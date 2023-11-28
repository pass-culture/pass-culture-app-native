import Clipboard from '@react-native-clipboard/clipboard'
import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { VenueBodyNew } from 'features/venue/components/VenueBodyNew/VenueBodyNew'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { fireEvent, render, screen } from 'tests/utils'

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('features/venue/api/useVenue')
jest.mock('@react-native-clipboard/clipboard')

const mockSubcategories = placeholderData.subcategories
const mockHomepageLabels = placeholderData.homepageLabels
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      homepageLabels: mockHomepageLabels,
    },
  }),
}))

const venueId = venueResponseSnap.id
useRoute.mockImplementation(() => ({ params: { id: venueId } }))

describe('<VenueBody />', () => {
  it('should display full venue address', () => {
    render(<VenueBodyNew venue={venueResponseSnap} onScroll={jest.fn()} />)

    expect(screen.getByText('1 boulevard Poissonnière, 75000 Paris')).toBeOnTheScreen()
  })

  it('should copy the whole address when pressing the copy button', () => {
    render(<VenueBodyNew venue={venueResponseSnap} onScroll={jest.fn()} />)

    fireEvent.press(screen.getByText('Copier l’adresse'))

    expect(Clipboard.setString).toHaveBeenCalledWith(
      'Le Petit Rintintin 1, 1 boulevard Poissonnière, 75000 Paris'
    )
  })

  it('should display default background image when no banner for venue', () => {
    render(<VenueBodyNew venue={venueResponseSnap} onScroll={jest.fn()} />)

    expect(screen.getByTestId('defaultVenueBackground')).toBeOnTheScreen()
  })

  it('should display withdrawal details', () => {
    render(<VenueBodyNew venue={venueResponseSnap} onScroll={jest.fn()} />)

    fireEvent.press(screen.getByText('Infos pratiques'))

    expect(screen.getByText('How to withdraw, https://test.com')).toBeOnTheScreen()
  })
})
