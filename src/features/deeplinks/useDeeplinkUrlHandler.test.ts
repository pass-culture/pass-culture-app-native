import { renderHook } from '@testing-library/react-hooks'

import { navigate } from '__mocks__/@react-navigation/native'
import { getScreenPath } from 'features/navigation/RootNavigator/linking/getScreenPath'
import { WEBAPP_V2_URL } from 'libs/environment'

import { useDeeplinkUrlHandler } from './useDeeplinkUrlHandler'

jest.mock('features/auth/settings')
jest.mock('features/navigation/navigationRef')

describe('useDeeplinkUrlHandler', () => {
  afterEach(jest.clearAllMocks)

  it('should redirect to a screen returned by getScreenFromDeeplink()', () => {
    const url = `${WEBAPP_V2_URL}${getScreenPath('Offer', { id: 1, from: 'deeplink' })}`
    const handleDeeplinkUrl = renderHook(useDeeplinkUrlHandler).result.current

    handleDeeplinkUrl({ url })

    expect(navigate).toBeCalledWith('Offer', { id: 1, from: 'deeplink' })
  })

  it('should redirect to PageNotFound when path is unknown', () => {
    const url = `${WEBAPP_V2_URL}/unknown-path`
    const handleDeeplinkUrl = renderHook(useDeeplinkUrlHandler).result.current

    handleDeeplinkUrl({ url })

    expect(navigate).toBeCalledWith('PageNotFound', undefined)
  })
})
