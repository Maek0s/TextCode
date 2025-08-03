import { useEffect } from 'react';
import { useState } from 'react';
import confetti from 'canvas-confetti'

function KeyListener() {
  const phraseToWrite = "Me gusta la sandía."

  const [phrase, setPhrase] = useState("")
  const [numberLetter, setNumberLetter] = useState(0)

  useEffect(() => {

    function handleKeyDown(event) {

      if (event.key == "Backspace") {
        if (phrase.length > 0) {
            setPhrase(prev => prev.substring(0, prev.length - 1))
            setNumberLetter(prev => prev - 1)
        }
      } else {
        // Filtramos que es una letra o signo permitido
        if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ,.!?;]$/.test(event.key)) {
            let letterToWrite = phraseToWrite[numberLetter]
            console.log("Letter to write: " + letterToWrite + " number: " + numberLetter
                + " total length: " + phraseToWrite.length
            )

            setPhrase(prev => prev + event.key)
            setNumberLetter(prev => prev + 1)

            console.log('Tecla presionada:', event.key);
            console.log('Frase:', phrase);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    // Limpieza cuando se desmonta
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [numberLetter, phrase]);

  useEffect(() => {
    // Solo si ya escribiste toda la frase
    if (numberLetter === phraseToWrite.length) {
      if (phrase === phraseToWrite) {
        confetti();
      } else {
        console.log("Frase incompleta o con errores:", phrase);
      }
    }
  }, [numberLetter, phrase, phraseToWrite]);

  return (
    <div className="game" style={{ fontFamily: "monospace", fontSize: "2rem" }}>
      {phraseToWrite.split("").map((char, idx) => {
        const isCorrect = phrase[idx] === char;
        const style = {
          color: isCorrect ? "green" : phrase[idx] ? "red" : "gray",
        };
        return (
          <span key={idx} style={style}>
            {char}
          </span>
        );
      })}
    </div>
  )
}

export default KeyListener;
