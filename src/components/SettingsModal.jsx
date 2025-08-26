import { ChromePicker } from "react-color";
import { useState } from "react";

import '../styles/SettingsModal.css'

export default function SettingsModal({ isOpen, onClose, settings, onSave }) {  
  const [showColorPicker, setShowColorPicker] = useState(false);

  if (!isOpen) return null

  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] }
    onSave(newSettings)
  }

  const handleColorChange = (newColor) => {
    const updatedSettings = { ...settings, cursorColor: newColor.hex }
    onSave(updatedSettings)
  }

  console.log(settings.cursorColor)

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

        <label className="setting-row">
          <span>Mostrar cursor</span>
          <div
            className={`toggle-switch ${settings.cursor ? "on" : "off"}`}
            onClick={() => toggleSetting("cursor")}
          >
            <div className="toggle-thumb" />
          </div>
        </label>

        {
          settings.cursor &&
          (
            <div className="setting-row">
              <span>Color cursor</span>
              <span className="reset"
                    onClick={() => handleColorChange({ hex: "#007acc" })}>Reset</span>
              <div
                className="color-square"
                style={{ backgroundColor: settings.cursorColor || "#000000" }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />

              {showColorPicker && (
                <div className="popover">
                  <div className="cover" onClick={() => setShowColorPicker(false)} />
                  
                  <ChromePicker
                    className="custom-chrome-picker"
                    color={settings.cursorColor || "#007acc"}
                    onChange={handleColorChange}
                    disableAlpha={true}
                  />
                </div>
              )}
            </div>
          )
        }

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
