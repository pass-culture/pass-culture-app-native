import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { OpenInboxButton } from 'features/auth/components/OpenInboxButton'
import { useIsMailAppAvailable } from 'features/auth/helpers/useIsMailAppAvailable'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalTouchableLinkProps } from 'ui/components/touchableLink/types'
import { BicolorEmailSent } from 'ui/svg/icons/BicolorEmailSent'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, TypoDS } from 'ui/theme'
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
    <React.Fragment>
      <IllustrationContainer>
        <BicolorEmailSent />
      </IllustrationContainer>
      <Spacer.Column numberOfSpaces={4} />
      <TypoDS.Title3 {...getHeadingAttrs(2)}>{title}</TypoDS.Title3>
      <Spacer.Column numberOfSpaces={4} />
      <TypoDS.Body>Tu as reçu un lien à l’adresse&nbsp;:</TypoDS.Body>
      <TypoDS.Body>{email}</TypoDS.Body>
      <Spacer.Column numberOfSpaces={4} />
      <TypoDS.Body>L’e-mail peut prendre quelques minutes pour arriver.</TypoDS.Body>
      <Spacer.Column numberOfSpaces={4} />
      <Separator.Horizontal />
      <Spacer.Column numberOfSpaces={4} />
      <TypoDS.Body>Tu n‘as pas reçu de lien&nbsp;? Tu peux&nbsp;:</TypoDS.Body>
      <Spacer.Column numberOfSpaces={4} />
      <ExternalTouchableLink
        as={ButtonTertiaryBlack}
        wording="Consulter notre centre d’aide"
        externalNav={consultFaq}
        onBeforeNavigate={consultFaqAnalytics}
        icon={ExternalSiteFilled}
        justifyContent="flex-start"
      />
      {additionalCTA}
      <Spacer.Column numberOfSpaces={additionalCTA ? 6 : 10} />
      {isMailAppAvailable ? <OpenInboxButton onAdditionalPress={openInBoxAnalytics} /> : null}
    </React.Fragment>
  )
}

const IllustrationContainer = styled.View(() => ({
  alignItems: 'center',
  width: '100%',
}))
