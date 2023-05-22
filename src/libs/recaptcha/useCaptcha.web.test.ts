import { renderHook } from 'tests/utils'

import { useCaptcha } from './useCaptcha'

describe('useCaptcha', () => {
  afterEach(() => {
    document.head.innerHTML = ''
  })

  it('insert captcha', () => {
    renderHook(useCaptcha)

    expect(
      document.querySelector('script[src="https://www.google.com/recaptcha/api.js?hl=fr"]')
    ).toBeTruthy()
  })

  it('insert captcha only once', () => {
    const { unmount } = renderHook(useCaptcha)

    unmount()
    renderHook(useCaptcha)

    expect(
      document.querySelectorAll('script[src="https://www.google.com/recaptcha/api.js?hl=fr"]')
    ).toHaveLength(1)
  })
})
