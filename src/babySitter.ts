import { interpret } from 'xstate';
import { createModel } from 'xstate/lib/model';

export const events = {
    handBinky: () => ({}),
    takeItAway: () => ({}),
    feed: () => ({}),
    threeSecPassed: () => ({}),
    putToSleep: () => ({}),
    awaken: () => ({})
  }

const initAudio = (src: string) => {
  const audio = new Audio(src);
  audio.volume = 1;
  audio.loop = true;
  return audio;
}

const model = createModel({
  isSleepy: false
}, {
  events 
})

export const machine = model.createMachine({
  id: 'cryBaby',
  initial: 'suckingBinky',
  states: {
    crying : {
      invoke: {
        src: 'cryingSound'
      },
      on: {
        handBinky : 'suckingBinky',
        feed : 'drinking',
putToSleep: [
          { cond: 'isSleepy', target: 'sleeping' },
        ]
      }
    },
    suckingBinky: {
      on: {
        takeItAway: 'crying',
      }
    },
    drinking: {
      invoke: { src: 'sleepinessCounter' },
      on: {
        takeItAway: 'crying',
        threeSecPassed: [
          { cond: 'isSleepy', target: 'sleeping' },
          { actions: 'becomingSleepy..' },
        ]
      }
    },
    sleeping: {
      invoke: {
        src: 'snoringSound'
      },
      on: {
        awaken: 'crying'
      }
    }
  }
}, {
  services: {
    sleepinessCounter: () => (sendback) => {
      const interval = window.setInterval(() => {
        sendback('threeSecPassed')
      }, 3000);
      
      return () => window.clearInterval(interval)
    },
    cryingSound: () => () => {
      const audio = initAudio('/baby-crying.mp3');
      audio.play();
      return () => audio.pause()
    },
    snoringSound: () => () => {
      const audio = initAudio('/snoring.mp3');
      audio.play();
      return () => audio.pause()
    }
  },
  actions: {
    'becomingSleepy..': model.assign({ isSleepy: true })
  },
  guards: {
    isSleepy: ({ isSleepy }) => isSleepy
  }
})

export const babySitter = interpret(machine).start();
