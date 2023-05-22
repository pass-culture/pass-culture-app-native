import { useEffect } from 'react'

const insertCaptcha = (): void => {
  const captchaDom = document.createElement('script')
  captchaDom.src = 'https://www.google.com/recaptcha/api.js?hl=fr'
  captchaDom.async = true
  captchaDom.defer = true
  document.head.appendChild(captchaDom)
}

export const useCaptcha = (): void => {
  useEffect(() => {
    const isAlreadyInDom = !!document.querySelector(
      'script[src="https://www.google.com/recaptcha/api.js?hl=fr"]'
    )

    if (isAlreadyInDom === false) {
      insertCaptcha()
    }
  }, [])
}
