import { useEffect, useState, useRef } from "react";
import data from "../assets/gamemodes/text/spain.json";
import javaFragments from "../assets/gamemodes/code/java.json";
import reactFragments from "../assets/gamemodes/code/react.json";
import cppFragments from "../assets/gamemodes/code/cpp.json";

import { getRandomInRange } from "../utils/GeneralUtils"

export function useRandomPhrase() {
    const [phraseRandom, setRandomPhrase] = useState("")

    const lastPhraseRef = useRef(null)

    const generateRandomPhrase = () => {
        if (!data.frases || data.frases.length === 0) return;

        let phrase = null;
        let tries = 0;
        do {
            const index = getRandomInRange(0, data.frases.length - 1);
            phrase = data.frases[index];
            tries++;
        } while (phrase === lastPhraseRef.current && tries < 10);

        lastPhraseRef.current = phrase;

        setRandomPhrase(phrase)
    }

    useEffect(() => {
        generateRandomPhrase();
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
        if (!file.codes || file.codes.length === 0) return;

        let fragment = null;
        let tries = 0;
        do {
            const index = getRandomInRange(0, file.codes.length - 1);
            fragment = file.codes[index];
            tries++;
        } while (fragment === lastFragmentRef.current && tries < 10);

        lastFragmentRef.current = fragment;
        setCodeFragment(fragment);
    }

    useEffect(() => {
        generateRandomFragment();
    }, [language])

    return { fragmentRandom, resetFragment: generateRandomFragment }
}