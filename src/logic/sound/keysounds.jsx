import keyPress from '../../assets/sounds/keypress.wav'

let audioCtx

export function playKeySound() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()

  fetch(keyPress)
    .then(res => res.arrayBuffer())
    .then(buf => audioCtx.decodeAudioData(buf))
    .then(decoded => {
      const src = audioCtx.createBufferSource()
      src.buffer = decoded

      src.playbackRate.value = 0.9 + Math.random() * 0.2

      const gain = audioCtx.createGain()
      gain.gain.value = 0.2

      src.connect(gain).connect(audioCtx.destination)
      src.start()
    })
}