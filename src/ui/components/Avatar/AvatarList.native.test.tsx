import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { render, screen, userEvent } from 'tests/utils'
import { AvatarList } from 'ui/components/Avatar/AvatarList'
import { AVATAR_LARGE, AVATAR_SMALL } from 'ui/theme/constants'

const avatarsData = [
  { id: '1', image: 'url1', name: 'Oda' },
  { id: '2', image: 'url2', name: 'MMMM' },
  { id: '3', name: 'Lolo' },
]

const user = userEvent.setup()

describe('<AvatarsList />', () => {
  jest.useFakeTimers()

  it('should display all items in the list', () => {
    render(<AvatarList data={avatarsData} onItemPress={jest.fn()} />)

    expect(screen.getByText('Oda')).toBeOnTheScreen()
    expect(screen.getByText('MMMM')).toBeOnTheScreen()
    expect(screen.getByText('Lolo')).toBeOnTheScreen()

    expect(screen.getAllByTestId('Avatar').at(0)).toHaveProp('size', AVATAR_LARGE)
    expect(screen.getAllByTestId('Avatar').at(0)).toHaveProp('borderColor', 'white')
  })

  it('should display items with custom avatar config', () => {
    render(
      <AvatarList
        data={avatarsData}
        onItemPress={jest.fn()}
        avatarConfig={{ size: AVATAR_SMALL, borderColor: 'pink' }}
      />
    )

    expect(screen.getByText('Oda')).toBeOnTheScreen()
    expect(screen.getByText('MMMM')).toBeOnTheScreen()
    expect(screen.getByText('Lolo')).toBeOnTheScreen()

    expect(screen.getAllByTestId('Avatar').at(0)).toHaveProp('size', AVATAR_SMALL)
    expect(screen.getAllByTestId('Avatar').at(0)).toHaveProp('borderColor', 'pink')
  })

  it('should force default avatar size to AVATAR_LARGE', () => {
    render(
      <AvatarList data={avatarsData} onItemPress={jest.fn()} avatarConfig={{ size: undefined }} />
    )

    expect(screen.getAllByTestId('Avatar').at(0)).toHaveProp('size', AVATAR_LARGE)
  })

  it('should display custom images for avatars', () => {
    render(<AvatarList data={avatarsData} onItemPress={jest.fn()} />)

    expect(screen.getByLabelText('Avatar de lʼartiste Oda')).toBeOnTheScreen()
    expect(screen.getByLabelText('Avatar de lʼartiste MMMM')).toBeOnTheScreen()
  })

  it('should handle missing images gracefully', () => {
    render(<AvatarList data={avatarsData} onItemPress={jest.fn()} />)

    expect(screen.getByTestId('BicolorProfile')).toBeOnTheScreen()
  })

  it('should navigate to the artist when clicking on avatar tile', async () => {
    render(<AvatarList data={avatarsData} onItemPress={jest.fn()} />)

    await user.press(screen.getByText('Oda'))

    expect(navigate).toHaveBeenCalledWith('Artist', {
      id: '1',
    })
  })
})
