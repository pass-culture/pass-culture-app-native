import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { RecreditType } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useNavigateToHomeWithReset } from 'features/navigation/helpers/useNavigateToHomeWithReset'
import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { storage } from 'libs/storage'
import { useResetRecreditAmountToShowMutation } from 'queries/profile/useResetRecreditAmountToShowMutation'
import { useBonificationBonusAmount, usePacificFrancToEuroRate } from 'queries/settings/useSettings'
import { formatCurrencyFromCents } from 'shared/currency/formatCurrencyFromCents'
import { useGetCurrencyToDisplay } from 'shared/currency/useGetCurrencyToDisplay'
import { getAge } from 'shared/user/getAge'
import BirthdayCake from 'ui/animations/onboarding_birthday_cake.json'
import { AnimatedProgressBar } from 'ui/components/bars/AnimatedProgressBar'
import { showErrorSnackBar } from 'ui/designSystem/Snackbar/snackBar.store'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { categoriesIcons } from 'ui/svg/icons/exports/categoriesIcons'
import { Typo } from 'ui/theme'
import { getNoHeadingAttrs } from 'ui/theme/typographyAttrs/getNoHeadingAttrs'

export const RecreditBirthdayNotification = () => {
  const { replace } = useNavigation<UseNavigationType>()
  const { navigateToHomeWithReset } = useNavigateToHomeWithReset()
  const { user } = useAuthContext()
  const theme = useTheme()

  const age = getAge(user?.birthDate)
  const currency = useGetCurrencyToDisplay()
  const { data: euroToPacificFrancRate } = usePacificFrancToEuroRate()
  const { data: bonificationBonusAmount } = useBonificationBonusAmount()

  const hasAlsoBonusRecreditToShow = user?.recreditTypeToShow === RecreditType.BonusCredit
  const bonifAmountToShow = hasAlsoBonusRecreditToShow ? bonificationBonusAmount : 0

  const formattedAmountToShow = user?.recreditAmountToShow
    ? formatCurrencyFromCents(
        user?.recreditAmountToShow - bonifAmountToShow,
        currency,
        euroToPacificFrancRate
      )
    : undefined

  const recreditMessage =
    age && formattedAmountToShow
      ? `Pour tes ${age} ans, ${formattedAmountToShow} ont été ajoutés à ton compte.`
      : undefined

  const { mutate: resetRecreditAmountToShow, isPending: isResetRecreditAmountToShowLoading } =
    useResetRecreditAmountToShowMutation({
      onSuccess: () => navigateToHomeWithReset(),
      onError: () => showErrorSnackBar('Une erreur est survenue'),
    })

  useEffect(() => {
    storage.saveObject('has_seen_birthday_notification_card', true)
  }, [])

  return (
    <GenericInfoPage
      animation={BirthdayCake}
      animationColoringMode="targeted"
      animationTargetShapeNames={['Fond 1', 'Gradient Fill 1']}
      title="Bonne nouvelle&nbsp;!"
      subtitle={recreditMessage}
      buttonPrimary={{
        wording: 'Continuer',
        onPress: () => {
          if (hasAlsoBonusRecreditToShow) {
            replace('BonificationGranted')
          } else resetRecreditAmountToShow()
        },
        isLoading: isResetRecreditAmountToShowLoading,
      }}>
      <React.Fragment>
        <ProgressBarContainer>
          <AnimatedProgressBar
            progress={1}
            color={theme.designSystem.color.background.brandPrimary}
            icon={categoriesIcons.Show}
            isAnimated
          />
          <Amount>{formattedAmountToShow}</Amount>
        </ProgressBarContainer>
        <StyledBody>
          Tu as jusqu’à la veille de tes 21 ans pour utiliser tout ton crédit.
        </StyledBody>
      </React.Fragment>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.designSystem.size.spacing.l,
}))

const ProgressBarContainer = styled.View(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.xxxl,
}))

const Amount = styled(Typo.Title2).attrs(getNoHeadingAttrs())(({ theme }) => ({
  textAlign: 'center',
  color: theme.designSystem.color.text.brandPrimary,
}))
