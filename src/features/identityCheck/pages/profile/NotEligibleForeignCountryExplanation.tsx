import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { SadFace } from 'ui/svg/icons/SadFace'
import { Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

export const NotEligibleForeignCountryExplanation = () => {
  const mainText = `Le crédit est réservé aux résidents français, et ce n’est pas ton cas pour l’instant. Tu peux continuer à profiter de tout le reste de l’application.${LINE_BREAK}${LINE_BREAK} Si tu reviens vivre en France, mets à jour tes informations depuis ta page profil pour demander ton crédit.`

  const { designSystem } = useTheme()
  return (
    <PageWithHeader
      shouldLimitWidth
      title="Informations"
      scrollChildren={
        <Container>
          <IconContainer>
            <SadFace size={200} color={designSystem.color.icon.brandPrimary} />
          </IconContainer>
          <TextContainer gap={4}>
            <StyledTitle
              {...setTextSemantic('h1')}>{`Tu n’es pas éligible pour le moment`}</StyledTitle>
            <MainText {...setTextSemantic('h2')}>{mainText}</MainText>
          </TextContainer>
        </Container>
      }
      fixedBottomChildren={
        <Button
          wording="Revenir au catalogue"
          onPress={navigateToHome}
          variant="secondary"
          color="brand"
          fullWidth
        />
      }
    />
  )
}

const Container = styled.View(({ theme }) => ({
  width: '100%',
  paddingVertical: theme.contentPage.marginVertical,
}))

const IconContainer = styled.View(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const StyledTitle = styled(Typo.Title2)({
  textAlign: 'center',
})

const MainText = styled(Typo.Body)({
  textAlign: 'center',
})

const TextContainer = styled(ViewGap)({
  alignItems: 'center',
})
