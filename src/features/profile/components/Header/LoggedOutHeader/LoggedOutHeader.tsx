import { t } from '@lingui/macro'
import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { StatusBar } from 'react-native'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { analytics } from 'libs/firebase/analytics'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Connect } from 'ui/svg/icons/Connect'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export function LoggedOutHeader() {
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBarStyle('dark-content', true)

      return () => StatusBar.setBarStyle('light-content', true)
    }, [])
  )

  return (
    <Container>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={6} />
      <HeaderContent>
        <Typo.Title4 {...getHeadingAttrs(1)}>{t`Profil`}</Typo.Title4>
        <Spacer.Column numberOfSpaces={7} />
        <Description>
          {t`Tu as entre 15 et 18 ans\u00a0? Crée-toi un compte pour bénéficier de ton crédit pass Culture`}
        </Description>
        <Spacer.Column numberOfSpaces={8} />
        <TouchableLink
          as={ButtonPrimary}
          testID="S'inscrire"
          wording={t`S'inscrire`}
          navigateTo={{ screen: 'SignupForm', params: { preventCancellation: true } }}
          onPress={() => {
            analytics.logProfilSignUp()
          }}
        />
        <Spacer.Column numberOfSpaces={5} />
        <Typo.Body>
          {t`Tu as déjà un compte\u00a0?` + '\u00a0'}
          <TouchableLink
            as={ButtonInsideText}
            navigateTo={{ screen: 'Login', params: { preventCancellation: true } }}
            wording={t`Connecte-toi`}
            icon={Connect}
            {...accessibilityAndTestId(t`Connecte-toi`)}
          />
        </Typo.Body>
        <Spacer.Column numberOfSpaces={7} />
      </HeaderContent>
    </Container>
  )
}

const Container = styled.View({
  overflow: 'hidden',
})

const HeaderContent = styled.View({
  alignItems: 'center',
  paddingHorizontal: getSpacing(5),
  width: '100%',
})

const Description = styled(Typo.Body)({
  textAlign: 'center',
})
