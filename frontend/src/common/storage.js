export function setLocalStorage(key, value) {
  if (!key) { return }
  window.localStorage.setItem(key, value)
}

export function getLocalStorage(key) {
  if (!key) { return }
  return window.localStorage.getItem(key)
}
