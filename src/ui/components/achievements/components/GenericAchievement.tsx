import { EventArg, useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { Children, cloneElement, FunctionComponent, ReactElement, useMemo } from 'react'
import { Platform, View } from 'react-native'
import Swiper, { SwiperControlsProps } from 'react-native-web-swiper'
import styled from 'styled-components/native'

import { ScreenNames, UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { analytics } from 'libs/firebase/analytics'
import { ButtonTertiaryNeutralInfo } from 'ui/components/buttons/ButtonTertiaryNeutralInfo'
import { DotComponent } from 'ui/components/DotComponent'
import { getSpacing, Spacer } from 'ui/theme'

import { ControlComponent, ControlComponentProps } from './ControlComponent'
import { AchievementCardKeyProps } from './GenericAchievementCard'

// While it may look like a duplication of the type in DotComponent.tsx,
// we need to enforce this type here to ensure that it receive the right props
// from the Swiper component.
// Doing so, we avoid that a change in DotComponent.tsx breaks this file.
// In short : never modify the following type.
type DotComponentPropsForSwiper = {
  index: number
  activeIndex: number
  numberOfSteps: number
  isActive: boolean
  onPress?: () => void
}

const DotComponentForSwiper: React.ComponentType<DotComponentPropsForSwiper> = DotComponent

export type Props = {
  screenName: ScreenNames
  children: Array<ReactElement<AchievementCardKeyProps>> | ReactElement<AchievementCardKeyProps>
  onFirstCardBackAction?: () => void
  skip?: () => void
}

export const GenericAchievement: FunctionComponent<Props> = ({
  screenName,
  children,
  onFirstCardBackAction,
  skip,
}: Props) => {
  const navigation = useNavigation<UseNavigationType>()
  const swiperRef = React.useRef<Swiper>(null)
  const skipButtonRef = React.useRef<View>(null)

  const cards = useMemo(() => Children.toArray(children), [children])
  const lastIndex = cards.length - 1

  // We use useFocusEffect(...) because we want to remove the BackHandler listener on blur
  // of this GenericAchievement component, otherwise the logic of the "back action"
  // would leak to other components / screens.
  useFocusEffect(() => {
    // For overriding iOS and Android go back and pop screen behaviour
    const unsubscribeFromNavigationListener = navigation.addListener('beforeRemove', (event) => {
      onRemoveScreenAction({
        swiperRefValue: swiperRef?.current,
        onFirstCardBackAction: onFirstCardBackAction,
        event,
      })
    })
    return unsubscribeFromNavigationListener
  })

  async function skipGenericAchievement() {
    if (skip) {
      skip()
    }
    if (swiperRef?.current) {
      const index = swiperRef.current.getActiveIndex()
      analytics.logHasSkippedTutorial(`${screenName}${index + 1}`)
    }
    navigation.reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
  }

  const controlProps: SwiperControlsProps = {
    DotComponent: (props: DotComponentPropsForSwiper) => (
      <DotComponentForSwiper {...props} numberOfSteps={cards.length} />
    ),
    PrevComponent: (props: ControlComponentProps) => <ControlComponent {...props} withMargin />,
    NextComponent: (props: ControlComponentProps) => <ControlComponent {...props} withMargin />,
    prevTitle: 'Revenir à l’étape précédente',
    nextTitle: 'Continuer vers l’étape suivante',
  }

  return (
    <EntireScreen>
      <Spacer.TopScreen />
      <ScreenUsableArea>
        {!!lastIndex && (
          <SkipButton ref={skipButtonRef}>
            <ButtonTertiaryNeutralInfo wording="Tout passer" onPress={skipGenericAchievement} />
          </SkipButton>
        )}
        <SwiperContainer>
          <Swiper
            ref={swiperRef}
            controlsProps={lastIndex ? controlProps : undefined}
            controlsEnabled={!!lastIndex}
            gesturesEnabled={() => !!lastIndex}
            slideWrapperStyle={slideWrapperStyle}
            onIndexChanged={() => {
              if (
                Platform.OS === 'web' &&
                ['next', 'prev'].includes(document.activeElement?.getAttribute('type') || '')
              ) {
                const skipButton = (skipButtonRef.current as unknown as HTMLElement)
                  .firstChild as HTMLElement
                skipButton.focus()
              }
            }}>
            {cards.map((card, index: number) =>
              cloneElement(card as ReactElement<AchievementCardKeyProps>, {
                key: index,
                swiperRef,
                name:
                  (card as ReactElement<AchievementCardKeyProps>).props.name ||
                  `${screenName}${index + 1}`,
                lastIndex,
                skip: skipGenericAchievement,
              })
            )}
          </Swiper>
        </SwiperContainer>
        <Spacer.Column numberOfSpaces={getSpacing(0.5)} />
      </ScreenUsableArea>
      <Spacer.BottomScreen />
    </EntireScreen>
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
        payload?: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
        source?: string
        target?: string
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

const slideWrapperStyle = {
  flex: 1,
  width: '100%',
}

const EntireScreen = styled.View(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.white,
  flexGrow: 1,
}))

const ScreenUsableArea = styled.View(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexGrow: 1,
  width: '100%',
  maxWidth: theme.contentPage.maxWidth,
  maxHeight: getSpacing(225),
}))

const SkipButton = styled(View)({
  alignSelf: 'flex-end',
  paddingHorizontal: getSpacing(5),
})

const SwiperContainer = styled.View({
  flex: 1,
  width: '100%',
})
