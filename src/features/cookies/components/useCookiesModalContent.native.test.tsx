import {
  CookiesSteps,
  useCookiesModalContent,
} from 'features/cookies/components/useCookiesModalContent'

const setCookiesStep = jest.fn()
const hideModal = jest.fn()

describe('useCookiesModalContent hook description', () => {
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
