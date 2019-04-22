export const id = (() => {
  let currentId = 0

  return () => {
    ++currentId
    return currentId
  }
})()

export const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
