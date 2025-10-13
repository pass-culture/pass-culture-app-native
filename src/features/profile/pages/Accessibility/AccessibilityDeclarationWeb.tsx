import React from 'react'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/helpers/contactSupport'
import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { getProfilePropConfig } from 'features/navigation/ProfileStackNavigator/getProfilePropConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { BulletListItem } from 'ui/components/BulletListItem'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Spacer, Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK, SPACE } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const webappUrl = { url: WEBAPP_V2_URL }
const homeUrl = { url: `${WEBAPP_V2_URL}/accueil` }
const signupUrl = { url: `${WEBAPP_V2_URL}/creation-compte` }
const loginUrl = { url: `${WEBAPP_V2_URL}/connexion` }
const identityCheckUrl = { url: `${WEBAPP_V2_URL}/verification-identite` }
const profileUrl = { url: `${WEBAPP_V2_URL}/profil` }
const changePasswordUrl = { url: `${WEBAPP_V2_URL}/profil/modification-mot-de-passe` }
const searchUrl = { url: `${WEBAPP_V2_URL}/recherche` }
const filterUrl = { url: `${WEBAPP_V2_URL}/filtres` }
const searchResultsUrl = { url: `${WEBAPP_V2_URL}/recherche?view="Results"` }
const favoritesUrl = { url: `${WEBAPP_V2_URL}/favoris` }
const offerUrl = { url: `${WEBAPP_V2_URL}/offre/1916` }
const accessibilityUrl = { url: `${WEBAPP_V2_URL}/accessibilite/declaration` }
const rightsDefenderUrl = { url: 'https://formulaire.defenseurdesdroits.fr/' }
const rightsDelegateUrl = { url: 'https://www.defenseurdesdroits.fr/saisir/delegues' }

