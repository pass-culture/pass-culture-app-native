import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/helpers/contactSupport'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { env } from 'libs/environment'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorUserError } from 'ui/svg/BicolorUserError'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export const SuspensionChoice = () => {
  const navigation = useNavigation<UseNavigationType>()
  const onPressContinue = () => navigation.navigate('SuspiciousLoginSuspendedAccount')

  return (
    <GenericInfoPageWhite
      headerGoBack
      titleComponent={Typo.Title3}
      title="Souhaites-tu suspendre ton compte pass&nbsp;Culture&nbsp;?"
      separateIconFromTitle={false}
      icon={BicolorUserError}>
      <Typo.ButtonText>Les conséquences&nbsp;:</Typo.ButtonText>
      <VerticalUl>
        <BulletListItem>
          <Typo.Body>
            tes réservations seront annulées sauf pour certains cas précisés dans les{SPACE}
            <ExternalTouchableLink
              as={StyledButtonInsideText}
              wording="conditions générales d’utilisation"
              icon={ExternalSiteFilled}
              externalNav={{ url: env.CGU_LINK }}
            />
          </Typo.Body>
        </BulletListItem>
        <BulletListItem text="si tu as un dossier en cours, tu ne pourras pas en déposer un nouveau." />
        <BulletListItem text="tu n’auras plus accès au catalogue." />
      </VerticalUl>
      <Spacer.Column numberOfSpaces={4} />
      <Typo.ButtonText>Les données qu’on conserve&nbsp;:</Typo.ButtonText>
      <Typo.Body>
        Nous gardons toutes les informations personnelles que tu nous as transmises lors de la
        vérification de ton identité.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={4} />
      <ButtonContainer>
        <ButtonPrimary wording="Oui, suspendre mon compte" onPress={onPressContinue} />
        <Spacer.Column numberOfSpaces={2} />
        <ExternalTouchableLink
          as={ButtonTertiaryBlack}
          wording="Contacter le support"
          accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
          icon={EmailFilled}
          externalNav={contactSupport.forGenericQuestion}
        />
      </ButtonContainer>
    </GenericInfoPageWhite>
  )
}

const ButtonContainer = styled.View({
  paddingBottom: getSpacing(10),
})

const StyledButtonInsideText = styled(ButtonInsideText).attrs(({ theme }) => ({
  buttonColor: theme.colors.black,
}))``
