import { renderHook } from '@testing-library/react-hooks'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { homeNavigateConfig } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'

import { getScreenFromDeeplink } from './getScreenFromDeeplink'
import { useDeeplinkUrlHandler } from './useDeeplinkUrlHandler'

jest.mock('./getScreenFromDeeplink')
const mockGetScreenFromDeeplink = mocked(getScreenFromDeeplink)
jest.mock('features/auth/settings')
jest.mock('features/navigation/navigationRef')

const url = 'url-does-not-matter-since-we-mock-getScreenFromDeeplink()'

describe('useDeeplinkUrlHandler', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should redirect to a screen returned by getScreenFromDeeplink() and also call analytics function', () => {
    mockGetScreenFromDeeplink.mockReturnValueOnce({ screen: 'Offer', params: { id: 1 } })
    const handleDeeplinkUrl = renderHook(useDeeplinkUrlHandler).result.current

    handleDeeplinkUrl({ url })

    expect(analytics.logConsultOffer).toHaveBeenCalledWith({ offerId: 1, from: 'deeplink' })
    expect(navigate).toHaveBeenCalledWith('Offer', { id: 1 })
  })

  it('should redirect to Home when getScreenFromDeeplink() throws an error', () => {
    mockGetScreenFromDeeplink.mockImplementationOnce(() => {
      throw new Error()
    })
    const handleDeeplinkUrl = renderHook(useDeeplinkUrlHandler).result.current

    handleDeeplinkUrl({ url })

    expect(navigate).toHaveBeenCalledWith(homeNavigateConfig.screen, homeNavigateConfig.params)
  })
})
