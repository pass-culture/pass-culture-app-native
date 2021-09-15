import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'
import * as ContactHelpers from 'ui/components/contact/helpers'

import { ContactBlock } from '../ContactBlock'

const venueId = venueResponseSnap.id
const email = 'contact@venue.com'
const phoneNumber = '+33102030405'
const website = 'https://my@website.com'

jest.mock('features/venue/api/useVenue')
const openMail = jest.spyOn(ContactHelpers, 'openMail')
const openPhoneNumber = jest.spyOn(ContactHelpers, 'openPhoneNumber')
const openExternalUrl = jest.spyOn(NavigationHelpers, 'openExternalUrl')

describe('<ContactBlock/>', () => {
  afterEach(jest.clearAllMocks)

  it('should open external email when the email button is press', () => {
    const { getByText } = render(<ContactBlock venueId={venueId} />)
    fireEvent.press(getByText('E-mail'))
    expect(openMail).toHaveBeenNthCalledWith(1, email)
  })

  it('should open external phone when the phone button is press', () => {
    const { getByText } = render(<ContactBlock venueId={venueId} />)
    fireEvent.press(getByText('Téléphone'))
    expect(openPhoneNumber).toHaveBeenNthCalledWith(1, phoneNumber)
  })

  it('should open external website when the website button is press', () => {
    const { getByText } = render(<ContactBlock venueId={venueId} />)
    fireEvent.press(getByText('Site internet'))
    expect(openExternalUrl).toHaveBeenNthCalledWith(1, website)
  })

  it('should display the email, phoneNumber and website', () => {
    const { queryByText } = render(<ContactBlock venueId={venueId} />)
    expect(queryByText('E-mail'))
    expect(queryByText('Téléphone'))
    expect(queryByText('Site internet'))
  })

  it('should display 3 different icons if email, phoneNumber and website are enable', () => {
    const { getAllByTestId } = render(<ContactBlock venueId={venueId} />)
    expect(getAllByTestId('Icon E-mail'))
    expect(getAllByTestId('Icon Téléphone'))
    expect(getAllByTestId('Icon Site internet'))
  })

  it('should log event VenueContact when opening email', () => {
    const { getByText } = render(<ContactBlock venueId={venueId} />)
    fireEvent.press(getByText('E-mail'))
    expect(analytics.logVenueContact).toHaveBeenNthCalledWith(1, { type: 'email', venueId })
  })

  it('should log event VenueContact when opening phone number', () => {
    const { getByText } = render(<ContactBlock venueId={venueId} />)
    fireEvent.press(getByText('Téléphone'))
    expect(analytics.logVenueContact).toHaveBeenNthCalledWith(1, { type: 'phoneNumber', venueId })
  })

  it('should log event VenueContact when opening website', () => {
    const { getByText } = render(<ContactBlock venueId={venueId} />)
    fireEvent.press(getByText('Site internet'))
    expect(analytics.logVenueContact).toHaveBeenNthCalledWith(1, { type: 'website', venueId })
  })
})
