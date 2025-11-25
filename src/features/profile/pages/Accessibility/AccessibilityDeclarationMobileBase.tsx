import React from 'react'
import styled from 'styled-components/native'

import { getProfileHookConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfileHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { BulletListItem } from 'ui/components/BulletListItem'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  appVersion: string
  platformName: string
  storeLink: { url: string }
  auditDate: string
  conformityEN: string
  conformityRAAM: string
  averageConformityRAAM: string
  nonAccessibleContent: string[]
  osVersion: string
  toolsUsed: string[]
}

const rightsDefenderUrl = { url: 'https://formulaire.defenseurdesdroits.fr/' }
const rightsDelegateUrl = { url: 'https://www.defenseurdesdroits.fr/saisir/delegues' }

export function AccessibilityDeclarationMobileBase({
  appVersion,
  platformName,
  storeLink,
  auditDate,
  conformityEN,
  conformityRAAM,
  averageConformityRAAM,
  nonAccessibleContent,
  osVersion,
  toolsUsed,
}: Props) {
  const { goBack } = useGoBack(...getProfileHookConfig('Accessibility'))

  return (
    <SecondaryPageWithBlurHeader
      onGoBack={goBack}
      title={`Déclaration d’accessibilité - ${platformName}`}
      enableMaxWidth={false}>
      <ViewGap gap={6}>
        <Typo.Body>
          Le pass Culture s’engage à rendre ses applications mobiles accessibles conformément à
          l’article 47 de la loi n° 2005-102 du 11 février 2005.
        </Typo.Body>
        <Typo.Body>
          La présente déclaration d’accessibilité s’applique à{SPACE}
          <ExternalTouchableLink
            as={LinkInsideText}
            wording={`l’application ${platformName}`}
            externalNav={storeLink}
            accessibilityRole={AccessibilityRole.LINK}
          />
          {SPACE}version {appVersion} du pass Culture.
        </Typo.Body>
      </ViewGap>

      <StyledSeparator />

      <ViewGap gap={6}>
        <TitleText>État de conformité</TitleText>
        <Typo.Body>
          L’application pass Culture sur {platformName} est{SPACE}
          <Typo.BodyAccent>partiellement conforme</Typo.BodyAccent>
          {SPACE}
          avec la norme européenne EN 301 549 v.3.2.1, la norme de référence en vigueur en France et
          en Europe, en raison des non-conformités énumérées dans la section «&nbsp;Résultats des
          tests&nbsp;».
        </Typo.Body>
      </ViewGap>

      <StyledSeparator />

      <ViewGap gap={6}>
        <TitleText>Résultats des tests</TitleText>
        <Typo.Body>
          L’audit de conformité réalisé le {auditDate} par la société Access42 révèle que
          l’application est conforme à <Typo.BodyAccent>{conformityRAAM}</Typo.BodyAccent> au
          Référentiel d’Accessibilité des Applications Mobiles (RAAM 1.1). Le taux de conformité
          moyen des pages est de <Typo.BodyAccent>{averageConformityRAAM}</Typo.BodyAccent>.
        </Typo.Body>
        <Typo.Body>
          L’application est conforme à <Typo.BodyAccent>{conformityEN}</Typo.BodyAccent> à la norme
          européenne EN 301 549 v.3.2.1.
        </Typo.Body>
      </ViewGap>

      <StyledSeparator />

      <ViewGap gap={6}>
        <TitleText>Contenus inaccessibles</TitleText>
        <Typo.Body>
          Les contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes.
        </Typo.Body>
        <SubtitleText>Non conformité</SubtitleText>
        <VerticalUl>
          {nonAccessibleContent.map((item, index) => (
            <BulletListItem
              key={item}
              text={item}
              index={index}
              total={nonAccessibleContent.length}
              groupLabel="Non conformité"
            />
          ))}
        </VerticalUl>

        <SubtitleText>Dérogations pour charge disproportionnée</SubtitleText>
        <Typo.Body>Aucune</Typo.Body>

        <SubtitleText>Contenus non soumis à l’obligation d’accessibilité</SubtitleText>
        <Typo.Body>
          Les contenus suivants n’entrent pas dans le calcul de la conformité ni dans le périmètre
          des éléments à rendre accessible, ils sont dérogés&nbsp;:
        </Typo.Body>
        <VerticalUl>
          <BulletListItem
            text="Les cartes Goggle Maps (motif&nbsp;: service externe)"
            groupLabel="Contenus non soumis à l’obligation d’accessibilité"
            index={0}
            total={2}
          />
          <BulletListItem
            text="La vérification d’identité (webview d’un prestataire externe)"
            groupLabel="Contenus non soumis à l’obligation d’accessibilité"
            index={1}
            total={2}
          />
        </VerticalUl>
      </ViewGap>

      <StyledSeparator />

      <ViewGap gap={6}>
        <TitleText>Établissement de cette déclaration d’accessibilité</TitleText>
        <Typo.BodyItalic>Cette déclaration a été établie le lundi 8 décembre 2025.</Typo.BodyItalic>
        <SubtitleText>Technologies utilisées pour la réalisation de l’application</SubtitleText>
        <VerticalUl>
          <BulletListItem
            text="react"
            groupLabel="Technologies utilisées pour l’application"
            index={0}
            total={3}
          />
          <BulletListItem
            text="react-native"
            groupLabel="Technologies utilisées pour l’application"
            index={1}
            total={3}
          />
          <BulletListItem
            text="react-native-web"
            groupLabel="Technologies utilisées pour l’application"
            index={2}
            total={3}
          />
        </VerticalUl>
        <SubtitleText>
          Agents utilisateurs, technologies d’assistance et outils utilisés pour vérifier
          l’accessibilité
        </SubtitleText>
        <VerticalUl>
          {toolsUsed.map((item, index) => (
            <BulletListItem
              key={item}
              text={item}
              groupLabel="Technologies pour vérifier l’accesibilité"
              index={index}
              total={toolsUsed.length}
            />
          ))}
        </VerticalUl>
        <Typo.Body>
          L’audit a été réalisé avec la version de système d’exploitation {platformName}&nbsp;:
          version {osVersion}
        </Typo.Body>
      </ViewGap>

      <StyledSeparator />

      <ViewGap gap={6}>
        <TitleText>Retour d’information et contact</TitleText>
        <Typo.Body>
          Il est important de rappeler qu’en vertu de l’article 11 de la loi de février 2005&nbsp;:
          {SPACE}
          <Typo.BodyItalic>
            «&nbsp;la personne handicapée a droit à la compensation des conséquences de son
            handicap, quels que soient l’origine et la nature de sa déficience, son âge ou son mode
            de vie.&nbsp;»
          </Typo.BodyItalic>
        </Typo.Body>
        <Typo.Body>
          Le pass Culture s’engage à prendre les moyens nécessaires afin de donner accès, dans un
          délai raisonnable, aux informations et fonctionnalités recherchées par la personne
          handicapée, que le contenu fasse l’objet d’une dérogation ou non.
        </Typo.Body>
        <Typo.Body>
          Le pass Culture invite les personnes qui rencontreraient des difficultés à la contacter
          afin qu’une assistance puisse être apportée&nbsp;:{SPACE}
          <ExternalTouchableLink
            as={LinkInsideText}
            wording="contacter le support"
            externalNav={{ url: env.SUPPORT_ACCOUNT_ISSUES_FORM }}
            accessibilityRole={AccessibilityRole.LINK}
            justifyContent="flex-start"
            onBeforeNavigate={() => analytics.logHasClickedContactForm('AccessibilityDeclaration')}
          />
        </Typo.Body>
      </ViewGap>

      <StyledSeparator />

      <ViewGap gap={6}>
        <TitleText>Voie de recours</TitleText>
        <Typo.Body>
          Si vous constatez un défaut d’accessibilité vous empêchant d’accéder à un contenu ou une
          fonctionnalité de l’application, que vous nous le signalez et que vous ne parvenez pas à
          obtenir une réponse de notre part, vous êtes en droit de faire parvenir vos doléances ou
          une demande de saisine au Défenseur des droits.
        </Typo.Body>
        <ViewGap gap={3}>
          <Typo.Body>
            Écrire un message au{SPACE}
            <ExternalTouchableLink
              as={LinkInsideText}
              wording="Défenseur des droits"
              externalNav={rightsDefenderUrl}
              accessibilityRole={AccessibilityRole.LINK}
            />
          </Typo.Body>
          <Typo.Body>
            Contacter le délégué du{SPACE}
            <ExternalTouchableLink
              as={LinkInsideText}
              wording="Défenseur des droits dans votre région"
              externalNav={rightsDelegateUrl}
              accessibilityRole={AccessibilityRole.LINK}
            />
          </Typo.Body>
          <Typo.Body>
            Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) Défenseur des droits
            Libre réponse 71120 75342 Paris CEDEX 07
          </Typo.Body>
        </ViewGap>
      </ViewGap>
      <Spacer.BottomScreen />
    </SecondaryPageWithBlurHeader>
  )
}

const TitleText = styled(Typo.Title4).attrs(getHeadingAttrs(2))``

const SubtitleText = styled(Typo.BodyAccent).attrs(getHeadingAttrs(3))``

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xl,
}))
