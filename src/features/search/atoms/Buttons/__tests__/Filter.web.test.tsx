import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/pages/reducer'
import { fireEvent, render } from 'tests/utils/web'

import { Filter } from '../Filter'

// TODO why is onPress props passed through web button?
// it creates "Warning: Unknown event handler property `%s`. It will be ignored.%s", "onPress" error
// eslint-disable-next-line local-rules/no-allow-console
allowConsole({ error: true })

jest.mock('features/search/utils/useMaxPrice', () => ({
  useMaxPrice: jest.fn(() => 300),
}))

describe('Filter component', () => {
  afterAll(() => jest.resetAllMocks())
  const mockSearchState = initialSearchState
  mockSearchState.offerIsDuo = true

  it('should render correctly', () => {
    const renderAPI = render(<Filter />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to Filter page on pressing', () => {
    const { getByTestId } = render(<Filter />)
    fireEvent.click(getByTestId('FilterButton'))
    expect(navigate).toHaveBeenCalledWith('SearchFilter')
  })
})
