import * as React from 'react'

export const ScratchApp = () => {
  const [isActive, setIsActive] = React.useState(false)

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
          data-active={isActive || void 0}
          onClick={() => setIsActive(prevState => !prevState)}
        ></div>
      </div>
    </div>
  )
}
