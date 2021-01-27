import * as React from 'react'
import {faPlay, faPause} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {ProgressCircle} from '../ProgressCircle'
import {timerMachine} from './timerMachine'

export const Timer = () => {
  const [state, dispatch] = React.useReducer(timerMachine, 'idle')

  const {duration, elapsed, interval} = {
    duration: 60,
    elapsed: 0,
    interval: 0.1,
  }

  const isRunning = state === 'running'

  return (
    <div
      className="timer"
      data-state={state}
      style={{
        // @ts-ignore
        '--duration': duration,
        '--elapsed': elapsed,
        '--interval': interval,
      }}
    >
      <header>
        <h1>Exercise 00</h1>
      </header>
      <ProgressCircle />
      <div className="display">
        <div className="label">{state}</div>
        <div
          className="elapsed"
          onClick={() => {
            dispatch({type: 'TOGGLE'})
          }}
        >
          {Math.ceil(duration - elapsed)}
        </div>
        <div className="controls">
          <button
            onClick={() => {
              dispatch({type: 'RESET'})
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="actions">
        <button
          onClick={() => {
            dispatch({type: 'TOGGLE'})
          }}
          title={isRunning ? 'Pause timer' : 'Start timer'}
        >
          <FontAwesomeIcon icon={!isRunning ? faPlay : faPause} />
        </button>
      </div>
    </div>
  )
}
