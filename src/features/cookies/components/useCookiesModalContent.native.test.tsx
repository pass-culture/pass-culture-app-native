import {
  CookiesSteps,
  useCookiesModalContent,
} from 'features/cookies/components/useCookiesModalContent'

describe('useCookiesModalContent hook description', () => {
  const setCookiesStep = jest.fn()
  const hideModal = jest.fn()

  it('should display the CookiesDescription and not show back button if first step', () => {
    const { childrenProps } = useCookiesModalContent({
      cookiesStep: CookiesSteps.COOKIES_CONSENT,
      setCookiesStep,
      hideModal,
    })
    expect(childrenProps.children).toMatchSnapshot()
    expect(childrenProps.leftIcon).toBeUndefined()
  })

  it('should display the CookiesSettings and show back button if second step', () => {
    const { childrenProps } = useCookiesModalContent({
      cookiesStep: CookiesSteps.COOKIES_SETTINGS,
      setCookiesStep,
      hideModal,
    })
    expect(childrenProps.leftIcon).not.toBeUndefined()
    expect(childrenProps.children).toMatchSnapshot()
  })
})
