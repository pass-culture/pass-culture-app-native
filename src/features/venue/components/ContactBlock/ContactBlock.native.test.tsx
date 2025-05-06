import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { analytics } from 'libs/analytics/provider'
import { render, screen, userEvent } from 'tests/utils'

import { ContactBlock } from './ContactBlock'

const venueId = venueDataTest.id

const mockShowErrorSnackBar = jest.fn()
jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: mockShowErrorSnackBar,
  }),
}))

const openUrlSpy = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('<ContactBlock/>', () => {
  it('should navigate to mail when pressing on email', async () => {
    render(<ContactBlock venue={venueDataTest} />)

    await user.press(screen.getByText('contact@venue.com'))

    expect(openUrlSpy).toHaveBeenCalledWith('mailto:contact@venue.com', undefined, true)
  })

  it('should navigate to tel when pressing on phoneNumber', async () => {
    render(<ContactBlock venue={venueDataTest} />)

    await user.press(screen.getByText('+33102030405'))

    expect(openUrlSpy).toHaveBeenCalledWith('tel:+33102030405', undefined, true)
  })

  it('should navigate to website when pressing on website adress', async () => {
    render(<ContactBlock venue={venueDataTest} />)

    await user.press(screen.getByText('https://my@website.com'))

    expect(openUrlSpy).toHaveBeenCalledWith('https://my@website.com', undefined, true)
  })

  it('should display the email, phoneNumber and website', () => {
    render(<ContactBlock venue={venueDataTest} />)

    expect(screen.getByText('contact@venue.com')).toBeOnTheScreen()
    expect(screen.getByText('+33102030405')).toBeOnTheScreen()
    expect(screen.getByText('https://my@website.com')).toBeOnTheScreen()
  })

  it('should log event VenueContact when opening email', async () => {
    render(<ContactBlock venue={venueDataTest} />)
    await user.press(screen.getByText('contact@venue.com'))

    expect(analytics.logVenueContact).toHaveBeenNthCalledWith(1, {
      type: 'email',
      venueId,
    })
  })

  it('should log event VenueContact when opening phone number', async () => {
    render(<ContactBlock venue={venueDataTest} />)
    await user.press(screen.getByText('+33102030405'))

    expect(analytics.logVenueContact).toHaveBeenNthCalledWith(1, {
      type: 'phoneNumber',
      venueId,
    })
  })

  it('should log event VenueContact when opening website', async () => {
    render(<ContactBlock venue={venueDataTest} />)
    await user.press(screen.getByText('https://my@website.com'))

    expect(analytics.logVenueContact).toHaveBeenNthCalledWith(1, {
      type: 'website',
      venueId,
    })
  })

  it('should show snackbar when error', async () => {
    openUrlSpy.mockRejectedValueOnce(new Error('error'))
    render(<ContactBlock venue={venueDataTest} />)

    await user.press(screen.getByText('https://my@website.com'))

    expect(mockShowErrorSnackBar).toHaveBeenCalledWith({ message: 'Une erreur est survenue.' })
  })

  it('should display nothing when contact section is empty', () => {
    render(<ContactBlock venue={{ ...venueDataTest, contact: {} }} />)

    expect(screen.queryByText('contact@venue.com')).not.toBeOnTheScreen()
    expect(screen.queryByText('+33102030405')).not.toBeOnTheScreen()
    expect(screen.queryByText('https://my@website.com')).not.toBeOnTheScreen()
  })
})
