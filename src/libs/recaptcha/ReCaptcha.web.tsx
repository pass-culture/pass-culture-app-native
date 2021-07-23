import React, { useEffect } from 'react'
import { useRef } from 'react'

import { env } from 'libs/environment'

type Props = {
  onError: (error: string) => void
  onExpire: () => void
  onSuccess: (token: string) => void
  isVisible: boolean
}

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
    props.onError('reCAPTCHA error : error-callback of widget called')
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
        props.onError('reCAPTCHA error : Number of retries exceeded')
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
            if (grecaptcha && grecaptcha.render) {
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
            props.onError('reCAPTCHA error : ' + error.message)
          }
        }
      }
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [props.isVisible])

  return <div id="recaptcha-container" ref={reCaptchaContainerRef} />
}
