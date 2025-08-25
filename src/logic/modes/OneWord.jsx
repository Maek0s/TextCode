import { useEffect, useState, useCallback } from 'react';

import { FaRedo, FaRegStopCircle } from "react-icons/fa";

/*import confetti from 'canvas-confetti'*/

import { playKeySound } from '../sound/keysounds.jsx';
import { useRandomWord } from '../hooks/usePhrases.jsx';

import "../../styles/Gamemodes.css"

function OneWord({ numberLetter, setNumberLetter, timer, settings} ) {
    const { word, getWord } = useRandomWord()
    const [ written, setWritten ] = useState("")
    const [ totalCorrect, setTotalCorrect ] = useState(0)
    const [ totalWrong, setTotalWrong ] = useState(0)
    const [ totalCorrectWords, setTotalCorrectWords ] = useState(0)
    const [ totalWords, setTotalWords ] = useState(0)

    const [ seconds, setSeconds ] = useState(0)

    const resetGame = useCallback(() => {
        getWord();
        setWritten("");
        setNumberLetter(0);
    }, [getWord, setNumberLetter]);

    useEffect(() => {
        function handleKeyDown(event) {
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
                    setWritten(prev => prev + event.key)
                    setNumberLetter(prev => prev + 1)

                    if (settings.sonidoEscribir) playKeySound()
                }
            }

            // Controlar el reinicio del juego
            const isCtrl = event.ctrlKey || event.metaKey
            if (isCtrl && event.key.toLowerCase() === 'r') {
                event.preventDefault()
                resetGame()
            }
        }
        
        window.addEventListener('keydown', handleKeyDown)
        
        // Limpieza cuando se desmonta
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberLetter, word])

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

            console.log("WordCorrect?", wordCorrect,"\nCorrect:", correct, "\nWrong:", wrong)
            
            // Se suma a las estadísticas totales
            if (correct > 0) setTotalCorrect(prev => prev + correct)
            if (wrong > 0) setTotalWrong(prev => prev + wrong)
            if (wordCorrect) setTotalCorrectWords(prev => prev + 1)
            setTotalWords(prev => prev + 1)

            resetGame()
        }
    }, [written, word, resetGame])
    
    useEffect(() => {
        console.log(`Total stats
    Total correct: ${totalCorrect}
    Total wrong: ${totalWrong}
    Words correct/total: ${totalCorrectWords}/${totalWords}`);
    }, [totalCorrect, totalWrong, totalCorrectWords, totalWords]);

    let letterIndex = 0;

    return (
        <>
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
                {/*
                <button className="stopButton"
                        onClick={(e) => {
                            e.currentTarget.blur()
                            resetGame()
                        }}
                        tabIndex="-1">
                    <FaRegStopCircle className="icon"/>
                    <span className="text">Stop</span>
                </button>
                */}
                <button className="resetButton"
                        onClick={(e) => {
                            e.currentTarget.blur()
                            resetGame()
                        }}
                        tabIndex="-1">
                    <FaRedo className="icon"/>
                    <span className="text">Reiniciar</span>
                </button>
            </div>
        </>
    )
}

export default OneWord