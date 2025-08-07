import { useEffect } from 'react';
import { useState } from 'react';
import { useRandomPhrase } from './ManageFiles.jsx'

import confetti from 'canvas-confetti'
import { FaRedo } from "react-icons/fa";

function KeyListener() {
    const { phraseRandom, resetPhrase } = useRandomPhrase()
    
    console.log("Phrase selected: ", phraseRandom)
    
    const [phrase, setPhrase] = useState("")
    const [numberLetter, setNumberLetter] = useState(0)
    
    const resetGame = () => {
        resetPhrase()
        setPhrase("")
        setNumberLetter(0)
    }

    useEffect(() => {
        function handleKeyDown(event) {
            
            // Gestión de escritura o borrado de caracteres
            if (event.key == "Backspace") {
                if (phrase.length > 0) {
                    setPhrase(prev => prev.substring(0, prev.length - 1))
                    setNumberLetter(prev => prev - 1)
                }
            } else {
                // Filtramos que es una letra o signo permitido
                if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ,.!?;]$/.test(event.key)) {
                    setPhrase(prev => prev + event.key)
                    setNumberLetter(prev => prev + 1)
                }
            }

            // Controlar el reinicio del juego
            const isCtrl = event.ctrlKey || event.metaKey
            if (isCtrl && event.key.toLowerCase() === 'r') {
                event.preventDefault()
                resetGame()
            }
        }
        
        window.addEventListener('keydown', handleKeyDown);
        
        // Limpieza cuando se desmonta
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [numberLetter, phrase, phraseRandom ]);
    
    useEffect(() => {
        // Solo si ya escribiste toda la frase
        if (numberLetter === phraseRandom.length && phraseRandom) {
            if (phrase === phraseRandom) {
                confetti();
            } else {
                console.log("Frase incompleta o con errores:", phrase);
            }
        }
    }, [numberLetter, phrase, phraseRandom]);
    
    let globalCharIndex = 0;
    
    return (
        <div className="contenedor">
            <div className="game">
            {
                phraseRandom.split(" ").map((word, wordIndex, wordArray) => {
                    return (
                        <div key={wordIndex}>
                            {word.split("").map((char, charIndex) => {
                                const currentIndex = globalCharIndex
                                
                                const isCorrect = phrase[currentIndex] === char;
                                const style = {
                                    color: isCorrect
                                    ? "green" : phrase[currentIndex]
                                    ? "red"
                                    : "gray",
                                };
                                
                                globalCharIndex++
                                
                                return (
                                    <span key={charIndex} style={style}>
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
            
            <button className="resetButton" onClick={resetGame}>
                <FaRedo className="icon"/>
                <span className="text">Reiniciar</span>
            </button>
        </div>
    )
}

export default KeyListener;