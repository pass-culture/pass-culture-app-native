import { t } from '@lingui/macro'
import React from 'react'

import { useDepositAmountsByAge } from 'features/auth/api'
import { useAppSettings } from 'features/auth/settings'
import TutorialOffers from 'ui/animations/tutorial_offers.json'
import {
  AchievementCardKeyProps,
  GenericAchievementCard,
} from 'ui/components/achievements/components/GenericAchievementCard'

export function SecondCard(props: AchievementCardKeyProps) {
  const { data: settings } = useAppSettings()
  const depositAmount = useDepositAmountsByAge().eighteenYearsOldDeposit
  const deposit = depositAmount.replace(' ', '')

  function onButtonPress() {
    props.swiperRef?.current?.goToNext()
  }

  const text = settings?.enableNativeEacIndividual
    ? t`dans l’année de tes 15 à 18 ans, obtiens l’aide financière pass Culture d’un montant de 20€ à ${deposit} à dépenser dans l’application.`
    : t`dans l’année de tes 18 ans, obtiens l’aide financière pass Culture d’un montant de ${deposit} à dépenser dans l’application.`

  return (
    <GenericAchievementCard
      animation={TutorialOffers}
      buttonCallback={onButtonPress}
      buttonText={t`Continuer`}
      pauseAnimationOnRenderAtFrame={62}
      subTitle={t`et si tu es...`}
      text={text}
      title={t`Des offres pour tous`}
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
      lastIndex={props.lastIndex}
    />
  )
}
