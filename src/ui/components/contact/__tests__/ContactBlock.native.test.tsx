import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'
import * as ContactHelpers from 'ui/components/contact/helpers'

import { ContactBlock } from '../ContactBlock'

const venueId = venueResponseSnap.id
const email = 'contact@venue.com'
const phoneNumber = '+33102030405'
const website = 'https://my@website.com'

jest.mock('features/venue/api/useVenue')
const openMail = jest.spyOn(ContactHelpers, 'openMail')
const openPhoneNumber = jest.spyOn(ContactHelpers, 'openPhoneNumber')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('<ContactBlock/>', () => {
  it('should open external email when the email button is press', () => {
    render(<ContactBlock venueId={venueId} />)
    fireEvent.press(screen.getByText('E-mail'))
    expect(openMail).toHaveBeenNthCalledWith(1, email)
  })

  it('should open external phone when the phone button is press', () => {
    render(<ContactBlock venueId={venueId} />)
    fireEvent.press(screen.getByText('Téléphone'))
    expect(openPhoneNumber).toHaveBeenNthCalledWith(1, phoneNumber)
  })

  it('should open external website when the website button is press', () => {
    render(<ContactBlock venueId={venueId} />)
    fireEvent.press(screen.getByText('Site internet'))
    expect(openUrl).toHaveBeenNthCalledWith(1, website)
  })

  it('should display the email, phoneNumber and website', () => {
    render(<ContactBlock venueId={venueId} />)
    expect(screen.queryByText('E-mail')).toBeOnTheScreen()
    expect(screen.queryByText('Téléphone')).toBeOnTheScreen()
    expect(screen.queryByText('Site internet')).toBeOnTheScreen()
  })

  it('should display 3 different icons if email, phoneNumber and website are enable', () => {
    render(<ContactBlock venueId={venueId} />)
    expect(screen.getAllByTestId('Icon E-mail')).not.toHaveLength(0)
    expect(screen.getAllByTestId('Icon Téléphone')).not.toHaveLength(0)
    expect(screen.getAllByTestId('Icon Site internet')).not.toHaveLength(0)
  })

  it('should log event VenueContact when opening email', () => {
    render(<ContactBlock venueId={venueId} />)
    fireEvent.press(screen.getByText('E-mail'))
    expect(analytics.logVenueContact).toHaveBeenNthCalledWith(1, {
      type: 'email',
      venueId,
    })
  })

  it('should log event VenueContact when opening phone number', () => {
    render(<ContactBlock venueId={venueId} />)
    fireEvent.press(screen.getByText('Téléphone'))
    expect(analytics.logVenueContact).toHaveBeenNthCalledWith(1, {
      type: 'phoneNumber',
      venueId,
    })
  })

  it('should log event VenueContact when opening website', () => {
    render(<ContactBlock venueId={venueId} />)
    fireEvent.press(screen.getByText('Site internet'))
    expect(analytics.logVenueContact).toHaveBeenNthCalledWith(1, {
      type: 'website',
      venueId,
    })
  })
})
