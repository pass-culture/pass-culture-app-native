import { t } from '@lingui/macro'
import React from 'react'

import { analytics } from 'libs/analytics'
import { useGeolocation } from 'libs/geolocation'
import { _ } from 'libs/i18n'
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
      buttonText={_(t`Activer la géolocalisation`)}
      pauseAnimationOnRenderAtFrame={62}
      subTitle={_(t`à portée de main !`)}
      text={_(
        t`Active la géolocalisation pour découvrir toutes les offres existantes autour de toi.`
      )}
      title={_(t`Toute la culture`)}
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
    />
  )
}
