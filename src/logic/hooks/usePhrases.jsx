import { useEffect, useRef, useState } from "react";
import cppFragments from "../../assets/gamemodes/code/cpp.json";
import javaFragments from "../../assets/gamemodes/code/java.json";
import reactFragments from "../../assets/gamemodes/code/react.json";
import data from "../../assets/gamemodes/text/spain.json";
import words from "../../assets/gamemodes/time/spain.json";

import { getRandomInRange } from "../../utils/GeneralUtils";

export function useRandomPhrase() {
    const [phraseRandom, setRandomPhrase] = useState("")

    const lastPhraseRef = useRef(null)

    const generateRandomPhrase = () => {
        if (!data.frases || data.frases.length === 0) return

        let phrase = null
        let tries = 0
        do {
            const index = getRandomInRange(0, data.frases.length - 1)
            phrase = data.frases[index]
            tries++
        } while (phrase === lastPhraseRef.current && tries < 10)

        lastPhraseRef.current = phrase

        setRandomPhrase(phrase)
    }

    useEffect(() => {
        generateRandomPhrase()
    }, [])

    return { phraseRandom, resetPhrase: generateRandomPhrase }
}

export function useFragmentCode(language) {
    const [fragmentRandom, setCodeFragment] = useState("")
    const lastFragmentRef = useRef(null)

    let file

    switch (language) {
        case "java":
            file = javaFragments
            break
        case "jsx":
            file = reactFragments
            break
        case "cpp":
            file = cppFragments
            break
        default:
            console.error("Language undefined, selected react: ", language)
            language = "react"
            file = reactFragments
            break
    }
                
    const generateRandomFragment = () => {
        if (!file.codes || file.codes.length === 0) return

        let fragment = null
        let tries = 0
        do {
            const index = getRandomInRange(0, file.codes.length - 1)
            fragment = file.codes[index]
            tries++
        } while (fragment === lastFragmentRef.current && tries < 10)

        // Forzar aunque sea el mismo
        lastFragmentRef.current = fragment
        setCodeFragment(fragment)
    }

    useEffect(() => {
        generateRandomFragment()
    }, [language])

    return { fragmentRandom, resetFragment: generateRandomFragment }
}

export function useRandomWord() {
    const [word, setRandomWord] = useState("")

    const lastPhraseRef = useRef(null)

    const generateRandomWord = () => {
        if (!words.words || words.words.length === 0) return

        let word = null
        let tries = 0
        do {
            const index = getRandomInRange(0, data.frases.length - 1)
            word = words.words[index]
            tries++
        } while (word === lastPhraseRef.current && tries < 10)

        lastPhraseRef.current = word

        setRandomWord(word)
    }

    useEffect(() => {
        generateRandomWord()
    }, [])

    return { word, getWord: generateRandomWord }
}
