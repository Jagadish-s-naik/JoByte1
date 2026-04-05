import { useState, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

interface UseWebcamProctorOptions {
  modelUrl: string;
  threshold?: number;
  cooldownMs?: number;
  onSuspiciousActivity: () => void;
  isActive: boolean;
  previewRef?: RefObject<HTMLDivElement | null>;
  isEnabled?: boolean;
}

export const useWebcamProctor = ({
  modelUrl,
  threshold = 0.85,
  cooldownMs = 5000,
  onSuspiciousActivity,
  isActive,
  previewRef,
  isEnabled = true
}: UseWebcamProctorOptions) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const modelRef = useRef<tmImage.CustomMobileNet | null>(null);
  const webcamRef = useRef<tmImage.Webcam | null>(null);
  const isPredictingRef = useRef(false);
  const lastDetectionTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const onSuspiciousActivityRef = useRef(onSuspiciousActivity);
  const isEnabledRef = useRef(isEnabled);

  // Keep references fresh without re-triggering the main effect
  useEffect(() => {
    onSuspiciousActivityRef.current = onSuspiciousActivity;
  }, [onSuspiciousActivity]);

  useEffect(() => {
    isEnabledRef.current = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    let active = true;

    const setupProctoring = async () => {
      try {
        if (!modelRef.current) {
          const modelURL = modelUrl + (modelUrl.endsWith('/') ? '' : '/') + 'model.json';
          const metadataURL = modelUrl + (modelUrl.endsWith('/') ? '' : '/') + 'metadata.json';
          modelRef.current = await tmImage.load(modelURL, metadataURL);
          if (active) setIsModelLoaded(true);
        }

        if (!webcamRef.current) {
          const flip = true; 
          webcamRef.current = new tmImage.Webcam(200, 200, flip); // width, height, flip
          await webcamRef.current.setup(); // request access to the webcam
          await webcamRef.current.play();
          
          if (previewRef?.current) {
            // Append the canvas to the visual DOM container
            previewRef.current.innerHTML = '';
            // set style for aesthetic
            webcamRef.current.canvas.style.width = '100%';
            webcamRef.current.canvas.style.height = '100%';
            webcamRef.current.canvas.style.objectFit = 'cover';
            webcamRef.current.canvas.style.borderRadius = '0.5rem';
            previewRef.current.appendChild(webcamRef.current.canvas);
          }
        }

        if (active) {
          isPredictingRef.current = true;
          loop();
        }
      } catch (err: any) {
        if (active) {
          console.error("Webcam Proctoring Error:", err);
          setCameraError(err.message || 'Failed to initialize webcam.');
        }
      }
    };

    const loop = async () => {
      if (!isPredictingRef.current || !webcamRef.current || !modelRef.current) return;
      
      try {
        if (webcamRef.current?.canvas) {
          webcamRef.current.update(); // update the webcam frame
          
          if (isEnabledRef.current) {
            const predictions = await modelRef.current.predict(webcamRef.current.canvas);
            
            const isCheating = predictions.some(p => {
                const isTargetClass = p.className.toLowerCase().includes('phone') || p.className === 'Class 2';
                return isTargetClass && p.probability >= threshold;
            });
            
            if (isCheating) {
              const now = Date.now();
              console.log("DETECTION_ENGINE: Potential violation identified.", predictions.filter(p => p.probability > 0.5));
              if (now - lastDetectionTimeRef.current > cooldownMs) {
                 lastDetectionTimeRef.current = now;
                 console.warn("Anti-Cheat: Phone detected via WebCam!");
                 onSuspiciousActivityRef.current();
              }
            }
          }
        }
      } catch (e) {
         // suppress silent errors during render loops
      }

      if (isPredictingRef.current) {
        animationFrameRef.current = window.requestAnimationFrame(loop);
      }
    };

    if (isActive) {
      setupProctoring();
    } else {
      isPredictingRef.current = false;
      if (webcamRef.current) {
        try { webcamRef.current.stop(); } catch (e) {}
      }
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      active = false;
      isPredictingRef.current = false;
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      if (webcamRef.current) {
        try { webcamRef.current.stop(); } catch (e) {}
      }
    };
  }, [modelUrl, threshold, cooldownMs, isActive]); // isEnabled removed to prevent camera restart

  return { isModelLoaded, cameraError };
};
