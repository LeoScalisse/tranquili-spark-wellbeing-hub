
import * as Tone from 'tone';

export const createAudioSynths = (effectChain: Tone.ToneAudioNode) => {
  // Sintetizador principal - configuração ultra suave
  const synth = new Tone.Synth({
    oscillator: { 
      type: 'sine',
      partialCount: 3
    },
    envelope: { 
      attack: 0.8, 
      decay: 1.2, 
      sustain: 0.3, 
      release: 2.5 
    },
    volume: -15
  }).connect(effectChain);

  // FM Synth para texturas suaves
  const fmSynth = new Tone.FMSynth({
    harmonicity: 1.5,
    modulationIndex: 2,
    oscillator: { type: 'sine' },
    modulation: { type: 'sine' },
    envelope: { 
      attack: 1.0, 
      decay: 1.5, 
      sustain: 0.4, 
      release: 3.0 
    },
    volume: -18
  }).connect(effectChain);

  // PolySynth para acordes harmônicos
  const polySynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { 
      type: 'sine',
      partialCount: 2
    },
    envelope: { 
      attack: 1.2, 
      decay: 2.0, 
      sustain: 0.5, 
      release: 4.0 
    },
    volume: -20
  }).connect(effectChain);

  // Noise Synth extremamente suave para texturas
  const noiseSynth = new Tone.NoiseSynth({
    noise: { type: 'pink' },
    envelope: { 
      attack: 0.5, 
      decay: 0.8, 
      sustain: 0.1, 
      release: 1.5 
    },
    volume: -25
  }).connect(effectChain);

  return {
    synth,
    fmSynth,
    polySynth,
    noiseSynth
  };
};
