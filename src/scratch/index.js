import * as React from 'react'
import {createMachine, assign} from 'xstate'
import {useMachine} from '@xstate/react'

const TIMEOUT = 2000

const INITIAL_STATE = 'inactive'

// eslint-disable-next-line no-unused-vars
const incrementCount = assign({
  count: (context, _event) => {
    return context.count + 1
  },
})

const notTooMuch = context => context.count < 5

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
        on: {
          SUCCESS: 'active',
          TOGGLE: 'inactive',
        },
      },
      active: {
        on: {
          TOGGLE: 'inactive',
        },
      },
      rejected: {},
    },
  },
  {
    actions: {incrementCount},
    guards: {notTooMuch},
  },
)

export const ScratchApp = () => {
  const [state, send] = useMachine(alarmMachine)

  const {
    value: status,
    context: {count},
  } = state

  React.useEffect(() => {
    if (status === 'pending') {
      const timer = setTimeout(() => {
        send({type: 'SUCCESS'})
      }, TIMEOUT)

      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return (
    <div className="scratch">
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
    </div>
  )
}
