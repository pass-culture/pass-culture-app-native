import React from 'react'
import styled from 'styled-components/native'

import { contactSupport } from 'features/auth/support.services'
import { RootNavigateParams } from 'features/navigation/RootNavigator/types'
import { PageProfileSection } from 'features/profile/pages/PageProfileSection/PageProfileSection'
import { WEBAPP_V2_URL } from 'libs/environment'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const actionPlanScreen: { screen: RootNavigateParams[0] } = {
  screen: 'AccessibilityActionPlan',
}

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

export function AccessibilityDeclaration() {
  return (
    <PageProfileSection title="Déclaration d’accessibilité" scrollable>
      <Typo.Body>
        Le pass Culture s’engage à rendre son site internet accessible conformément à l’article 47
        de la loi n° 2005-102 du 11 février 2005. À cette fin, il met en œuvre la stratégie et les
        actions suivantes&nbsp;:
      </Typo.Body>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem>
          <Typo.Caption>
            <InternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Schéma pluriannuel d’accessibilité 2022 - 2024"
              icon={PlainArrowNext}
              navigateTo={actionPlanScreen}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            <InternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Actions réalisées en 2022"
              icon={PlainArrowNext}
              navigateTo={actionPlanScreen}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            <InternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Plans d’actions 2023 - 2024"
              icon={PlainArrowNext}
              navigateTo={actionPlanScreen}
            />
          </Typo.Caption>
        </BulletListItem>
      </VerticalUl>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        Cette déclaration d’accessibilité s’applique au site internet{' '}
        <ExternalTouchableLink
          as={ButtonInsideText}
          typography="Caption"
          wording="https://passculture.app/"
          icon={ExternalSiteFilled}
          externalNav={webappUrl}
        />
      </Typo.Body>
      <StyledSeparator />
      <TitleText>État de conformité</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        Le site pass Culture est partiellement conforme avec le référentiel général d’amélioration
        de l’accessibilité.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Résultats des tests
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          L’audit de conformité réalisé par la société Tanaguru révèle que&nbsp;:
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem text="81&nbsp;% des critères RGAA version 4.1 sont respectés." />
        <BulletListItem text="Le taux moyen de conformité du service en ligne s’élève à 91&nbsp;%." />
      </VerticalUl>
      <StyledSeparator />
      <TitleText>Contenus non accessibles</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        Les contenus listés ci-dessous ne sont pas accessibles pour les raisons suivantes.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>Non conformité</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem text="Certains intitulés de lien ne sont pas pertinents." />
        <BulletListItem text="Le code source généré sur chaque page est invalide au regard de la spécification HTML5, la grande majorité des erreurs relevées concernent des imbrications de balises non conformes." />
        <BulletListItem text="En version mobile ou lors d’un zoom 200&nbsp;%, le menu de navigation n’est plus disponible sur plusieurs pages de l’application." />
        <BulletListItem
          text="Sur les pages de la recherche (recherche, résultats et filtres)&nbsp;:"
          nestedListTexts={[
            'Les sliders présents sont affichés uniquement via les feuilles de styles. Ils n’apparaissent donc plus sur la page lorsqu’on désactive le CSS.',
            'L’intitulé des boutons «\u00a0réinitialiser\u00a0», «\u00a0rechercher\u00a0» et «\u00a0me localiser\u00a0» sont tronqués lorsqu’on redéfinie les propriétés d’espacement du texte.',
            'Certains champs ne sont pas correctement reliés à leur intitulé.',
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
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>Dérogations pour charge disproportionnée</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem text="Aucune" />
      </VerticalUl>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>Contenus non soumis à l’obligation d’accessibilité</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem text="Aucun" />
      </VerticalUl>
      <StyledSeparator />
      <TitleText>Établissement de cette déclaration d’accessibilité</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <StyledBody>
        Cette déclaration a été établie le 29 novembre 2022. Elle a été mise à jour le 4 janvier
        2023.
      </StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Technologies utilisées pour la réalisation du site pass Culture
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem text="HTML5" />
        <BulletListItem text="CSS" />
        <BulletListItem text="JavaScript" />
      </VerticalUl>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Environnement de test
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Les vérifications de restitution de contenus ont été réalisées sur la base de la
          combinaison fournie par la base de référence du RGAA 4.1, avec les versions
          suivantes&nbsp;:
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem text="Firefox et NVDA" />
        <BulletListItem text="Chrome et NVDA" />
        <BulletListItem text="Safari et VoiceOver" />
      </VerticalUl>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>Les outils utilisés lors de l’évaluation</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem text="Extension HeadingsMap" />
        <BulletListItem text="Extension Web Developer" />
        <BulletListItem text="Extension Stylus" />
        <BulletListItem text="Validateur HTML W3C" />
        <BulletListItem text="Tanaguru Contrast-Finder" />
        <BulletListItem text="Outils de développement (navigateur)" />
      </VerticalUl>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Pages du site ayant fait l’objet de la vérification de conformité
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem>
          <Typo.Caption>
            <ExternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Accueil"
              icon={ExternalSiteFilled}
              externalNav={homeUrl}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            <ExternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Connexion"
              icon={ExternalSiteFilled}
              externalNav={loginUrl}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            <ExternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Inscription - Date de naissance"
              icon={ExternalSiteFilled}
              externalNav={signupUrl}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            <ExternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Vérification d’identité"
              icon={ExternalSiteFilled}
              externalNav={identityCheckUrl}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            <ExternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Profil"
              icon={ExternalSiteFilled}
              externalNav={profileUrl}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            <ExternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Modification de mot de passe"
              icon={ExternalSiteFilled}
              externalNav={changePasswordUrl}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            <ExternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Recherche"
              icon={ExternalSiteFilled}
              externalNav={searchUrl}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            <ExternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Filtres"
              icon={ExternalSiteFilled}
              externalNav={filterUrl}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            <ExternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Résultats de recherche"
              icon={ExternalSiteFilled}
              externalNav={searchResultsUrl}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            <ExternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Favoris"
              icon={ExternalSiteFilled}
              externalNav={favoritesUrl}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            <ExternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Détails d’une offre"
              icon={ExternalSiteFilled}
              externalNav={offerUrl}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            <ExternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Déclaration d’accessibilité"
              icon={ExternalSiteFilled}
              externalNav={accessibilityUrl}
            />
          </Typo.Caption>
        </BulletListItem>
      </VerticalUl>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Retour d’information et contact
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le
          responsable de l’application pour être orienté vers une alternative accessible ou obtenir
          le contenu sous une autre forme.
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem text="Contacter l’équipe support à l’adresse ">
          <Typo.Caption>
            <ExternalTouchableLink
              as={ButtonInsideText}
              wording="support@passculture.app"
              typography="Caption"
              accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support"
              justifyContent="flex-start"
              externalNav={contactSupport.forGenericQuestion}
              icon={EmailFilled}
            />
          </Typo.Caption>
        </BulletListItem>
      </VerticalUl>
      <StyledSeparator />
      <TitleText>Voie de recours</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        Cette procédure est à utiliser dans le cas suivant&nbsp;:
        {DOUBLE_LINE_BREAK}
        Vous avez signalé au responsable du site internet un défaut d’accessibilité qui vous empêche
        d’accéder à un contenu ou à un des services du portail et vous n’avez pas obtenu de réponse
        satisfaisante.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={6} />
      <VerticalUl>
        <BulletListItem>
          <Typo.Caption>
            Écrire un message au{' '}
            <ExternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Défenseur des droits"
              icon={ExternalSiteFilled}
              externalNav={rightsDefenderUrl}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            Contacter le délégué du{' '}
            <ExternalTouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Défenseur des droits dans votre région"
              icon={ExternalSiteFilled}
              externalNav={rightsDelegateUrl}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) Défenseur des droits
            Libre réponse 71120 75342 Paris CEDEX 07
          </Typo.Caption>
        </BulletListItem>
      </VerticalUl>
      <Spacer.BottomScreen />
    </PageProfileSection>
  )
}

const TitleText = styled(Typo.Title4).attrs(getHeadingAttrs(2))``

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  fontFamily: theme.fontFamily.italic,
}))

const StyledSeparator = styled(Separator)({
  marginVertical: getSpacing(6),
})
