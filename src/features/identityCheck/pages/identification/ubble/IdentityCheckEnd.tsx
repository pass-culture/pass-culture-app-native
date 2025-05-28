import React, { FC, useEffect } from 'react'
import styled from 'styled-components/native'

import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { getPrimaryIllustration } from 'shared/illustrations/getPrimaryIllustration'
import { Page } from 'ui/pages/Page'
import { EmailSent } from 'ui/svg/icons/EmailSent'
import { Spacer, Typo, getSpacing } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const IdentityCheckEnd: FC = () => {
  const Illustration = getPrimaryIllustration(EmailSent)

  const { data: subscription } = useGetStepperInfoQuery()

  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const saveStep = useSaveStep()

  const navigateToStepper = async () => {
    await saveStep(IdentityCheckStep.IDENTIFICATION)
    navigateForwardToStepper()
  }

  useEffect(() => {
    const timeout = setTimeout(
      subscription?.nextSubscriptionStep ? navigateToStepper : navigateToHome,
      3000
    )
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription?.nextSubscriptionStep])

  return (
    <Page>
      <Container>
        <Spacer.Flex flex={1} />
        <IllustrationContainer>{Illustration ? <Illustration /> : null}</IllustrationContainer>
        <TextContainer>
          <StyledTitle2 {...getHeadingAttrs(1)}>
            Ta pièce d’identité a bien été transmise&nbsp;!
          </StyledTitle2>
        </TextContainer>
        <Spacer.Flex flex={1} />
      </Container>
    </Page>
  )
}

const Container = styled.View<{ top: number; bottom: number }>(({ theme }) => ({
  flex: 1,
  justifyContent: 'space-between',
  paddingHorizontal: theme.contentPage.marginHorizontal,
  paddingVertical: theme.contentPage.marginVertical,
  overflow: 'scroll',
}))

const IllustrationContainer = styled.View<{ animation: boolean }>(({ animation }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: getSpacing(6),
  ...(animation && { height: '30%' }),
}))

const TextContainer = styled.View({
  alignItems: 'center',
  marginBottom: getSpacing(6),
})

const StyledTitle2 = styled(Typo.Title2)({
  textAlign: 'center',
})
