import {useMachine} from '@xstate/react'
import * as React from 'react'
import {createMachine} from 'xstate'

const TIMEOUT = 2000

const INITIAL_STATE = 'inactive'

const alarmMachine = createMachine({
  initial: INITIAL_STATE,
  states: {
    inactive: {
      on: {
        TOGGLE: 'pending',
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
  },
})

export const ScratchApp = () => {
  const [state, send] = useMachine(alarmMachine)

  const {value: status} = state

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
