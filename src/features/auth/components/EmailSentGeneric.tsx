import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { OpenInboxButton } from 'features/auth/components/OpenInboxButton'
import { useIsMailAppAvailable } from 'features/auth/helpers/useIsMailAppAvailable'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalTouchableLinkProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { EmailSent } from 'ui/svg/icons/EmailSent'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  title: string
  email: string
  consultFaq: ExternalTouchableLinkProps['externalNav']
  additionalCTA?: React.ReactNode
  consultFaqAnalytics?: () => Promise<void>
  openInBoxAnalytics?: () => Promise<void>
}

export const EmailSentGeneric: FunctionComponent<Props> = ({
  title,
  email,
  consultFaq,
  additionalCTA,
  consultFaqAnalytics,
  openInBoxAnalytics,
}) => {
  const isMailAppAvailable = useIsMailAppAvailable()

  return (
    <ViewGap gap={4}>
      <IllustrationContainer>
        <StyledEmailSent />
      </IllustrationContainer>
      <Typo.Title3 {...getHeadingAttrs(2)}>{title}</Typo.Title3>
      <Typo.Body>Tu as reçu un lien à l’adresse&nbsp;:</Typo.Body>
      <Typo.Body>{email}</Typo.Body>
      <Typo.Body>L’e-mail peut prendre quelques minutes pour arriver.</Typo.Body>
      <Separator.Horizontal />
      <Typo.Body>Tu n‘as pas reçu de lien&nbsp;? Tu peux&nbsp;:</Typo.Body>
      <ExternalTouchableLink
        as={ButtonTertiaryBlack}
        wording="Consulter notre centre d’aide"
        externalNav={consultFaq}
        onBeforeNavigate={consultFaqAnalytics}
        icon={ExternalSiteFilled}
        justifyContent="flex-start"
      />
      <StyledView marginBottom={additionalCTA ? getSpacing(2) : getSpacing(6)}>
        {additionalCTA}
      </StyledView>
      {isMailAppAvailable ? <OpenInboxButton onAdditionalPress={openInBoxAnalytics} /> : null}
    </ViewGap>
  )
}

const IllustrationContainer = styled.View(() => ({
  alignItems: 'center',
  width: '100%',
}))

const StyledView = styled.View<{ marginBottom?: number }>(({ marginBottom }) => ({
  marginBottom,
}))

const StyledEmailSent = styled(EmailSent).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``
