import { t } from '@lingui/macro'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { Children, cloneElement, FunctionComponent, ReactElement, useMemo } from 'react'
import { BackHandler } from 'react-native'
import Swiper from 'react-native-web-swiper'
import styled from 'styled-components/native'

import { homeNavigateConfig } from 'features/navigation/helpers'
import { ScreenNames, UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { ButtonTertiaryGreyDark } from 'ui/components/buttons/ButtonTertiaryGreyDark'
import { Background } from 'ui/svg/Background'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

import { ControlComponent } from './ControlComponent'
import { DotComponent } from './DotComponent'
import { AchievementCardKeyProps } from './GenericAchievementCard'

const controlProps = {
  DotComponent,
  PrevComponent: ControlComponent,
  NextComponent: ControlComponent,
}

export type Props = {
  screenName: ScreenNames
  children: Array<ReactElement<AchievementCardKeyProps>> | ReactElement<AchievementCardKeyProps>
  onFirstCardBackAction?: () => void
  skip?: () => void
}

export const GenericAchievement: FunctionComponent<Props> = (props: Props) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const swiperRef = React.useRef<Swiper>(null)

  const cards = useMemo(() => Children.toArray(props.children), [props.children])
  const lastIndex = cards.length - 1

  // We use useFocusEffect(...) because we want to remove the BackHandler listener on blur
  // of this GenericAchievement component, otherwise the logic of the "back action"
  // would leak to other components / screens.
  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      onBackAction(swiperRef?.current, props.onFirstCardBackAction)
    )
    return () => backHandler.remove()
  })

  async function skip() {
    if (props.skip) {
      props.skip()
    }
    if (swiperRef?.current) {
      const index = swiperRef.current.getActiveIndex()
      analytics.logHasSkippedTutorial(`${props.screenName}${index + 1}`)
    }
    navigate(homeNavigateConfig.screen, homeNavigateConfig.params)
  }

  return (
    <React.Fragment>
      <Background />
      <EntireScreen>
        <Spacer.TopScreen />
        <ScreenUsableArea>
          {!!lastIndex && (
            <SkipButton>
              <HorizontalPaddingContainer>
                <ButtonTertiaryGreyDark title={t`Tout passer`} onPress={skip} />
              </HorizontalPaddingContainer>
            </SkipButton>
          )}
          <SwiperContainer>
            <Swiper
              ref={swiperRef}
              controlsProps={lastIndex ? controlProps : undefined}
              controlsEnabled={!!lastIndex}
              gesturesEnabled={() => !!lastIndex}
              slideWrapperStyle={slideWrapperStyle}>
              {cards.map((card, index: number) =>
                cloneElement(card as ReactElement<AchievementCardKeyProps>, {
                  key: index,
                  swiperRef,
                  name:
                    (card as ReactElement<AchievementCardKeyProps>).props.name ||
                    `${props.screenName}${index + 1}`,
                  lastIndex,
                  skip,
                })
              )}
            </Swiper>
          </SwiperContainer>
          <Spacer.Column numberOfSpaces={getSpacing(0.5)} />
        </ScreenUsableArea>
        <Spacer.BottomScreen />
      </EntireScreen>
    </React.Fragment>
  )
}

export function onBackAction(
  swiperRefValue: Swiper | null,
  onFirstCardBackAction?: () => void
): boolean {
  if (swiperRefValue) {
    const activeIndex = swiperRefValue.getActiveIndex()
    if (activeIndex === 0) {
      if (onFirstCardBackAction) {
        onFirstCardBackAction()
      } else {
        return false // use default back handler action
      }
    } else {
      swiperRefValue.goToPrev()
    }
  }
  return true
}

const HorizontalPaddingContainer = styled.View({
  paddingHorizontal: getSpacing(5),
})

const slideWrapperStyle = {
  flex: 1,
  width: '100%',
}

const EntireScreen = styled.View({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: ColorsEnum.WHITE,
  flexGrow: 1,
})

const ScreenUsableArea = styled.View({
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
  width: '100%',
  maxWidth: getSpacing(125),
  maxHeight: getSpacing(225),
})

const SkipButton = styled.View({
  alignSelf: 'flex-end',
})

const SwiperContainer = styled.View({
  flex: 1,
  width: '100%',
})
