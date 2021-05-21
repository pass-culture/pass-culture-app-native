function ClipboardModule() {
  var content = ''

  const hasString = () => typeof content === 'string'

  // not used in the app because it's iOS specific but kept to have an homogeneous interface
  const hasUrl = () => true

  const getString = () => Promise.resolve(content)

  const setString = (value: string) => void (content = value)

  return {
    hasString,
    hasUrl,
    getString,
    setString,
  }
}

const module = ClipboardModule()

export default module
