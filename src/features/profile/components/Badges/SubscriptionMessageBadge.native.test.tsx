import React from 'react'
import { Linking } from 'react-native'

import { navigateFromRef } from 'features/navigation/navigationRef'
import { linking } from 'features/navigation/RootNavigator/linking'
import { SubscriptionMessageBadge } from 'features/profile/components/Badges/SubscriptionMessageBadge'
import { fireEvent, render, screen } from 'tests/utils'

jest.mock('features/navigation/navigationRef')

describe('SubscriptionMessageBadge', () => {
  it('should open external url when clicking on the component and url is not in-app url', async () => {
    const externalUrl = 'http://toto.com'

    render(
      <SubscriptionMessageBadge
        subscriptionMessage={{
          userMessage: 'coucou',
          callToAction: { callToActionLink: externalUrl, callToActionTitle: 'callToAction' },
        }}
      />
    )

    fireEvent.press(screen.getByText('callToAction'))

    expect(Linking.openURL).toHaveBeenCalledWith(externalUrl)
  })

  it.each(linking.prefixes)(
    'should open internal url when clicking on the component and url is prefixed with %s',
    (urlPrefix) => {
      const internalUrl = `${urlPrefix}profil`
      render(
        <SubscriptionMessageBadge
          subscriptionMessage={{
            userMessage: 'coucou',
            callToAction: { callToActionLink: internalUrl, callToActionTitle: 'callToAction' },
          }}
        />
      )

      fireEvent.press(screen.getByText('callToAction'))

      expect(navigateFromRef).toHaveBeenCalledWith('TabNavigator', {
        screen: 'Profile',
      })
    }
  )
})
