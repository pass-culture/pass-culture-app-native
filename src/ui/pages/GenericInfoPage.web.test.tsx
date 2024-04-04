import React from 'react'

import { render } from 'tests/utils/web'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'

// We unmock these modules to make sure they are not used because
// navigation with @react-navigation is not always defined in GenericInfoPage
jest.unmock('@react-navigation/native')
jest.unmock('@react-navigation/stack')
jest.unmock('@react-navigation/bottom-tabs')
jest.unmock('features/navigation/useGoBack')
jest.unmock('libs/hooks/useWhiteStatusBar')

describe('<GenericInfoPage />', () => {
  it('should render correctly', () => {
    const { container } = render(
      <GenericInfoPage title="GenericInfoPage" icon={BicolorPhonePending} />
    )

    expect(container).toMatchSnapshot()
  })
})
