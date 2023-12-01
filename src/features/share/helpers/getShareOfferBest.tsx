import { OfferResponse } from 'api/gen'
import { formatShareOfferMessage } from 'features/share/helpers/formatShareOfferMessage'
import { getOfferUrl } from 'features/share/helpers/getOfferUrl'
import { share } from 'libs/share/shareBest'
import { ShareContent } from 'libs/share/types'

type Parameters = {
  offer?: OfferResponse
  utmMedium: string
}

const offerShareSubject = 'Je t’invite à découvrir une super offre sur le pass Culture\u00a0!'

export const getShareOffer = ({
  offer,
  utmMedium,
}: Parameters): {
  share: () => void
  shareContent: ShareContent | null
} => {
  if (!offer) return { share: () => undefined, shareContent: null }

  const content = {
    subject: offerShareSubject,
    body: formatShareOfferMessage({
      offerName: offer.name,
      venueName: offer.venue.publicName || offer.venue.name,
    }),
    url: getOfferUrl(offer?.id, utmMedium),
  }

  return {
    share: () => share({ content, mode: 'default' }),
    shareContent: content,
  }
}
