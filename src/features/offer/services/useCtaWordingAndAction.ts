import { t } from '@lingui/macro'

import { CategoryType } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useUserProfileInfo } from 'features/home/api'
import { openExternalUrl } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'

import { OfferAdaptedResponse, useOffer } from '../api/useOffer'

import { useHasEnoughCredit } from './useHasEnoughCredit'

interface Props {
  isLoggedIn: boolean
  isBeneficiary: boolean
  offer: OfferAdaptedResponse
  hasEnoughCredit: boolean
}
interface ICTAWordingAndAction {
  isExternal?: boolean
  wording?: string
  onPress?: () => void
}

// Follow logic of https://www.notion.so/Modalit-s-d-affichage-du-CTA-de-r-servation-dbd30de46c674f3f9ca9f37ce8333241
export const getCtaWordingAndAction = ({
  isLoggedIn,
  isBeneficiary,
  offer,
  hasEnoughCredit,
}: Props): ICTAWordingAndAction | undefined => {
  const { category, externalTicketOfficeUrl } = offer

  // Non beneficiary
  if (!isLoggedIn || !isBeneficiary) {
    const isEvent = category.categoryType === CategoryType.Event
    if (!externalTicketOfficeUrl) return { wording: undefined }

    return {
      isExternal: isEvent,
      wording: isEvent ? t`Accéder à la billetterie` : t`Accéder à l'offre`,
      onPress: () => openExternalUrl(externalTicketOfficeUrl),
    }
  }

  // Beneficiary
  if (!offer.isReleased) return { wording: t`Offre expirée` }
  if (offer.isExpired) return { wording: t`Offre expirée` }
  if (offer.isSoldOut) return { wording: t`Offre épuisée` }

  if (category.categoryType === CategoryType.Thing) {
    if (!hasEnoughCredit) {
      if (offer.isDigital) return { wording: t`Crédit numérique insuffisant` }
      return { wording: t`Crédit insuffisant` }
    }

    return {
      wording: t`Réserver`,
      onPress: () => {
        analytics.logClickBookOffer(offer.id)
      },
    }
  }

  if (category.categoryType === CategoryType.Event) {
    if (!hasEnoughCredit) return { wording: t`Crédit insuffisant` }

    return {
      wording: t`Voir les disponibilités`,
      onPress: () => {
        analytics.logConsultAvailableDates(offer.id)
      },
    }
  }
  return
}

export const useCtaWordingAndAction = (props: {
  offerId: number
}): ICTAWordingAndAction | undefined => {
  const { offerId } = props
  const { isLoggedIn } = useAuthContext()
  const { data: profileInfo } = useUserProfileInfo()
  const { data: offer } = useOffer({ offerId })
  const hasEnoughCredit = useHasEnoughCredit(offerId)

  if (!offer) return

  /* check I have all information to calculate wording
   * why: avoid flash on CTA wording
   */
  if (
    isLoggedIn === null ||
    profileInfo === null ||
    offer.category.categoryType === null ||
    offer.category.categoryType === undefined
  )
    return

  const { isBeneficiary = false } = profileInfo || {}
  return getCtaWordingAndAction({ isLoggedIn, isBeneficiary, offer, hasEnoughCredit })
}
