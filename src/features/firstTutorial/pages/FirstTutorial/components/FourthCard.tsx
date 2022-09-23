import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { storage } from 'libs/storage'
import StarAnimation from 'ui/animations/tutorial_star.json'
import {
  AchievementCardKeyProps,
  GenericAchievementCard,
} from 'ui/components/achievements/components/GenericAchievementCard'

export function FourthCard(props: AchievementCardKeyProps) {
  const { reset } = useNavigation<UseNavigationType>()

  const { activeIndex, index } = props
  const isActiveCard = index !== undefined && activeIndex === index
  useEffect(() => {
    if (isActiveCard) {
      storage.saveObject('has_seen_tutorials', true)
    }
  }, [isActiveCard])

  function onButtonPress() {
    reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
  }

  return (
    <GenericAchievementCard
      animation={StarAnimation}
      buttonCallback={onButtonPress}
      buttonText="Découvrir"
      buttonAccessibilityLabel="Découvrir ton pass Culture"
      pauseAnimationOnRenderAtFrame={62}
      subTitle="quotidiennes"
      text="Nos nombreux partenaires ajoutent de nouvelles offres quotidiennement. Découvre les dès maintenant&nbsp;!"
      title="Des nouveautés"
      swiperRef={props.swiperRef}
      name={props.name}
      index={props.index}
      activeIndex={props.activeIndex}
      lastIndex={props.lastIndex}
    />
  )
}
