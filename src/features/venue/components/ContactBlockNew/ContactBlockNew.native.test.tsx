import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'
import * as ContactHelpers from 'ui/components/contact/helpers'

import { ContactBlock } from './ContactBlockNew'

const venueId = venueResponseSnap.id
const email = 'contact@venue.com'
const phoneNumber = '+33102030405'
const website = 'https://my@website.com'

const openMail = jest.spyOn(ContactHelpers, 'openMail')
const openPhoneNumber = jest.spyOn(ContactHelpers, 'openPhoneNumber')
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('<ContactBlock/>', () => {
  it('should open external email when the email button is press', () => {
    render(<ContactBlock venue={venueResponseSnap} />)
    fireEvent.press(screen.getByText('contact@venue.com'))

    expect(openMail).toHaveBeenNthCalledWith(1, email)
  })

  it('should open external phone when the phone button is press', () => {
    render(<ContactBlock venue={venueResponseSnap} />)
    fireEvent.press(screen.getByText('+33102030405'))

    expect(openPhoneNumber).toHaveBeenNthCalledWith(1, phoneNumber)
  })

  it('should open external website when the website button is press', () => {
    render(<ContactBlock venue={venueResponseSnap} />)
    fireEvent.press(screen.getByText('https://my@website.com'))

    expect(openUrl).toHaveBeenNthCalledWith(1, website)
  })

  it('should display the email, phoneNumber and website', () => {
    render(<ContactBlock venue={venueResponseSnap} />)

    expect(screen.queryByText('contact@venue.com')).toBeOnTheScreen()
    expect(screen.queryByText('+33102030405')).toBeOnTheScreen()
    expect(screen.queryByText('https://my@website.com')).toBeOnTheScreen()
  })

  it('should log event VenueContact when opening email', () => {
    render(<ContactBlock venue={venueResponseSnap} />)
    fireEvent.press(screen.getByText('contact@venue.com'))

    expect(analytics.logVenueContact).toHaveBeenNthCalledWith(1, {
      type: 'email',
      venueId,
    })
  })

  it('should log event VenueContact when opening phone number', () => {
    render(<ContactBlock venue={venueResponseSnap} />)
    fireEvent.press(screen.getByText('+33102030405'))

    expect(analytics.logVenueContact).toHaveBeenNthCalledWith(1, {
      type: 'phoneNumber',
      venueId,
    })
  })

  it('should log event VenueContact when opening website', () => {
    render(<ContactBlock venue={venueResponseSnap} />)
    fireEvent.press(screen.getByText('https://my@website.com'))

    expect(analytics.logVenueContact).toHaveBeenNthCalledWith(1, {
      type: 'website',
      venueId,
    })
  })
})
