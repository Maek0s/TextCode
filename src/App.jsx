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

function App() {
    // Header
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Settings
    const [ tabulado, setTabulacion ] = useState(() => {
        const tabuladoSetting = window.localStorage.getItem("tabulado")

        return tabuladoSetting ? JSON.parse(tabuladoSetting) : false
    })

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
                tabuladoSetting={tabulado}
                setTabulacion={setTabulacion}
            />
        </div>

        <Game tabuladoSetting={tabulado}/>

        <Footer/>
        </>
    )
}

export default App