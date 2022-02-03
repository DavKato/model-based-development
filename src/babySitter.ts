import { interpret } from 'xstate';
import { createModel } from 'xstate/lib/model';

export const events = {
    'おしゃぶりあげる': () => ({}),
    'とりあげる': () => ({}),
    'おちちあげる': () => ({}),
    '３秒経過': () => ({}),
    'ねかしつける': () => ({}),
    '大いなる目覚め': () => ({})
  }

const initAudio = (src: string) => {
  const audio = new Audio(src);
  audio.volume = 1;
  audio.loop = true;
  return audio;
}

const model = createModel({
  '眠い': false
}, {
  events 
})

export const machine = model.createMachine({
  id: '泣き虫赤ちゃん',
  initial: 'おしゃぶり',
  states: {
    'ガン泣き': {
      invoke: {
        src: '泣き声'
      },
      on: {
        'おしゃぶりあげる': 'おしゃぶり',
        'おちちあげる': 'おちち',
        'ねかしつける': [
          { cond: '眠気あり', target: 'おねんね' },
        ]
      }
    },
    'おしゃぶり': {
      on: {
        'とりあげる': 'ガン泣き',
      }
    },
    'おちち': {
      invoke: { src: '眠気カウンター' },
      on: {
        'とりあげる': 'ガン泣き',
        '３秒経過': [
          { cond: '眠気あり', target: 'おねんね' },
          { actions: '眠気アップ' },
        ]
      }
    },
    'おねんね': {
      invoke: {
        src: 'いびき'
      },
      on: {
        '大いなる目覚め': 'ガン泣き'
      }
    }
  }
}, {
  services: {
    '眠気カウンター': () => (sendback) => {
      const interval = window.setInterval(() => {
        sendback('３秒経過')
      }, 3000);
      
      return () => window.clearInterval(interval)
    },
    '泣き声': () => () => {
      const audio = initAudio('/baby-crying.mp3');
      audio.play();
      return () => audio.pause()
    },
    'いびき': () => () => {
      const audio = initAudio('/snoring.mp3');
      audio.play();
      return () => audio.pause()
    }
  },
  actions: {
    '眠気アップ': model.assign({ '眠い': true })
  },
  guards: {
    '眠気あり': (context) => context['眠い']
  }
})

export const babySitter = interpret(machine).start();
