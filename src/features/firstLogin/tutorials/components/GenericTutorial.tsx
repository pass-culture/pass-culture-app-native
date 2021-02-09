import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { cloneElement, FunctionComponent, ReactElement, useRef } from 'react'
import Swiper from 'react-native-web-swiper'
import styled from 'styled-components/native'

import { DotComponent } from 'features/firstLogin/tutorials/components/DotComponent'
import { CardKey } from 'features/firstLogin/tutorials/components/GenericCard'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { analytics } from 'libs/analytics'
import { _ } from 'libs/i18n'
import { storage } from 'libs/storage'
import { ButtonTertiaryGreyDark } from 'ui/components/buttons/ButtonTertiaryGreyDark'
import { Background } from 'ui/svg/Background'
import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

const controlProps = {
  DotComponent: DotComponent,
  dotsTouchable: true,
  prevPos: false,
  nextPos: false,
}

export type Props = {
  name: string
  children: Array<ReactElement<CardKey>>
}

export const GenericTutorial: FunctionComponent<Props> = (props: Props) => {
  const { navigate } = useNavigation<UseNavigationType>()
  const swiperRef = useRef<Swiper>(null)

  function goToHomeWithoutModal() {
    storage.saveObject('has_seen_tutorials', true)
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
        <ScreenUsableArea>
          <SkipButton>
            <HorizontalPaddingContainer>
              <ButtonTertiaryGreyDark title={_(t`Tout passer`)} onPress={goToHomeWithoutModal} />
            </HorizontalPaddingContainer>
          </SkipButton>
          <SwiperContainer>
            <Swiper
              ref={swiperRef}
              controlsProps={controlProps}
              slideWrapperStyle={slideWrapperStyle}>
              {props.children.map((card, index: number) =>
                cloneElement(card, {
                  key: index,
                  swiperRef: swiperRef,
                  name: `${props.name}${index + 1}`,
                })
              )}
            </Swiper>
          </SwiperContainer>
          <Spacer.Column numberOfSpaces={getSpacing(2)} />
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
  paddingTop: getSpacing(5),
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
