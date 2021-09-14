import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { fireEvent, render } from 'tests/utils'
import * as ContactHelpers from 'ui/components/contact/helpers'

import { ContactBlock } from '../ContactBlock'

const email = 'contact@venue.com'
const phoneNumber = '+33102030405'
const website = 'https://my@website.com'
const venueName = 'Le Petit Rintintin 1'

const openMail = jest.spyOn(ContactHelpers, 'openMail')
const openPhoneNumber = jest.spyOn(ContactHelpers, 'openPhoneNumber')
const openExternalUrl = jest.spyOn(NavigationHelpers, 'openExternalUrl')

jest.mock('features/venue/api/useVenue')

describe('<ContactBlock/>', () => {
  it('should open external email when the email button is press', () => {
    const { getByText } = renderContactBlock({ email })
    fireEvent.press(getByText(`Contacter ${venueName}`))
    expect(openMail).toHaveBeenNthCalledWith(1, email)
  })

  it('should open external phone when the phone button is press', () => {
    const { getByText } = renderContactBlock({ phoneNumber })
    fireEvent.press(getByText(phoneNumber))
    expect(openPhoneNumber).toHaveBeenNthCalledWith(1, phoneNumber)
  })

  it('should open external website when the website button is press', () => {
    const { getByText } = renderContactBlock({ website })
    fireEvent.press(getByText(website))
    expect(openExternalUrl).toHaveBeenNthCalledWith(1, website)
  })

  it('should not display the email, phoneNumber and website if they are all undefined', () => {
    const { queryByText } = renderContactBlock({})
    expect(queryByText(email)).toBeNull()
    expect(queryByText(phoneNumber)).toBeNull()
    expect(queryByText(website)).toBeNull()
  })

  it('should display the email, phoneNumber and website', () => {
    const { queryByText } = renderContactBlock({ email, phoneNumber, website })
    expect(queryByText(email))
    expect(queryByText(phoneNumber))
    expect(queryByText(website))
  })

  it('should display 3 external icons if email, phoneNumber and website are enable', () => {
    const { getAllByTestId } = renderContactBlock({ email, phoneNumber, website })
    const externalLinkSquare = getAllByTestId('ExternalLinkSquare')
    expect(externalLinkSquare.length).toBe(3)
  })
})

const renderContactBlock = (props: {
  email?: string | undefined
  phoneNumber?: string | undefined
  website?: string | undefined
}) =>
  render(
    <ContactBlock
      venueName={venueResponseSnap.publicName || ''}
      email={props.email}
      phoneNumber={props.phoneNumber}
      website={props.website}
    />
  )
