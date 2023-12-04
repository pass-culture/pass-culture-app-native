import { Share } from 'react-native'

import { shareApp } from 'features/share/helpers/shareApp'
import { analytics } from 'libs/analytics'
import { waitFor } from 'tests/utils'

const shareMockReturnValue = { action: Share.sharedAction, activityType: 'copy' }
const shareMock = jest.spyOn(Share, 'share').mockResolvedValue(shareMockReturnValue)

describe('shareApp', () => {
  it('should share with native dialog when default mode on iOS', () => {
    shareApp('utmMedium')

    expect(shareMock).toHaveBeenCalledWith(
      {
        message: 'Profite toi aussi de tous les bons plans du pass Culture :\n',
        url: 'https://webapp-v2.example.com/accueil?utm_gen=product&utm_campaign=share_app&utm_medium=utmMedium',
      },
      {
        subject: 'Profite toi aussi de tous les bons plans du pass Culture',
      }
    )
  })

  it('should log hasSharedApp when logAnalytics is true', async () => {
    shareApp('utmMedium')

    await waitFor(() => {
      expect(analytics.logHasSharedApp).toHaveBeenCalledWith(shareMockReturnValue.activityType)
    })
  })

  it('should log hasDismissedAppSharingModal when user closes native modal', async () => {
    shareMock.mockResolvedValueOnce({ action: Share.dismissedAction })
    shareApp('utmMedium')

    await waitFor(() => {
      expect(analytics.logHasDismissedAppSharingModal).toHaveBeenCalledTimes(1)
    })
  })
})
