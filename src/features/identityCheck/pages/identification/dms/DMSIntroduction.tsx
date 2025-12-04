import { useRoute } from '@react-navigation/native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { InformationWithIcon } from 'ui/components/InformationWithIcon'
import { Li } from 'ui/components/Li'
import { VerticalUl } from 'ui/components/Ul'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Clock } from 'ui/svg/icons/Clock'
import { Confirmation } from 'ui/svg/icons/Confirmation'
import { IdCard } from 'ui/svg/icons/IdCard'
import { Profile } from 'ui/svg/icons/Profile'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { LogoDMS } from 'ui/svg/LogoDMS'
import { getSpacing, Typo } from 'ui/theme'

export const DMSIntroduction = (): React.JSX.Element => {
  const { params } = useRoute<UseRouteType<'DMSIntroduction'>>()

  const timeLabel = '10 minutes de ton temps'
  const IDLabel = params?.isForeignDMSInformation
    ? 'Ta carte d’identité, ton passeport ou un titre séjour français en cours de validité'
    : 'Ta pièce d’identité française en cours de validité'
  const selfieLabel = 'Un selfie avec ta pièce d’identité'
  const homeProofLabel = 'Un justificatif de domicile'

  const informationListItem: { icon: FC<AccessibleIcon>; label: string }[] =
    params?.isForeignDMSInformation
      ? [
          { icon: Clock, label: timeLabel },
          { icon: IdCard, label: IDLabel },
          { icon: Confirmation, label: homeProofLabel },
          { icon: Profile, label: selfieLabel },
        ]
      : [
          { icon: Clock, label: timeLabel },
          { icon: IdCard, label: IDLabel },
          { icon: Profile, label: selfieLabel },
        ]

  const toDMSWebsiteButtonProps = params?.isForeignDMSInformation
    ? {
        externalNav: { url: env.DMS_FOREIGN_CITIZEN_URL },
        onBeforeNavigate: analytics.logOpenDMSForeignCitizenURL,
      }
    : {
        externalNav: { url: env.DMS_FRENCH_CITIZEN_URL },
        onBeforeNavigate: analytics.logOpenDMSFrenchCitizenURL,
      }

  return (
    <GenericInfoPage
      withGoBack
      illustration={StyledLogoDMS}
      title="Identifie-toi sur le site demarche.numerique.gouv.fr"
      buttonPrimary={{
        wording: 'Aller sur le site',
        accessibilityLabel: 'Aller sur le site de demarche.numerique.gouv.fr',
        ...toDMSWebsiteButtonProps,
      }}>
      <Container>
        <StyledBody>Pour t’identifier tu vas avoir besoin de&nbsp;: </StyledBody>
        <VerticalUl>
          {informationListItem.map((informationItem) => (
            <StyledLi key={informationItem.label}>
              <InformationWithIcon Icon={informationItem.icon} text={informationItem.label} />
            </StyledLi>
          ))}
        </VerticalUl>
        <Typo.BodyAccentXs>
          Le traitement de ton dossier peut prendre jusqu’à 5 jours.
        </Typo.BodyAccentXs>
      </Container>
    </GenericInfoPage>
  )
}
const Container = styled.View({
  alignItems: 'start',
  alignSelf: 'center',
})

const StyledLi = styled(Li)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))
const StyledBody = styled(Typo.Body)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.l,
}))

const StyledLogoDMS = () => {
  return <LogoDMS width={getSpacing(60)} />
}
