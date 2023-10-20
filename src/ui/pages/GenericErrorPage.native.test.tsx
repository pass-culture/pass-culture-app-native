import React from 'react'

import { render, screen } from 'tests/utils'
import { GenericErrorPage } from 'ui/pages/GenericErrorPage'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'

// We unmock these modules to make sure they are not used because
// navigation with @react-navigation is not always defined in GenericErrorPage
jest.unmock('@react-navigation/native')
jest.unmock('@react-navigation/stack')
jest.unmock('@react-navigation/bottom-tabs')
jest.unmock('features/navigation/useGoBack')
jest.unmock('libs/hooks/useWhiteStatusBar')

describe('<GenericErrorPage />', () => {
  it('should render correctly', () => {
    render(<GenericErrorPage title="GenericErrorPage" icon={BicolorPhonePending} />)
    expect(screen).toMatchSnapshot()
  })
})
