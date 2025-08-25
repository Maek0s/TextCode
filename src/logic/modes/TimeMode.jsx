import { useEffect, useState, useRef } from "react";
import { FaRedo } from "react-icons/fa";
import { playKeySound } from "../sound/keysounds.jsx";
import jsonWords from "../../assets/gamemodes/time/spain.json";
import "../../styles/Gamemodes.css";

function TimeMode({ timer, settings, resetGame }) {
    const [words, setWords] = useState([]);
    const [phrase, setPhrase] = useState("");
    const [numberLetter, setNumberLetter] = useState(0);
    const [wordsOffset, setWordsOffset] = useState(0);
    const [line, setLine] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timer);

    const containerRef = useRef(null);
    const VISIBLE_LINES = 3;
    const BUFFER_SIZE = 50; // Número inicial de palabras

    // Genera palabras aleatorias
    const generateWords = (count = 50) => {
        const dict = jsonWords.words;
        const newWords = Array.from({ length: count }, () => dict[Math.floor(Math.random() * dict.length)]);
        setWords(prev => [...prev, ...newWords]);
    };

    useEffect(() => {
        generateWords(BUFFER_SIZE);
        if (timer > 0) setTimeLeft(timer);
    }, [timer]);

    // Manejo de escritura incluyendo espacio
    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === "Backspace") {
                if (phrase.length > 0) {
                    setPhrase(prev => prev.slice(0, -1));
                    setNumberLetter(prev => prev - 1);
                    if (settings.sonidoEscribir) playKeySound();
                }
            } else if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.;!?]$/.test(event.key) || event.key === " ") {
                const key = event.key === " " ? " " : event.key;
                setPhrase(prev => prev + key);
                setNumberLetter(prev => prev + 1);
                if (settings.sonidoEscribir) playKeySound();
            }

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
                event.preventDefault();
                resetGame();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [phrase, numberLetter]);

    // Scroll automático y recorte de palabras completadas
    useEffect(() => {
        if (!containerRef.current || phrase.length === 0) return;

        const container = containerRef.current;
        const wordDivs = Array.from(container.children);
        if (!wordDivs.length) return;

        let charCount = 0;
        let currentWordIndex = 0;

        for (let i = 0; i < words.length; i++) {
            charCount += words[i].length + 1;
            if (phrase.length < charCount) {
                currentWordIndex = i;
                break;
            }
        }

        const localIndex = currentWordIndex - wordsOffset;
        const currentWord = wordDivs[localIndex];
        if (!currentWord) return;

        const wordTop = currentWord.offsetTop;
        const wordBottom = currentWord.offsetTop + currentWord.offsetHeight;
        const lineHeight = currentWord.offsetHeight;
        const visibleHeight = lineHeight * VISIBLE_LINES;

        if (wordBottom > visibleHeight) {
            setLine(Math.floor(wordTop / lineHeight));
        }

        // Recortar palabras completadas para liberar DOM
        if (currentWordIndex > 20) {
            setWords(prev => prev.slice(currentWordIndex));
            setPhrase(prev => prev.slice(charCount - words[currentWordIndex].length - 1));
            setWordsOffset(offset => offset + currentWordIndex);
            generateWords(15);
        }
    }, [phrase, words, wordsOffset]);

    let globalCharIndex = 0;

    return (
        <div className="contenedor">
            {timer > 0 && <h2>Tiempo: {timeLeft}s</h2>}
            <div className="gameTime" ref={containerRef}>
                {words.map((word, idx) => (
                    <div key={idx + wordsOffset}>
                        {word.split("").map((char, i) => {
                            const isCorrect = phrase[globalCharIndex] === char;
                            const style = { color: phrase[globalCharIndex] == null ? "gray" : isCorrect ? "green" : "red" };
                            globalCharIndex++;
                            return <span key={i} style={style}>{char}</span>;
                        })}
                        <span key={`space-${idx}`}> </span>
                        {globalCharIndex++ && null}
                    </div>
                ))}
            </div>

            <button
                className="resetButtonTime"
                onClick={e => { e.currentTarget.blur(); resetGame(); }}
                tabIndex="-1"
            >
                <FaRedo className="icon" />
                <span className="text">Reiniciar</span>
            </button>
        </div>
    );
}

export default TimeMode;
