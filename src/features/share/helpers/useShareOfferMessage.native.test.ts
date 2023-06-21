import { UseQueryResult } from 'react-query'

import { OfferResponse } from 'api/gen'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import * as OfferAPI from 'features/offer/api/useOffer'
import { useShareOfferMessage } from 'features/share/helpers/useShareOfferMessage'
import { renderHook } from 'tests/utils'

const mockUseOffer = jest.spyOn(OfferAPI, 'useOffer') as jest.SpyInstance<
  Partial<UseQueryResult<OfferResponse>>
>

const shareMessage =
  'Retrouve "Je ne sais pas ce que je dis" chez "Cinéma de la fin" sur le pass Culture'

describe('useShareOffer', () => {
  describe('should display share modal with data from offer', () => {
    it('should return undefined when no offer found', async () => {
      mockUseOffer.mockReturnValueOnce({ data: undefined })
      const { result } = renderHook(() => useShareOfferMessage(mockOffer.id))

      const message = result.current

      expect(message).toBeUndefined()
    })

    it('should return share message with location name when offer is found', async () => {
      mockUseOffer.mockReturnValueOnce({ data: mockOffer })
      const { result } = renderHook(() => useShareOfferMessage(mockOffer.id))

      const message = result.current

      expect(message).toEqual(shareMessage)
    })
  })
})
