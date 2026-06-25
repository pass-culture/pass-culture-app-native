import { useNavigation, useRoute } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import { styled } from 'styled-components/native'

import { BonificationType } from 'features/bonification/enums'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { env } from 'libs/environment/env'
import { BulletListItem } from 'ui/components/BulletListItem'
import { Form } from 'ui/components/Form'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Link } from 'ui/designSystem/Link/Link'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { IdCardWithMagnifyingGlass as InitialIdCardWithMagnifyingGlass } from 'ui/svg/icons/IdCardWithMagnifyingGlass'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const BonificationRequiredInformation = () => {
  const { params } = useRoute<UseRouteType<'BonificationRequiredInformation'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const isDisabilityBonification = params?.bonificationType === BonificationType.DISABILITY

  const title = isDisabilityBonification
    ? 'Nous avons besoins de quelques informations supplémentaires'
    : 'Quelles sont les informations requises d’un de tes parents ou représentants légaux\u00a0?'

  const subtitle = isDisabilityBonification
    ? 'Afin de finaliser ta demande, nous t’invitons à te munir des informations suivantes\u00a0:'
    : 'Munis-toi des informations suivantes pour faire ta demande\u00a0:'

  const dataPrivacyText = isDisabilityBonification
    ? `Tu peux en savoir plus sur la collecte de données et tes droits (accès, opposition, rectification) en consultant `
    : `Toi ou tes représentants légaux pouvez en savoir plus sur cette collecte de données et vos droits (accès, opposition, rectification) en consultant `

  const onPressFamilyQuotient = () => navigate(...getSubscriptionHookConfig('BonificationNames'))
  const onPressDisability = () =>
    navigate(
      ...getSubscriptionHookConfig('BonificationBirthPlace', {
        bonificationType: BonificationType.DISABILITY,
      })
    )

  const onPress = isDisabilityBonification ? onPressDisability : onPressFamilyQuotient

  return (
    <PageWithHeader
      title="Informations"
      shouldDisplayBottomGradient
      scrollChildren={
        <Form.MaxWidth>
          <ViewGap gap={4}>
            <Container>
              <IdCardWithMagnifyingGlass />
            </Container>
            <StyledTitle3 {...getHeadingAttrs(2)}>{title}</StyledTitle3>
            <Typo.Body>{subtitle}</Typo.Body>
            <VerticalUl>
              {isDisabilityBonification ? (
                <React.Fragment>
                  <BulletListItem groupLabel="Informations demandées" index={0} total={2}>
                    <Typo.BodyAccent>Pays de naissance</Typo.BodyAccent>
                  </BulletListItem>
                  <BulletListItem groupLabel="Informations demandées" index={1} total={2}>
                    <View>
                      <Typo.BodyAccent>Ville de naissance</Typo.BodyAccent>
                      <Typo.BodyS>Si tu es né en France</Typo.BodyS>
                    </View>
                  </BulletListItem>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <BulletListItem groupLabel="Informations demandées" index={0} total={5}>
                    <Typo.BodyAccent>Nom de naissance</Typo.BodyAccent>
                  </BulletListItem>
                  <BulletListItem groupLabel="Informations demandées" index={1} total={5}>
                    <Typo.BodyAccent>Prénom(s)</Typo.BodyAccent>
                  </BulletListItem>
                  <BulletListItem groupLabel="Informations demandées" index={2} total={5}>
                    <Typo.BodyAccent>Nom d’usage</Typo.BodyAccent>
                  </BulletListItem>
                  <BulletListItem groupLabel="Informations demandées" index={3} total={5}>
                    <Typo.BodyAccent>Date de naissance</Typo.BodyAccent>
                  </BulletListItem>
                  <BulletListItem groupLabel="Informations demandées" index={4} total={5}>
                    <Typo.BodyAccent>Lieu de naissance</Typo.BodyAccent>
                  </BulletListItem>
                </React.Fragment>
              )}
            </VerticalUl>
          </ViewGap>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ViewGap gap={4}>
          <Button
            fullWidth
            type="submit"
            wording="Commencer"
            isLoading={false}
            accessibilityLabel="Commencer la demande"
            onPress={onPress}
          />
          <ExternalTouchableLink
            as={Button}
            variant="tertiary"
            color="neutral"
            wording="Consulter l’article d’aide"
            externalNav={{ url: env.FAQ_BONIFICATION_LEGAL_GUARDIAN_BIRTH_INFORMATIONS }}
            icon={ExternalSiteFilled}
          />
          <StyledBodyXs>
            {dataPrivacyText}
            <ExternalTouchableLink
              as={Link}
              isInsideText
              size="extraSmall"
              wording="notre charte dédiée"
              externalNav={{ url: env.DATA_PRIVACY_CHART_LINK }}
              accessibilityRole={AccessibilityRole.LINK}
            />
            .
          </StyledBodyXs>
        </ViewGap>
      }
    />
  )
}

const IdCardWithMagnifyingGlass = styled(InitialIdCardWithMagnifyingGlass).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``

const Container = styled.View({
  alignItems: 'center',
})

const StyledBodyXs = styled(Typo.BodyXs)({
  textAlign: 'center',
})

const StyledTitle3 = styled(Typo.Title3)({
  textAlign: 'center',
})
