import { t } from '@lingui/macro'
import React from 'react'

import { analytics } from 'libs/analytics'
import { useGeolocation } from 'libs/geolocation'
import GeolocationAnimation from 'ui/animations/geolocalisation.json'
import {
  AchievementCardKeyProps,
  GenericAchievementCard,
} from 'ui/components/achievements/components/GenericAchievementCard'

export function ThirdCard(props: AchievementCardKeyProps) {
  const { requestGeolocPermission } = useGeolocation()

  async function onGeolocationButtonPress() {
    await requestGeolocPermission({
      onSubmit: () => {
        props.swiperRef?.current?.goToNext()
      },
      onAcceptance: () => {
        analytics.logHasActivateGeolocFromTutorial()
      },
    })
  }

  return (
    <GenericAchievementCard
      animation={GeolocationAnimation}
      buttonCallback={onGeolocationButtonPress}
      buttonText={t`Activer la géolocalisation`}
      pauseAnimationOnRenderAtFrame={62}
      subTitle={t`à portée de main\u00a0!`}
      text={t`Active la géolocalisation pour découvrir toutes les offres existantes autour de toi.`}
      title={t`Toute la culture`}
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
      lastIndex={props.lastIndex}
    />
  )
}
