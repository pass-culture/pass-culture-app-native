import { useCookiesModalContent } from 'features/cookies/components/useCookiesModalContent'
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

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('useCookiesModalContent hook description', () => {
  it('should display the CookiesDescription and not show back button if first step', () => {
    const { childrenProps } = useCookiesModalContent({
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
    const { childrenProps } = useCookiesModalContent({
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
