import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import './App.css';

function App() {
  const videoHeight = 450;
  const videoWidth = 600;
  const videoRef = useRef();

  const [person, setPerson] = useState([]);
  const [emotion, setEmotion] = useState([]);
  const [distance, setDistance] = useState([]);

  const [folders, setFolders] = useState([]);

  useEffect(() => {
    loadModels();
    videoRef.current.addEventListener('play', runFaceRecognition);
  }, []);

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
        faceapi.nets.faceExpressionNet.loadFromUri('./models'),
      ]);
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error(error);
    }
  };

  function getLabeledFaceDescriptions() {
    const labels = ["Bike", "Peem", "Saka", "Obama"];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i < 2; i++) { 
          const img = await faceapi.fetchImage(`http://localhost:5000/images/${label}/${i}.png`);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
        }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  }

  const runFaceRecognition = async () => {
    const labeledFaceDescriptors = await getLabeledFaceDescriptions();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

    const canvas = faceapi.createCanvasFromMedia(videoRef.current);
    document.body.append(canvas);

    const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

      faceapi.draw.drawDetections(canvas, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

      const results = resizedDetections.map((d) => {
        return faceMatcher.findBestMatch(d.descriptor);
      });

      setPerson([]);
      setDistance([]);
      setEmotion([]);

      results.forEach((result, i) => {
        setPerson((prevPerson) => [...prevPerson, result.label]);
        setDistance((prevDistance) => [...prevDistance, result.distance]);
      });

      detections.forEach((result, i) => {     
        setEmotion((prevEmotion) => [
          ...prevEmotion,
          Object.keys(detections[i].expressions).reduce((a, b) =>
            detections[i].expressions[a] > detections[i].expressions[b] ? a : b
          ),
        ]);
      })

      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result.toString(),
        });
        drawBox.draw(canvas);
      });
    }, 100);
  };

  useEffect(() => {
    // Fetch folder names from the server
    fetch('http://localhost:5000/folders')
      .then(response => response.json())
      .then(data => {
        // Set the folder names in the state
        setFolders(data.folders);
      })
      .catch(error => {
        console.error('Error fetching folder names:', error);
      });
      console.log(folders);
  },[]);

  return (
    <>
      <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth}></video>
    </>
  );
}

export default App;