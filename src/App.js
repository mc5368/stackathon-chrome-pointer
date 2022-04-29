// 0. Install fingerpose npm install fingerpose
// 1. Add Use State
// 2. Import emojis and finger pose import * as fp from "fingerpose";
// 3. Setup hook and emoji object
// 4. Update detect function for gesture handling
// 5. Add emoji display to the screen

///////// NEW STUFF ADDED USE STATE
import React, { useRef, useState, useEffect } from "react";
// import Reactpip from 'react-picture-in-picture'
///////// NEW STUFF ADDED USE STATE

// import logo from './logo.svg';
// import * as tf from "@tensorflow/tfjs";
import * as hands from "@mediapipe/hands"
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import Webcam from "react-webcam";
import "./App.css";
import { drawHand } from "../src/utilities";

///////// NEW STUFF IMPORTS
import * as fp from "fingerpose";
import victory from "./victory.png";
import thumbs_up from "./thumbs_up.png";
///////// NEW STUFF IMPORTS

function App() {
  if(window.isSecureContext){
  }

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  ///////// NEW STUFF ADDED STATE HOOK
  // const [emoji, setEmoji] = useState(null);
  // const images = { thumbs_up: thumbs_up, victory: victory };
  ///////// NEW STUFF ADDED STATE HOOK

  const runHandpose = async () => {
    // const net = await hands.load();
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
      runtime: 'mediapipe', // or 'tfjs'
      solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/hands',
      modelType: 'full'
    };
    let detector = await handPoseDetection.createDetector(model, detectorConfig);
    // console.log(detector)
    // console.log("Handpose model loaded.");
    //  Loop and detect hands
    setInterval(() => {
      detect(detector);
    }, 100);
  };

  const detect = async (detector) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;


      // Make Detections
      // const hand = await net.estimateHands(video);

      const hands = await detector.estimateHands(video);  

      ///////// NEW STUFF ADDED GESTURE HANDLING

      // if (hand.length > 0) {
      //   const GE = new fp.GestureEstimator([
      //     fp.Gestures.VictoryGesture,
      //     fp.Gestures.ThumbsUpGesture,
      //   ]);
      //   const gesture = await GE.estimate(hand[0].landmarks, 4);
      //   if (gesture.gestures !== undefined && gesture.gestures.length > 0) {
      //     // console.log(gesture.gestures);

      //     const confidence = gesture.gestures.map(
      //       (prediction) => prediction.confidence
      //     );
      //     const maxConfidence = confidence.indexOf(
      //       Math.max.apply(null, confidence)
      //     );
      //     console.log(gesture.gestures[maxConfidence].name);
      //     setEmoji(gesture.gestures[maxConfidence].name);
      //     console.log(emoji);
      //   }
      // }

      ///////// NEW STUFF ADDED GESTURE HANDLING

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");
      ctx.translate(canvasRef.current.width,0)
      ctx.scale(-1,1)
      // for (let i=0;i<hands.length;i++){
      drawHand(hands, ctx);
      console.log(hands[0])
      // }
    }
  };

  useEffect(()=>{runHandpose()});

  return (
    <div className="App">
      <p>Test</p>
      <header className="App-header">
        {/* <Reactpip> */}
          <Webcam
          allow="camera"
          ref={webcamRef}
          style={{
            position: "absolute",
            // marginLeft: "auto",
            // marginRight: "auto",
            left: 0,
            right: 0,
            // textAlign: "center",
            // zindex: 9,
            width: 160,
            height: 120,
          }}
          mirrored={true}
        />
        {/* </Reactpip> */}
        {/* <Reactpip> */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            // marginLeft: "auto",
            // marginRight: "auto",
            left: 0,
            right: 0,
            // textAlign: "center",
            // zindex: 9,
            width: 160,
            height: 120,
          }}
          />
        {/* </Reactpip> */}

        {/* NEW STUFF */}
        {/* {emoji !== null ? (
          <img
            src={images[emoji]}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              bottom: 0,
              right: 0,
              // textAlign: "center",
              height: 0,
            }}
          />
        ) : (
          ""
        )} */}

        {/* NEW STUFF */}
      </header>
    </div>
  );
}

export default App;
