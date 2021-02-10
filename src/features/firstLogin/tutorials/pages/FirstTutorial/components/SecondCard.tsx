import { t } from '@lingui/macro'
import React from 'react'

import { CardKey, GenericCard } from 'features/firstLogin/tutorials/components/GenericCard'
import { _ } from 'libs/i18n'
import TutorialOffers from 'ui/animations/tutorial_offers.json'

export function SecondCard(props: CardKey) {
  function onButtonPress() {
    props.swiperRef?.current?.goToNext()
  }
  return (
    <GenericCard
      animation={TutorialOffers}
      buttonCallback={onButtonPress}
      buttonText={_(t`Continuer`)}
      pauseAnimationOnRenderAtFrame={62}
      subTitle={_(t`et si tu es...`)}
      text={_(
        t`dans l’année de tes 18 ans, obtiens l’aide financière pass Culture d’un montant de 300€ à dépenser dans l’application.`
      )}
      title={_(t`Des offres pour tous`)}
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
    />
  )
}
