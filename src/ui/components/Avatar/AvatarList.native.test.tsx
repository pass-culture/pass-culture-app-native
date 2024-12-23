import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { render, screen, userEvent } from 'tests/utils'
import { AvatarsList } from 'ui/components/Avatar/AvatarList'

const avatarsData = [
  { id: 1, image: 'url1', name: 'Oda' },
  { id: 2, image: 'url2', name: 'MMMM' },
  { id: 3, name: 'Lolo' },
]

const user = userEvent.setup()

describe('<AvatarsList />', () => {
  jest.useFakeTimers()

  it('should display all items in the list', () => {
    render(<AvatarsList data={avatarsData} from="venue" />)

    expect(screen.getByText('Oda')).toBeOnTheScreen()
    expect(screen.getByText('MMMM')).toBeOnTheScreen()
    expect(screen.getByText('Lolo')).toBeOnTheScreen()
  })

  it('should display custom images for avatars', () => {
    render(<AvatarsList data={avatarsData} from="venue" />)

    expect(screen.getByLabelText('Avatar de lʼartiste Oda')).toBeOnTheScreen()
    expect(screen.getByLabelText('Avatar de lʼartiste MMMM')).toBeOnTheScreen()
  })

  it('should handle missing images gracefully', () => {
    render(<AvatarsList data={avatarsData} from="venue" />)

    expect(screen.getByTestId('BicolorProfile')).toBeOnTheScreen()
  })

  it('should navigate to the artist when clicking on avatar tile', async () => {
    render(<AvatarsList data={avatarsData} from="venue" />)

    await user.press(screen.getByText('Oda'))

    expect(push).toHaveBeenCalledWith('Artist', {
      fromOfferId: 1,
    })
  })
})
