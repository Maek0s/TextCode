import './App.css'

import { useState } from "react"
 
import logo from './assets/images/logotextcode.png'

import Game from './logic/Game.jsx'

import Footer from './components/Footer.jsx';
import OptionNav from './components/OptionNav.jsx';

import { FaUser, FaCheckCircle } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdLeaderboard } from "react-icons/md";

import SettingsModal from "./components/SettingsModal.jsx";
import Notification from './components/Notification.jsx';
import UpdatesModal from './components/UpdatesModal.jsx';

import { saveSettings } from "./logic/storage/settings.js"

function App() {
    // Header
    const [ isSettingsOpen, setIsSettingsOpen ] = useState(false)

    // Notification
    const [notification, setNotification] = useState(null);

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
    const [ isUpdatesOpen, setIsUpdatesOpen ] = useState(false)

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
                {notification && (
                    <Notification
                        message={notification.message}
                        icon={notification.icon}
                        backgroundColor={notification.backgroundColor}
                        textColor={notification.textColor}
                        duration={notification.duration}
                        width={notification.width}
                        position={notification.position}
                        onClose={() => setNotification(null)}
                    />
                )}
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

            <Game settings={settings}
                  setNotification={setNotification}
                  notification={notification}
            />

            <Footer
                setIsUpdatesOpen={setIsUpdatesOpen}
            />
        </>
    )
}

export default App