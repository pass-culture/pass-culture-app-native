import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SortButton } from 'features/favorites/components/SortButton'
import { render, screen, userEvent } from 'tests/utils'

const user = userEvent.setup()
jest.useFakeTimers()

describe('SortButton', () => {
  it('should redirect to favorites sorts screen when pressing button', async () => {
    render(<SortButton />)

    await user.press(screen.getByLabelText('Trier'))

    expect(navigate).toHaveBeenCalledWith('FavoritesSorts', undefined)
  })
})
