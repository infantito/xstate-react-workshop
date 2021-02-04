import * as React from 'react'
import {createMachine, assign, send, spawn, sendParent} from 'xstate'
import {useMachine, useService} from '@xstate/react'

const TIMEOUT = 2000

const INITIAL_STATE = 'inactive'

// eslint-disable-next-line no-unused-vars
const incrementCount = assign({
  count: (context, _event) => {
    return context.count + 1
  },
})

const notTooMuch = context => context.count < 5

const greetMachine = createMachine({
  initial: 'unknown',
  states: {
    unknown: {
      always: [
        {
          cond: () => new Date().getHours() < 12,
          target: 'morning',
        },
        {
          target: 'day',
        },
      ],
    },
    morning: {},
    day: {},
  },
})

const saveAlarm = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(100)
    }, 2000)
  })
}

const alarmMachine = createMachine(
  {
    initial: INITIAL_STATE,
    context: {count: 0},
    states: {
      inactive: {
        on: {
          TOGGLE: [
            // if
            {
              target: 'pending',
              actions: 'incrementCount',
              cond: 'notTooMuch',
            },
            // else
            {
              target: 'rejected',
            },
          ],
        },
      },
      pending: {
        invoke: {
          id: 'timeout',
          src: (ctx, event) => (sendBack, receive) => {
            receive(console.log)

            const timeout = setTimeout(() => {
              sendBack({
                type: 'SUCCESS',
              })
            }, TIMEOUT)

            return () => {
              console.log('cleaning up!')
              clearTimeout(timeout)
            }
          },
          onError: {target: 'rejected'},
        },
        on: {
          SUCCESS: 'active',
          TOGGLE: {
            target: 'inactive',
          },
        },
      },
      active: {
        entry: sendParent('ACTIVE'),
      },
      rejected: {},
    },
  },
  {
    actions: {incrementCount},
    guards: {notTooMuch},
  },
)

const Alarm = ({alarmRef}) => {
  const [state, send] = useService(alarmRef)

  const {
    value: status,
    context: {count},
  } = state

  return (
    <div className="alarm">
      <div className="alarmTime">
        {new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}
        ({count}) ({state.toStrings().join(' ')})
      </div>
      <div
        className="alarmToggle"
        style={{opacity: status === 'pending' ? 0.5 : 1}}
        data-active={status === 'active' || void 0}
        onClick={() => send({type: 'TOGGLE'})}
      ></div>
    </div>
  )
}

const alarmsMachine = createMachine({
  context: {
    alarms: [],
  },
  initial: 'active',
  states: {
    active: {
      on: {
        ADD_ALARM: {
          actions: assign({
            alarms: (ctx, event) => {
              const alarm = spawn(alarmMachine)

              return ctx.alarms.concat(alarm)
            },
          }),
        },
        ACTIVE: {
          actions: (context, event) => {
            console.log('Received', event)
          },
        },
      },
    },
  },
})

export const ScratchApp = () => {
  const [greetState] = useMachine(greetMachine)

  const [state, send] = useMachine(alarmsMachine)

  return (
    <div className="scratch">
      <h2>Good {greetState.value}</h2>
      <button onClick={() => send('ADD_ALARM')}>Add Alarm</button>
      {state.context.alarms.map((alarm, i) => (
        <Alarm alarmRef={alarm} key={i} />
      ))}
    </div>
  )
}
