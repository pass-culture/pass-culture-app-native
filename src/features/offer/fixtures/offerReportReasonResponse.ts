import { OfferReportReasons } from 'api/gen'

export const offerReportReasonResponseSnap: OfferReportReasons = {
  reasons: {
    IMPROPER: {
      description: 'La date ne correspond pas, mauvaise description...',
      title: 'La description est non conforme',
    },
    INAPPROPRIATE: {
      description: 'violence, incitation à la haine, nudité...',
      title: 'Le contenu est inapproprié',
    },
    OTHER: {
      description: '',
      title: 'Autre',
    },
    PRICE_TOO_HIGH: {
      description: 'comparé à l’offre public',
      title: 'Le tarif est trop élevé',
    },
  },
}
