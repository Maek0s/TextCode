import { useState } from 'react';
import { useFragmentCode, useRandomPhrase } from './hooks/usePhrases.jsx';

import { LuTimerOff } from "react-icons/lu";
import { IoMdInfinite } from "react-icons/io";
import { FaJava, FaKeyboard, FaReact } from "react-icons/fa";
import { FaCode } from "react-icons/fa6";
import { PiTextAaBold } from "react-icons/pi";
import { SiCplusplus } from "react-icons/si";
import { TbNumber15Small, TbNumber30Small, TbNumber60Small } from "react-icons/tb";

import CodeMode from './modes/CodeMode.jsx';
import TextMode from './modes/TextMode.jsx';
import OneWord from './modes/OneWord.jsx';

import FinalScreen from '../components/FinalScreen.jsx';

function Game({ settings, setNotification }) {
    const { phraseRandom, resetPhrase } = useRandomPhrase()
    const [ phrase, setPhrase ] = useState("")
    const [ inputCode, setInputCode ] = useState("")
    const [ numberLetter, setNumberLetter ] = useState(0)
    const [ gamemode, setGamemode ] = useState("Text")
    const [ progLanguage, setProgLanguage ] = useState("java")
    const { fragmentRandom, resetFragment } = useFragmentCode(progLanguage)
    const [ timer, setTimer ] = useState(-1)
    const [ gameState, setGameState ] = useState(false)

    // Pantalla final
    const [ showFinalScreen, setShowFinalScreen] = useState(false)
    const [ finalScreen, setFinalScreen ] = useState(null)

    const resetGame = () => {
        resetPhrase()
        setPhrase("")
        setNumberLetter(0)
    }

    const changeTimer = (timer) => {
        if (!gameState)
            setTimer(timer)
    }

    const resetFinalScreen = () => {
        setShowFinalScreen(false)
    }

    const changeProgLanguage = (progLanguage) => {
        setInputCode("")
        setProgLanguage(progLanguage)
    }

    const changeGamemode = (gamemode) => {
        resetGame()
        setInputCode("")
        setGameState(false)
        setGamemode(gamemode)

        if (gamemode === "Text" && timer == -2) {
            setTimer(-1)
        }
    }

    const loadGame = () => {
        switch (gamemode) {
            case "Text":
                return <TextMode
                            finalScreen={finalScreen}
                            setFinalScreen={setFinalScreen}
                            showFinalScreen={showFinalScreen}
                            setShowFinalScreen={setShowFinalScreen}
                            phrase={phrase}
                            setPhrase={setPhrase}
                            numberLetter={numberLetter}
                            setNumberLetter={setNumberLetter}
                            phraseRandom={phraseRandom}
                            timer={timer}
                            resetGame={resetGame}
                            gameState={gameState}
                            setGameState={setGameState}
                            setNotification={setNotification}
                            settings={settings}
                        />
            case "Code":
                return <CodeMode
                            fragmentRandom={fragmentRandom}
                            resetFragment={resetFragment}
                            progLanguage={progLanguage}
                            inputCode={inputCode}
                            setInputCode={setInputCode}
                            setNotification={setNotification}
                            settings={settings}
                        />
            case "OneWord":
                return <OneWord
                            finalScreen={finalScreen}
                            setFinalScreen={setFinalScreen}
                            setShowFinalScreen={setShowFinalScreen}
                            setNumberLetter={setNumberLetter}
                            timer={timer}
                            gameState={gameState}
                            setGameState={setGameState}
                            setNotification={setNotification}
                            settings={settings}
                       />
            default:
                return (
                    <>
                        {console.error("Error aquí, modo de juego: ", gamemode)}
                        <p><b>¡Modo desconocido! "{gamemode}"</b></p>
                        <p>Manda una captura de pantalla con<br/>
                           todo incluido para reportar el bug</p>
                    </>
                )
        }
    }
    
    return (
        <div className="contenedor">
            {
                showFinalScreen ? (
                    <FinalScreen
                        data={finalScreen}
                        gameMode={gamemode}
                        onClick={() => {
                            setFinalScreen(null)
                            resetFinalScreen()
                        }}
                    />
                ) :
                <>
                <div className="optionsGame">
                    <div className="group">
                        <span className={`mode ${gamemode === "Text" ? "enable" : ""}`}
                            onClick={() => changeGamemode("Text")}>
                            <PiTextAaBold size={25} style={{ position: 'relative', top: '2px' }}/>
                        </span>
                        <span className={`mode ${gamemode === "OneWord" ? "enable" : ""}`}
                            onClick={() => changeGamemode("OneWord")}>
                            <FaKeyboard size={25} style={{ position: 'relative', top: '2px' }}/>
                        </span>
                        <span className={`mode ${gamemode === "Code" ? "enable" : ""}`}
                            onClick={() => changeGamemode("Code")}>
                            <FaCode size={25} style={{ position: 'relative', top: '2px' }}/>
                        </span>
                    </div>
                    { gamemode === "Code" && (
                        <div className="group">
                            <span className={`mode ${progLanguage === "jsx" ? "enable" : ""}`}
                                onClick={() => changeProgLanguage("jsx")}>
                                <FaReact size={25} style={{ position: 'relative', top: '2px' }}/>
                            </span>
                            <span className={`mode ${progLanguage === "java" ? "enable" : ""}`}
                                onClick={() => changeProgLanguage("java")}>
                                <FaJava size={25} style={{ position: 'relative', top: '2px' }}/>
                            </span>
                            <span className={`mode ${progLanguage === "cpp" ? "enable" : ""}`}
                                onClick={() => changeProgLanguage("cpp")}>
                                <SiCplusplus size={25} style={{ position: 'relative', top: '2px' }}/>
                            </span>
                        </div>)
                    }
                    <div className={`group timersExpanded`}>
                        { (gamemode === "OneWord" || gamemode === "Text")
                         && (
                            <>
                                {
                                    (gamemode === "OneWord") ?
                                    (
                                        <>
                                        <span className={`timerToggleExpanded ${timer === -2 ? "enable" : ""}`}
                                            onClick={() => changeTimer(-2)}
                                        >
                                            <LuTimerOff size={25} style={{ fontSize: '10px', position: 'relative', top: '2px' }}/>
                                        </span>
                                        <span className={`timerDisplayed ${timer === -1 ? "enable" : ""}`}
                                            onClick={() => changeTimer(-1)}
                                        >
                                            <IoMdInfinite size={25} style={{ position: 'relative', top: '2px' }}/>
                                        </span>
                                        </>
                                    ) :
                                    <span className={`timerToggleExpanded ${timer === -1 ? "enable" : ""}`}
                                        onClick={() => changeTimer(-1)}
                                    >
                                        <IoMdInfinite size={25} style={{ position: 'relative', top: '2px' }}/>
                                    </span>
                                }
                                <span className={`timerDisplayed ${timer === 15 ? "enable" : ""}`}
                                    onClick={() => changeTimer(15)}>
                                    <TbNumber15Small size={25}/>
                                </span>
                                <span className={`timerDisplayed ${timer === 30 ? "enable" : ""}`}
                                    onClick={() => changeTimer(30)}>
                                    <TbNumber30Small size={25}/>
                                </span>
                                <span className={`timerDisplayed ${timer === 60 ? "enable" : ""}`}
                                    onClick={() => changeTimer(60)}>
                                    <TbNumber60Small size={25}/>
                                </span>
                            </>
                        )}
                    </div>
                </div>
                {
                    loadGame()
                }

                {
                    settings.controles && (
                        <div className="controlsDiv">
                            <ul>
                                {
                                    (gamemode == "OneWord" || gamemode == "Text") ?
                                    ( <li><kbd>Esc</kbd> Parar juego</li> )
                                    :
                                    ( <li><kbd>Ctrl</kbd> + <kbd>R</kbd> Reiniciar</li> )
                                }
                                
                            </ul>
                        </div>
                    )
                }
            </>
            }
        </div>
    )
}

export default Game