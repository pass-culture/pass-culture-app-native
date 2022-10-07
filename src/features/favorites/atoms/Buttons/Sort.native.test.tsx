import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render } from 'tests/utils'

import { Sort } from './Sort'

describe('Sort component', () => {
  afterAll(() => jest.resetAllMocks())
  it('should navigate to Sort page on pressing', () => {
    const { getByTestId } = render(<Sort />)
    fireEvent.press(getByTestId('SortButton'))
    expect(navigate).toHaveBeenCalledWith('FavoritesSorts', undefined)
  })
})
