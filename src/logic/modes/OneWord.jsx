import { useEffect, useState, useCallback, useRef } from 'react';

import { FaRegStopCircle, FaPlay } from "react-icons/fa";
import { BsFillKeyboardFill } from "react-icons/bs";
import { MdError } from "react-icons/md";

import { playKeySound } from '../sound/keysounds.jsx';
import { useRandomWord } from '../hooks/usePhrases.jsx';

import "../../styles/Gamemodes.css"

function OneWord({ finalScreen, setFinalScreen, setShowFinalScreen,
                   setNumberLetter, timer, settings, gameState,
                   setGameState, setNotification} ) {
    // Variables de texto
    const { word, getWord } = useRandomWord()
    const [ written, setWritten ] = useState("")
    
    // Variables de tiempo y de estado del juego
    const [ mode, setMode ] = useState(null)
    const [ timeLeft, setTimeLeft ] = useState(0)
    const intervalRef = useRef(null)
    const [ stats, setStats ] = useState([])

    const modeRef = useRef(mode);
    useEffect(() => { modeRef.current = mode }, [mode]);

    // Función para disparar notificación
    const triggerNotification = (config) => {
        setNotification(config);
    }

    // Reiniciar el juego
    const resetGame = useCallback(() => {
        getWord()
        setWritten("")
        setNumberLetter(0)
    }, [getWord, setNumberLetter])

    // Método para finalizar el juego
    const finishGame = useCallback((currentMode) => {
        setGameState(false);

        if (!currentMode) currentMode = modeRef.current;

        if (currentMode === 'infinite' || currentMode === 'timed') {
            if (calculateStats(stats)) {
                if (settings.enableFinalScreen) {
                    setFinalScreen(stats)
                    setShowFinalScreen(true)
                }
            }
        }

        setTimeLeft(0)
        setWritten("")
        getWord()
        setStats([])
        setMode(null)

        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [stats, getWord, setFinalScreen, setShowFinalScreen, timeLeft]);

    const startCountdown = (seconds) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        
        setGameState(true)
        
        if (seconds === -1) {
            setMode('infinite')
            setTimeLeft(0)
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev + 1)
            }, 1000)
            return
        }

        setMode('timed')
        setTimeLeft(seconds)

        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current)
                    intervalRef.current = null
                    finishGame('timed')
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    // Calcular las estadísticas
    const calculateStats = (stats) => {
        let wpmBruto = 0
        let wpmNeto = 0
        let correctLetters = 0
        let incorrectLetters = 0

        let time = 0

        stats.forEach(stat => {
            correctLetters += stat.letterCorrect
            incorrectLetters += stat.letterWrong
        })

        if (timer === -1)
            time = timeLeft
        else
            time = timer

        wpmBruto = Math.round(((correctLetters + incorrectLetters) / 5) / (time / 60))
        wpmNeto = Math.round(((correctLetters - incorrectLetters) / 5) / (time / 60))

        stats.time = time
        stats.wpmBruto = wpmBruto
        stats.wpmNeto = wpmNeto

        if (correctLetters === 0) {
            triggerNotification({
                message: `Se requiere completar una palabra y acertar alguna letra`,
                icon: <MdError />,
                backgroundColor: "#fd0a0aff",
                textColor: "#fff",
                duration: 4000,
                width: "550px",
                position: "top-center"
            })
            return false
        } else if (time <= 5) {
            triggerNotification({
                message: `Debe pasar más de 5 segundos para contar`,
                icon: <MdError />,
                backgroundColor: "#fd0a0aff",
                textColor: "#fff",
                duration: 4000,
                width: "550px",
                position: "top-center"
            })
            return false
        } else if (incorrectLetters >= correctLetters) {
            triggerNotification({
                message: `Debes tener más letras correctas que incorrectas ${incorrectLetters}x - ${correctLetters}✓`,
                icon: <MdError />,
                backgroundColor: "#fd0a0aff",
                textColor: "#fff",
                duration: 2500,
                width: "550px",
                position: "top-center"
            })
            return false
        }

        // Mostrar notificación al terminar el juego
        triggerNotification({
            message: `Juego terminado! WPM: ${wpmNeto} - (${correctLetters}/${correctLetters + incorrectLetters}) letras acertadas.`,
            icon: <BsFillKeyboardFill />,
            backgroundColor: "#12a0ff",
            textColor: "#fff",
            duration: 5000,
            width: "550px",
            position: "top-center"
        })

        console.log("Estadísticas validas.", stats)

        return true
    }

    // Limpiar al desmontar
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [])

    // Gestión de input
    useEffect(() => {
        function handleKeyDown(event) {
            if (finalScreen) return

            // Gestión de escritura o borrado de caracteres
            if (event.key == "Backspace") {
                if (word.length > 0) {
                    setWritten(prev => prev.substring(0, prev.length - 1))
                    setNumberLetter(prev => prev - 1)

                    if (settings.sonidoEscribir) playKeySound()
                }
            } else {
                // Filtramos que es una letra o signo permitido
                if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ,.!?;]$/.test(event.key)) {
                    // Si no está iniciado se inicia el juego
                    if (!gameState && timer != -2) startCountdown(timer)

                    setWritten(prev => prev + event.key)
                    setNumberLetter(prev => prev + 1)

                    if (settings.sonidoEscribir) playKeySound()
                }
            }

            // Controlar el reinicio del juego
            if (event.key.toLowerCase() === "escape" || event.keyCode === 27) {
                event.preventDefault()
                if (modeRef.current === 'infinite') finishGame()
                else {
                    triggerNotification({
                        message: `Solo puedes parar el temporizador en modo infinito`,
                        icon: <MdError />,
                        backgroundColor: "#fd0a0aff",
                        textColor: "#fff",
                        duration: 4000,
                        width: "550px",
                        position: "top-center"
                })}
            }
        }
        
        window.addEventListener('keydown', handleKeyDown)
        
        // Limpieza cuando se desmonta
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        };
    }, [word, settings, gameState, timer, resetGame, setNumberLetter])

    // Control al terminar la palabra
    useEffect(() => {
        if (word && word.length === written.length) {
            let index = 0

            let correct = 0
            let wrong = 0
            let wordCorrect = false
            
            written.split("").forEach(letter => {
                if (letter === word[index])
                    correct++
                else
                    wrong++

                index++
            })

            if (wrong == 0) wordCorrect = true

            if (gameState) {
                // Se suma a las estadísticas totales
                let newStats = {
                    letterCorrect: correct,
                    letterWrong: wrong,
                    correctWord: wordCorrect,
                    word: word
                }

                stats.push(newStats)
            }

            resetGame()
        }
    }, [written, word, resetGame])
    
    let letterIndex = 0;

    return (
        <>
            <span>{timer === -1
                    ? `Modo infinito - Tiempo: ${timeLeft}`
                    : timer === -2
                        ? "\u00A0"
                        : timeLeft != 0
                            ? timeLeft
                            : timer}</span>

            <div className="game">
                { word &&
                    (word.split("").map((char, charIndex) => {
                        const currentIndex = letterIndex

                        const isCorrect = written[currentIndex] === char
                        const style = {
                            color : isCorrect
                            ? "green" : written[currentIndex]
                            ? "red"
                            : "gray",
                        }

                        letterIndex++

                        return (
                            <span key={charIndex} style={style}>
                                {char}
                            </span>
                        )
                    }))
                }
            </div>
            <div className="buttons oneword">
                {
                gameState === true
                ? (
                    <button className="stopButton"
                            onClick={(e) => {
                                e.currentTarget.blur()
                                if (modeRef.current === 'infinite') finishGame()
                                else {
                                    triggerNotification({
                                        message: `Solo puedes parar el temporizador en modo infinito`,
                                        icon: <MdError />,
                                        backgroundColor: "#fd0a0aff",
                                        textColor: "#fff",
                                        duration: 4000,
                                        width: "550px",
                                        position: "top-center"
                                })}
                            }}
                            tabIndex="-1">
                        <FaRegStopCircle className="icon"/>
                        <span className="text">Stop</span>
                    </button>)
                : (
                    <button className="playButton"
                            tabIndex="-1">
                        <FaPlay className="icon"/>
                        <span className="text">Escribe para jugar</span>
                    </button>)
                }
            </div>
        </>
    )
}

export default OneWord