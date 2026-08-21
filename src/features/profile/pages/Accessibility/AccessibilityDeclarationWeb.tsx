import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { getTabPropConfig } from 'features/navigation/TabBar/getTabPropConfig'
import { AccessibilityFeatures } from 'features/profile/components/AccessibilityFeatures/AccessibilityFeatures'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { env } from 'libs/environment/env'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { BulletListItem } from 'ui/components/BulletListItem'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Link } from 'ui/designSystem/Link/Link'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Spacer, Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'
import { setTextSemantic } from 'ui/theme/typographyAttrs/setTextSemantic'

const appVersion = '1.395.0'
const auditDate = '22 juillet 2026'
const conformityRGAA = '65,45%'
const nonAccessibleContent = [
  '[1.3 - RGAA] L’alternative textuelle d’une image porteuse d’information au moins n’est pas pertinente.',
  '[3.1 - RGAA] Une information au moins est véhiculée uniquement par la couleur.',
  '[6.1 - RGAA] Un lien au moins a un intitulé qui n’est pas pertinent.',
  '[7.1 - RGAA] Une fonctionnalité JavaScript au moins n’est pas compatible avec les technologies d’assistance ou fait un usage inapproprié de propriétés ARIA.',
  '[7.3 - RGAA] Une fonctionnalité JavaScript au moins n’est pas contrôlable par le clavier ou tout autre dispositif de pointage.',
  '[7.4 - RGAA] Un changement de contexte au moins se déclenche sans que l’utilisateur en soit informé.',
  '[7.5 - RGAA] Un message de statut au moins n’est pas restitué par les technologies d’assistance.',
  '[8.6 - RGAA] Un titre de page au moins n’est pas pertinent.',
  '[8.9 - RGAA] Une balise au moins est utilisée à des fins de présentation (par exemple des paragraphes vides et/ou des textes non structurés dans des balises de paragraphes).',
  '[9.1 - RGAA] La hiérarchie des titres d’une page au moins n’est pas pertinente.',
  '[9.2 - RGAA] La structure du document d’une page au moins n’est pas cohérente.',
  '[9.3 - RGAA] Une liste au moins n’est pas correctement structurée.',
  '[10.1 - RGAA] Un élément HTML de présentation au moins (balise ou attribut) est utilisé.',
  '[10.3 - RGAA] Un contenu au moins ne se présente pas dans un ordre logique dans le code source.',
  '[10.7 - RGAA] Une indication visuelle de prise de focus au moins n’est pas visible ou suffisamment contrastée.',
  '[10.11 - RGAA] Un contenu au moins ne peut être présenté sans défilement horizontal et/ou présente des pertes d’informations lorsque le texte est agrandi à 400%.',
  '[11.5 - RGAA] Un ensemble de champs de même nature au moins ne sont pas regroupés.',
  '[11.6 - RGAA] Un regroupement de champs de formulaires au moins n’a pas de légende.',
  '[13.10 - RGAA] Une fonctionnalité au moins, utilisable au moyen d’un geste complexe, n’a pas d’alternative au moyen d’un geste simple.',
  '[14.1 - RAWeb] La documentation du site web ne décrit pas les fonctionnalités d’accessibilité disponibles et/ou les informations relatives à la compatibilité avec l’accessibilité.',
]

// Ajouter les focus sur les liens
// Changer le titre de la page
// Mettre à jour le nouveau document de suivi d’accessibilité

const webappUrl = { url: WEBAPP_V2_URL }
const rightsDefenderUrl = { url: 'https://formulaire.defenseurdesdroits.fr/' }
const rightsDelegateUrl = { url: 'https://www.defenseurdesdroits.fr/saisir/delegues' }

const isWeb = Platform.OS === 'web'

