import React, { useEffect, useRef } from 'react'

import { env } from 'libs/environment'

type Props = {
  onError: (error: string) => void
  onExpire: () => void
  onSuccess: (token: string) => void
  isVisible: boolean
}

// This will move up and reduce recaptcha challenge when viewport height is lower than 440px
const css = `
   @media only screen and (max-height: 440px) {
      div[style*="transition: visibility"] > div[style*="position: fixed"] + div[style*="position: absolute"] {
          transform: scale(0.75);
          transform-origin: 50% 0%;
      }
   }
`

export function ReCaptcha(props: Props) {
  const reCaptchaContainerRef = useRef<HTMLDivElement>(null)

  function onSuccess(token: string) {
    const { grecaptcha } = window
    if (grecaptcha && grecaptcha.reset) {
      grecaptcha.reset()
    }
    props.onSuccess(token)
  }

  function onRecaptchaErrorCallback() {
    props.onError('reCAPTCHA error: error-callback of widget called')
  }

  useEffect(() => {
    if (!props.isVisible) {
      return
    }
    let numberOfRetries = 0
    const intervalId = setInterval(() => {
      numberOfRetries = numberOfRetries + 1
      if (numberOfRetries > 15) {
        clearInterval(intervalId)
        props.onError('reCAPTCHA error: Number of retries exceeded')
        return
      }

      const { grecaptcha } = window
      const reCaptchaContainer = reCaptchaContainerRef.current
      const isReCaptchaRendered = reCaptchaContainer && reCaptchaContainer.hasChildNodes()
      if (
        reCaptchaContainer &&
        grecaptcha &&
        grecaptcha.ready &&
        grecaptcha.render &&
        grecaptcha.execute
      ) {
        if (!isReCaptchaRendered) {
          grecaptcha.ready(() => {
            if (grecaptcha.render) {
              grecaptcha.render(reCaptchaContainer.id, {
                sitekey: env.SITE_KEY,
                callback: onSuccess,
                'expired-callback': props.onExpire,
                'error-callback': onRecaptchaErrorCallback,
                size: 'invisible',
                theme: 'light',
              })
            }
          })
        }
        if (isReCaptchaRendered) {
          try {
            grecaptcha.execute()
            clearInterval(intervalId)
          } catch (error) {
            if (error instanceof Error) props.onError('reCAPTCHA error: ' + error.message)
          }
        }
      }
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isVisible])

  return (
    <React.Fragment>
      <style>{css}</style>
      <div id="recaptcha-container" ref={reCaptchaContainerRef} />
    </React.Fragment>
  )
}
