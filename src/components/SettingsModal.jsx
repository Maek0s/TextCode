import '../styles/SettingsModal.css'

import { saveSettings } from "../logic/storage/settings.js"

export default function SettingsModal({ isOpen, onClose, tabuladoSetting, setTabulacion }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Configuración</h2>

        <label className="setting-row">
          <span>Tabulación automática</span>
          <div
            className={`toggle-switch ${tabuladoSetting ? "on" : "off"}`}
            onClick={() => {
              let newState = !tabuladoSetting

              saveSettings({ value: newState })
              setTabulacion(newState)
            }}
          >
            <div className="toggle-thumb" />
          </div>
        </label>

        <hr/>

        <h3 className="coming-soon-title">Próximamente</h3>
        <div className="coming-soon">
          <span>🌐 Idioma</span>
          <span>📜 Ventana al finalizar</span>
          <span>🕹️ Subir textos personalizados</span>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}
