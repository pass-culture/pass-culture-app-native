import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { render, screen, userEvent } from 'tests/utils'
import { AvatarsList } from 'ui/components/Avatar/AvatarList'
import { Profile } from 'ui/svg/icons/Profile'
import { TypoDS } from 'ui/theme'

const avatarsData = [
  { id: 1, image: <Profile size={40} testID="profil" />, name: 'Oda' },
  { id: 2, image: <TypoDS.Title1>M.M</TypoDS.Title1>, name: 'MMMM' },
  { id: 3, name: 'Lolo' },
]

const user = userEvent.setup()

describe('<AvatarsList />', () => {
  jest.useFakeTimers()

  it('should display all items in the list', () => {
    render(<AvatarsList data={avatarsData} />)

    expect(screen.getByText('Oda')).toBeOnTheScreen()
    expect(screen.getByText('MMMM')).toBeOnTheScreen()
    expect(screen.getByText('Lolo')).toBeOnTheScreen()
  })

  it('should display custom images for avatars', () => {
    render(<AvatarsList data={avatarsData} />)

    expect(screen.getByTestId('profil')).toBeOnTheScreen()
  })

  it('should handle missing images gracefully', () => {
    render(<AvatarsList data={avatarsData} />)

    expect(screen.getByTestId('BicolorProfile')).toBeOnTheScreen()
  })

  it('should navigate to the artist when clicking on avatar tile', async () => {
    render(<AvatarsList data={avatarsData} />)

    await user.press(screen.getByText('Oda'))

    expect(push).toHaveBeenCalledWith('Artist', {
      id: 1,
    })
  })
})
