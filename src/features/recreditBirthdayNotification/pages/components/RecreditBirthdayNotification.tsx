import { t } from '@lingui/macro'
import LottieView from 'lottie-react-native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { useDepositAmount } from 'features/auth/api'
import { useUserProfileInfo } from 'features/home/api'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { storage } from 'libs/storage'
import TutorialPassLogo from 'ui/animations/eighteen_birthday.json'
import { ProgressBar } from 'ui/components/bars/ProgressBar'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Spacer } from 'ui/components/spacer/Spacer'
import CategoryIcon from 'ui/svg/icons/categories/bicolor'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { useGrid } from 'ui/theme/grid'

export const RecreditBirthdayNotification = () => {
  const { data: user } = useUserProfileInfo()
  const depositAmount = useDepositAmount()
  const age = user?.dateOfBirth
    ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()
    : undefined
  const grid = useGrid()
  const animationRef = React.useRef<LottieView>(null)
  const amount = 30 //TODO: get the real amount

  useEffect(() => {
    storage.saveObject('has_seen_birthday_notification_card', true)
    analytics.logScreenView('BirthdayNotification')
  }, [])

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play(0, 62)
    }
  }, [animationRef])

  return (
    <Container>
      <Spacer.Flex flex={grid({ sm: 0.2, default: 0.5 }, 'height')} />
      <StyledLottieContainer height={`${grid({ sm: 20, default: 30 }, 'height')}%`}>
        <StyledLottieView ref={animationRef} source={TutorialPassLogo} loop={false} />
      </StyledLottieContainer>
      <Spacer.Flex flex={grid({ sm: 0.1, default: 0.5 }, 'height')} />
      <StyledTitle>{t`Bonne nouvelle !`}</StyledTitle>
      <StyledSubTitle>{t({ id: `Tu as {age} ans...`, values: { age } })}</StyledSubTitle>
      <Spacer.Flex flex={grid({ sm: 0.1, default: 0.5 }, 'height')} />
      <StyledBody>
        {t({
          id: 'birthday notification text',
          values: { amount, age },
          message: `Pour tes {age} ans, le Gouvernement vient d'ajouter {amount} euros à ton crédit. 
          Tu disposes maintenant de :`,
        })}
      </StyledBody>

      <ProgressBarContainer>
        <ProgressBar
          progress={1}
          color={ColorsEnum.BRAND}
          icon={CategoryIcon.Spectacles}
          isAnimated
        />
        <Amount color={ColorsEnum.BRAND}>{depositAmount}</Amount>
      </ProgressBarContainer>

      <StyledFooterText>
        {t`Tu as jusqu’à la veille de tes 18 ans pour
          profiter de ton budget.`}
      </StyledFooterText>
      <Spacer.Flex flex={grid({ sm: 0.5, default: 0.2 }, 'height')} />
      <ButtonContainer>
        <ButtonPrimary title={t`Continuer`} onPress={navigateToHome} />
      </ButtonContainer>
      <Spacer.Flex flex={grid({ sm: 0.2, default: 0.5 }, 'height')} />
    </Container>
  )
}

type StyledLottieContainerProps = { height: string }
const StyledLottieContainer = styled.View.attrs<StyledLottieContainerProps>(({ height }) => ({
  height: height ?? '30%',
}))<StyledLottieContainerProps>(({ height }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  height,
}))

const Container = styled.View({
  flex: 1,
  paddingHorizontal: getSpacing(5),
  maxWidth: getSpacing(125),
  alignSelf: 'center',
})

const StyledLottieView = styled(LottieView)({
  flexGrow: 1,
  width: '100%',
  height: '100%',
})

const StyledTitle = styled(Typo.Title1)({
  textAlign: 'center',
})

const StyledSubTitle = styled(Typo.Title2)({
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
  fontSize: getSpacing(5),
  lineHeight: getSpacing(7),
  fontFamily: 'Montserrat-Medium',
})

const StyledFooterText = styled(Typo.Body)({
  textAlign: 'center',
  fontSize: getSpacing(3),
  fontFamily: 'Montserrat-Regular',
  marginTop: getSpacing(2),
})

const ProgressBarContainer = styled.View({
  flexDirection: 'column',
  paddingHorizontal: getSpacing(10),
  marginTop: getSpacing(2),
})

const Amount = styled(Typo.Title2)({
  textAlign: 'center',
})

const ButtonContainer = styled.View({
  alignItems: 'center',
})
