import * as React from 'react'
import {faPlay, faPause} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {useMachine} from '@xstate/react'
import {timerMachine} from './timerMachine'
import {ProgressCircle} from '../ProgressCircle'

export const Timer = () => {
  const [state, send] = useMachine(timerMachine)

  // Use state.context instead
  const {
    value: status,
    context: {duration, elapsed, interval},
  } = state

  return (
    <div
      className="timer"
      data-state={status}
      style={{
        // @ts-ignore
        '--duration': duration,
        '--elapsed': elapsed,
        '--interval': interval,
      }}
    >
      <header>
        <h1>Exercise 02</h1>
      </header>
      <ProgressCircle />
      <div className="display">
        <div className="label">{status}</div>
        <div className="elapsed" onClick={() => send({type: 'TOGGLE'})}>
          {Math.ceil(duration - elapsed)}
        </div>
        <div className="controls">
          {status !== 'running' && (
            <button onClick={() => send('RESET')}>Reset</button>
          )}

          {status === 'running' && (
            <button onClick={() => send('ADD_MINUTE')}>+ 1:00</button>
          )}
        </div>
      </div>
      <div className="actions">
        {status === 'running' && (
          <button onClick={() => send({type: 'TOGGLE'})} title="Pause timer">
            <FontAwesomeIcon icon={faPause} />
          </button>
        )}

        {(status === 'paused' || status === 'idle') && (
          <button onClick={() => send({type: 'TOGGLE'})} title="Start timer">
            <FontAwesomeIcon icon={faPlay} />
          </button>
        )}
      </div>
    </div>
  )
}
