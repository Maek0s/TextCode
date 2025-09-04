import '../styles/UpdatesModal.css'

export default function UpdatesModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>📢 Próximas actualizaciones</h2>

        <div className="updates-list">
          <div className="update-block">
            <h3>v0.0.5</h3>
            <ul>
              <li>Mejora en el responsive</li>
              <li>Mejora en la estructura del proyecto</li>
            </ul>
          </div>

          <div className="update-block">
            <h3>v0.0.6</h3>
            <ul>
              <li>Creación de cuentas para guardar el progreso</li>
            </ul>
          </div>

          <div className="update-block">
            <h3>v1.0.0</h3>
            <ul>
              <li>Mejora en la gestión de cuentas</li>
              <li>Perfil más cómodo</li>
              <li>Personalización del entorno más extenso</li>
            </ul>
          </div>

          <div className="update-block">
            <h3>v1.0.1</h3>
            <ul>
              <li>Compatibilidad con móvil</li>
              <li>Tabla de clasificación de mejores tiempos</li>
            </ul>
          </div>
          
        </div>

        <p className="updates-note">
          ⚠️ Esta lista no es definitiva, es una previa visualización de lo que podría contener la versión.
        </p>

        <div className="modal-actions">
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}
