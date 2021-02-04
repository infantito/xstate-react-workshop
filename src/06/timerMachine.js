import {createMachine, assign} from 'xstate'

const timerExpired = ctx => ctx.elapsed >= ctx.duration

export const timerMachine = createMachine({
  initial: 'idle',
  context: {
    duration: 5,
    elapsed: 0,
    interval: 0.1,
  },
  states: {
    idle: {
      entry: assign({
        duration: 5,
        elapsed: 0,
      }),
      on: {
        TOGGLE: 'running',
      },
    },
    running: {
      // Add the `normal` and `overtime` nested states here.
      // Don't forget to add the initial state (`normal`)!
      initial: 'normal',
      states: {
        normal: {
          always: {
            target: 'overtime',
            cond: ctx => ctx.elapsed >= ctx.duration,
          },
          on: {
            RESET: void 0,
          },
        },
        overtime: {
          after: {
            2000: 'timeOver',
          },
          on: {
            TOGGLE: void 0,
          },
        },
        timeOver: {
          type: 'final',
        },
      },
      onDone: 'idle',
      on: {
        TICK: {
          actions: assign({
            elapsed: ctx => ctx.elapsed + ctx.interval,
          }),
        },
        TOGGLE: 'paused',
        ADD_MINUTE: {
          actions: assign({
            duration: ctx => ctx.duration + 60,
          }),
        },
      },
    },
    paused: {
      on: {
        TOGGLE: 'running',
      },
    },
  },
  on: {
    RESET: {
      target: '.idle',
    },
  },
})
