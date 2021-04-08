import { t } from '@lingui/macro'
import React from 'react'

import { useDepositAmount } from 'features/auth/api'
import { formatToFrenchDecimal } from 'libs/parsers'
import TutorialOffers from 'ui/animations/tutorial_offers.json'
import {
  AchievementCardKeyProps,
  GenericAchievementCard,
} from 'ui/components/achievements/components/GenericAchievementCard'

export function SecondCard(props: AchievementCardKeyProps) {
  const depositAmount = useDepositAmount()
  const deposit = formatToFrenchDecimal(depositAmount).replace(' ', '')

  function onButtonPress() {
    props.swiperRef?.current?.goToNext()
  }

  return (
    <GenericAchievementCard
      animation={TutorialOffers}
      buttonCallback={onButtonPress}
      buttonText={t`Continuer`}
      pauseAnimationOnRenderAtFrame={62}
      subTitle={t`et si tu es...`}
      text={t`dans l’année de tes 18 ans, obtiens l’aide financière pass Culture d’un montant de ${deposit.toString()} à dépenser dans l’application.`}
      title={t`Des offres pour tous`}
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
      lastIndex={props.lastIndex}
    />
  )
}
