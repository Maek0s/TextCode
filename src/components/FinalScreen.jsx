import { useMemo } from "react";

import { FaRedo } from "react-icons/fa";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import "../styles/FinalScreen.css";

export default function FinalScreen({ data, gameMode, onClick }) {
  const stats = useMemo(() => {
    const totalWords = data.length
    const correctWords = data.filter(w => w.correctWord).length
    const wrongWords = totalWords - correctWords
    const totalLetters = data.reduce((acc, w) => acc + w.letterCorrect + w.letterWrong, 0)
    const correctLetters = data.reduce((acc, w) => acc + w.letterCorrect, 0)
    const wrongLetters = data.reduce((acc, w) => acc + w.letterWrong, 0)
    const accuracy = totalLetters > 0 ? Math.round((correctLetters / totalLetters) * 100) : 0
    const wpmNeto = data.wpmNeto || 0
    const wpmBruto = data.wpmBruto || 0
    const time = data.time

    return { totalWords, correctWords, wrongWords, totalLetters, correctLetters,
             wrongLetters, accuracy, wpmNeto, wpmBruto, time }
  }, [data])

  const getMotivationalMessage = (wpmNeto) => {
    if (wpmNeto >= 100) return "¡Perfecto, eres muy veloz! 🔥"
    if (wpmNeto >= 70) return "¡Gran trabajo, lo haces genial! 💪"
    if (wpmNeto >= 50) return "¡Bien hecho! Sigue practicando ✨"
    if (wpmNeto >= 40 && wpmNeto < 50) return "No está mal, pero puedes mejorar 😉"
    if (wpmNeto < 40) return "¡No te rindas! Poco a poco mejorarás 🆙"
    return "¡No te rindas! Cada error cuenta 💡"
  }

  const donutData = [
    { name: "Correctas", value: stats.accuracy },
    { name: "Incorrectas", value: 100 - stats.accuracy }
  ]

  const COLORS = ["#4aff91", "#ff4b6b"]

  return (
    <div className="final-screen-graph">

      <div className="donut-section horizontal">
        <div className="donut-left">
          <div className="donut-container">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={donutData}
                  innerRadius={70}
                  outerRadius={90}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <span className="donut-value">{stats.accuracy}%</span>
              <span className="donut-label">PRECISION</span>
            </div>
          </div>
        </div>

        <div className="donut-right">
          <div className="motivational-message">
            {getMotivationalMessage(stats.wpmNeto)}
          </div>
          <div className="wpm-panel horizontal">
            <div className="metric">
              <span className="label">WPM</span>
              <span className="value">{stats.wpmNeto}</span>
            </div>
            <div className="metric">
              <span className="label">WPM raw</span>
              <span className="value">{stats.wpmBruto}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="extra-stats">
        <div className="stat-card accuracy">
          <span className="icon">🎮</span>
          <span className="label">Modo de juego</span>
          <span className="value">{gameMode}</span>
        </div>
        <div className="stat-card time">
          <span className="icon">⏱️</span>
          <span className="label">Tiempo</span>
          <span className="value">{stats.time}s</span>
        </div>
        <div className="stat-card total">
          <span className="icon">🔢</span>
          <span className="label">Total letras</span>
          <span className="value">{stats.totalLetters}</span>
        </div>
        <div className="stat-card correct">
          <span className="icon">✅</span>
          <span className="label">Letras correctas</span>
          <span className="value">{stats.correctLetters}</span>
        </div>
        <div className="stat-card wrong">
          <span className="icon">❌</span>
          <span className="label">Letras incorrectas</span>
          <span className="value">{stats.wrongLetters}</span>
        </div>
      </div>

      <div className="next-button-container">
        <button className="resetButtonFinal"
                onClick={(e) => {
                    e.currentTarget.blur()
                    onClick()
                }}
                tabIndex="-1">
            <FaRedo className="icon"/>
            <span className="text">Reiniciar</span>
        </button>
      </div>
    </div>
  );
}