export const AccessibilityDeclarationWeb = () => {
  const { goBack } = useNavigation<UseNavigationType>()

  return (
    <PageWithHeader
      onGoBack={goBack}
      title="Déclaration d’accessibilité web"
      scrollChildren={
        <React.Fragment>
          <ViewGap gap={6}>
            <Typo.Body>
              Le pass Culture s’engage à rendre son site internet accessible conformément à
              l’article 47 de la loi n° 2005-102 du 11 février 2005. À cette fin, il met en œuvre la
              stratégie et les actions suivantes&nbsp;:
            </Typo.Body>

            <Typo.Body>
              Cette déclaration d’accessibilité s’applique au site internet&nbsp;
              {isWeb ? (
                <InternalTouchableLink
                  as={Link}
                  isInsideText
                  variant="tertiary"
                  wording="https://passculture.app/"
                  accessibilityRole={AccessibilityRole.LINK}
                  navigateTo={getTabPropConfig('Home')}
                />
              ) : (
                <ExternalTouchableLink
                  as={Link}
                  isInsideText
                  isExternal
                  wording="https://passculture.app/ mobile"
                  externalNav={webappUrl}
                  accessibilityRole={AccessibilityRole.LINK}
                />
              )}
              .
            </Typo.Body>

            <Separator.Horizontal />

            <TitleText>État de conformité</TitleText>

            <Typo.Body>
              La version <Typo.Button>{appVersion}</Typo.Button> de l’application web pass Culture
              est non conforme avec la{' '}
              <ExternalTouchableLink
                as={Link}
                isExternal
                isInsideText
                wording="norme européenne 301 549 (v3.2.1)"
                externalNav={{
                  url: 'https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf',
                }}
                accessibilityRole={AccessibilityRole.LINK}
              />
              .
            </Typo.Body>

            <Typo.Body>
              La méthodologie d’audit se base sur le Référentiel d’Évaluation de l’Accessibilité Web
              (RAWeb 1.1), seule méthode opérationnelle publiée à ce jour pour vérifier l’ensemble
              des critères de la norme européenne.
            </Typo.Body>

            <Typo.Body>
              L’application web pass Culture est partiellement conforme avec le{SPACE}
              <ExternalTouchableLink
                as={Link}
                isExternal
                isInsideText
                wording="RAWeb version 1.1"
                externalNav={{ url: 'https://accessibilite.public.lu/fr/raweb1.1/index.html' }}
                accessibilityRole={AccessibilityRole.LINK}
              />
              {SPACE}et{SPACE}
              <ExternalTouchableLink
                as={Link}
                isExternal
                isInsideText
                wording="Le RGAA version 4.1"
                externalNav={{
                  url: 'https://www.numerique.gouv.fr/publications/rgaa-accessibilite/',
                }}
                accessibilityRole={AccessibilityRole.LINK}
              />
              , en raison des non-conformités énumérées dans la section «&nbsp;Résultats des
              tests&nbsp;».
            </Typo.Body>

            <SubtitleText>Résultats des tests</SubtitleText>

            <Typo.Body>
              L’audit de conformité réalisé par la société Access42 révèle que le site est{SPACE}
              <Typo.Button>conforme à {conformityRGAA} au RGAA version 4.1</Typo.Button>.
            </Typo.Body>

            <Separator.Horizontal />

            <TitleText>Contenus inaccessibles</TitleText>

            <Typo.Body>
              Les contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes.
            </Typo.Body>

            <SubtitleText>Non conformité</SubtitleText>

            <VerticalUl gap={6}>
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

            <Typo.Body>Pas de dérogation identifiée</Typo.Body>

            <SubtitleText>Contenus non soumis à l’obligation d’accessibilité</SubtitleText>

            <Typo.Body>Pas d’exemption identifiée</Typo.Body>

            <Separator.Horizontal />

            <AccessibilityFeatures />

            <Separator.Horizontal />

            <TitleText>Établissement de cette déclaration d’accessibilité</TitleText>

            <Typo.BodyItalic>Cette déclaration a été établie le {auditDate}.</Typo.BodyItalic>

            <SubtitleText>
              Technologies utilisées pour la réalisation du site pass Culture
            </SubtitleText>

            <VerticalUl gap={6}>
              <BulletListItem
                groupLabel="Technologies utilisées pour le site"
                text="HTML5"
                index={0}
                total={3}
              />
              <BulletListItem
                groupLabel="Technologies utilisées pour le site"
                text="CSS"
                index={1}
                total={3}
              />
              <BulletListItem
                groupLabel="Technologies utilisées pour le site"
                text="JavaScript"
                index={2}
                total={3}
              />
            </VerticalUl>

            <SubtitleText>
              Agents utilisateurs, technologies d’assistance et outils utilisés pour vérifier
              l’accessibilité
            </SubtitleText>

            <Typo.Body>
              Les tests des pages web ont été effectués avec les combinaisons de navigateurs web et
              lecteurs d’écran suivants&nbsp;:
            </Typo.Body>

            <VerticalUl gap={6}>
              <BulletListItem
                groupLabel="Technologies pour vérifier l’accesibilité"
                text="Firefox 152 et NVDA 2025"
                index={0}
                total={5}
              />
              <BulletListItem
                groupLabel="Technologies pour vérifier l’accesibilité"
                text="Firefox 152 et JAWS 2025"
                index={1}
                total={5}
              />
              <BulletListItem
                groupLabel="Technologies pour vérifier l’accesibilité"
                text="Safari 26.5 et VoiceOver (macOS 26.5)"
                index={2}
                total={5}
              />
              <BulletListItem
                groupLabel="Technologies pour vérifier l’accesibilité"
                text="Safari 26.5 et VoiceOver (iOS 26.5)"
                index={3}
                total={5}
              />
              <BulletListItem
                groupLabel="Technologies pour vérifier l’accesibilité"
                text="Chrome 146 et TalkBack (Android 16)"
                index={4}
                total={5}
              />
            </VerticalUl>

            <Typo.Body>
              La vérification de l’accessibilité est le résultat de tests manuels, assistés par des
              outils (feuilles CSS dédiés, extensions HeadingsMaps et WebDeveloper Toolbar, Color
              Contrast Analyser).
            </Typo.Body>

            <SubtitleText>
              Pages du site ayant fait l’objet de la vérification de conformité
            </SubtitleText>

            <VerticalUl gap={6}>
              <BulletListItem
                groupLabel="Pages auditées"
                text="Création de compte (6 écrans)"
                index={0}
                total={13}
              />
              <BulletListItem
                groupLabel="Pages auditées"
                text="Authentification"
                index={1}
                total={13}
              />
              <BulletListItem
                groupLabel="Pages auditées"
                text="Accessibilité"
                index={2}
                total={13}
              />
              <BulletListItem
                groupLabel="Pages auditées"
                text="Plan du site"
                index={3}
                total={13}
              />
              <BulletListItem
                groupLabel="Pages auditées"
                text="Profil (connecté et déconnecté)"
                index={4}
                total={13}
              />
              <BulletListItem groupLabel="Pages auditées" text="Apparence" index={5} total={13} />
              <BulletListItem
                groupLabel="Pages auditées"
                text="Mentions légales"
                index={6}
                total={13}
              />
              <BulletListItem groupLabel="Pages auditées" text="Recherche" index={7} total={13} />
              <BulletListItem
                groupLabel="Pages auditées"
                text="Recherche - catégorie cinéma"
                index={8}
                total={13}
              />
              <BulletListItem
                groupLabel="Pages auditées"
                text="Réservation d’une offre (3 écrans)"
                index={9}
                total={13}
              />
              <BulletListItem groupLabel="Pages auditées" text="Accueil" index={10} total={13} />
              <BulletListItem groupLabel="Pages auditées" text="Lieu" index={11} total={13} />
              <BulletListItem
                groupLabel="Pages auditées"
                text="Déblocage du crédit - Profil"
                index={12}
                total={13}
              />
            </VerticalUl>

            <Separator.Horizontal />

            <TitleText>Retour d’information et contact</TitleText>

            <Typo.Body>
              Il est important de rappeler qu’en vertu de l’article 11 de la loi de février
              2005&nbsp;:
            </Typo.Body>

            <Typo.BodyItalic>
              «&nbsp;la personne handicapée a droit à la compensation des conséquences de son
              handicap, quels que soient l’origine et la nature de sa déficience, son âge ou son
              mode de vie.&nbsp;»
            </Typo.BodyItalic>

            <Typo.Body>
              pass Culture s’engage à prendre les moyens nécessaires afin de donner accès, dans un
              délai raisonnable, aux informations et fonctionnalités recherchées par la personne
              handicapée, que le contenu fasse l’objet d’une dérogation ou non.
            </Typo.Body>

            <Typo.Body>
              pass Culture invite les personnes qui rencontreraient des difficultés à{SPACE}
              <ExternalTouchableLink
                as={Link}
                isInsideText
                isExternal
                wording="contacter le support"
                externalNav={{ url: env.SUPPORT_ACCOUNT_ISSUES_FORM }}
                accessibilityRole={AccessibilityRole.LINK}
                onBeforeNavigate={() =>
                  analytics.logHasClickedContactForm('AccessibilityDeclaration')
                }
              />
              {SPACE}
              afin qu’une assistance puisse être apportée (alternative accessible, information et
              contenu donnés sous une autre forme).
            </Typo.Body>

            <Separator.Horizontal />

            <TitleText>Voie de recours</TitleText>

            <Typo.Body>
              Si vous constatez un défaut d’accessibilité vous empêchant d’accéder à un contenu ou
              une fonctionnalité du site, que vous nous le signalez et que vous ne parvenez pas à
              obtenir une réponse de notre part, vous êtes en droit de faire parvenir vos doléances
              ou une demande de saisine au Défenseur des droits.
            </Typo.Body>

            <Typo.Body>Plusieurs moyens sont à votre disposition&nbsp;:</Typo.Body>

            <VerticalUl gap={6}>
              <BulletListItem
                groupLabel="Moyens de recours"
                text="Écrire un message au "
                index={0}
                total={3}>
                <ExternalTouchableLink
                  as={Link}
                  isInsideText
                  isExternal
                  wording="Défenseur des droits"
                  externalNav={rightsDefenderUrl}
                  accessibilityRole={AccessibilityRole.LINK}
                />
              </BulletListItem>
              <BulletListItem
                groupLabel="Moyens de recours"
                text="Contacter le délégué du "
                index={1}
                total={3}>
                <ExternalTouchableLink
                  as={Link}
                  isExternal
                  isInsideText
                  wording="Défenseur des droits dans votre région"
                  externalNav={rightsDelegateUrl}
                  accessibilityRole={AccessibilityRole.LINK}
                />
              </BulletListItem>
              <BulletListItem
                groupLabel="Moyens de recours"
                text="Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) Défenseur des droits Libre réponse 71120 75342 Paris CEDEX 07"
                index={2}
                total={3}
              />
            </VerticalUl>
          </ViewGap>
          <Spacer.BottomScreen />
        </React.Fragment>
      }
    />
  )
}

const TitleText = styled(Typo.Title4).attrs(setTextSemantic('h2'))``

const SubtitleText = styled(Typo.BodyAccent).attrs(setTextSemantic('h3'))``
