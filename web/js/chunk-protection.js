function _errorTitle(text) {
  const title = document.createElement('h1')
  title.style.position = 'absolute'
  title.style.fontFamily = 'Montserrat-Bold'
  title.style.top = '40%'
  title.style.left = '50%'
  title.style.transform = 'translate(-50%, 50%)'
  title.style.color = '#fff'
  title.style.width = '100%'
  title.style.textAlign = 'center'
  title.style.padding = '0px 2em'
  title.innerHTML = text
  return title
}

function _errorButton(text) {
  const button = document.createElement('button')
  button.setAttribute('type', 'button')
  button.innerHTML = text
  button.onclick = function () {
    location.reload()
  }
  button.style.position = 'absolute'
  button.style.fontFamily = 'Montserrat-Bold'
  button.style.top = '50%'
  button.style.left = '50%'
  button.style.transform = 'translate(-50%, 50%)'
  button.style.overflow = 'hidden'
  button.style.cursor = 'pointer'
  button.style.color = '#fff'
  button.style.height = '48px'
  button.style.borderRadius = '24px'
  button.style.backgroundColor = '#EB0055FF'
  button.style.border = '0px'
  button.style.maxWidth = '500px'
  button.style.outline = 'none'
  button.style.padding = '0px 72px'
  button.style.textDecoration = 'none'
  button.style.boxSizing = 'border-box'
  return button
}

let isFirstChunkError = false

window.onerror = function (error, source) {
  const hasFailedChunk = error === "Uncaught SyntaxError: Unexpected token '<'"
  if (
    !isFirstChunkError &&
    hasFailedChunk &&
    source &&
    source.indexOf('chunk') !== -1 &&
    source.indexOf('passculture') !== -1
  ) {
    if ('serviceWorker' in navigator) {
      const sessionKey = 'retries_passculture_chunks'
      isFirstChunkError = true

      caches.keys().then(function (cacheNames) {
        const promises = []
        cacheNames.forEach(function (cacheName) {
          promises.push(caches.delete(cacheName))
        })
        Promise.all(promises).finally(function () {
          const count = Number(sessionStorage.getItem(sessionKey) || 0) + 1
          sessionStorage.setItem(sessionKey, count)
          if (count <= 3) {
            setTimeout(() => location.reload(), 3000)
            document.body.append(_errorTitle('Un problème est survenu, rechargement en cours...'))
          } else {
            document.body.append(_errorTitle('Un problème est survenu, veuillez réessayer.'))
            document.body.append(_errorButton('Recharger'))
            sessionStorage.removeItem(sessionKey)
          }
        })
      })
    }
  }
}
