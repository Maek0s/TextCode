import { useEffect, useState, useRef, useCallback } from 'react';

import { FaRegStopCircle, FaPlay } from "react-icons/fa";
import { BsFillKeyboardFill } from "react-icons/bs";
import { MdError } from "react-icons/md";

import { playKeySound } from '../sound/keysounds.jsx';

import "../../App.css"

function TextMode({ finalScreen, setFinalScreen, setShowFinalScreen,
                    phrase, setPhrase, numberLetter, setNumberLetter, phraseRandom,
                    resetGame, settings, timer, gameState, setGameState, setNotification } ) {

    // Variables de tiempo y de estado del juego
    const [ mode, setMode ] = useState(null)
    const [ timeLeft, setTimeLeft ] = useState(0)
    const intervalRef = useRef(null)
    const [ stats, setStats ] = useState([])
    
    const modeRef = useRef(mode)
    useEffect(() => { modeRef.current = mode }, [mode])

    // Función para disparar notificación
    const triggerNotification = (config) => {
        setNotification(config)
    }

    // Método para finalizar el juego
    const finishGame = useCallback((currentMode) => {
        setGameState(false)

        if (!currentMode) currentMode = modeRef.current

        // Se guarda el progreso de la frase actual
        if (phraseRandom && phrase.length > 0) {
            let correct = 0
            let wrong = 0

            phrase.split("").forEach((char, index) => {
                if (phraseRandom[index] === char) correct++
                else wrong++
            })

            let newStats = {
                letterCorrect: correct,
                letterWrong: wrong,
                correctPhrase: phrase === phraseRandom,
                phrase: phraseRandom
            }

            setStats(prev => [...prev, newStats])
        }

        let finalTime = 0
        
        if (currentMode === 'infinite')
            finalTime = timeLeft
        else
            finalTime = timer

        if (currentMode === 'infinite' || currentMode === 'timed') {
            if (calculateStats(stats, finalTime)) {
                if (settings.enableFinalScreen) {
                    setFinalScreen(stats)
                    setShowFinalScreen(true)
                }
            }
        }

        setTimeLeft(0)
        setStats([])
        setPhrase("")
        setNumberLetter(0)
        setMode(null)

        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [stats, mode, setFinalScreen, setShowFinalScreen, timeLeft])

    const startCountdown = (seconds) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
        
        setGameState(true)
        
        if (seconds === -1) {
            setTimeLeft(0)
            setMode('infinite')
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

    // Calcula las estadísticas
    const calculateStats = (stats, finalTime) => {
        let wpmBruto = 0
        let wpmNeto = 0
        let correctLetters = 0
        let incorrectLetters = 0

        stats.forEach(stat => {
            correctLetters += stat.letterCorrect
            incorrectLetters += stat.letterWrong
        })

        wpmBruto = Math.round(((correctLetters + incorrectLetters) / 5) / (finalTime / 60))
        wpmNeto = Math.round(((correctLetters - incorrectLetters) / 5) / (finalTime / 60))

        stats.time = finalTime
        stats.wpmBruto = wpmBruto
        stats.wpmNeto = wpmNeto

        if (correctLetters === 0) {
            triggerNotification({
                message: `Se requiere completar una palabra y acertar alguna letra`,
                icon: <MdError />,
                backgroundColor: "#fd0a0aff",
                textColor: "#fff",
                duration: 2500,
                width: "550px",
                position: "top-center"
            })
            return false
        } else if (finalTime <= 5) {
            triggerNotification({
                message: `Debe pasar más de 5 segundos para contar`,
                icon: <MdError />,
                backgroundColor: "#fd0a0aff",
                textColor: "#fff",
                duration: 2500,
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
                duration: 4000,
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
                if (phrase.length > 0) {
                    setPhrase(prev => prev.substring(0, prev.length - 1))
                    setNumberLetter(prev => prev - 1)

                    if (settings.sonidoEscribir) playKeySound()
                }
            } else {
                // Filtramos que es una letra o signo permitido
                if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ,.!?;]$/.test(event.key)) {
                    if (!gameState) startCountdown(timer)

                    setPhrase(prev => prev + event.key)
                    setNumberLetter(prev => prev + 1)

                    if (settings.sonidoEscribir) playKeySound()
                }
            }

            // Parar el juego
            if (event.key === "Escape" || event.keyCode === 27) {
                event.preventDefault()
                if (modeRef.current === 'infinite') finishGame()
                else {
                    triggerNotification({
                        message: `Solo puedes parar el temporizador en modo infinito`,
                        icon: <MdError />,
                        backgroundColor: "#fd0a0aff",
                        textColor: "#fff",
                        duration: 2000,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberLetter, phrase, phraseRandom, timer])
    
    // Sumar estadísticas al completar una frase
    useEffect(() => {
        if (numberLetter === phraseRandom.length && phraseRandom) {
            let correct = 0
            let wrong = 0

            phrase.split("").forEach((char, index) => {
                if (phraseRandom[index] === char) correct++
                else wrong++
            })

            let newStats = {
                letterCorrect: correct,
                letterWrong: wrong,
                correctPhrase: phrase === phraseRandom,
                phrase: phraseRandom
            }

            stats.push(newStats)

            // Pide nueva frase y resetea input
            resetGame()
        }
    }, [numberLetter, phrase, phraseRandom, resetGame])

    let globalCharIndex = 0

    return (
        <>
            <span>{timer === -1 ? `Modo infinito - Tiempo: ${timeLeft}`
                    : timeLeft != 0
                        ? timeLeft
                        : timer}</span>

            <div className="game">
                {
                    phraseRandom.split(" ").map((word, wordIndex, wordArray) => {
                        return (
                            <div key={wordIndex}>
                                {word.split("").map((char, charIndex) => {
                                    const currentIndex = globalCharIndex
                                    
                                    const isCorrect = phrase[currentIndex] === char
                                    const style = {
                                        color: isCorrect
                                        ? "green" : phrase[currentIndex]
                                        ? "red"
                                        : "gray",
                                    }

                                    const withCursor = currentIndex === numberLetter
                                    
                                    globalCharIndex++
                                    
                                    return (
                                        <span key={charIndex} style={style}>
                                            {(settings.cursor && withCursor) &&
                                                (<span className="cursor"
                                                    style={{
                                                         "--cursor-color": settings.cursorColor || "#007acc",
                                                        }}>
                                                </span>)
                                            }
                                            {char}
                                        </span>
                                    )
                                })}
                                {wordIndex < wordArray.length - 1 && (
                                    <span key={`space-${wordIndex}`}> </span>
                                )}
                                { globalCharIndex++ && null }
                            </div>
                        )
                    })
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

export default TextMode