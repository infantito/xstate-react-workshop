import * as React from 'react'

const TIMEOUT = 2000

const INITIAL_STATE = 'inactive'

const alarmReducer = (state, event) => {
  switch (state) {
    case 'inactive':
      if (event.type === 'TOGGLE') {
        return 'pending'
      }

      return state
    case 'pending':
      if (event.type === 'SUCCESS') {
        return 'active'
      } else if (event.type === 'TOGGLE') {
        return 'inactive'
      }

      return state
    case 'active':
      if (event.type === 'TOGGLE') {
        return 'inactive'
      }

      return state
    default:
      return 'inactive'
  }
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
