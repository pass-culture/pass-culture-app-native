import React from 'react'

import { render, screen } from 'tests/utils'
import { AvatarListItem } from 'ui/components/Avatar/AvatarListItem'
import { Profile } from 'ui/svg/icons/Profile'

describe('<AvatarListItem />', () => {
  it('should display artist avatar name', () => {
    render(<AvatarListItem id={1} name="Oda" />)

    expect(screen.getByText('Oda')).toBeOnTheScreen()
  })

  it('should display image avatar', () => {
    render(<AvatarListItem id={1} name="Oda" image={<Profile testID="profil" />} />)

    expect(screen.getByTestId('profil')).toBeOnTheScreen()
  })

  it('should display default image avatar', () => {
    render(<AvatarListItem id={1} name="Oda" />)

    expect(screen.getByTestId('BicolorProfile')).toBeOnTheScreen()
  })
})
