export const saveSettings = ({ value }) => {
  window.localStorage.setItem('tabulado', value)

  console.log(window.localStorage.getItem('tabulado'))
}