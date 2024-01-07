import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios'
import Video from '../style/video.module.css'

import { Container } from 'react-bootstrap';

function FaceDetection() {

  const videoHeight = 450;
  const videoWidth = 600;
  const videoRef = useRef();

  const [person, setPerson] = useState([]);
  const [emotion, setEmotion] = useState([]);
  const [distance, setDistance] = useState([]);

  // Load Models / Viodeo addEventListener 
  useEffect(() => {
    loadModels();
    videoRef.current.addEventListener('play', runFaceRecognition);
  }, []);

  // Load Models / Start Video
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

  // Get Images and Labels for Model
  async function getLabeledFaceDescriptions() {
    try {
      const response = await axios.get('http://localhost:5000/getLabelFolder');
      const { folders } = response.data;

      const labeledFaceDescriptors = await Promise.all(
        folders.map(async (label) => {
          const descriptions = [];
          for (let i = 1; i < 2; i++) {
            const img = await faceapi.fetchImage(`http://localhost:5000/getImageFolder/${label}/${i}.png`);

            const detections = await faceapi
              .detectSingleFace(img)
              .withFaceLandmarks()
              .withFaceDescriptor();

            if (detections) {
              descriptions.push(detections.descriptor);
            }
          }
          return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
      );

      return labeledFaceDescriptors;
    } catch (error) {
      console.error('Error:', error);
      throw new Error('Error fetching labeled face descriptions');
    }
  }

  // Prediction
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

  return (
    <Container>
      <div className={Video.frame} >
        <video className={Video.video} ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth}>
        </video>
      </div>
    </Container>
  );
}

export default FaceDetection;