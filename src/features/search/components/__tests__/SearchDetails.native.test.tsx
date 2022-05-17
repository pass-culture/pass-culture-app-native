import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchDetails } from 'features/search/components/SearchDetails'
import { fireEvent, render, superFlushWithAct } from 'tests/utils'

const mockSettings = {
  appEnableSearchHomepageRework: false,
}

jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))

describe('SearchDetails component', () => {
  it('should redirect to search home on arrow left click', async () => {
    mockSettings.appEnableSearchHomepageRework = true
    const { getByTestId } = render(<SearchDetails />)
    const previousBtn = getByTestId('previousBtn')

    fireEvent.press(previousBtn)
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
    })
    expect(navigate).toBeCalledWith('TabNavigator', { params: undefined, screen: 'Search' })
  })

  it('should reset input when user click on input icon', async () => {
    mockSettings.appEnableSearchHomepageRework = true
    const { getByTestId } = render(<SearchDetails />)

    const searchInput = getByTestId('searchInput')
    await fireEvent.changeText(searchInput, 'Test')

    const resetIcon = getByTestId('resetSearchInput')
    await fireEvent.press(resetIcon)

    expect(searchInput.props.value).toBe('')
  })
})
