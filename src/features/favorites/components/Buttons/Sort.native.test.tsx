import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { render, screen, userEvent } from 'tests/utils'

import { Sort } from './Sort'

jest.useFakeTimers()

describe('Sort component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should navigate to Sort page on pressing', async () => {
    render(<Sort />)
    await userEvent.setup().press(screen.getByTestId('Trier'))

    expect(navigate).toHaveBeenCalledWith('FavoritesSorts', undefined)
  })
})
