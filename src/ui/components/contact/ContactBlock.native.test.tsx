import React from 'react'
import { mocked } from 'ts-jest/utils'

import * as NavigationHelpers from 'features/navigation/helpers'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { fireEvent, render } from 'tests/utils'
import { isValidFrenchPhoneNumber } from 'ui/components/contact/frenchPhoneNumberCheck'
import { isEmailValid } from 'ui/components/inputs/emailCheck'

import { ContactBlock } from './ContactBlock'

const email = venueResponseSnap.contact?.email || ''
const phoneNumber = venueResponseSnap.contact?.phoneNumber || ''
const website = venueResponseSnap.contact?.website || ''

const openExternalUrl = jest.spyOn(NavigationHelpers, 'openExternalUrl')
const openExternalPhoneNumber = jest.spyOn(NavigationHelpers, 'openExternalPhoneNumber')

jest.mock('features/venue/api/useVenue')
jest.mock('ui/components/contact/frenchPhoneNumberCheck')
jest.mock('ui/components/inputs/emailCheck')
const mockedUseValidFrenchPhoneNumber = mocked(isValidFrenchPhoneNumber)
const mockedEmailCheck = mocked(isEmailValid)

describe('<ContactBlock/>', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should open external email when the email button is press', () => {
    mockedEmailCheck.mockReturnValueOnce(true)
    const { getByText } = renderContactBlock()

    const venueName = venueResponseSnap.publicName
    const emailButton = getByText(`Contacter ${venueName}`)
    fireEvent.press(emailButton)
    expect(openExternalUrl).toBeCalledWith(email)
  })

  it('should open external phone when the phone button is press', () => {
    mockedUseValidFrenchPhoneNumber.mockReturnValueOnce(true)
    const { getByText } = renderContactBlock()

    const phoneNumberButton = getByText(phoneNumber)
    fireEvent.press(phoneNumberButton)
    expect(openExternalPhoneNumber).toBeCalledWith(phoneNumber)
  })

  it('should open external website when the website button is press', () => {
    const { getByText } = renderContactBlock()

    const websiteButton = getByText(website)
    fireEvent.press(websiteButton)
    expect(openExternalUrl).toBeCalledWith(website)
  })
})

const renderContactBlock = () => {
  return render(
    <ContactBlock
      venue={venueResponseSnap}
      email={email}
      phoneNumber={phoneNumber}
      website={website}
    />
  )
}
