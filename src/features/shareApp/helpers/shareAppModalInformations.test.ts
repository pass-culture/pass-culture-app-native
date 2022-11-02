import {
  shareAppModalInformations,
  ShareAppModalType,
} from 'features/shareApp/helpers/shareAppModalInformations'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'

describe('shareAppModalInformations', () => {
  it('should diplay correct informations when underage', () => {
    const modalInformations = shareAppModalInformations(ShareAppModalType.NOT_ELIGIBLE)
    expect(modalInformations).toEqual({
      title: 'Passe la culture à ton voisin\u00a0!',
      explanation: `Pour les 15-18 ans, le pass Culture offre un crédit dédié à la culture. ${DOUBLE_LINE_BREAK} Fais-en profiter ton entourage\u00a0!`,
    })
  })

  it('should diplay correct informations when beneficiary', () => {
    const modalInformations = shareAppModalInformations(ShareAppModalType.BENEFICIARY)
    expect(modalInformations).toEqual({
      title: 'La culture, ça se partage\u00a0!',
      explanation:
        'Recommande l’appli à tes potes pour qu’ils profitent eux aussi de tous les bons plans du pass Culture.',
    })
  })

  it('should diplay correct informations when booking', () => {
    const modalInformations = shareAppModalInformations(ShareAppModalType.ON_BOOKING_SUCCESS)
    expect(modalInformations).toEqual({
      title: 'Le bon pote, c’est toi\u00a0!',
      explanation:
        'Recommande l’appli à tes proches pour qu’ils profitent eux aussi de tous les bons plans du pass Culture.',
    })
  })
})
