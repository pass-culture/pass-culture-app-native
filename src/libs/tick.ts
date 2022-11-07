export function tick(): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve()
    }, 0)
  )
}
