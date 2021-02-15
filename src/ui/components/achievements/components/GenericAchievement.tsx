import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { Children, cloneElement, FunctionComponent, ReactElement, useMemo } from 'react'
import Swiper from 'react-native-web-swiper'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { _ } from 'libs/i18n'
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
  name: string
  children: Array<ReactElement<AchievementCardKeyProps>> | ReactElement<AchievementCardKeyProps>
  skip?: () => void
}

export const GenericAchievement: FunctionComponent<Props> = (props: Props) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const swiperRef = React.useRef<Swiper>(null)
  const cards = useMemo(() => Children.toArray(props.children), [props.children])
  const lastIndex = cards.length - 1

  async function skip() {
    if (props.skip) {
      await props.skip()
    }
    if (swiperRef?.current) {
      const index = swiperRef.current.getActiveIndex()
      analytics.logHasSkippedTutorial(`${props.name}${index + 1}`)
    }
    navigate('TabNavigator')
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
                <ButtonTertiaryGreyDark title={_(t`Tout passer`)} onPress={skip} />
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
                    `${props.name}${index + 1}`,
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
