import React from 'react'

import { render, screen } from 'tests/utils'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Typo } from 'ui/theme'

import { GenericInfoPage } from './GenericInfoPage'

jest.mock('libs/firebase/analytics/analytics')

const onPress = jest.fn()

describe('<GenericInfoPage />', () => {
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
})
