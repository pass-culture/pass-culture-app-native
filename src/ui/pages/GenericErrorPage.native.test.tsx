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

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('<GenericErrorPage />', () => {
  it('should render correctly', () => {
    render(<GenericErrorPage title="GenericErrorPage" icon={BicolorPhonePending} />)

    expect(screen).toMatchSnapshot()
  })
})
