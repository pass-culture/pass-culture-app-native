import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'

import { Sort } from '../Sort'

describe('Filter component', () => {
  afterAll(() => jest.resetAllMocks())
  it('should navigate to Sort page on pressing', () => {
    const { getByTestId } = render(<Sort />)
    fireEvent.press(getByTestId('SortButton'))
    expect(navigate).toHaveBeenCalledWith('FavoritesSorts')
  })
})
