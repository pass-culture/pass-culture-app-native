import React from 'react'

import { checkAccessibilityFor, render } from 'tests/utils/web'
import { BicolorPhonePending } from 'ui/svg/icons/BicolorPhonePending'

import { GenericErrorPage } from './GenericErrorPage'

// We unmock these modules to make sure they are not used because
// navigation with @react-navigation is not always defined in GenericErrorPage
jest.unmock('@react-navigation/native')
jest.unmock('@react-navigation/stack')
jest.unmock('@react-navigation/bottom-tabs')
jest.unmock('features/navigation/useGoBack')

describe('<GenericErrorPage />', () => {
  it('should render correctly', () => {
    const { container } = render(
      <GenericErrorPage title="GenericErrorPage" icon={BicolorPhonePending} />
    )

    expect(container).toMatchSnapshot()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(
        <GenericErrorPage title="GenericErrorPage" icon={BicolorPhonePending} />
      )

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
