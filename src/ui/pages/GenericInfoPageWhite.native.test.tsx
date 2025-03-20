import React from 'react'

import { render, screen } from 'tests/utils'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { Typo } from 'ui/theme'

import { GenericInfoPageWhite } from './GenericInfoPageWhite'

jest.mock('libs/firebase/analytics/analytics')

const onPress = jest.fn()

describe('<GenericInfoPageWhite />', () => {
  it('should render correctly', () => {
    render(
      <GenericInfoPageWhite
        withGoBack
        withSkipAction={onPress}
        illustration={MaintenanceCone}
        title="Title"
        subtitle="Subtitle"
        buttonPrimary={{
          wording: 'ButtonPrimary',
          navigateTo: { screen: 'CheatcodesNavigationGenericPages' },
        }}
        buttonSecondary={{
          wording: 'ButtonSecondary',
          onPress: onPress,
        }}
        buttonTertiary={{
          wording: 'ButtonTertiary',
          navigateTo: { screen: 'CheatcodesNavigationGenericPages' },
          icon: PlainArrowPrevious,
        }}>
        <Typo.Body>Children...</Typo.Body>
      </GenericInfoPageWhite>
    )

    expect(screen).toMatchSnapshot()
  })
})
