import { t } from '@lingui/macro'
import { EventArg, useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { Children, cloneElement, FunctionComponent, ReactElement, useMemo } from 'react'
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
  const navigation = useNavigation<UseNavigationType>()
  const swiperRef = React.useRef<Swiper>(null)

  const cards = useMemo(() => Children.toArray(props.children), [props.children])
  const lastIndex = cards.length - 1

  // We use useFocusEffect(...) because we want to remove the BackHandler listener on blur
  // of this GenericAchievement component, otherwise the logic of the "back action"
  // would leak to other components / screens.
  useFocusEffect(() => {
    // For overriding iOS and Android go back and pop screen behaviour
    const unsubscribeFromNavigationListener = navigation.addListener('beforeRemove', (event) => {
      onRemoveScreenAction({
        swiperRefValue: swiperRef?.current,
        onFirstCardBackAction: props.onFirstCardBackAction,
        event,
      })
    })
    return unsubscribeFromNavigationListener
  })

  async function skip() {
    if (props.skip) {
      props.skip()
    }
    if (swiperRef?.current) {
      const index = swiperRef.current.getActiveIndex()
      analytics.logHasSkippedTutorial(`${props.screenName}${index + 1}`)
    }
    navigation.navigate(homeNavigateConfig.screen, homeNavigateConfig.params)
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

export function onRemoveScreenAction({
  swiperRefValue,
  onFirstCardBackAction,
  event,
}: {
  swiperRefValue: Swiper | null
  onFirstCardBackAction?: () => void
  event: EventArg<
    'beforeRemove',
    true,
    {
      action: Readonly<{
        type: string
        payload?: Record<string, any> | undefined // eslint-disable-line @typescript-eslint/no-explicit-any
        source?: string | undefined
        target?: string | undefined
      }>
    }
  >
}): void {
  const isGoBackAction = ['GO_BACK', 'POP'].includes(event.data.action.type)
  if (!isGoBackAction || !swiperRefValue) {
    return // Remove screen
  }
  const activeIndex = swiperRefValue.getActiveIndex()
  if (activeIndex === 0 && onFirstCardBackAction) {
    onFirstCardBackAction()
    event.preventDefault() // Do not remove screen
  } else if (activeIndex === 0) {
    return // Remove screen
  } else {
    swiperRefValue.goToPrev()
    event.preventDefault() // Do not remove screen
  }
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
