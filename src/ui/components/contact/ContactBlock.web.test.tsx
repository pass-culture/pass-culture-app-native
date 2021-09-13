import React from 'react'
import { mocked } from 'ts-jest/utils'

import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { render } from 'tests/utils/web'
import { isValidFrenchPhoneNumber } from 'ui/components/contact/frenchPhoneNumberCheck'
import { isEmailValid } from 'ui/components/inputs/emailCheck'

import { ContactBlock } from './ContactBlock'

const email = venueResponseSnap.contact?.email || ''
const phoneNumber = venueResponseSnap.contact?.phoneNumber || ''
const website = venueResponseSnap.contact?.website || ''

jest.mock('features/venue/api/useVenue')
jest.mock('ui/components/contact/frenchPhoneNumberCheck')
jest.mock('ui/components/inputs/emailCheck')
const mockedUseValidFrenchPhoneNumber = mocked(isValidFrenchPhoneNumber)
const mockedEmailCheck = mocked(isEmailValid)

describe('<ContactBlock/>', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display the email', () => {
    mockedEmailCheck.mockReturnValueOnce(true)
    const { getByText } = renderContactBlock()
    expect(getByText(email))
  })

  it('should display the phone number', () => {
    mockedUseValidFrenchPhoneNumber.mockReturnValueOnce(true)
    const { getByText } = renderContactBlock()
    expect(getByText(phoneNumber))
  })

  it('should display the website', () => {
    const { getByText } = renderContactBlock()
    expect(getByText(website))
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
