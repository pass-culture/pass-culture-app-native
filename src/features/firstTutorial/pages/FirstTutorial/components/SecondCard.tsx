import { t } from '@lingui/macro'
import React from 'react'

import { useDepositAmount } from 'features/auth/api'
import { _ } from 'libs/i18n'
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
      buttonText={_(t`Continuer`)}
      pauseAnimationOnRenderAtFrame={62}
      subTitle={_(t`et si tu es...`)}
      text={_(
        t`dans l’année de tes 18 ans, obtiens l’aide financière pass Culture d’un montant de ${deposit} à dépenser dans l’application.`
      )}
      title={_(t`Des offres pour tous`)}
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
      lastIndex={props.lastIndex}
    />
  )
}
