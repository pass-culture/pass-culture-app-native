import { BookingOfferResponseV2, FavoriteOfferResponse, OfferResponseV2 } from 'api/gen'
import { formatShareOfferMessage } from 'features/share/helpers/formatShareOfferMessage'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { share } from 'libs/share/share'
import { ShareContent } from 'libs/share/types'

type Offer = OfferResponseV2 | BookingOfferResponseV2 | FavoriteOfferResponse
type Parameters = {
  offer?: Offer
  utmMedium: string
}

const hasVenue = (offer: Offer) => 'venueName' in offer || 'venue' in offer

const isFavoriteOffer = (offer: Offer): offer is FavoriteOfferResponse => 'venueName' in offer
const getVenueName = (offer: Offer) => (isFavoriteOffer(offer) ? offer.venueName : offer.venue.name)

const offerShareSubject = 'Je t’invite à découvrir une super offre sur le pass Culture\u00a0!'

export const getShareOffer = ({
  offer,
  utmMedium,
}: Parameters): {
  share: () => Promise<void>
  shareContent: ShareContent | null
} => {
  if (!offer || !hasVenue(offer))
    return { share: () => new Promise((r) => r()), shareContent: null }

  const content = {
    subject: offerShareSubject,
    body: formatShareOfferMessage({
      offerName: offer.name,
      venueName: getVenueName(offer),
    }),
    url: getOfferUrl(offer?.id, utmMedium),
  }

  return {
    share: () => share({ content, mode: 'default' }),
    shareContent: content,
  }
}
