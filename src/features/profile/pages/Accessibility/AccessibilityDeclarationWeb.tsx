import React from 'react'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/helpers/contactSupport'
import { getProfileNavConfig } from 'features/navigation/ProfileStackNavigator/getProfileNavConfig'
import { WEBAPP_V2_URL } from 'libs/environment/useWebAppUrl'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { getSpacing, Spacer, Typo } from 'ui/theme'
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
  return (
    <SecondaryPageWithBlurHeader title="Déclaration d’accessibilité web" enableMaxWidth={false}>
      <Typo.Body>
        Le pass Culture s’engage à rendre son site internet accessible conformément à l’article 47
        de la loi n° 2005-102 du 11 février 2005. À cette fin, il met en œuvre la stratégie et les
        actions suivantes&nbsp;:
      </Typo.Body>
      <StyledView>
        <VerticalUl>
          <BulletListItem>
            <Typo.BodyXs>
              <InternalTouchableLink
                as={ButtonInsideText}
                wording="Schéma pluriannuel d’accessibilité 2022 - 2025"
                icon={PlainArrowNext}
                navigateTo={getProfileNavConfig('AccessibilityActionPlan')}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem>
            <Typo.BodyXs>
              <InternalTouchableLink
                as={ButtonInsideText}
                wording="Actions réalisées depuis 2022"
                icon={PlainArrowNext}
                navigateTo={getProfileNavConfig('AccessibilityActionPlan')}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem>
            <Typo.BodyXs>
              <InternalTouchableLink
                as={ButtonInsideText}
                wording="Plan d’actions 2024"
                icon={PlainArrowNext}
                navigateTo={getProfileNavConfig('AccessibilityActionPlan')}
              />
            </Typo.BodyXs>
          </BulletListItem>
        </VerticalUl>
      </StyledView>
      <Typo.Body>
        Cette déclaration d’accessibilité s’applique au site internet{SPACE}
        <ExternalTouchableLink
          as={ButtonInsideText}
          wording="https://passculture.app/"
          icon={ExternalSiteFilled}
          externalNav={webappUrl}
        />
      </Typo.Body>
      <StyledSeparator />
      <ViewGap gap={6}>
        <TitleText>État de conformité</TitleText>
        <Typo.Body>
          Le site pass Culture est partiellement conforme avec le référentiel général d’amélioration
          de l’accessibilité.
        </Typo.Body>
        <Typo.BodyAccent>
          Résultats des tests
          {DOUBLE_LINE_BREAK}
          <Typo.Body>
            L’audit de conformité réalisé par la société Tanaguru révèle que&nbsp;:
          </Typo.Body>
        </Typo.BodyAccent>
      </ViewGap>
      <StyledView>
        <VerticalUl>
          <BulletListItem text="85&nbsp;% des critères RGAA version 4.1 sont respectés." />
          <BulletListItem text="Le taux moyen de conformité du service en ligne s’élève à 93&nbsp;%." />
        </VerticalUl>
        <StyledSeparator />
        <TitleText>Contenus non accessibles</TitleText>
      </StyledView>
      <ViewGap gap={6}>
        <Typo.Body>
          Les contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes.
        </Typo.Body>
        <Typo.BodyAccent>Non conformité</Typo.BodyAccent>
      </ViewGap>
      <StyledView>
        <VerticalUl>
          <BulletListItem text="Certains intitulés de lien ne sont pas pertinents." />
          <BulletListItem text="Le code source généré sur chaque page est invalide au regard de la spécification HTML5, la grande majorité des erreurs relevées concernent des imbrications de balises non conformes." />
          <BulletListItem text="En version mobile ou lors d’un zoom 200&nbsp;%, le menu de navigation n’est plus disponible sur plusieurs pages de l’application." />
          <BulletListItem
            text="Sur les pages de la recherche (recherche, résultats et filtres)&nbsp;:"
            nestedListTexts={[
              'Les sliders présents sont affichés uniquement via les feuilles de styles. Ils n’apparaissent donc plus sur la page lorsqu’on désactive le CSS.',
            ]}
          />
          <BulletListItem
            text="Sur la page des résultats de recherche&nbsp;:"
            nestedListTexts={[
              'La liste des filtres placée sous le champ de recherche est tronquée sur un écran de 320px de large.',
            ]}
          />
          <BulletListItem text="Au sein des modales affichant un calendrier (filtrer selon une date ou réserver une offre), le calendrier n’est pas compatible avec les technologies d’assistance en raison de rôles absents et/ou erronés ainsi qu’une navigation clavier qui n’est pas implémentée comme attendue." />
          <BulletListItem text="La modale d’information sur la géolocalisation n’est pas restituée comme telle." />
          <BulletListItem text="Sur la page de connexion et certaines pages du processus d’inscription, lorsque l’on oriente son écran en mode paysage, le défilement vertical ne fonctionne pas correctement et empêche ainsi l’accès a une partie du contenu de la page." />
        </VerticalUl>
      </StyledView>
      <Typo.BodyAccent>Dérogations pour charge disproportionnée</Typo.BodyAccent>
      <StyledView>
        <VerticalUl>
          <BulletListItem text="Le lecteur Youtube, utilisé pour diffuser les contenus vidéo." />
          <BulletListItem text="Le reCaptcha, utilisé lors de la connexion, le changement de mot de passe ou de la création du compte." />
          <BulletListItem text="La carte des lieux culturels, utilisée dans la recherche." />
        </VerticalUl>
      </StyledView>
      <Typo.BodyAccent>Contenus non soumis à l’obligation d’accessibilité</Typo.BodyAccent>
      <StyledView>
        <VerticalUl>
          <BulletListItem text="Aucun" />
        </VerticalUl>
        <StyledSeparator />
        <TitleText>Établissement de cette déclaration d’accessibilité</TitleText>
      </StyledView>
      <ViewGap gap={6}>
        <Typo.BodyItalic>
          Cette déclaration a été établie le 29 novembre 2022. Elle a été mise à jour le 13 février
          2023.
        </Typo.BodyItalic>
        <Typo.BodyAccent>
          Technologies utilisées pour la réalisation du site pass Culture
        </Typo.BodyAccent>
      </ViewGap>
      <StyledView>
        <VerticalUl>
          <BulletListItem text="HTML5" />
          <BulletListItem text="CSS" />
          <BulletListItem text="JavaScript" />
        </VerticalUl>
      </StyledView>
      <Typo.BodyAccent>
        Environnement de test
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Les vérifications de restitution de contenus ont été réalisées sur la base de la
          combinaison fournie par la base de référence du RGAA 4.1, avec les versions
          suivantes&nbsp;:
        </Typo.Body>
      </Typo.BodyAccent>
      <StyledView>
        <VerticalUl>
          <BulletListItem text="Firefox et NVDA" />
          <BulletListItem text="Chrome et NVDA" />
          <BulletListItem text="Safari et VoiceOver" />
        </VerticalUl>
      </StyledView>
      <Typo.BodyAccent>Les outils utilisés lors de l’évaluation</Typo.BodyAccent>
      <StyledView>
        <VerticalUl>
          <BulletListItem text="Extension HeadingsMap" />
          <BulletListItem text="Extension Web Developer" />
          <BulletListItem text="Extension Stylus" />
          <BulletListItem text="Validateur HTML W3C" />
          <BulletListItem text="Tanaguru Contrast-Finder" />
          <BulletListItem text="Outils de développement (navigateur)" />
        </VerticalUl>
      </StyledView>
      <Typo.BodyAccent>
        Pages du site ayant fait l’objet de la vérification de conformité
      </Typo.BodyAccent>
      <StyledView>
        <VerticalUl>
          <BulletListItem>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={ButtonInsideText}
                wording="Accueil"
                icon={ExternalSiteFilled}
                externalNav={homeUrl}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={ButtonInsideText}
                wording="Connexion"
                icon={ExternalSiteFilled}
                externalNav={loginUrl}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={ButtonInsideText}
                wording="Inscription - Date de naissance"
                icon={ExternalSiteFilled}
                externalNav={signupUrl}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={ButtonInsideText}
                wording="Vérification d’identité"
                icon={ExternalSiteFilled}
                externalNav={identityCheckUrl}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={ButtonInsideText}
                wording="Profil"
                icon={ExternalSiteFilled}
                externalNav={profileUrl}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={ButtonInsideText}
                wording="Modification de mot de passe"
                icon={ExternalSiteFilled}
                externalNav={changePasswordUrl}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={ButtonInsideText}
                wording="Recherche"
                icon={ExternalSiteFilled}
                externalNav={searchUrl}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={ButtonInsideText}
                wording="Filtres"
                icon={ExternalSiteFilled}
                externalNav={filterUrl}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={ButtonInsideText}
                wording="Résultats de recherche"
                icon={ExternalSiteFilled}
                externalNav={searchResultsUrl}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={ButtonInsideText}
                wording="Favoris"
                icon={ExternalSiteFilled}
                externalNav={favoritesUrl}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={ButtonInsideText}
                wording="Détails d’une offre"
                icon={ExternalSiteFilled}
                externalNav={offerUrl}
              />
            </Typo.BodyXs>
          </BulletListItem>
          <BulletListItem>
            <Typo.BodyXs>
              <ExternalTouchableLink
                as={ButtonInsideText}
                wording="Déclaration d’accessibilité"
                icon={ExternalSiteFilled}
                externalNav={accessibilityUrl}
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
          as={ButtonInsideText}
          wording="support@passculture.app"
          accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
          justifyContent="flex-start"
          externalNav={contactSupport.forGenericQuestion}
          icon={EmailFilled}
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
              as={ButtonInsideText}
              wording="Défenseur des droits"
              icon={ExternalSiteFilled}
              externalNav={rightsDefenderUrl}
            />
          </Typo.Body>
          <Typo.Body>
            Contacter le délégué du{SPACE}
            <ExternalTouchableLink
              as={ButtonInsideText}
              wording="Défenseur des droits dans votre région"
              icon={ExternalSiteFilled}
              externalNav={rightsDelegateUrl}
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

const StyledSeparator = styled(Separator.Horizontal)({
  marginVertical: getSpacing(6),
})

const StyledView = styled.View({
  marginTop: getSpacing(5),
  marginBottom: getSpacing(6),
})
