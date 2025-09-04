import { useState, useEffect } from "react";
import "../styles/Notification.css";

const Notification = ({
  message,
  icon = null, // JSX del icono
  backgroundColor = "#333",
  textColor = "#fff",
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)

    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        if (onClose) onClose()
      }, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`notification ${visible ? "show" : "hide"}`}
      style={{ backgroundColor, color: textColor }}
    >
      {icon && <div className="notification-icon">{icon}</div>}
      <div className="notification-message">{message}</div>
    </div>
  )
}

export default Notification
