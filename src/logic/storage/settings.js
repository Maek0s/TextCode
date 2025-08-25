export const saveSettings = (newSettings) => {
  window.localStorage.setItem("settings", JSON.stringify(newSettings))
}
