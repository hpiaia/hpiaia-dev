import { useEffect, useRef, useState } from "react";

import { createNoise } from "./noise";

const MAX_CHANNELS = 4;

export function useChannels(startAt = 0) {
  const isMounted = useRef(true);

  const [channel, setChannel] = useState(startAt);
  const [loading, setLoading] = useState(false);

  function prev() {
    if (loading) return;
    if (channel === -1) setChannel(MAX_CHANNELS);
    else setChannel(channel - 1);
  }

  function next() {
    if (loading) return;
    if (channel === MAX_CHANNELS) setChannel(-1);
    else setChannel(channel + 1);
  }

  useEffect(() => {
    if (isMounted.current) {
      isMounted.current = false;
      return;
    }

    setLoading(true);

    const noise = createNoise();
    noise.start();

    const timeout = setTimeout(
      () => {
        setLoading(false);
        noise.stop();
      },
      1000 + Math.random() * 1000
    );

    return () => clearTimeout(timeout);
  }, [channel]);

  return { channel, loading, prev, next };
}
