import React from 'react'

import { QFBonificationStatus } from 'api/gen'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { Code } from 'ui/svg/icons/Code'
import { WarningFilled } from 'ui/svg/icons/WarningFilled'

enum BonificationBannerType {
  ERROR = 'Error',
  PENDING = 'Pending',
  DEFAULT = 'Default',
}

const BANNER_CONFIG = {
  [BonificationBannerType.DEFAULT]: {
    type: BannerType.DEFAULT,
    label: (amount: string) =>
      `Un bonus de ${amount} pourrait t’être attribué, voyons si tu peux y être éligible.`,
    links: [
      {
        navigateTo: getSubscriptionPropConfig('BonificationRequiredInformation'),
        wording: 'Je veux vérifier',
      },
    ],
    Icon: Code,
  },
  [BonificationBannerType.PENDING]: {
    type: BannerType.ALERT,
    label: 'Dossier en cours de vérification. On te notifiera rapidement.',
    links: [],
    Icon: Code,
  },
  [BonificationBannerType.ERROR]: {
    type: BannerType.ERROR,
    label: 'Nous n’avons pas trouvé de correspondance pour ce dossier.',
    links: [
      {
        navigateTo: getSubscriptionPropConfig('BonificationRequiredInformation'),
        wording: 'Je veux vérifier',
      },
    ],
    Icon: WarningFilled,
  },
}

const BANNER_CONFIG_MAP = {
  [QFBonificationStatus.unknown_ko]: BANNER_CONFIG[BonificationBannerType.ERROR],
  [QFBonificationStatus.too_many_retries]: BANNER_CONFIG[BonificationBannerType.ERROR],
  [QFBonificationStatus.custodian_not_found]: BANNER_CONFIG[BonificationBannerType.ERROR],
  [QFBonificationStatus.started]: BANNER_CONFIG[BonificationBannerType.PENDING],
  [QFBonificationStatus.eligible]: BANNER_CONFIG[BonificationBannerType.DEFAULT],
  [QFBonificationStatus.quotient_familial_too_high]: BANNER_CONFIG[BonificationBannerType.DEFAULT],
  [QFBonificationStatus.granted]: BANNER_CONFIG[BonificationBannerType.DEFAULT],
  default: BANNER_CONFIG[BonificationBannerType.DEFAULT],
}

export const BonificationBanner = ({
  bonificationStatus,
  onCloseCallback,
}: {
  bonificationStatus: QFBonificationStatus | undefined | null
  onCloseCallback: () => void
}) => {
  const currency = useGetCurrencyToDisplay()
  const euroToPacificFrancRate = useGetPacificFrancToEuroRate()
  const bonificationAmount = formatCurrencyFromCents(5000, currency, euroToPacificFrancRate) // get amount from backend

  const onClose = () => {
    onCloseCallback()
  }

  const bannerConfig =
    (bonificationStatus && BANNER_CONFIG_MAP[bonificationStatus]) ||
    BANNER_CONFIG[BonificationBannerType.DEFAULT]

  const label =
    typeof bannerConfig.label === 'function'
      ? bannerConfig.label(bonificationAmount)
      : bannerConfig.label

  return <Banner {...bannerConfig} label={label} onClose={onClose} />
}
