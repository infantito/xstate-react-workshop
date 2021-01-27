export const ScratchApp = () => {
  return (
    <div className="scratch">
      <div className="alarm">
        <div className="alarmTime">
          {new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
        <div className="alarmToggle"></div>
      </div>
    </div>
  )
}
