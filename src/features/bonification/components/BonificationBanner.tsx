import React from 'react'

import { QFBonificationStatus } from 'api/gen'
import { BonificationRefusedType } from 'features/bonification/pages/BonificationRefused'
import { getSubscriptionPropConfig } from 'features/navigation/SubscriptionStackNavigator/getSubscriptionPropConfig'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { useGetPacificFrancToEuroRate } from 'shared/exchangeRates/useGetPacificFrancToEuroRate'
import { Banner } from 'ui/designSystem/Banner/Banner'
import { BannerType } from 'ui/designSystem/Banner/enums'
import { Code } from 'ui/svg/icons/Code'
import { LogoFilled } from 'ui/svg/icons/LogoFilled'
import { WarningFilled } from 'ui/svg/icons/WarningFilled'

enum BonificationBannerType {
  ERROR = 'Error',
  PENDING = 'Pending',
  DEFAULT = 'Default',
}

const STATUS_TO_REFUSED_TYPE: Record<string, BonificationRefusedType> = {
  [QFBonificationStatus.custodian_not_found]: BonificationRefusedType.CUSTODIAN_NOT_FOUND,
  [QFBonificationStatus.too_many_retries]: BonificationRefusedType.TOO_MANY_RETRIES,
  [QFBonificationStatus.not_in_tax_household]: BonificationRefusedType.NOT_IN_TAX_HOUSEHOLD,
  [QFBonificationStatus.quotient_familial_too_high]:
    BonificationRefusedType.QUOTIENT_FAMILY_TOO_HIGH,
}

const BANNER_CONFIG = {
  [BonificationBannerType.DEFAULT]: {
    type: BannerType.DEFAULT,
    label: (amount: string) => `Bonus de ${amount}`,
    description: `Tu es peut-être éligible à ce bonus, vérifie si tu y as droit.`,
    links: () => [
      {
        navigateTo: getSubscriptionPropConfig('BonificationExplanations'),
        wording: 'Vérifier maintenant',
      },
    ],
    Icon: LogoFilled,
  },
  [BonificationBannerType.PENDING]: {
    type: BannerType.ALERT,
    label: (amount: string) => `Bonus de ${amount}`,
    description: 'Ton dossier est actuellement en cours de vérification.',
    links: () => [],
    Icon: Code,
  },
  [BonificationBannerType.ERROR]: {
    type: BannerType.ERROR,
    label: (amount: string) => `Bonus de ${amount}`,
    description: 'Ton dossier a été refusé.',
    links: (refusedType: BonificationRefusedType) => [
      {
        navigateTo: getSubscriptionPropConfig('BonificationRefused', {
          bonificationRefusedType: refusedType,
        }),
        wording: 'Voir plus de détails',
      },
    ],
    Icon: WarningFilled,
  },
}

const BANNER_CONFIG_MAP = {
  [QFBonificationStatus.not_in_tax_household]: BANNER_CONFIG[BonificationBannerType.ERROR],
  [QFBonificationStatus.too_many_retries]: BANNER_CONFIG[BonificationBannerType.ERROR],
  [QFBonificationStatus.custodian_not_found]: BANNER_CONFIG[BonificationBannerType.ERROR],
  [QFBonificationStatus.quotient_familial_too_high]: BANNER_CONFIG[BonificationBannerType.ERROR],
  [QFBonificationStatus.started]: BANNER_CONFIG[BonificationBannerType.PENDING],
  [QFBonificationStatus.eligible]: BANNER_CONFIG[BonificationBannerType.DEFAULT],
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

  const bannerConfig = bonificationStatus && BANNER_CONFIG_MAP[bonificationStatus]

  const label =
    typeof bannerConfig.label === 'function'
      ? bannerConfig.label(bonificationAmount)
      : bannerConfig.label

  const refusedType = bonificationStatus && STATUS_TO_REFUSED_TYPE[bonificationStatus]

  const links = bannerConfig.links(refusedType)

  return <Banner {...bannerConfig} label={label} links={links} onClose={onClose} />
}
