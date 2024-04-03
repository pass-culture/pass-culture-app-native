import React from 'react'

import { VenueTypeCodeKey } from 'api/gen'
import { VenueTypeModal } from 'features/venueMap/pages/modals/VenueTypeModal'
import { fireEvent, render, screen } from 'tests/utils'

const mockHideModal = jest.fn()

describe('<VenueTypeModal />', () => {
  it('should render modal correctly', () => {
    render(<VenueTypeModal venueType={null} hideModal={mockHideModal} isVisible />)

    expect(screen).toMatchSnapshot()
  })

  it('should select by default "Tout" option', () => {
    render(<VenueTypeModal venueType={null} hideModal={mockHideModal} isVisible />)

    expect(screen.getByText('Tout')).toHaveProp('isSelected', true)
  })

  it('should select an option when pressing it', () => {
    render(<VenueTypeModal venueType={null} hideModal={mockHideModal} isVisible />)

    expect(screen.getByText('Cinémas - Salles de projection')).toHaveProp('isSelected', false)

    fireEvent.press(screen.getByText('Cinémas - Salles de projection'))

    expect(screen.getByText('Cinémas - Salles de projection')).toHaveProp('isSelected', true)
  })

  it('should select "Tout" option when pressing reset button', () => {
    render(
      <VenueTypeModal venueType={VenueTypeCodeKey.MOVIE} hideModal={mockHideModal} isVisible />
    )

    expect(screen.getByText('Tout')).toHaveProp('isSelected', false)

    fireEvent.press(screen.getByText('Réinitialiser'))

    expect(screen.getByText('Tout')).toHaveProp('isSelected', true)
  })

  it('should select "Tout" option and close the modal when pressing close button', () => {
    render(
      <VenueTypeModal venueType={VenueTypeCodeKey.MOVIE} hideModal={mockHideModal} isVisible />
    )

    expect(screen.getByText('Tout')).toHaveProp('isSelected', false)

    fireEvent.press(screen.getByTestId('Fermer'))

    expect(screen.getByText('Tout')).toHaveProp('isSelected', true)
    expect(mockHideModal).toHaveBeenCalledTimes(1)
  })

  it('should select "Tout" option and close the modal when pressing search button', () => {
    render(
      <VenueTypeModal venueType={VenueTypeCodeKey.MOVIE} hideModal={mockHideModal} isVisible />
    )

    expect(screen.getByText('Tout')).toHaveProp('isSelected', false)

    fireEvent.press(screen.getByText('Rechercher'))

    expect(screen.getByText('Tout')).toHaveProp('isSelected', true)
    expect(mockHideModal).toHaveBeenCalledTimes(1)
  })
})
