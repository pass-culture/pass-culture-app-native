import { BookingOfferResponse, FavoriteOfferResponse, OfferResponseV2 } from 'api/gen'
import { formatShareOfferMessage } from 'features/share/helpers/formatShareOfferMessage'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { share } from 'libs/share/share'
import { ShareContent } from 'libs/share/types'

type Offer = OfferResponseV2 | BookingOfferResponse | FavoriteOfferResponse
type Parameters = {
  offer?: Offer
  utmMedium: string
}

const hasVenue = (offer: Offer) =>
  Object.keys(offer).includes('venueName') || Object.keys(offer).includes('venue')

const isFavoriteOffer = (offer: Offer): offer is FavoriteOfferResponse =>
  !!Object.keys(offer).includes('venueName')
const getVenueName = (offer: Offer) =>
  isFavoriteOffer(offer) ? offer.venueName : offer.venue.publicName || offer.venue.name

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
