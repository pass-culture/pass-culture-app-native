import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

import { ContactBlock } from './ContactBlock'

const venueId = venueDataTest.id

const openUrlSpy = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('<ContactBlock/>', () => {
  it.each([
    {
      destination: 'mail',
      contact: 'email',
      text: 'contact@venue.com',
      url: 'mailto:contact@venue.com',
    },
    { destination: 'tel', contact: 'phoneNumber', text: '+33102030405', url: 'tel:+33102030405' },
    {
      destination: 'website',
      contact: 'website adress',
      text: 'https://my@website.com',
      url: 'https://my@website.com',
    },
  ])('should navigate to $destination when pressing on $contact', async ({ text, url }) => {
    render(<ContactBlock venue={venueDataTest} />)

    await user.press(screen.getByText(text))

    expect(openUrlSpy).toHaveBeenCalledWith(url, undefined, true)
  })

  it('should display the email, phoneNumber and website', () => {
    render(<ContactBlock venue={venueDataTest} />)

    expect(screen.getByText('contact@venue.com')).toBeOnTheScreen()
    expect(screen.getByText('+33102030405')).toBeOnTheScreen()
    expect(screen.getByText('https://my@website.com')).toBeOnTheScreen()
  })

  it.each([
    { contact: 'email', text: 'contact@venue.com', type: 'email' },
    { contact: 'phone number', text: '+33102030405', type: 'phoneNumber' },
    { contact: 'website', text: 'https://my@website.com', type: 'website' },
  ])('should log event VenueContact when opening $contact', async ({ text, type }) => {
    render(<ContactBlock venue={venueDataTest} />)
    await user.press(screen.getByText(text))

    expect(analytics.logVenueContact).toHaveBeenNthCalledWith(1, {
      type,
      venueId,
    })
  })

  it('should show snackbar when error', async () => {
    openUrlSpy.mockRejectedValueOnce(new Error('error'))
    render(<ContactBlock venue={venueDataTest} />)

    await user.press(screen.getByText('https://my@website.com'))

    expect(screen.getByTestId('snackbar-error')).toBeOnTheScreen()
    expect(screen.getByText('Une erreur est survenue.')).toBeOnTheScreen()
  })

  it('should display nothing when contact section is empty', () => {
    render(<ContactBlock venue={{ ...venueDataTest, contact: {} }} />)

    expect(screen.queryByText('contact@venue.com')).not.toBeOnTheScreen()
    expect(screen.queryByText('+33102030405')).not.toBeOnTheScreen()
    expect(screen.queryByText('https://my@website.com')).not.toBeOnTheScreen()
  })
})
