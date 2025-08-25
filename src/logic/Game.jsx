import { useState } from 'react';
import { useFragmentCode, useRandomPhrase } from './hooks/usePhrases.jsx';

import { CiStopwatch } from "react-icons/ci";
import { IoMdInfinite } from "react-icons/io";
import { FaJava, FaKeyboard, FaReact } from "react-icons/fa";
import { FaCode } from "react-icons/fa6";
import { PiTextAaBold } from "react-icons/pi";
import { SiCplusplus } from "react-icons/si";
import { TbNumber15Small, TbNumber30Small, TbNumber60Small } from "react-icons/tb";
import { SiMonkeytype } from "react-icons/si";

import CodeMode from './modes/CodeMode.jsx';
import TextMode from './modes/TextMode.jsx';
import TimeMode from './modes/TimeMode.jsx';
import OneWord from './modes/OneWord.jsx';

function Game({ settings }) {
    const { phraseRandom, resetPhrase } = useRandomPhrase();
    const [ phrase, setPhrase ] = useState("");
    const [ inputCode, setInputCode ] = useState("")
    const [ numberLetter, setNumberLetter ] = useState(0);
    const [ gamemode, setGamemode ] = useState("text");
    const [ progLanguage, setProgLanguage ] = useState("java");
    const { fragmentRandom, resetFragment } = useFragmentCode(progLanguage);
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

    const changeGamemode = (gamemode) => {
        resetGame()
        setInputCode("")
        setGamemode(gamemode)
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
                            resetGame={resetGame}
                            settings={settings}
                        />
            case "code":
                return <CodeMode
                            fragmentRandom={fragmentRandom}
                            resetFragment={resetFragment}
                            progLanguage={progLanguage}
                            inputCode={inputCode}
                            setInputCode={setInputCode}
                            settings={settings}
                        />
            case "oneword":
                return <OneWord
                            numberLetter={numberLetter}
                            setNumberLetter={setNumberLetter}
                            timer={timer}
                            settings={settings}
                            resetGame={resetGame}
                       />
            case "time":
                return <TimeMode
                            timer={timer}
                            settings={settings}
                            resetGame={resetGame}
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
                          onClick={() => changeGamemode("text")}>
                        <PiTextAaBold size={25} style={{ position: 'relative', top: '2px' }}/>
                    </span>
                    <span className={`mode ${gamemode === "oneword" ? "enable" : ""}`}
                          onClick={() => changeGamemode("oneword")}>
                        <FaKeyboard size={25} style={{ position: 'relative', top: '2px' }}/>
                    </span>
                    <span className={`mode ${gamemode === "code" ? "enable" : ""}`}
                          onClick={() => changeGamemode("code")}>
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
                <div className={`group timersExpanded`}>
                    {/* gamemode === "oneword" && (
                        <>
                            <span className={`timerToggleExpanded ${timer === 0 ? "enable" : ""}`}
                                  onClick={() => setTimer(0)}
                            >
                                <IoMdInfinite size={25} style={{ position: 'relative', top: '2px' }}/>
                            </span>
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
                    )*/}
                </div>
            </div>
            {
                loadGame()
            }
        </div>
    )
}

export default Game