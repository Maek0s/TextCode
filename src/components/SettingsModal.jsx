import '../styles/SettingsModal.css'

export default function SettingsModal({ isOpen, onClose, settings, onSave }) {
  if (!isOpen) return null

  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] }
    onSave(newSettings)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Configuración ⚙️</h2>

        <label className="setting-row">
          <span>Tabulación automática</span>
          <div
            className={`toggle-switch ${settings.tabulacion ? "on" : "off"}`}
            onClick={() => toggleSetting("tabulacion")}
          >
            <div className="toggle-thumb" />
          </div>
        </label>

        <label className="setting-row">
          <span>Mostrar lista controles</span>
          <div
            className={`toggle-switch ${settings.controles ? "on" : "off"}`}
            onClick={() => toggleSetting("controles")}
          >
            <div className="toggle-thumb" />
          </div>
        </label>

        <h2>Sonido 🎶</h2>

        <label className="setting-row">
          <span>Efectos de sonido</span>
          <div
            className={`toggle-switch ${settings.efectosSonido ? "on" : "off"}`}
            onClick={() => toggleSetting("efectosSonido")}
          >
            <div className="toggle-thumb" />
          </div>
        </label>

        <label className="setting-row">
          <span>Sonido al escribir</span>
          <div
            className={`toggle-switch ${settings.sonidoEscribir ? "on" : "off"}`}
            onClick={() => toggleSetting("sonidoEscribir")}
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
