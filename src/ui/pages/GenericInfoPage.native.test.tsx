import React from 'react'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { render, screen } from 'tests/utils'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Typo } from 'ui/theme'

import { GenericInfoPage } from './GenericInfoPage'

jest.mock('libs/firebase/analytics/analytics')

const onPress = jest.fn()

describe('<GenericInfoPage />', () => {
  beforeEach(() => setFeatureFlags())

  it('should render correctly', () => {
    render(
      <GenericInfoPage
        withGoBack
        withSkipAction={onPress}
        illustration={MaintenanceCone}
        title="Title"
        subtitle="Subtitle"
        buttonPrimary={{
          wording: 'ButtonPrimary',
          navigateTo: {
            screen: 'CheatcodesStackNavigator',
            params: { screen: 'CheatcodesNavigationGenericPages' },
          },
        }}
        buttonSecondary={{
          wording: 'ButtonSecondary',
          onPress: onPress,
        }}
        buttonTertiary={{
          wording: 'ButtonTertiary',
          navigateTo: {
            screen: 'CheatcodesStackNavigator',
            params: { screen: 'CheatcodesNavigationGenericPages' },
          },
          icon: PlainArrowPrevious,
        }}>
        <Typo.Body>Children...</Typo.Body>
      </GenericInfoPage>
    )

    expect(screen).toMatchSnapshot()
  })

  it('should keep legacy illustration when new vision UI FF is not activated', () => {
    render(
      <GenericInfoPage
        illustration={MaintenanceCone}
        remoteIllustration={{
          url: 'https://example.com/illustration.png',
          backgroundColor: 'positive01',
          size: 'default',
        }}
        title="Title"
        buttonPrimary={{
          wording: 'ButtonPrimary',
          onPress,
        }}
      />
    )

    expect(screen.queryByTestId('generic-info-page-remote-illustration')).not.toBeOnTheScreen()
  })

  it('should display remote illustration when new vision UI FF is activated', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_NEW_VISION_UI])

    render(
      <GenericInfoPage
        illustration={MaintenanceCone}
        remoteIllustration={{
          url: 'https://example.com/illustration.png',
          backgroundColor: 'positive01',
          size: 'small',
        }}
        title="Title"
        buttonPrimary={{
          wording: 'ButtonPrimary',
          onPress,
        }}
      />
    )

    expect(screen.getByTestId('generic-info-page-remote-illustration')).toBeOnTheScreen()
  })
})
