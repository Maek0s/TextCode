import { useEffect, useRef, useLayoutEffect } from 'react';
import { FaRedo } from "react-icons/fa";

import Prism from 'prismjs';
import 'prismjs/themes/prism.css';

import 'prismjs/components/prism-clike';

import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-jsx';

function CodeMode({ fragmentRandom, resetFragment, progLanguage, inputCode, setInputCode }) {
    const containerRef = useRef(null)

    const resetGame = () => {
        setInputCode("")
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
        resetFragment()
    }

    useLayoutEffect(() => {
        if (containerRef.current) {
            if (inputCode.endsWith('\n')) {
                const container = containerRef.current;
                const maxScroll = container.scrollHeight - container.clientHeight;
                const nextScrollTop = container.scrollTop + 20;
                
                container.scrollTop = nextScrollTop > maxScroll ? maxScroll : nextScrollTop;
            }
        }
    }, [inputCode])

    const handleKeyDown = (e) => {
        e.preventDefault()

        const expectedChar = fragmentRandom.charAt(inputCode.length)

        let key = e.key

        // Controlar el reinicio del juego
        const isCtrl = e.ctrlKey || e.metaKey
        if (isCtrl && e.key.toLowerCase() === 'r') {
            e.preventDefault()
            resetGame()
            return
        }

        if (key === 'Enter' && '\n' === expectedChar) {
            key = '\n'
            setInputCode((prev) => prev + key);
            return
        }

        if (key === 'Tab') {
            key = '    '
            e.preventDefault()

            const expectedBlock = fragmentRandom.slice(inputCode.length, inputCode.length + 1);
            const expectedSpaces = fragmentRandom.slice(inputCode.length, inputCode.length + 4);

            if (expectedBlock === '\t' || expectedSpaces === '    ') {
                setInputCode(prev => prev + key)
            }
            return
        }

        if (e.key === 'Backspace') {
            setInputCode((prev) => prev.slice(0, -1))
            return
        }

        if (key === expectedChar) {
            setInputCode((prev) => prev + key)
        }
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
    }

    const getHighlightedCode = () => {
        if (!fragmentRandom) {
            console.error("Ha ocurrido un error al cargar el fragmento.")
            fragmentRandom = "Error"
            return
        }

        const typed = fragmentRandom.slice(0, inputCode.length)
        const rest = fragmentRandom.slice(inputCode.length)

        const safeLang = Prism.languages[progLanguage] ? progLanguage : 'jsx';
        const prismLang = Prism.languages[safeLang];

        const typedHighlighted = Prism.highlight(typed, prismLang, safeLang);
        const restEscaped = escapeHtml(rest);

        // Insertar cursor
        const cursorSpan = `<span class="cursor"></span>`

        let fullCode = typedHighlighted + cursorSpan + `<span style="color: gray;">${restEscaped}</span>`

        fullCode = fullCode.replaceAll("    ", (offset) => {
            // Si la flecha ya ha sido escrita
            if (offset < inputCode.length) {
                return `<span class="tab-arrow active">→    </span>`
            } else {
                // Y si todavía no
                return `<span class="tab-arrow">→    </span>`
            }
        })

        // Retornar todo junto
        return fullCode
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    })

    return (
        <>
            <div className="gameCodeContainer">
                <pre className={`language-${progLanguage}`} aria-hidden="true" ref={containerRef}>
                    <code dangerouslySetInnerHTML={{ __html: getHighlightedCode() }} />
                </pre>
            </div>

            <button className="resetButton codebtn"
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

export default CodeMode