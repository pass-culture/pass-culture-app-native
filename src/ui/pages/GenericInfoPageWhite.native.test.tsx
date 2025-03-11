import React from 'react'

import { render, screen } from 'tests/utils'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { TypoDS } from 'ui/theme'

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
        <TypoDS.Body>Children...</TypoDS.Body>
      </GenericInfoPageWhite>
    )

    expect(screen).toMatchSnapshot()
  })
})
