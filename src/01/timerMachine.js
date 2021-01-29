import {createMachine} from 'xstate'

export const timerMachine = createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        TOGGLE: 'running',
      },
    },
    running: {
      on: {
        TOGGLE: 'paused',
        RESET: 'idle',
      },
    },
    paused: {
      on: {
        TOGGLE: 'running',
        RESET: 'idle',
      },
    },
  },
})
