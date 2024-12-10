import React from 'react'

import { render, screen } from 'tests/utils'
import { AvatarsList } from 'ui/components/Avatar/AvatarList'

describe('<AvatarsList />', () => {
  it('should display all items in the list', () => {
    render(<AvatarsList />)

    expect(screen.getByText('Oda')).toBeOnTheScreen()
    expect(screen.getByText('MMMM')).toBeOnTheScreen()
    expect(screen.getByText('Lolo')).toBeOnTheScreen()
  })

  it('should display custom images for avatars', () => {
    render(<AvatarsList />)

    expect(screen.getByTestId('profil')).toBeOnTheScreen()
  })

  it('should handle missing images gracefully', () => {
    render(<AvatarsList />)

    expect(screen.getByTestId('BicolorProfile')).toBeOnTheScreen()
  })
})
