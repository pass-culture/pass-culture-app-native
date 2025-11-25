import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { styled } from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { env } from 'libs/environment/env'
import { BulletListItem } from 'ui/components/BulletListItem'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { Form } from 'ui/components/Form'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { IdCardWithMagnifyingGlass as InitialIdCardWithMagnifyingGlass } from 'ui/svg/icons/IdCardWithMagnifyingGlass'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const BonificationRequiredInformation = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  return (
    <PageWithHeader
      title="Informations"
      scrollChildren={
        <Form.MaxWidth>
          <ViewGap gap={4}>
            <Container>
              <IdCardWithMagnifyingGlass />
            </Container>
            <StyledTitle3 {...getHeadingAttrs(2)}>
              Quelles sont les informations requises d’un de tes parents ou représentants
              légaux&nbsp;?
            </StyledTitle3>
            <Typo.Body>Munis-toi des informations suivantes pour faire ta demande&nbsp;:</Typo.Body>
            <VerticalUl>
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
            </VerticalUl>
          </ViewGap>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <ViewGap gap={3}>
          <Button
            fullWidth
            type="submit"
            wording="Commencer"
            isLoading={false}
            accessibilityLabel="Commencer la demande"
            onPress={() => navigate(...getSubscriptionHookConfig('BonificationNames'))}
          />
          <ExternalTouchableLink
            as={Button}
            variant="tertiary"
            color="neutral"
            wording="Consulter l’article d’aide"
            externalNav={{ url: env.FAQ_BONIFICATION }}
            icon={ExternalSiteFilled}
          />
          <StyledBodyXs>
            Toi ou tes représentants légaux pouvez en savoir plus sur cette collecte de données et
            vos droits (accès, opposition, rectification) en consultant {SPACE}
            <ExternalTouchableLink
              as={LinkInsideText}
              typography="BodyAccentXs"
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
