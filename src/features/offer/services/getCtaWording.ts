import { t } from '@lingui/macro'

import { CategoryType } from 'api/gen'
import { _ } from 'libs/i18n'

interface ICtaWording {
  categoryType: CategoryType
  isLoggedIn: boolean
  isBeneficiary: boolean
}

export const getCtaWording = ({ categoryType, isLoggedIn, isBeneficiary }: ICtaWording) => {
  if (isLoggedIn && isBeneficiary) {
    if (categoryType === CategoryType.Event) {
      // 1. Voir les disponibilités
      // Au moment de la réservation si pour une ou plusieurs dates à venir le stock > 0
      //
      // 2. Offre épuisée
      // Si stock = 0 pour l'ensemble des dates à venir (toutes les stocks ont été réservées ou si le stock est annulé/supprimé par l'acteur (isSoftDeleted = true)
      // (bookable stock = 0)
      //
      // 3. Offre expirée
      // Au moment de la réservation si la ou l'ensemble des dates limites de réservation de l'offre sont caduques
      //
      // 4. Crédit insuffisant
      // Si crédit bénéficiaire < prix de l'offre sortie physique ou numérique
    } else {
      // 1.Réserver
      // Si stock > 0
      // (bookable stock > 0)
      //
      // 2. Offre épuisée
      // Si stock = 0 (toutes les stocks ont été réservées ou si le stock est annulé/supprimé par l'acteur (isSoftDeleted = true)
      // (bookable stock = 0)
      //
      // 3. Offre expirée
      // Au moment de la réservation si la date limite de réservation de l'offre est caduque
      //
      // 4. Crédit insuffisant
      // Si crédit bénéficaire < prix de l'offre bien physique / numérique
      //
      // 5. Impossible de réserver pour les utilisateurs Apple
      // Cas spécifique : offre numérique, prix > 0€ et utilisateur iOS
    }
  } else {
    if (categoryType === CategoryType.Event) return _(t`Accéder à la billetterie externe`)
    return _(t`Accéder à l'offre`)
  }
  return _(t`Voir les disponibilités`)
}
