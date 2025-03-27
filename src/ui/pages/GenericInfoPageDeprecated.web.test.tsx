import React from 'react'

import { render } from 'tests/utils/web'
import { GenericInfoPageDeprecated } from 'ui/pages/GenericInfoPageDeprecated'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'

// We unmock these modules to make sure they are not used because
// navigation with @react-navigation is not always defined in GenericInfoPageDeprecated
jest.unmock('@react-navigation/native')
jest.unmock('@react-navigation/stack')
jest.unmock('@react-navigation/bottom-tabs')
jest.unmock('features/navigation/useGoBack')

describe('<GenericInfoPageDeprecated />', () => {
  it('should render correctly', () => {
    const { container } = render(
      <GenericInfoPageDeprecated title="GenericInfoPageDeprecated" icon={BicolorPhonePending} />
    )

    expect(container).toMatchSnapshot()
  })
})
