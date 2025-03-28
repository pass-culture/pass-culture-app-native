import React from 'react'

import { OnSiteWithdrawal } from 'features/bookings/components/TicketBody/OnSiteWithdrawal/OnSiteWithdrawal'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { render, screen } from 'tests/utils'

describe('<OnSitelWithdrawal/>', () => {
  it('should return the correct message if there is token', () => {
    render(<OnSiteWithdrawal booking={bookingsSnap.ongoing_bookings[0]} />)

    expect(
      screen.getByText(
        'Présente le code ci-dessus à l’accueil du lieu indiqué avant le début de l’événement pour récupérer ton billet.'
      )
    ).toBeOnTheScreen()
  })

  it('should return the token if there is token', () => {
    render(<OnSiteWithdrawal booking={bookingsSnap.ongoing_bookings[0]} />)

    expect(screen.getByText('352UW4')).toBeOnTheScreen()
  })

  it('should not return the message if there is no token', () => {
    render(<OnSiteWithdrawal booking={{ ...bookingsSnap.ongoing_bookings[0], token: undefined }} />)

    expect(
      screen.queryByText(
        'Présente le code ci-dessus à l’accueil du lieu indiqué avant le début de l’événement pour récupérer ton billet.'
      )
    ).not.toBeOnTheScreen()
  })
})
