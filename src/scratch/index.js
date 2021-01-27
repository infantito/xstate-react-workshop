import * as React from 'react'

const TIMEOUT = 2000

export const ScratchApp = () => {
  const [status, setStatus] = React.useState('inactive')

  React.useEffect(() => {
    if (status === 'pending') {
      const timer = setTimeout(() => {
        setStatus('active')
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
          onClick={() =>
            setStatus(prevStatus =>
              prevStatus === 'active' ? 'inactive' : 'pending',
            )
          }
        ></div>
      </div>
    </div>
  )
}
