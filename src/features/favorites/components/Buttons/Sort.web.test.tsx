import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render, screen } from 'tests/utils/web'

import { Sort } from './Sort'

describe('Sort component', () => {
  afterAll(() => jest.resetAllMocks())
  it('should navigate to Sort page on pressing', () => {
    render(<Sort />)
    fireEvent.click(screen.getByTestId('Trier'))
    expect(navigate).toHaveBeenCalledWith('FavoritesSorts', undefined)
  })
})
