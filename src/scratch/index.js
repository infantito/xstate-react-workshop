import * as React from 'react'

const TIMEOUT = 2000

const INITIAL_STATE = 'inactive'

const alarmMachine = {
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
}

const alarmReducer = (state, event) => {
  const nextState = alarmMachine.states[state].on[event.type] || state

  return nextState
}

export const ScratchApp = () => {
  const [status, dispatch] = React.useReducer(alarmReducer, INITIAL_STATE)

  React.useEffect(() => {
    if (status === 'pending') {
      const timer = setTimeout(() => {
        dispatch({type: 'SUCCESS'})
      }, TIMEOUT)

      return () => clearTimeout(timer)
    }
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
          onClick={() => dispatch({type: 'TOGGLE'})}
        ></div>
      </div>
    </div>
  )
}
