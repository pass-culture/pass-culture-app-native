import React from 'react'
import styled from 'styled-components/native'

import { ContactSupportButton } from 'features/profile/pages/Accessibility/components/ContactSupportButton'
import { PageProfileSection } from 'features/profile/pages/PageProfileSection/PageProfileSection'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { Separator } from 'ui/components/Separator'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { EmailFilled } from 'ui/svg/icons/EmailFilled'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { PlainArrowNext } from 'ui/svg/icons/PlainArrowNext'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK, LINE_BREAK } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export function AccessibilityDeclaration() {
  return (
    <PageProfileSection title="Déclaration d'accessibilité" scrollable>
      <Typo.Body>
        Le pass Culture s’engage à rendre son site internet accessible conformément à l’article 47
        de la loi n° 2005-102 du 11 février 2005. À cette fin, il met en œuvre la stratégie et les
        actions suivantes&nbsp;:
      </Typo.Body>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem>
          <Typo.Caption>
            <TouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Schéma pluriannuel"
              icon={PlainArrowNext}
              navigateTo={{ screen: 'AccessibilityActionPlan' }}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>Plan d’actions&nbsp;: en cours</Typo.Caption>
        </BulletListItem>
      </VerticalUl>
      <StyledSeparator />
      <TitleText>État de conformité</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        Le site pass Culture n’est pas en conformité avec le référentiel général d’amélioration de
        l’accessibilité car il n’existe aucun résultat d’audit en cours de validité permettant de
        mesurer le respect des critères. Par conséquent aucune non conformité et aucune dérogation
        ne sont énumérées ci-dessous.
      </Typo.Body>
      <StyledSeparator />
      <TitleText>Résultats des tests</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>En l’absence d’audit de conformité, il n’y a pas de résultats de tests.</Typo.Body>
      <StyledSeparator />
      <TitleText>Contenus non accessibles</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Non conformité
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          En l’absence d’audit tous les contenus seront considérés comme non accessibles par
          hypothèse.
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Dérogations pour charge disproportionnée
        {DOUBLE_LINE_BREAK}
        <Typo.Body>En l’absence d’audit aucune dérogation n’a été établie.</Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Contenus non soumis à l’obligation d’accessibilité
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          En l’absence d’audit aucun contenu n’a été identifié comme n’entrant pas dans le champ de
          la législation applicable.
        </Typo.Body>
      </Typo.ButtonText>
      <StyledSeparator />
      <TitleText>Établissement de cette déclaration d’accessibilité</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <StyledBody>Cette déclaration a été établie le 23-09-2020.</StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Technologies utilisées pour la réalisation du site pass Culture
        {DOUBLE_LINE_BREAK}
        <Typo.Body>En l’absence d’audit aucune technologie n’a été utilisée.</Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Agents utilisateurs, technologies d’assistance et outils utilisés pour vérifier
        l’accessibilité
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          En l’absence d’audit aucun agent utilisateur et aucune technologie d’assistance n’ont été
          utilisés.
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Les tests des pages web ont été effectués avec les combinaisons de navigateurs web et
        lecteurs d’écran suivants&nbsp;:
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          En l’absence d’audit aucune combinaison de navigateur et de lecteur d’écran n’a été
          utilisée.
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Les outils suivants ont été utilisés lors de l’évaluation&nbsp;:
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          En l’absence d’audit aucun outil n’a été utilisé lors de l’évaluation.
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Pages du site ayant fait l’objet de la vérification de conformité&nbsp;:
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          En l’absence d’audit aucune page n’a fait l’objet de la vérification de conformité.
        </Typo.Body>
      </Typo.ButtonText>
      <StyledSeparator />
      <TitleText>Retours d’information et contact </TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        Si vous n’arrivez pas à accéder à un contenu ou à un service, vous pouvez contacter le
        responsable du site web pour être orienté vers une alternative accessible ou obtenir le
        contenu sous une autre forme.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem text="Si vous êtes un professionnel, contacter l’équipe support Pro du pass Culture à l’adresse mail suivante&nbsp;:">
          {DOUBLE_LINE_BREAK}
          <TouchableLink
            as={ButtonTertiaryBlack}
            wording="support-pro@passculture.app"
            accessibilityLabel="Ouvrir le gestionnaire mail pour contacter le support Pro"
            justifyContent="flex-start"
            externalNav={{ url: 'mailto:support-pro@passculture.app' }}
            icon={EmailFilled}
          />
          {LINE_BREAK}
        </BulletListItem>
        <BulletListItem text="Si vous êtes un jeune, contacter l’équipe support du pass Culture à l’adresse mail suivante&nbsp;:">
          {DOUBLE_LINE_BREAK}
          <ContactSupportButton />
          {LINE_BREAK}
        </BulletListItem>
      </VerticalUl>
      <Spacer.Column numberOfSpaces={2} />
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
            <TouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Défenseur des droits"
              icon={ExternalSiteFilled}
              externalNav={{ url: 'https://formulaire.defenseurdesdroits.fr/' }}
            />
          </Typo.Caption>
        </BulletListItem>
        <BulletListItem>
          <Typo.Caption>
            Contacter le délégué du{' '}
            <TouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Défenseur des droits dans votre région"
              icon={ExternalSiteFilled}
              externalNav={{ url: 'https://www.defenseurdesdroits.fr/saisir/delegues' }}
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
