import { useState } from 'react';
import { useRandomPhrase } from './ManageFiles.jsx'
import { useFragmentCode } from './ManageFiles.jsx';

import { TbNumber15Small, TbNumber30Small, TbNumber60Small  } from "react-icons/tb";
import { FaJava, FaReact } from "react-icons/fa";
import { FaCode } from "react-icons/fa6";
import { SiCplusplus } from "react-icons/si";
import { CiStopwatch } from "react-icons/ci";
import { PiTextAaBold } from "react-icons/pi";

import TextMode from './modes/TextMode.jsx'
import CodeMode from './modes/CodeMode.jsx'


function Game({ tabuladoSetting }) {
    const { phraseRandom, resetPhrase } = useRandomPhrase();
    const [ phrase, setPhrase ] = useState("");
    const [ inputCode, setInputCode ] = useState("")
    const [ numberLetter, setNumberLetter ] = useState(0);
    const [ gamemode, setGamemode ] = useState("text");
    const [ progLanguage, setProgLanguage ] = useState("java");
    const { fragmentRandom, resetFragment } = useFragmentCode(progLanguage);
    const [ mostrarTimers, showTimers ] = useState(false)
    const [ timer, setTimer ] = useState(0);

    const resetGame = () => {
        resetPhrase()
        setPhrase("")
        setNumberLetter(0)
    }

    const selecTimer = (number) => {
        if (timer == number)
            setTimer(0)
        else
            setTimer(number)
    }

    const changeProgLanguage = (progLanguage) => {
        setInputCode("")
        setProgLanguage(progLanguage)
    }

    const loadGame = () => {
        switch (gamemode) {
            case "text":
                return <TextMode
                            phrase={phrase}
                            setPhrase={setPhrase}
                            numberLetter={numberLetter}
                            setNumberLetter={setNumberLetter}
                            phraseRandom={phraseRandom}
                            timer={timer}
                            resetGame={resetGame}
                        />
            case "code":
                return <CodeMode
                            fragmentRandom={fragmentRandom}
                            resetFragment={resetFragment}
                            progLanguage={progLanguage}
                            inputCode={inputCode}
                            setInputCode={setInputCode}
                            tabuladoSetting={tabuladoSetting}
                        />
            default:
                return (
                    <>
                        {console.log("Error aquí, modo de juego: ", gamemode)}
                        <p>¡Modo desconocido!</p>
                        <p>Entra en la consola y manda una captura de <br/>
                        pantalla con todo incluido para reportar el bug</p>
                    </>
                )
        }
    }
    
    return (
        <div className="contenedor">
            <div className="optionsGame">
                <div className="group">
                    <span className={`mode ${gamemode === "text" ? "enable" : ""}`}
                          onClick={() => setGamemode("text")}>
                        <PiTextAaBold size={25} style={{ position: 'relative', top: '2px' }}/>
                    </span>
                    <span className={`mode ${gamemode === "code" ? "enable" : ""}`}
                          onClick={() => setGamemode("code")}>
                        <FaCode size={25} style={{ position: 'relative', top: '2px' }}/>
                    </span>
                </div>
                { gamemode === "code" && (
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
                <div className={`group ${mostrarTimers ? 'timersExpanded' : ''}`}>
                    <span className={`${mostrarTimers ? 'timerToggleExpanded' : 'timerToggle'}`}
                          onClick={() => {
                              showTimers(prev => !prev)
                              if (!mostrarTimers) setTimer(0)
                          }}
                    >
                        <CiStopwatch size={25} style={{ position: 'relative', top: '2px' }}/>
                    </span>
                    <>
                        <span className={`timerDisplayed ${timer === 15 ? "enable" : ""}`}
                              onClick={() => selecTimer(15)}>
                            <TbNumber15Small size={25}/>
                        </span>
                        <span className={`timerDisplayed ${timer === 30 ? "enable" : ""}`}
                              onClick={() => selecTimer(30)}>
                            <TbNumber30Small size={25}/>
                        </span>
                        <span className={`timerDisplayed ${timer === 60 ? "enable" : ""}`}
                              onClick={() => selecTimer(60)}>
                            <TbNumber60Small size={25}/>
                        </span>
                    </>
                </div>
            </div>
            {
                loadGame()
            }
        </div>
    )
}

export default Game