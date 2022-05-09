import React from 'react'

import { SearchHeader } from 'features/search/components/SearchHeader'
import { render } from 'tests/utils'

const mockSettings = {
  appEnableSearchHomepageRework: false,
}

jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))

describe('SearchHeader component', () => {
  it('should not display search bar rework if search enable rework feature flag is not activated', () => {
    mockSettings.appEnableSearchHomepageRework = false
    const { queryByTestId } = render(<SearchHeader />)
    expect(queryByTestId('searchBoxReworkContainer')).toBeFalsy()
  })

  it('should display search bar rework if search enable rework feature flag is activated', () => {
    mockSettings.appEnableSearchHomepageRework = true
    const { getByTestId } = render(<SearchHeader />)
    getByTestId('searchBoxReworkContainer')
  })
})
