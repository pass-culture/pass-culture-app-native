import React from 'react'

import { render, screen } from 'tests/utils'
import { AvatarListItem } from 'ui/components/Avatar/AvatarListItem'

describe('<AvatarListItem />', () => {
  it('should display artist avatar name', () => {
    render(<AvatarListItem id={1} name="Oda" width={100} onItemPress={jest.fn()} />)

    expect(screen.getByText('Oda')).toBeOnTheScreen()
  })

  it('should display image avatar', () => {
    render(<AvatarListItem id={1} name="Oda" image="url" width={100} onItemPress={jest.fn()} />)

    expect(screen.getByLabelText('Avatar de lʼartiste Oda')).toBeOnTheScreen()
  })

  it('should display default image avatar', () => {
    render(<AvatarListItem id={1} name="Oda" width={100} onItemPress={jest.fn()} />)

    expect(screen.queryByLabelText('Avatar de lʼartiste')).not.toBeOnTheScreen()
    expect(screen.getByTestId('BicolorProfile')).toBeOnTheScreen()
  })
})
