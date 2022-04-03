import type { Config, Implementations } from '../../types';

import { createModel } from 'xstate/lib/model';

import events from './events';

export const model = createModel({ isSleepy: false }, { events });

export const config: Config<typeof model> = {
  id: "cryBaby",
  initial: "suckingBinky",
  states: {
    crying: {
      on: {
        handBinky: {
          target: "suckingBinky",
        },
        feed: {
          target: "drinking",
        },
        putToSleep: {
          cond: "isSleepy",
          target: "sleeping",
        },
      },
    },
    suckingBinky: {
      on: {
        takeItAway: {
          target: "crying",
        },
      },
    },
    drinking: {
      on: {
        takeItAway: {
          target: "crying",
        },
        threeSecPassed: [
          {
            cond: "isSleepy",
            target: "sleeping",
          },
          {
            actions: "becomingSleepy..",
          },
        ],
      },
    },
    sleeping: {
      on: {
        awaken: {
          target: "crying",
        },
      },
    },
  },
};

export const implementations: Implementations<typeof model> = {
  actions: {
    'becomingSleepy..': model.assign({ isSleepy: true })
  },
  guards: {
    isSleepy: ({ isSleepy }) => isSleepy
  }
}

// Below line exists just to activate xstate vscode extention.
model.createMachine(config, implementations);
