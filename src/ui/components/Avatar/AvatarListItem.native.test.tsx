import React from 'react'

import { render, screen } from 'tests/utils'
import { AvatarListItem } from 'ui/components/Avatar/AvatarListItem'

describe('<AvatarListItem />', () => {
  it('should display artist avatar name + image', () => {
    render(<AvatarListItem id={1} name="Oda" image="url" onItemPress={jest.fn()} />)

    expect(screen.getByText('Oda')).toBeOnTheScreen()
    expect(screen.getByLabelText('Avatar de lʼartiste Oda')).toBeOnTheScreen()
  })

  it('should display default image avatar', () => {
    render(<AvatarListItem id={1} name="Oda" onItemPress={jest.fn()} />)

    expect(screen.queryByLabelText('Avatar de lʼartiste')).not.toBeOnTheScreen()
    expect(screen.getByTestId('BicolorProfile')).toBeOnTheScreen()
  })
})
