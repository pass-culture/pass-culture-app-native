import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import LottieView from 'lottie-react-native'
import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import StarAnimation from 'ui/animations/tutorial_star.json'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Spacer } from 'ui/components/spacer/Spacer'
import { PlainArrowPrevious } from 'ui/svg/icons/PlainArrowPrevious'
import { getSpacing, Typo } from 'ui/theme'
import { useGrid } from 'ui/theme/grid'

export const SelectSchoolHome: React.FC = () => {
  const animation = useRef<LottieView>(null)
  const { navigate } = useNavigation<UseNavigationType>()
  const grid = useGrid()

  useEffect(() => {
    animation.current?.play?.(0, 62)
  }, [animation])

  return (
    <Container>
      <Spacer.Flex flex={1} />
      <StyledLottieContainer height={`${grid({ sm: 20, default: 30 }, 'height')}%`}>
        <StyledLottieView ref={animation} source={StarAnimation} loop={false} />
      </StyledLottieContainer>
      <Spacer.Flex flex={0.5} />
      <TitleContainer>{t`Fais-tu partie de la phase de test ?`}</TitleContainer>
      <BodyContainer>
        {t`Si tu es élève dans` + '\u00a0'}
        <Strong>{t`l'un des 21 établissements de test`}</Strong>
        {'\u00a0' +
          t`des académies de Rennes ou de Versailles, tu fais partie de la phase de test du pass Culture 15-17 ans.`}
        {'\n\n'}
        {t`Tu pourras ainsi nous aider à améliorer l’application.`}
      </BodyContainer>

      <ButtonsContainer>
        <ButtonSecondary
          onPress={() => navigate('SelectSchool')}
          title={t`Voir les établissements partenaires`}
        />

        <CustomButtonTertiaryBlack
          onPress={navigateToHome}
          title={t`Retourner à l'accueil`}
          icon={PlainArrowPrevious}
        />
      </ButtonsContainer>
      <Spacer.Flex flex={0.5} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  backgroundColor: theme.colors.white,
  flexDirection: 'column',
  alignSelf: 'center',
  padding: getSpacing(5),
  maxWidth: getSpacing(125),
  flex: 1,
}))

const TitleContainer = styled(Typo.Title1)({
  textAlign: 'center',
})

const BodyContainer = styled(Typo.Body)({
  textAlign: 'center',
  marginVertical: getSpacing(5),
})

const Strong = styled(Typo.Body)({
  fontWeight: 'bold',
})

type StyledLottieContainerProps = { height?: string }
const StyledLottieContainer = styled.View.attrs<{ height?: string }>(({ height }) => ({
  height: height ?? '30%',
}))<StyledLottieContainerProps>(({ height }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  height,
}))

const StyledLottieView = styled(LottieView)({
  width: '100%',
  height: '100%',
})

const CustomButtonTertiaryBlack = styled(ButtonTertiaryBlack)({
  marginTop: getSpacing(5),
})

const ButtonsContainer = styled.View({
  alignItems: 'center',
})
