import { useEffect, useState } from "react";

const useMuteWarning = (loudness: number, running: boolean): [boolean] => {
  const [showMuteWarning, setShowMuteWarning] = useState<boolean>(false);

  useEffect(() => {
    if (loudness > 6 && running) {
      setShowMuteWarning(true);
    }
  }, [loudness, running]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (showMuteWarning) {
      timeout = setTimeout(() => {
        setShowMuteWarning(false);
      }, 5000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [showMuteWarning]);

  return [showMuteWarning];
};

export default useMuteWarning;
