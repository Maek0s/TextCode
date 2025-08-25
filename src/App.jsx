import './App.css'

import { useState } from "react"
 
import logo from './assets/images/logotextcode.png'

import Game from './logic/Game.jsx'

import Footer from './components/Footer.jsx';

import OptionNav from './components/OptionNav.jsx';

import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdLeaderboard } from "react-icons/md";

import SettingsModal from "./components/SettingsModal.jsx";

import { saveSettings } from "./logic/storage/settings.js"
import UpdatesModal from './components/UpdatesModal.jsx';

function App() {
    // Header
    const [ isSettingsOpen, setIsSettingsOpen ] = useState(false);

    // Settings
    const [ settings, setSettings ] = useState(() => {
        const stored = window.localStorage.getItem("settings")
        return stored ? JSON.parse(stored) : {
            tabulado: false,
            efectosSonido: true,
            sonidoEscribir: true,
            controles: true,
        }
    })

    // Footer
    const [ isUpdatesOpen, setIsUpdatesOpen ] = useState(false);

    const handleSave = (newSettings) => {
        setSettings(newSettings)
        saveSettings(newSettings)
    }

    // Return
    return (
        <>
            <header>
                <div className="headerLeft">
                <a id="logo" href="./">
                    <div className="icon">
                    <img src={logo}/>
                    </div>
                    <h1 className="iconLogo">Text&Code</h1>
                </a>
                </div>
                <div className="headerRight">
                <OptionNav nameClass="username">
                    <MdLeaderboard size={22}/>
                </OptionNav>
                <OptionNav nameClass="username">
                    <IoMdSettings size={22} onClick={() => setIsSettingsOpen(true)}/>
                </OptionNav>
                <OptionNav nameClass="username">
                    <FaUser size={18}/>
                    Username
                </OptionNav>
                </div>
            </header>
            <div>
                <SettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                    settings={settings}
                    onSave={handleSave}
                />
                <UpdatesModal
                    isOpen={isUpdatesOpen}
                    onClose={() => setIsUpdatesOpen(false)}
                />
            </div>

            <Game settings={settings}/>

            {
                settings.controles && (
                    <div className="controlsDiv">
                        <ul>
                            <li><kbd>Ctrl</kbd> + <kbd>R</kbd> Reiniciar</li>
                            {/*<li><kbd>Esc</kbd> Parar juego</li>*/}
                        </ul>
                    </div>
                )
            }

            <Footer
                isUpdatesOpen={isUpdatesOpen}
                setIsUpdatesOpen={setIsUpdatesOpen}
            />
        </>
    )
}

export default App