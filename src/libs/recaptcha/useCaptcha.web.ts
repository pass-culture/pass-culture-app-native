import { useEffect } from 'react'

const RECAPTCHA_URL = 'https://www.google.com/recaptcha/api.js?hl=fr'

const insertCaptcha = (): void => {
  const captchaDom = document.createElement('script')
  captchaDom.src = RECAPTCHA_URL
  captchaDom.async = true
  captchaDom.defer = true
  document.head.appendChild(captchaDom)
}

export const useCaptcha = (): void => {
  useEffect(() => {
    const isAlreadyInDom = !!document.querySelector(`script[src="${RECAPTCHA_URL}"]`)

    if (isAlreadyInDom === false) {
      insertCaptcha()
    }
  }, [])
}
