export function createNoise() {
  const audio = new window.AudioContext();

  const buffer = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
  const gainNode = audio.createGain();

  gainNode.gain.setValueAtTime(0.02, audio.currentTime);
  gainNode.connect(audio.destination);

  for (let i = 0, noiseBufferOutput = buffer.getChannelData(0); i < audio.sampleRate; i++) {
    noiseBufferOutput[i] = Math.random() * 2 - 1;
  }

  const noise = audio.createBufferSource();

  noise.loop = true;
  noise.buffer = buffer;
  noise.connect(gainNode);

  noise.onended = () => {
    try {
      noise.disconnect();
      gainNode.disconnect();
      audio.close();
    } catch (e) {
      //
    }
  };

  return {
    start: () => noise.start(0),
    stop: () => noise.stop(),
  };
}
