/**
 * AuraCast: Ambient Audio Synthesizer (Web Audio API)
 */

class AudioSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.audioNodes = [];
    this.isPlaying = false;
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  stop() {
    if (this.audioNodes && this.audioNodes.length > 0) {
      this.audioNodes.forEach((node) => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) {
          // ignore cleanup errors
        }
      });
      this.audioNodes = [];
    }
    this.isPlaying = false;
  }

  playMood(mood) {
    this.initAudioContext();
    this.stop();

    if (!this.audioCtx) return;
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Master volume
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.18, now + 1.5);
    masterGain.connect(ctx.destination);
    this.audioNodes.push(masterGain);

    if (mood.id === 'cozy' || mood.id === 'stormy') {
      // Rain Pink Noise generator
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = mood.id === 'stormy' ? 700 : 1200;

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();
      this.audioNodes.push(whiteNoise);

      if (mood.id === 'stormy') {
        // Deep sub rumble
        const subOsc = ctx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(55, now);
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.2, now);
        subOsc.connect(subGain);
        subGain.connect(masterGain);
        subOsc.start();
        this.audioNodes.push(subOsc);
      }
    } else {
      // Harmonic Ambient Drone
      const freqs =
        mood.id === 'radiant'
          ? [220, 277.18, 329.63, 440]
          : [174.61, 220, 261.63, 349.23];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.04 / freqs.length, now);

        // Soft LFO
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.1 + idx * 0.05, now);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.015, now);
        lfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start();
        lfo.start();
        this.audioNodes.push(osc, lfo);
      });
    }

    this.isPlaying = true;
  }
}

export const audioSynth = new AudioSynthesizer();
