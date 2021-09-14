import React from 'react'

import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { render } from 'tests/utils/web'

import { ContactBlock } from './ContactBlock'

const email = venueResponseSnap.contact?.email || ''
const phoneNumber = venueResponseSnap.contact?.phoneNumber || ''
const website = venueResponseSnap.contact?.website || ''

describe('<ContactBlock/>', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not display the phoneNumber and website if they are undefined', () => {
    const { queryByText } = renderContactBlock(email, undefined, undefined)
    expect(queryByText(email))
    expect(queryByText(phoneNumber)).toBeNull()
    expect(queryByText(website)).toBeNull()
  })

  it('should not display the phoneNumber and website if they are undefined', () => {
    const { queryByText } = renderContactBlock(undefined, phoneNumber, undefined)
    expect(queryByText(email)).toBeNull()
    expect(queryByText(phoneNumber))
    expect(queryByText(website)).toBeNull()
  })

  it('should not display the email and phoneNumber if they are undefined', () => {
    const { queryByText } = renderContactBlock(undefined, undefined, website)
    expect(queryByText(email)).toBeNull()
    expect(queryByText(phoneNumber)).toBeNull()
    expect(queryByText(website))
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

  it('should not display 3 external icons if email, phoneNumber and website are enable', () => {
    const { queryByTestId } = renderContactBlock(email, phoneNumber, website)
    expect(queryByTestId('ExternalLinkSquare')).toBeNull()
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
