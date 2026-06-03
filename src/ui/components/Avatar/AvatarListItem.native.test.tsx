import React from 'react'

import { render, screen } from 'tests/utils'
import { AvatarListItem } from 'ui/components/Avatar/AvatarListItem'

describe('<AvatarListItem />', () => {
  it('should display artist avatar name + image', () => {
    render(<AvatarListItem id={1} name="Oda" image="url" onItemPress={jest.fn()} />)

    expect(screen.getByText('Oda')).toBeOnTheScreen()
    expect(screen.getByTestId('artistAvatar')).toBeOnTheScreen()
  })

  it('should display default image avatar', () => {
    render(<AvatarListItem id={1} name="Oda" onItemPress={jest.fn()} />)

    expect(screen.queryByLabelText('Avatar de l’artiste')).not.toBeOnTheScreen()
    expect(screen.getByTestId('defaultArtistAvatar')).toBeOnTheScreen()
  })

  it('should display artist role when specified', () => {
    render(<AvatarListItem id={1} name="Oda" onItemPress={jest.fn()} role="Auteur" />)

    expect(screen.getByText('Auteur')).toBeOnTheScreen()
  })

  it('should use accessibility label when specified', () => {
    render(
      <AvatarListItem
        id={1}
        name="Oda"
        onItemPress={jest.fn()}
        role="Auteur"
        accessibilityLabel="Accéder à la page artiste de Oda"
      />
    )

    expect(screen.getByLabelText('Accéder à la page artiste de Oda')).toBeOnTheScreen()
  })

  it('should use name as accessibility label when not specified', () => {
    render(<AvatarListItem id={1} name="Oda" onItemPress={jest.fn()} role="Auteur" />)

    expect(screen.getByLabelText('Oda')).toBeOnTheScreen()
  })

  it('should not use link when avatar has an empty string as id', () => {
    render(
      <AvatarListItem
        id=""
        name="Oda"
        onItemPress={jest.fn()}
        role="Auteur"
        accessibilityLabel="Accéder à la page artiste de Oda"
      />
    )

    expect(screen.queryByLabelText('Accéder à la page artiste de Oda')).not.toBeOnTheScreen()
  })
})
