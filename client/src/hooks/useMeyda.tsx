import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Meyda from "meyda";

type MeydaFeatures = {
  [key: string]: any; // Use a specific type if you know the structure of the features object
};

const useMeyda = (): [boolean, Dispatch<SetStateAction<boolean>>, MeydaFeatures | null] => {
  const [analyser, setAnalyser] = useState<ReturnType<typeof Meyda.createMeydaAnalyzer> | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [features, setFeatures] = useState<MeydaFeatures | null>(null);

  const getMedia = async (): Promise<MediaStream | undefined> => {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    const audioContext = new AudioContext();

    let newAnalyser: ReturnType<typeof Meyda.createMeydaAnalyzer> | undefined;
    getMedia().then((stream) => {
      if (audioContext.state === "closed" || !stream) {
        return;
      }
      const source = audioContext.createMediaStreamSource(stream);
      newAnalyser = Meyda.createMeydaAnalyzer({
        audioContext: audioContext,
        source: source,
        bufferSize: 8192,
        featureExtractors: ["loudness"],
        callback: (features: MeydaFeatures) => {
          console.log(features);
          setFeatures(features);
        },
      });
      setAnalyser(newAnalyser);
    });

    return () => {
      if (newAnalyser) {
        newAnalyser.stop();
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  useEffect(() => {
    if (analyser) {
      if (running) {
        analyser.start();
      } else {
        analyser.stop();
      }
    }
  }, [running, analyser]);

  return [running, setRunning, features];
};

export default useMeyda;
