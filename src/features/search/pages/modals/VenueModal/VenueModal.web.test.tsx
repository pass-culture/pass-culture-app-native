import React from 'react'

import { MODAL_TO_SHOW_TIME } from 'tests/constants'
import { render, checkAccessibilityFor, act } from 'tests/utils/web'

import { VenueModal } from './VenueModal'

jest.useFakeTimers()

const dismissModalMock = jest.fn()

describe('<VenueModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<VenueModal visible dismissModal={dismissModalMock} />)

      let results
      await act(async () => {
        jest.advanceTimersByTime(MODAL_TO_SHOW_TIME)

        results = await checkAccessibilityFor(container)
      })
      await act(async () => {})

      expect(results).toHaveNoViolations()

      await act(async () => {})
    })
  })
})
