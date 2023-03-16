import { openUrl } from 'features/navigation/helpers'

import { openGoogleMapsItinerary } from './openGoogleMapsItinerary'

jest.mock('features/navigation/helpers')
const mockOpenUrl = jest.mocked(openUrl)

describe('openGoogleMapsItinerary()', () => {
  it('should open the correct encoded url with address', () => {
    const address = '12 rue duhesme 75018 Paris'
    openGoogleMapsItinerary(address)
    const url =
      'https://www.google.com/maps/dir/?api=1&destination=12%20rue%20duhesme%2075018%20Paris'
    expect(mockOpenUrl).toHaveBeenCalledWith(url)
  })

  it('should open the correct encoded url with lat,long string', () => {
    const address = '1.567,6.8888'
    openGoogleMapsItinerary(address)
    const url = 'https://www.google.com/maps/dir/?api=1&destination=1.567%2C6.8888'
    expect(mockOpenUrl).toHaveBeenCalledWith(url)
  })
})
