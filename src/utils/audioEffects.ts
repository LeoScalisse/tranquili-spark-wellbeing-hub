
import * as Tone from 'tone';

export const createAudioEffects = () => {
  // Reverb suave para criar atmosfera
  const reverb = new Tone.Reverb({
    decay: 3,
    wet: 0.3,
    preDelay: 0.1
  });

  // Delay sutil para profundidade
  const delay = new Tone.FeedbackDelay({
    delayTime: '8n',
    feedback: 0.2,
    wet: 0.15
  });

  // Filtro passa-baixas para suavizar
  const filter = new Tone.Filter({
    frequency: 3000,
    type: 'lowpass',
    rolloff: -12
  });

  // Conectar efeitos em cadeia
  const effectChain = filter.connect(delay).connect(reverb).toDestination();

  return {
    reverb,
    delay,
    filter,
    effectChain
  };
};
