import { useEffect } from 'react';

import { FaRedo } from "react-icons/fa";

import confetti from 'canvas-confetti'

function TextMode({ phrase, setPhrase, numberLetter, setNumberLetter, phraseRandom, timer, resetGame} ) {
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
        
        window.addEventListener('keydown', handleKeyDown)
        
        // Limpieza cuando se desmonta
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [numberLetter, phrase, phraseRandom])
    
    useEffect(() => {
        // Efecto cuando ganas
        if (numberLetter === phraseRandom.length && phraseRandom) {
            if (phrase === phraseRandom) {
                confetti()
                resetGame()
            } else {
                console.log("Frase incompleta o con errores:", phrase)
                resetGame()
            }
        }
    }, [numberLetter, phrase, phraseRandom]);
    
    let globalCharIndex = 0;

    return (
        <>
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
            <button className="resetButton"
                    onClick={(e) => {
                        e.currentTarget.blur()
                        resetGame()
                    }}
                    tabIndex="-1">
                <FaRedo className="icon"/>
                <span className="text">Reiniciar</span>
            </button>
        </>
        
    )
}

export default TextMode