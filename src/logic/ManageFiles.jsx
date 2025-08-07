import { useEffect, useState } from "react";
import data from "../assets/phrases/spain.json";

import { getRandomInRange } from "../utils/GeneralUtils"

export function useRandomPhrase() {
    const [phraseRandom, setRandomPhrase] = useState("")

    const generateRandomPhrase = () => {
        const index = getRandomInRange(0, data.frases.length - 1);
        const phrase = data.frases[index];
        setRandomPhrase(phrase);
    };

    useEffect(() => {
        generateRandomPhrase();
    }, []);

    return { phraseRandom, resetPhrase: generateRandomPhrase }
}
