import type { Page } from '@playwright/test';

import { interpret } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { expect } from '@playwright/test';

const stateDisplay = (page: Page) => page.locator('[data-test-id=state-display]');

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
      },
      meta: {
        test: async (page) => {
          const state = stateDisplay(page);
          expect(await state.innerHTML()).toBe('ガン泣き');
        }
      }
    },
    'おしゃぶり': {
      on: {
        'とりあげる': 'ガン泣き',
      },
      meta: {
        test: async (page) => {
          const state = stateDisplay(page);
          expect(await state.innerHTML()).toBe('おしゃぶり');
        }
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
      },
      meta: {
        test: async (page) => {
          const state = stateDisplay(page);
          expect(await state.innerHTML()).toBe('おちち');
        }
      }
    },
    'おねんね': {
      invoke: {
        src: 'いびき'
      },
      on: {
        '大いなる目覚め': 'ガン泣き'
      },
      meta: {
        test: async (page) => {
          const state = stateDisplay(page);
          expect(await state.innerHTML()).toBe('おねんね');
        }
      }
    
    }
  }
}, {
  services: {
    '眠気カウンター': () => (sendback) => {
      const interval = window.setInterval(() => {
        sendback('３秒経過')
      }, 5000);
      
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
    // @ts-ignore
    '眠気アップ': model.assign({ '眠い': true })
  },
  guards: {
    '眠気あり': (context) => context['眠い']
  }
})

export const babySitter = interpret(machine).start();
