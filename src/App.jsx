import './App.css'

import KeyListener from './logic/KeyListener.jsx';

import logo from './assets/images/logotextcode.png'
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdLeaderboard } from "react-icons/md";

function App() {
  return (
    <>
      <header>
        <div className="headerLeft">
          <a id="logo" href="./">
            <div className="icon">
              <img src={logo}/>
            </div>
            <h1 className="iconLogo">Text&Code</h1>
          </a>
        </div>
        <div className="headerRight">
          <a className="optionNav">
            <MdLeaderboard size={22}/>
          </a>
          <a className="optionNav">

            <IoMdSettings size={22}/>
          </a>
          <a className="optionNav">
            <div className="username">
              <FaUser size={18}/>
              Username
            </div>
          </a>
        </div>
      </header>

      <KeyListener />
    </>
  )
}

export default App
