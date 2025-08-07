import './App.css'

import KeyListener from './logic/KeyListener.jsx';
import OptionNav from './components/OptionNav.jsx';

import logo from './assets/images/logotextcode.png'
import { FaUser, FaRedo } from "react-icons/fa";
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
          <OptionNav nameClass="username">
            <MdLeaderboard size={22}/>
          </OptionNav>
          <OptionNav nameClass="username">
            <IoMdSettings size={22}/>
          </OptionNav>
          <OptionNav nameClass="username">
              <FaUser size={18}/>
              Username
          </OptionNav>
        </div>
      </header>

      <KeyListener />
    </>
  )
}

export default App
