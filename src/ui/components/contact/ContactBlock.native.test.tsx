import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { fireEvent, render } from 'tests/utils'

import { ContactBlock } from './ContactBlock'

const email = venueResponseSnap.contact?.email || ''
const phoneNumber = venueResponseSnap.contact?.phoneNumber || ''
const website = venueResponseSnap.contact?.website || ''
const venueName = venueResponseSnap.publicName

const openExternalUrl = jest.spyOn(NavigationHelpers, 'openExternalUrl')
const openExternalPhoneNumber = jest.spyOn(NavigationHelpers, 'openExternalPhoneNumber')

jest.mock('features/venue/api/useVenue')

describe('<ContactBlock/>', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should open external email when the email button is press', () => {
    const { getByText } = renderContactBlock(email)
    const emailButton = getByText(`Contacter ${venueName}`)
    fireEvent.press(emailButton)
    expect(openExternalUrl).toBeCalledWith(`mailto:${email}`)
  })

  it('should open external phone when the phone button is press', () => {
    const { getByText } = renderContactBlock(phoneNumber)
    const phoneNumberButton = getByText(phoneNumber)
    fireEvent.press(phoneNumberButton)
    expect(openExternalPhoneNumber).toBeCalledWith(phoneNumber)
  })

  it('should open external website when the website button is press', () => {
    const { getByText } = renderContactBlock(website)
    const websiteButton = getByText(website)
    fireEvent.press(websiteButton)
    expect(openExternalUrl).toBeCalledWith(website)
  })

  it('should not display the email, phoneNumber and website if they are all undefined', () => {
    const { queryByText } = renderContactBlock(undefined, undefined, undefined)
    expect(queryByText(email)).toBeNull()
    expect(queryByText(phoneNumber)).toBeNull()
    expect(queryByText(website)).toBeNull()
  })

  it('should display the email, phoneNumber and website', () => {
    const { queryByText } = renderContactBlock(email, phoneNumber, website)
    expect(queryByText(email))
    expect(queryByText(phoneNumber))
    expect(queryByText(website))
  })

  it('should display 3 external icons if email, phoneNumber and website are enable', () => {
    const { getAllByTestId } = renderContactBlock(email, phoneNumber, website)
    const externalLinkSquare = getAllByTestId('ExternalLinkSquare')
    expect(externalLinkSquare.length).toBe(3)
  })
})

const renderContactBlock = (
  email?: string | undefined,
  phoneNumber?: string | undefined,
  website?: string | undefined
) => {
  return render(
    <ContactBlock
      venue={venueResponseSnap}
      email={email}
      phoneNumber={phoneNumber}
      website={website}
    />
  )
}
