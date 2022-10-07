import { useRoute } from '@react-navigation/native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { UseRouteType } from 'features/navigation/RootNavigator'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InformationWithIcon } from 'ui/components/InformationWithIcon'
import { Li } from 'ui/components/Li'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorClock } from 'ui/svg/icons/BicolorClock'
import { BicolorConfirmation } from 'ui/svg/icons/BicolorConfirmation'
import { BicolorIdCard } from 'ui/svg/icons/BicolorIdCard'
import { BicolorProfile } from 'ui/svg/icons/BicolorProfile'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { BicolorIconInterface } from 'ui/svg/icons/types'
import { LogoDMS } from 'ui/svg/LogoDMS'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const DMSIntroduction = (): JSX.Element => {
  const { params } = useRoute<UseRouteType<'DMSIntroduction'>>()

  const timeLabel = '10 minutes de ton temps'
  const IDLabel = params?.isForeignDMSInformation
    ? 'Ta carte d’identité, ton passeport ou un titre séjour français en cours de validité'
    : 'Ta pièce d’identité française en cours de validité'
  const selfieLabel = 'Un selfie avec ta pièce d’identité'
  const homeProofLabel = 'Un justificatif de domicile'

  const informationListItem: { icon: FC<BicolorIconInterface>; label: string }[] =
    params?.isForeignDMSInformation
      ? [
          { icon: BicolorClock, label: timeLabel },
          { icon: BicolorIdCard, label: IDLabel },
          { icon: BicolorConfirmation, label: homeProofLabel },
          { icon: BicolorProfile, label: selfieLabel },
        ]
      : [
          { icon: BicolorClock, label: timeLabel },
          { icon: BicolorIdCard, label: IDLabel },
          { icon: BicolorProfile, label: selfieLabel },
        ]

  return (
    <GenericInfoPageWhite
      icon={LogoDMS}
      titleComponent={Typo.Title2}
      title="Identifie-toi sur le site demarches-simplifiees.fr"
      separateIconFromTitle={false}
      headerGoBack
      fullWidth
      mobileBottomFlex={0.5}>
      <StyledBody>Pour t’identifier tu vas avoir besoin de&nbsp;: </StyledBody>
      <VerticalUl>
        {informationListItem.map((informationItem, index) => (
          <Li key={index}>
            <InformationWithIcon Icon={informationItem.icon} text={informationItem.label} />
            <Spacer.Column numberOfSpaces={4.5} />
          </Li>
        ))}
      </VerticalUl>
      <StyledCaption>Le traitement de ton dossier peut prendre jusqu’à 5 jours.</StyledCaption>
      <Spacer.Flex flex={1} />
      <LinkContainer>
        <TouchableLink
          wording="Aller sur demarches-simplifiees.fr"
          icon={ExternalSite}
          as={ButtonPrimary}
          // TODO(PC-17774) navigate to DMS external url
          navigateTo={navigateToHomeConfig}
        />
      </LinkContainer>
    </GenericInfoPageWhite>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
  marginBottom: getSpacing(5),
})

const StyledCaption = styled(Typo.Caption)({
  textAlign: 'center',
})

const LinkContainer = styled.View({
  alignItems: 'center',
})
