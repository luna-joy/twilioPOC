import { useState, useEffect, Dispatch, SetStateAction } from "react";
import Meyda from "meyda";

type LoudnessFeatures = {
  loudness: {
    total: number;
    specific: number[];
  };
};


const useLoudness = (): [boolean, Dispatch<SetStateAction<boolean>>, number] => {
  const [analyser, setAnalyser] = useState<ReturnType<typeof Meyda.createMeydaAnalyzer> | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [loudness, setLoudness] = useState<number>(0);

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
    const highPass = audioContext.createBiquadFilter();
    highPass.frequency.setValueAtTime(300, audioContext.currentTime);
    const lowPass = audioContext.createBiquadFilter();
    lowPass.frequency.setValueAtTime(3400, audioContext.currentTime);

    let newAnalyser: ReturnType<typeof Meyda.createMeydaAnalyzer> | undefined;
    getMedia().then((stream) => {
      if (audioContext.state === "closed" || !stream) {
        return;
      }
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(highPass);
      highPass.connect(lowPass);

      newAnalyser = Meyda.createMeydaAnalyzer({
        audioContext: audioContext,
        source: lowPass,
        bufferSize: 8192,
        featureExtractors: ["loudness"],
        callback: (features:LoudnessFeatures) => {
          if (features.loudness) {
            setLoudness(
              (prevLoudness) =>
                (prevLoudness + features.loudness.total * 0.2) / 2
            );
          }
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

  return [running, setRunning, loudness];
};

export default useLoudness;
