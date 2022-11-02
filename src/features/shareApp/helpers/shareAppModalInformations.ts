import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

export enum ShareAppModalType {
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  BENEFICIARY = 'BENEFICIARY',
  ON_BOOKING_SUCCESS = 'ON_BOOKING_SUCCESS',
}

export const shareAppModalInformations = (modalType: ShareAppModalType) => {
  if (modalType === ShareAppModalType.NOT_ELIGIBLE)
    return {
      title: 'Passe la culture à ton voisin\u00a0!',
      explanation: `Pour les 15-18 ans, le pass Culture offre un crédit dédié à la culture. ${DOUBLE_LINE_BREAK} Fais-en profiter ton entourage\u00a0!`,
    }

  if (modalType === ShareAppModalType.BENEFICIARY)
    return {
      title: 'La culture, ça se partage\u00a0!',
      explanation:
        'Recommande l’appli à tes potes pour qu’ils profitent eux aussi de tous les bons plans du pass Culture.',
    }

  return {
    title: 'Le bon pote, c’est toi\u00a0!',
    explanation:
      'Recommande l’appli à tes proches pour qu’ils profitent eux aussi de tous les bons plans du pass Culture.',
  }
}
