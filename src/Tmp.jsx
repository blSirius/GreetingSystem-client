import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import './App.css';
import axios from 'axios';


function App() {
  const videoHeight = 450;
  const videoWidth = 600;
  const videoRef = useRef();

  const [person, setPerson] = useState([]);
  const [emotion, setEmotion] = useState([]);
  const [distance, setDistance] = useState([]);
  const [memory, setMemory] = useState([]);

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
    const labels = ["Bike", "Peem"];
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i < 2; i++) {
          const img = await faceapi.fetchImage(`../public/labels/${label}/${i}.png`);
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

  useEffect(() => {
    for (let i = 0; i < person.length; i++) {
      // Check if the current person is not in 'memory'
      if (!memory.includes(person[i])) {
        autoSaveToDB(person[i]);
      }
    }
    setMemory([...memory, ...person]);
  }, [person]);

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


  const autoSaveToDB = async (person) => {
    try {
      const response = await axios.post('http://localhost:5000/api/addData', { person: person });
  
      console.log('Data saved to the database:', response.data);
    } catch (error) {
      console.error('Error saving data to the database:', error);
    }
  };



  return (
    <>
      <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth}></video>

      {person.map((d, i) => (
        <p key={i}>{d}</p>
      ))}

      {person.length}
    </>
  );
}

export default App;