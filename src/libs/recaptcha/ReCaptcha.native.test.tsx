import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { simulateWebviewMessage, render } from 'tests/utils'

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
    const renderAPI = renderReCaptcha(reCaptchaProps)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should not render webview when modal is not visible', () => {
    const renderAPI = renderReCaptcha({ ...reCaptchaProps, isVisible: false })
    const recaptchaWebview = renderAPI.queryByTestId('recaptcha-webview')
    expect(recaptchaWebview).toBeFalsy()
  })

  it("should call onSuccess() callback when webview's message is success", () => {
    const renderAPI = renderReCaptcha(reCaptchaProps)
    const recaptchaWebview = renderAPI.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "success", "token": "fakeToken" }')

    expect(reCaptchaProps.onSuccess).toBeCalledWith('fakeToken')
  })

  it("should call onError() callback when webview's message is error", () => {
    const renderAPI = renderReCaptcha(reCaptchaProps)
    const recaptchaWebview = renderAPI.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "error", "error": "someError" }')

    expect(reCaptchaProps.onError).toBeCalledWith('someError')
  })

  it("should call onClose() callback when webview's message is close", () => {
    const renderAPI = renderReCaptcha(reCaptchaProps)
    const recaptchaWebview = renderAPI.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "close" }')

    expect(reCaptchaProps.onClose).toBeCalled()
  })

  it("should call onExpire() callback when webview's message is expire", () => {
    const renderAPI = renderReCaptcha(reCaptchaProps)
    const recaptchaWebview = renderAPI.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "expire" }')

    expect(reCaptchaProps.onExpire).toBeCalled()
  })

  it("should call onLoad() callback when webview's message is load", () => {
    const renderAPI = renderReCaptcha(reCaptchaProps)
    const recaptchaWebview = renderAPI.getByTestId('recaptcha-webview')

    simulateWebviewMessage(recaptchaWebview, '{ "message": "load" }')

    expect(reCaptchaProps.onLoad).toBeCalled()
  })
})

function renderReCaptcha(reCaptchaProps: React.ComponentProps<typeof ReCaptcha>) {
  return render(<ReCaptcha {...reCaptchaProps} />, {
    // eslint-disable-next-line local-rules/no-react-query-provider-hoc
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