export function AccessibilityDeclarationWeb() {
  const { goBack } = useGoBack(...getProfileHookConfig('Accessibility'))
  return (
    <SecondaryPageWithBlurHeader
      onGoBack={goBack}
      title="Déclaration d’accessibilité web"
      enableMaxWidth={false}>
      <Typo.Body>
        Le pass Culture s’engage à rendre son site internet accessible conformément à l’article 47
        de la loi n° 2005-102 du 11 février 2005. À cette fin, il met en œuvre la stratégie et les
        actions suivantes&nbsp;:
      </Typo.Body>
      <StyledView>
        <VerticalUl>
          <BulletListItem
            groupLabel="Engagements"
            accessibilityRole={AccessibilityRole.BUTTON}
            index={0}
            total={3}>
            <Typo.BodyXs>
              <InternalTouchableLink
                as={LinkInsideText}
                wording="Schéma pluriannuel d’accessibilité 2022 - 2025"
                navigateTo={getProfilePropConfig('AccessibilityActionPlan')}
                accessibilityRole={AccessibilityRole.BUTTON}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem
            groupLabel="Engagements"
            accessibilityRole={AccessibilityRole.BUTTON}
            index={1}
            total={3}>
            <Typo.BodyXs>
              <InternalTouchableLink
                as={LinkInsideText}
                wording="Actions réalisées depuis 2022"
                navigateTo={getProfilePropConfig('AccessibilityActionPlan')}
                accessibilityRole={AccessibilityRole.BUTTON}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem
            groupLabel="Engagements"
            accessibilityRole={AccessibilityRole.BUTTON}
            index={2}
            total={3}>
            <Typo.BodyXs>
              <InternalTouchableLink
                as={LinkInsideText}
                wording="Plan d’actions 2024"
                navigateTo={getProfilePropConfig('AccessibilityActionPlan')}
                accessibilityRole={AccessibilityRole.BUTTON}
              />
            </Typo.BodyXs>
          </BulletListItem>
        </VerticalUl>
      </StyledView>
      <Typo.Body>
        Cette déclaration d’accessibilité s’applique au site internet{SPACE}
        <ExternalTouchableLink
          as={LinkInsideText}
          wording="https://passculture.app/"
          externalNav={webappUrl}
          accessibilityRole={AccessibilityRole.LINK}
        />
      </Typo.Body>
      <StyledSeparator />
      <ViewGap gap={6}>
        <TitleText>État de conformité</TitleText>
        <Typo.Body>
          Le site pass Culture est partiellement conforme avec le référentiel général d’amélioration
          de l’accessibilité.
        </Typo.Body>
        <SubtitleText>
          Résultats des tests
          {DOUBLE_LINE_BREAK}
          <Typo.Body>
            L’audit de conformité réalisé par la société Tanaguru révèle que&nbsp;:
          </Typo.Body>
        </SubtitleText>
      </ViewGap>
      <StyledView>
        <VerticalUl>
          <BulletListItem
            groupLabel="Résultats des tests"
            text="85&nbsp;% des critères RGAA version 4.1 sont respectés."
            index={0}
            total={2}
          />
          <BulletListItem
            groupLabel="Résultats des tests"
            text="Le taux moyen de conformité du service en ligne s’élève à 93&nbsp;%."
            index={1}
            total={2}
          />
        </VerticalUl>
        <StyledSeparator />
        <TitleText>Contenus non accessibles</TitleText>
      </StyledView>
      <ViewGap gap={6}>
        <Typo.Body>
          Les contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes.
        </Typo.Body>
        <SubtitleText>Non conformité</SubtitleText>
      </ViewGap>
      <StyledView>
        <VerticalUl>
          <BulletListItem
            groupLabel="Non conformité"
            text="Certains intitulés de lien ne sont pas pertinents."
            index={0}
            total={8}
          />
          <BulletListItem
            groupLabel="Non conformité"
            text="Le code source généré sur chaque page est invalide au regard de la spécification HTML5, la grande majorité des erreurs relevées concernent des imbrications de balises non conformes."
            index={1}
            total={8}
          />
          <BulletListItem
            groupLabel="Non conformité"
            text="En version mobile ou lors d’un zoom 200&nbsp;%, le menu de navigation n’est plus disponible sur plusieurs pages de l’application."
            index={2}
            total={8}
          />
          <BulletListItem
            groupLabel="Non conformité"
            text="Sur les pages de la recherche (recherche, résultats et filtres)&nbsp;:"
            nestedListTexts={[
              'Les sliders présents sont affichés uniquement via les feuilles de styles. Ils n’apparaissent donc plus sur la page lorsqu’on désactive le CSS.',
            ]}
            index={3}
            total={8}
          />
          <BulletListItem
            groupLabel="Non conformité"
            text="Sur la page des résultats de recherche&nbsp;:"
            nestedListTexts={[
              'La liste des filtres placée sous le champ de recherche est tronquée sur un écran de 320px de large.',
            ]}
            index={4}
            total={8}
          />
          <BulletListItem
            groupLabel="Non conformité"
            text="Au sein des modales affichant un calendrier (filtrer selon une date ou réserver une offre), le calendrier n’est pas compatible avec les technologies d’assistance en raison de rôles absents et/ou erronés ainsi qu’une navigation clavier qui n’est pas implémentée comme attendue."
            index={5}
            total={8}
          />
          <BulletListItem
            groupLabel="Non conformité"
            text="La modale d’information sur la géolocalisation n’est pas restituée comme telle."
            index={6}
            total={8}
          />
          <BulletListItem
            groupLabel="Non conformité"
            text="Sur la page de connexion et certaines pages du processus d’inscription, lorsque l’on oriente son écran en mode paysage, le défilement vertical ne fonctionne pas correctement et empêche ainsi l’accès a une partie du contenu de la page."
            index={7}
            total={8}
          />
        </VerticalUl>
      </StyledView>
      <SubtitleText>Dérogations pour charge disproportionnée</SubtitleText>
      <StyledView>
        <VerticalUl>
          <BulletListItem
            groupLabel="Dérogations"
            text="Le lecteur Youtube, utilisé pour diffuser les contenus vidéo."
            index={0}
            total={3}
          />
          <BulletListItem
            groupLabel="Dérogations"
            text="Le reCaptcha, utilisé lors de la connexion, le changement de mot de passe ou de la création du compte."
            index={1}
            total={3}
          />
          <BulletListItem
            groupLabel="Dérogations"
            text="La carte des lieux culturels, utilisée dans la recherche."
            index={2}
            total={3}
          />
        </VerticalUl>
      </StyledView>
      <SubtitleText>Contenus non soumis à l’obligation d’accessibilité</SubtitleText>
      <StyledView>
        <VerticalUl>
          <BulletListItem groupLabel="" index={0} total={1} text="Aucun" />
        </VerticalUl>
        <StyledSeparator />
        <TitleText>Établissement de cette déclaration d’accessibilité</TitleText>
      </StyledView>
      <ViewGap gap={6}>
        <Typo.BodyItalic>
          Cette déclaration a été établie le 29 novembre 2022. Elle a été mise à jour le 13 février
          2023.
        </Typo.BodyItalic>
        <SubtitleText>Technologies utilisées pour la réalisation du site pass Culture</SubtitleText>
      </ViewGap>
      <StyledView>
        <VerticalUl>
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
      </StyledView>
      <SubtitleText>
        Environnement de test
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Les vérifications de restitution de contenus ont été réalisées sur la base de la
          combinaison fournie par la base de référence du RGAA 4.1, avec les versions
          suivantes&nbsp;:
        </Typo.Body>
      </SubtitleText>
      <StyledView>
        <VerticalUl>
          <BulletListItem
            groupLabel="Technologies pour vérifier l’accesibilité"
            text="Firefox et NVDA"
            index={0}
            total={3}
          />
          <BulletListItem
            groupLabel="Technologies pour vérifier l’accesibilité"
            text="Chrome et NVDA"
            index={1}
            total={3}
          />
          <BulletListItem
            groupLabel="Technologies pour vérifier l’accesibilité"
            text="Safari et VoiceOver"
            index={2}
            total={3}
          />
        </VerticalUl>
      </StyledView>
      <SubtitleText>Les outils utilisés lors de l’évaluation</SubtitleText>
      <StyledView>
        <VerticalUl>
          <BulletListItem
            groupLabel="Les outils utilisés"
            text="Extension HeadingsMap"
            index={0}
            total={6}
          />
          <BulletListItem
            groupLabel="Les outils utilisés"
            text="Extension Web Developer"
            index={1}
            total={6}
          />
          <BulletListItem
            groupLabel="Les outils utilisés"
            text="Extension Stylus"
            index={2}
            total={6}
          />
          <BulletListItem
            groupLabel="Les outils utilisés"
            text="Validateur HTML W3C"
            index={3}
            total={6}
          />
          <BulletListItem
            groupLabel="Les outils utilisés"
            text="Tanaguru Contrast-Finder"
            index={4}
            total={6}
          />
          <BulletListItem
            groupLabel="Les outils utilisés"
            text="Outils de développement (navigateur)"
            index={5}
            total={6}
          />
        </VerticalUl>
      </StyledView>
      <SubtitleText>Pages du site ayant fait l’objet de la vérification de conformité</SubtitleText>
      <StyledView>
        <VerticalUl>
          <BulletListItem groupLabel="Pages auditées" index={0} total={12}>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={LinkInsideText}
                wording="Accueil"
                externalNav={homeUrl}
                accessibilityRole={AccessibilityRole.LINK}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem groupLabel="Pages auditées" index={1} total={12}>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={LinkInsideText}
                wording="Connexion"
                externalNav={loginUrl}
                accessibilityRole={AccessibilityRole.LINK}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem groupLabel="Pages auditées" index={2} total={12}>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={LinkInsideText}
                wording="Inscription - Date de naissance"
                externalNav={signupUrl}
                accessibilityRole={AccessibilityRole.LINK}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem groupLabel="Pages auditées" index={3} total={12}>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={LinkInsideText}
                wording="Vérification d’identité"
                externalNav={identityCheckUrl}
                accessibilityRole={AccessibilityRole.LINK}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem groupLabel="Pages auditées" index={4} total={12}>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={LinkInsideText}
                wording="Profil"
                externalNav={profileUrl}
                accessibilityRole={AccessibilityRole.LINK}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem groupLabel="Pages auditées" index={5} total={12}>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={LinkInsideText}
                wording="Modification de mot de passe"
                externalNav={changePasswordUrl}
                accessibilityRole={AccessibilityRole.LINK}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem groupLabel="Pages auditées" index={6} total={12}>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={LinkInsideText}
                wording="Recherche"
                externalNav={searchUrl}
                accessibilityRole={AccessibilityRole.LINK}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem groupLabel="Pages auditées" index={7} total={12}>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={LinkInsideText}
                wording="Filtres"
                externalNav={filterUrl}
                accessibilityRole={AccessibilityRole.LINK}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem groupLabel="Pages auditées" index={8} total={12}>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={LinkInsideText}
                wording="Résultats de recherche"
                externalNav={searchResultsUrl}
                accessibilityRole={AccessibilityRole.LINK}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem groupLabel="Pages auditées" index={9} total={12}>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={LinkInsideText}
                wording="Favoris"
                externalNav={favoritesUrl}
                accessibilityRole={AccessibilityRole.LINK}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem groupLabel="Pages auditées" index={10} total={12}>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={LinkInsideText}
                wording="Détails d’une offre"
                externalNav={offerUrl}
                accessibilityRole={AccessibilityRole.LINK}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem groupLabel="Pages auditées" index={11} total={12}>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={LinkInsideText}
                wording="Déclaration d’accessibilité"
                externalNav={accessibilityUrl}
                accessibilityRole={AccessibilityRole.LINK}
              />
            </Typo.BodyXs>
          </BulletListItem>
        </VerticalUl>
      </StyledView>
      <StyledSeparator />
      <TitleText>
        Retour d’information et contact
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le
          responsable de l’application pour être orienté vers une alternative accessible ou obtenir
          le contenu sous une autre forme.
        </Typo.Body>
      </TitleText>

      <Typo.Body>
        Contacter l’équipe support à l’adresse{SPACE}
        <ExternalTouchableLink
          as={LinkInsideText}
          wording="support@passculture.app"
          accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
          justifyContent="flex-start"
          externalNav={contactSupport.forGenericQuestion}
          accessibilityRole={AccessibilityRole.LINK}
        />
      </Typo.Body>

      <StyledSeparator />

      <ViewGap gap={6}>
        <TitleText>Voie de recours</TitleText>
        <Typo.Body>
          Cette procédure est à utiliser dans le cas suivant&nbsp;:
          {DOUBLE_LINE_BREAK}
          Vous avez signalé au responsable du site internet un défaut d’accessibilité qui vous
          empêche d’accéder à un contenu ou à un des services du portail et vous n’avez pas obtenu
          de réponse satisfaisante.
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

const StyledView = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xl,
}))
