import { Share } from 'react-native'

import { analytics } from 'libs/firebase/analytics'
import { share } from 'libs/share'
import { waitFor } from 'tests/utils'

const defaultContent = { message: 'Message' }
const defaultOptions = {}
const shareMockReturnValue = { action: Share.sharedAction, activityType: 'copy' }
const shareMock = jest.spyOn(Share, 'share').mockResolvedValue(shareMockReturnValue)

describe('share()', () => {
  it('should call share', () => {
    share(defaultContent, defaultOptions)

    expect(shareMock).toHaveBeenCalledTimes(1)
  })

  it('should not call logShareAnalytics when logAnalytics is false', () => {
    share(defaultContent, defaultOptions, false)

    expect(analytics.logHasSharedApp).not.toHaveBeenCalled()
    expect(analytics.logHasDismissedAppSharingModal).not.toHaveBeenCalled()
  })

  it('should log anayltics when logAnalytics is true', async () => {
    share(defaultContent, defaultOptions, true)

    await waitFor(() => {
      expect(analytics.logHasSharedApp).toHaveBeenNthCalledWith(
        1,
        shareMockReturnValue.activityType
      )
    })
  })

  it('should log hasDimissedAppSharingModal when user closes native modal', async () => {
    shareMock.mockResolvedValueOnce({ action: Share.dismissedAction })
    share(defaultContent, defaultOptions, true)

    await waitFor(() => {
      expect(analytics.logHasDismissedAppSharingModal).toHaveBeenCalledTimes(1)
    })
  })
})
