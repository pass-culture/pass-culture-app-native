import React from 'react'

import { UnknownErrorFixture } from 'libs/recaptcha/fixtures'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { simulateWebviewMessage, render, screen } from 'tests/utils'

import { ReCaptcha } from './ReCaptcha'

const reCaptchaProps = {
  onClose: jest.fn(),
  onError: jest.fn(),
  onExpire: jest.fn(),
  onLoad: jest.fn(),
  onSuccess: jest.fn(),
  isVisible: true,
}

describe('<ReCaptcha />', () => {
  it('should render correctly', () => {
    renderReCaptcha(reCaptchaProps)

    expect(screen).toMatchSnapshot()
  })

  it('should not render webview when modal is not visible', () => {
    renderReCaptcha({ ...reCaptchaProps, isVisible: false })
    const recaptchaWebview = screen.queryByTestId('recaptcha-webview')

    expect(recaptchaWebview).not.toBeOnTheScreen()
  })

  it("should call onSuccess() callback when webview's message is success", () => {
    renderReCaptcha(reCaptchaProps)
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    expect(reCaptchaProps.onSuccess).toHaveBeenCalledWith('fakeToken')
  })

  it('should call onError() callback when recaptcha raises an error', () => {
    renderReCaptcha(reCaptchaProps)
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, UnknownErrorFixture)

    expect(reCaptchaProps.onError).toHaveBeenCalledWith('UnknownError', 'someError')
  })

  it("should call onClose() callback when webview's message is close", () => {
    renderReCaptcha(reCaptchaProps)
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "close" }')

    expect(reCaptchaProps.onClose).toHaveBeenCalledTimes(1)
  })

  it("should call onExpire() callback when webview's message is expire", () => {
    renderReCaptcha(reCaptchaProps)
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "expire" }')

    expect(reCaptchaProps.onExpire).toHaveBeenCalledTimes(1)
  })

  it("should call onLoad() callback when webview's message is load", () => {
    renderReCaptcha(reCaptchaProps)
    const recaptchaWebview = screen.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "load" }')

    expect(reCaptchaProps.onLoad).toHaveBeenCalledTimes(1)
  })
})

function renderReCaptcha(reCaptchaProps: React.ComponentProps<typeof ReCaptcha>) {
  return render(<ReCaptcha {...reCaptchaProps} />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
