import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { navigateToHomeConfig } from 'features/navigation/helpers'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { GenericInfoPageWhite } from 'ui/pages/GenericInfoPageWhite'
import { BicolorIdCardError } from 'ui/svg/icons/BicolorIdCardError'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

export const ExpiredOrLostID = (): JSX.Element => {
  return (
    <GenericInfoPageWhite
      icon={StyledBicolorIdCardError}
      titleComponent={Typo.Title2}
      title="Ta pièce d’identité expirée ou perdue"
      separateIconFromTitle={false}
      headerGoBack>
      <StyledBody>
        Pour profiter du pass Culture tu as besoin de ta carte d’identité ou de ton passeport en
        cours de validité.
      </StyledBody>
      <Spacer.Column numberOfSpaces={1} />
      <StyledBody>Une pièce d’identité expirée ne prouve plus ta nationalité française.</StyledBody>
      <Spacer.Column numberOfSpaces={1} />
      <StyledBody>Tu peux faire une demande de renouvellement sur le site ants.gouv.fr.</StyledBody>
      <Spacer.Flex flex={1} />
      <View>
        <TouchableLink
          as={ButtonPrimary}
          navigateTo={navigateToHomeConfig}
          wording="M’identifier plus tard"
        />
        <Spacer.Column numberOfSpaces={5} />
        <TouchableLink
          as={ButtonTertiaryBlack}
          wording="Demander un renouvellement"
          // TODO(PC-16840) navigate to external site
          navigateTo={navigateToHomeConfig}
          icon={ExternalSiteFilled}
        />
      </View>
    </GenericInfoPageWhite>
  )
}

const StyledBicolorIdCardError = styled(BicolorIdCardError).attrs(({ theme }) => ({
  size: theme.illustrations.sizes.fullPage,
  color: theme.colors.secondary,
  color2: theme.colors.primary,
}))``

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
  marginBottom: getSpacing(5),
})
