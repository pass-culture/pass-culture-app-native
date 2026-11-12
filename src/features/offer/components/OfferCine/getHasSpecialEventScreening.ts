import { OfferResponse } from 'api/gen'

const SPECIAL_EVENT_FEATURES = new Set([
  'PLEIN_AIR',
  'DRIVE_IN',
  'CINE_CONCERT',
  'AVANT_PREMIERE',
  'AVANT_PREMIERE_EQUIPE',
  'CINE_DEBAT',
  'DERNIERE_DIFFUSION',
  'SEANCE_UNIQUE',
  'PREMIERE_DIFFUSION',
  'RENCONTRE',
  'REPLAY',
  'LIVE',
  'ATELIER',
  'ANIMATION_15_25',
  'PUBLIC_ADAPTE',
  'CINE_CLUB',
  'FESTIVAL',
  'CINE_RELAX',
])

export const getHasSpecialEventScreenings = (
  offers: OfferResponse[] | undefined,
  dates: Date[]
): boolean =>
  offers?.some((offer) =>
    offer.stocks.some((stock) => {
      if (!stock.beginningDatetime) {
        return false
      }
      const stockDate = new Date(stock.beginningDatetime)
      const isStockInDates = dates.some(
        (date) =>
          date.getFullYear() === stockDate.getFullYear() &&
          date.getMonth() === stockDate.getMonth() &&
          date.getDate() === stockDate.getDate()
      )
      return isStockInDates && stock.features.some((feature) => SPECIAL_EVENT_FEATURES.has(feature))
    })
  ) || false
