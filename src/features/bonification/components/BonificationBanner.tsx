import React from 'react'

import { FraudCheckStatus } from 'api/gen'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { Code } from 'ui/svg/icons/Code'
import { WarningFilled } from 'ui/svg/icons/WarningFilled'

export const BonificationBanner = ({
  bonificationStatus,
}: {
  bonificationStatus: FraudCheckStatus | undefined | null
}) => {
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const bonificationAmount = formatCurrencyFromCents(5000, currency, euroToPacificFrancRate) // get amount from backend

  const onClose = () =>
    alert(
      'TODO(PC-38487): Récupérer la valeur depuis le backend pour permettre de cacher la bannière. Actuellement la bannière s’affiche en fonction de la valeur du feature flag "ENABLE_BONIFICATION".'
    )

  const bannerVariants = {
    ['Default']: {
      bannerType: BannerType.DEFAULT,
      label: `Un bonus de ${bonificationAmount} pourrait t’être attribué, voyons si tu peux y être éligible.`,
      links: [
        {
          navigateTo: getSubscriptionPropConfig('BonificationIntroduction'),
          wording: 'Je veux vérifier',
        },
      ],
      icon: Code,
    },
    ['Pending']: {
      bannerType: BannerType.ALERT,
      label: 'Dossier en cours de vérification. On te notifiera rapidement.',
      links: [],
      icon: Code,
    },
    ['Error']: {
      bannerType: BannerType.ERROR,
      label: 'Nous n’avons pas trouvé de correspondance pour ce dossier.',
      links: [
        {
          navigateTo: getSubscriptionPropConfig('BonificationIntroduction'),
          wording: 'Je veux vérifier',
        },
      ],
      icon: WarningFilled,
    },
  }

  const banner =
    bonificationStatus === FraudCheckStatus.error
      ? bannerVariants['Error']
      : bonificationStatus === FraudCheckStatus.pending
        ? bannerVariants['Pending']
        : bannerVariants['Default']

  return (
    <Banner
      label={banner.label}
      Icon={banner.icon}
      links={banner.links}
      onClose={onClose}
      type={banner.bannerType}
    />
  )
}
