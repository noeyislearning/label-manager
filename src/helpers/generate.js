export function generateRandomNumber() {
  return Math.floor(Math.random() * 1e12)
    .toString()
    .padStart(12, "0")
}

export function generateCurrentDate() {
  const today = new Date()
  const mm = String(today.getMonth() + 1).padStart(2, "0")
  const dd = String(today.getDate()).padStart(2, "0")
  const yyyy = today.getFullYear()
  return `${mm}${dd}${yyyy}`
}
