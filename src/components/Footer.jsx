import { FaCodeBranch } from "react-icons/fa";
import { IoLogoGithub } from "react-icons/io";

import packageJson from '/package.json';

function Footer() {
    return (
        <footer>
            <span className="githubCreator">
                <a href="https://github.com/Maek0s" target="_blank" rel="noopener noreferrer">
                <IoLogoGithub/>
                <p>Maek0s</p>
                </a>
            </span>
            <span className="madeWith">
                <a href="https://github.com/Maek0s/TextCode" target="_blank" rel="noopener noreferrer">
                <FaCodeBranch/>
                <p>v{packageJson.version}</p>
                </a>
            </span>
        </footer>
    )
}

export default Footer