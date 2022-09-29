import React from 'react'

import { analytics } from 'libs/firebase/analytics'
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
      buttonText="Utiliser ma position"
      pauseAnimationOnRenderAtFrame={62}
      title="Toute la culture"
      subTitle="près de chez toi"
      text="Librairie, ciné, festival... Active ta géolocalisation pour retrouver les offres culturelles à proximité."
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
      lastIndex={props.lastIndex}
    />
  )
}
