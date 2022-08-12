import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchResultsFilters } from 'features/search/components/SearchResultsFilters'
import { fireEvent, render } from 'tests/utils'

const mockSettings = jest.fn().mockReturnValue({ data: {} })
jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => mockSettings()),
}))

describe('SearchResultsFilters component', () => {
  it('should render correctly', () => {
    expect(render(<SearchResultsFilters />)).toMatchSnapshot()
  })

  describe('When feature flag filter activated', () => {
    beforeAll(() => {
      mockSettings.mockReturnValue({ data: { appEnableCategoryFilterPage: true } })
    })

    it('should display location button', () => {
      const { queryByTestId } = render(<SearchResultsFilters />)

      expect(queryByTestId('locationButton')).toBeTruthy()
    })

    it('should redirect on location page on location button click', async () => {
      const { getByTestId } = render(<SearchResultsFilters />)
      const locationButton = getByTestId('locationButton')
      await fireEvent.press(locationButton)

      expect(navigate).toHaveBeenNthCalledWith(1, 'LocationFilter')
    })
  })

  describe('When feature flag filter desactivated', () => {
    beforeAll(() => {
      mockSettings.mockReturnValue({ data: { appEnableCategoryFilterPage: false } })
    })

    it('should not display location button', () => {
      const { queryByTestId } = render(<SearchResultsFilters />)

      expect(queryByTestId('locationButton')).toBeNull()
    })
  })
})
