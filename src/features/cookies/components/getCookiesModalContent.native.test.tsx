import { getCookiesModalContent } from 'features/cookies/components/getCookiesModalContent'
import { CookiesSteps } from 'features/cookies/enums'

const settingsCookiesChoice = {
  customization: false,
  performance: false,
  marketing: false,
}
const setCookiesStep = jest.fn()
const setSettingsCookiesChoice = jest.fn()
const acceptAll = jest.fn()
const declineAll = jest.fn()
const customChoice = jest.fn()

jest.mock('libs/firebase/analytics/analytics')

describe('getCookiesModalContent hook description', () => {
  it('should display the CookiesDescription and not show back button if first step', () => {
    const { childrenProps } = getCookiesModalContent({
      cookiesStep: CookiesSteps.COOKIES_CONSENT,
      settingsCookiesChoice,
      setCookiesStep,
      setSettingsCookiesChoice,
      acceptAll,
      declineAll,
      customChoice,
    })

    expect(childrenProps.leftIcon).toBeUndefined()
  })

  it('should display the CookiesSettings and show back button if second step', () => {
    const { childrenProps } = getCookiesModalContent({
      cookiesStep: CookiesSteps.COOKIES_SETTINGS,
      settingsCookiesChoice,
      setCookiesStep,
      setSettingsCookiesChoice,
      acceptAll,
      declineAll,
      customChoice,
    })

    expect(childrenProps.leftIcon).not.toBeUndefined()
  })
})
