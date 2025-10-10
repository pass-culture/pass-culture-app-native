/* eslint-disable no-console */
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { styled } from 'styled-components/native'

import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'
import { env } from 'libs/environment/env'
import { InfoBanner } from 'ui/components/banners/InfoBanner'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Form } from 'ui/components/Form'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { IdCardWithMagnifyingGlass as InitialIdCardWithMagnifyingGlass } from 'ui/svg/icons/IdCardWithMagnifyingGlass'
import { Info } from 'ui/svg/icons/Info'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const BonificationIntroduction = () => {
  const { navigate } = useNavigation<StackNavigationProp<SubscriptionStackParamList>>()

  return (
    <PageWithHeader
      title="Informations Personnelles"
      scrollChildren={
        <Form.MaxWidth>
          <ViewGap gap={4}>
            <Container>
              <IdCardWithMagnifyingGlass />
            </Container>
            <Typo.Title3 {...getHeadingAttrs(2)}>
              On a besoin d’infos sur ton parent ou tuteur
            </Typo.Title3>
            <Typo.Body>
              Pour demander ton allocation, tu dois remplir quelques infos sur ton parent, ton
              tuteur légal ou l’organisme qui te prend en charge.
            </Typo.Body>
            <Typo.Body>On va te demander&nbsp;:</Typo.Body>
            <VerticalUl>
              <BulletListItem groupLabel="Informations demandées" index={0} total={5}>
                <Typo.BodyAccent>Nom de naissance (avant mariage)</Typo.BodyAccent>
              </BulletListItem>
              <BulletListItem groupLabel="Informations demandées" index={1} total={5}>
                <Typo.BodyAccent>Prénom complet</Typo.BodyAccent>
              </BulletListItem>
              <BulletListItem groupLabel="Informations demandées" index={2} total={5}>
                <Typo.BodyAccent>Nom d’usage</Typo.BodyAccent>
              </BulletListItem>
              <BulletListItem groupLabel="Informations demandées" index={3} total={5}>
                <Typo.BodyAccent>Date de naissance</Typo.BodyAccent>
              </BulletListItem>
              <BulletListItem groupLabel="Informations demandées" index={4} total={5}>
                <Typo.BodyAccent>Ville de naissance</Typo.BodyAccent>
              </BulletListItem>
            </VerticalUl>
            <Typo.Body>
              Ces infos nous servirons à vérifier si tu es éligible à l’allocation.
            </Typo.Body>
            <InfoBanner
              icon={Info}
              message="Il se peut que tu ne sois pas éligible et que ta demande soit refusée."
            />
          </ViewGap>
        </Form.MaxWidth>
      }
      fixedBottomChildren={
        <React.Fragment>
          <ButtonPrimary
            wording="Commencer"
            isLoading={false}
            type="submit"
            accessibilityLabel="Commencer la demande"
            onPress={() => {
              navigate('BonificationNames')
            }}
          />
          <ExternalTouchableLink
            as={ButtonTertiaryBlack}
            wording="Consulter l’article d’aide"
            externalNav={{ url: env.FAQ_LINK }}
            onBeforeNavigate={() => {
              // ANALYTICS?
              console.log('KO')
            }}
            icon={ExternalSiteFilled}
          />
        </React.Fragment>
      }
    />
  )
}

const IdCardWithMagnifyingGlass = styled(InitialIdCardWithMagnifyingGlass).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
  size: theme.illustrations.sizes.fullPage,
}))``

const Container = styled.View({ alignItems: 'center' })
