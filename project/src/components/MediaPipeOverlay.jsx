import React, { useRef, useEffect } from "react";

export default function MediaPipeOverlay({ clothingImage }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let pose, camera;
    // Loader for camera_utils.js
    const loadCameraUtils = () => {
      return new Promise((resolve) => {
        if (window.Camera) return resolve();
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };
    const loadMediaPipe = async () => {
      if (!window.Pose) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/pose";
        script.async = true;
        script.onload = () => startPose();
        document.body.appendChild(script);
      } else {
        startPose();
      }
    };
    async function startPose() {
      await loadCameraUtils();
      pose = new window.Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      pose.onResults(onPoseResults);

      camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
    function onPoseResults(results) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      if (clothingImage && results.poseLandmarks) {
        const leftShoulder = results.poseLandmarks[11];
        const rightShoulder = results.poseLandmarks[12];
        const leftHip = results.poseLandmarks[23];
        const rightHip = results.poseLandmarks[24];
        if (leftShoulder && rightShoulder && leftHip && rightHip) {
          // Perspective warp (see previous code for full implementation)
          ctx.save();
          ctx.globalAlpha = 0.95;
          // Simple overlay, can be replaced with the perspective transform helper
          const width = Math.abs(rightShoulder.x - leftShoulder.x) * canvas.width * 1.4;
          const height = Math.abs(rightHip.y - leftShoulder.y) * canvas.height * 1.3;
          const x = (leftShoulder.x + rightShoulder.x) / 2 * canvas.width;
          const y = (leftShoulder.y + rightShoulder.y) / 2 * canvas.height;
          ctx.translate(x, y);
          const angle = Math.atan2(
            rightShoulder.y - leftShoulder.y,
            rightShoulder.x - leftShoulder.x
          );
          ctx.rotate(angle);
          ctx.drawImage(
            clothingImage,
            -width / 2,
            0,
            width,
            height
          );
          ctx.restore();
        }
      }
    }
    loadMediaPipe();
    return () => {
      if (camera && camera.stop) camera.stop();
    };
  }, [clothingImage]);

  return (
    <div className="relative w-full flex flex-col items-center">
      <video ref={videoRef} className="rounded-lg" autoPlay playsInline muted width={640} height={480} style={{ display: "none" }} />
      <canvas ref={canvasRef} width={640} height={480} className="rounded-lg border shadow" />
    </div>
  );
}
