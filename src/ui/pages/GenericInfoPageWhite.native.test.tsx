import React from 'react'

import { render, screen } from 'tests/utils'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { MaintenanceCone } from 'ui/svg/icons/MaintenanceCone'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { TypoDS } from 'ui/theme'

const onPress = () => 'doNothing'

describe('<GenericInfoPageWhite />', () => {
  it('should render correctly', () => {
    render(
      <GenericInfoPageWhite
        withGoBack
        withSkipAction={onPress}
        illustration={MaintenanceCone}
        title="Title"
        subtitle="Subtitle"
        buttonPrimary={{ wording: 'ButtonPrimary', action: onPress }}
        buttonSecondary={{ wording: 'ButtonSecondary', action: onPress }}
        buttonTertiary={{ wording: 'ButtonTertiary', action: onPress, icon: PlainArrowPrevious }}>
        <TypoDS.Body>Children...</TypoDS.Body>
      </GenericInfoPageWhite>
    )

    expect(screen).toMatchSnapshot()
  })
})
