import React from 'react'

import { VenueResponse } from 'api/gen'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen, waitFor } from 'tests/utils/web'
import { SnackBarHelperSettings } from 'ui/components/snackBar/types'

import { ContactBlock } from './ContactBlockNew'

const openUrlSpy = jest.spyOn(NavigationHelpers, 'openUrl')
const mockShowErrorSnackBar = jest.fn()

jest.mock('ui/components/snackBar/SnackBarContext', () => ({
  useSnackBarContext: () => ({
    showErrorSnackBar: jest.fn((props: SnackBarHelperSettings) => mockShowErrorSnackBar(props)),
  }),
}))

describe('<ContactBlock/>', () => {
  it('should match snapshot', () => {
    const { container } = render(<ContactBlock venue={venueResponseSnap} />)

    expect(container).toMatchSnapshot()
  })

  it('should navigate to mail when clicking on email', async () => {
    render(<ContactBlock venue={venueResponseSnap} />)

    fireEvent.click(screen.getByText('contact@venue.com'))

    await waitFor(() => {
      expect(openUrlSpy).toHaveBeenCalledWith('mailto:contact@venue.com', undefined, true)
    })
  })

  it('should navigate to tel when clicking on phoneNumber', async () => {
    render(<ContactBlock venue={venueResponseSnap} />)

    fireEvent.click(screen.getByText('+33102030405'))

    await waitFor(() => {
      expect(openUrlSpy).toHaveBeenCalledWith('tel:+33102030405', undefined, true)
    })
  })

  it('should navigate to website when clicking on website adress', async () => {
    render(<ContactBlock venue={venueResponseSnap} />)

    fireEvent.click(screen.getByText('https://my@website.com'))

    await waitFor(() => {
      expect(openUrlSpy).toHaveBeenCalledWith('https://my@website.com', undefined, true)
    })
  })

  it('should show snackbar when error', async () => {
    render(<ContactBlock venue={venueResponseSnap} />)
    openUrlSpy.mockRejectedValueOnce(new Error('error'))

    fireEvent.click(screen.getByText('https://my@website.com'))

    await waitFor(() => {
      expect(mockShowErrorSnackBar).toHaveBeenCalledWith({ message: 'Une erreur est survenue' })
    })
  })

  it('should not show phoneNumber if invalid format', () => {
    const venueWithInvalidPhoneNumber: VenueResponse = {
      ...venueResponseSnap,
      contact: { phoneNumber: '1234567890' },
    }
    render(<ContactBlock venue={venueWithInvalidPhoneNumber} />)

    expect(screen.queryByText('1234567890')).not.toBeInTheDocument()
  })

  it('should log analytics when clicking a button', () => {
    render(<ContactBlock venue={venueResponseSnap} />)

    fireEvent.click(screen.getByText('https://my@website.com'))

    expect(analytics.logVenueContact).toHaveBeenCalledWith({ type: 'website', venueId: 5543 })
  })
})
