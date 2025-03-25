import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'

import { ProposedBySection } from 'features/offer/components/OfferBody/ProposedBySection/ProposedBySection'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { render, screen, userEvent } from 'tests/utils'

const mockNavigate = jest.fn()
jest.spyOn(reactNavigationNative, 'useNavigation').mockReturnValue({
  navigate: mockNavigate,
})

const venue = offerResponseSnap.venue

const user = userEvent.setup()
jest.useFakeTimers()

describe('<ProposedBySection />', () => {
  it('should display venue name', () => {
    render(
      <ProposedBySection
        navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
        name={venue.name}
        imageUrl={venue.bannerUrl}
      />
    )

    expect(screen.getByText('PATHE BEAUGRENELLE')).toBeOnTheScreen()
  })

  it('should display venue image when there is one', () => {
    render(
      <ProposedBySection
        navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
        name={venue.name}
        imageUrl={venue.bannerUrl}
      />
    )

    expect(screen.getByTestId('VenueImage')).toBeOnTheScreen()
  })

  it('should display default image when there is no venue image', () => {
    render(
      <ProposedBySection
        navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
        name={venue.name}
      />
    )

    expect(screen.getByTestId('DefaultImage')).toBeOnTheScreen()
  })

  it('should navigate to the venue when navigateTo defined', async () => {
    render(
      <ProposedBySection
        navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
        name={venue.name}
      />
    )

    await user.press(screen.getByText('PATHE BEAUGRENELLE'))

    expect(mockNavigate).toHaveBeenNthCalledWith(1, 'Venue', { id: 1664 })
  })

  it('should display right chevron when navigateTo defined', async () => {
    render(
      <ProposedBySection
        navigateTo={{ screen: 'Venue', params: { id: venue.id } }}
        name={venue.name}
      />
    )

    expect(screen.getByTestId('RightFilled')).toBeOnTheScreen()
  })

  it('should not navigate to the venue when navigateTo not defined', async () => {
    render(<ProposedBySection name={venue.name} />)

    await user.press(screen.getByText('PATHE BEAUGRENELLE'))

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should not display right chevron when navigateTo not defined', async () => {
    render(<ProposedBySection name={venue.name} />)

    expect(screen.queryByTestId('RightFilled')).not.toBeOnTheScreen()
  })
})
