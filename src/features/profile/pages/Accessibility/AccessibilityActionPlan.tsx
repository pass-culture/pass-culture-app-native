import React from 'react'
import styled from 'styled-components/native'

import { ActionPlanTag } from 'features/profile/pages/Accessibility/components/ActionPlanTag'
import { ContactSupportButton } from 'features/profile/pages/Accessibility/components/ContactSupportButton'
import { PageProfileSection } from 'features/profile/pages/PageProfileSection/PageProfileSection'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonQuaternaryPrimary } from 'ui/components/buttons/ButtonQuaternaryPrimary'
import { Separator } from 'ui/components/Separator'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK, LINE_BREAK } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export function AccessibilityActionPlan() {
  return (
    <PageProfileSection title="Schéma pluriannuel" scrollable>
      <StyledBody>Schéma pluriannuel d’accessibilité 2022 - 2024</StyledBody>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        L’article 47 de la loi n° 2005-102 du 11 février 2005 pour l’égalité des droits et des
        chances, la participation et la citoyenneté des personnes rend obligatoire à tout service de
        communication publique en ligne d’être accessible à tous.
      </Typo.Body>
      <StyledSeparator />
      <TitleText>Définition de l’accessibilité numérique</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        L’accessibilité numérique permet d’accéder aux contenus (sites web, documents bureautiques,
        supports multimédias, intranets d’entreprise, applications mobiles…), quelle que soit sa
        façon de naviguer.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        L’accessibilité numérique est indispensable aux personnes en situation de handicap
        pour&nbsp;:
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem text="s'informer ;" />
        <BulletListItem text="communiquer ;" />
        <BulletListItem text="accomplir des démarches administratives ;" />
        <BulletListItem text="mener une activité professionnelle…" />
      </VerticalUl>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        L’accessibilité numérique profite à tous&nbsp;: aux personnes âgées, aux personnes en
        situation de handicap temporaire ou permanent, aux personnes peu à l’aise avec Internet…
        {LINE_BREAK}
        L’accessibilité numérique s’inscrit dans une démarche d’égalité et constitue un enjeu
        politique et social fondamental afin de garantir à tous, sans discrimination, le même accès
        à l’information et aux services en ligne.
        {LINE_BREAK}
        L’accessibilité numérique est un domaine transverse qui concerne toutes les personnes
        impliquées dans la création, la maintenance et l’utilisation des dispositifs
        numériques&nbsp;: décideurs, chefs de projet, graphistes, développeurs, producteurs de
        contenus.
      </Typo.Body>
      <StyledSeparator />
      <TitleText>Politique d’accessibilité</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        L’accessibilité numérique est au cœur des préoccupations liées au développement ou à la mise
        à disposition de sites web ou d’applications tant auprès du public que des personnels
        internes de la SAS pass Culture.
        {LINE_BREAK}
        Cette volonté s’illustre par l’élaboration de ce schéma pluriannuel d’accessibilité
        numérique associé à des plans annuels d’action, dans l’objectif d’accompagner la mise en
        conformité RGAA (Référentiel Général d’Amélioration de l’Accessibilité) et l’amélioration
        progressive des sites web et applications concernés.
        {DOUBLE_LINE_BREAK}
        L’élaboration, le suivi et la mise à jour de ce schéma pluriannuel sont placés sous la
        responsabilité du pôle Accessibilité.
        {DOUBLE_LINE_BREAK}
        Ses missions sont&nbsp;:
      </Typo.Body>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem text="promouvoir l’accessibilité par la diffusion des normes et des bonnes pratiques ;" />
        <BulletListItem text="accompagner les équipes internes par des actions notamment de formation ;" />
        <BulletListItem text="contrôler et veiller à l’application de la loi n° 2005-102 du 11 février 2005 en procédant à des audits réguliers ;" />
        <BulletListItem text="assurer la prise en charge des demandes des utilisateurs et de manière générale la qualité du service rendu aux utilisateurs en situation de handicap ;" />
        <BulletListItem text="faire une veille sur les évolutions réglementaires." />
      </VerticalUl>
      <StyledSeparator />
      <TitleText>
        Ressources humaines et financières affectées à l’accessibilité numérique
      </TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        Le pilotage et le suivi de la conformité au RGAA reviennent au pôle Accessibilité. Cette
        équipe transverse est notamment composée d’une personne en lien avec les publics,
        d’ingénieurs en informatique, d’une designeuse, et d’une personne dédiée à la conception du
        produit.
      </Typo.Body>
      <StyledSeparator />
      <TitleText>Organisation de la prise en compte de l’accessibilité numérique</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        La prise en compte de l’accessibilité numérique nécessite&nbsp;:
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem text="de poursuivre l’adaptation de l’organisation interne de production et de gestion des sites web et application concernés ;" />
        <BulletListItem text="de poursuivre l’accompagnement des équipes ;" />
        <BulletListItem text="de veiller à la prise en compte de l’accessibilité dans les procédures de marché ;" />
        <BulletListItem text="de prendre en charge des personnes en situation de handicap lorsqu’elles signalent des difficultés." />
      </VerticalUl>
      <Spacer.Column numberOfSpaces={5} />
      <Typo.Body>
        Les éléments ci-dessous décrivent les points importants sur lesquels la SAS pass Culture
        s’appuiera pour améliorer l’accessibilité numérique de l’ensemble de ses sites web et
        applications.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Action de formation et de sensibilisation
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Tout au long de la période d’application de ce schéma, des actions de formation et de
          sensibilisation vont être organisées.
          {LINE_BREAK}
          Elles permettront aux personnels intervenant sur les sites, les applications mais aussi
          sur les supports de communication de développer, éditer et mettre en ligne des contenus
          accessibles.
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>Plus précisément, notre action consiste à&nbsp;:</Typo.ButtonText>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem text="sensibiliser pour bien faire comprendre l’importance du respect des règles de bonnes pratiques d’accessibilité numérique ;" />
        <BulletListItem text="former pour acquérir les bonnes pratiques indispensables pour produire des sites et applications accessibles (graphisme, ergonomie, développement) et publier des contenus accessibles." />
      </VerticalUl>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Recours à des compétences externes
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Chaque fois que nécessaire, la SAS pass Culture fait appel à des intervenants externes
          afin de l’accompagner dans la prise en compte de l’accessibilité. Cela recouvre par
          exemple les actions de sensibilisation et de formation, les actions d’accompagnements et
          plus particulièrement les actions d’audits et de certification des sites web et
          applications concernés.
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Prise en compte de l’accessibilité numérique dans les projets
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Les objectifs d’accessibilité et de conformité au RGAA sont inscrits et rappelés dès le
          début des projets dont ils constitueront un axe majeur et une exigence de base.
          {LINE_BREAK}
          De la même manière, ces objectifs et ces exigences sont rappelés dans les éventuelles
          conventions établies avec nos partenaires.
          {LINE_BREAK}
          Comme pour le RGPD, l’accessibilité est citée dans la réflexion préalable et nécessaire à
          l’engagement des projets.
          {LINE_BREAK}
          Pour favoriser la prise en compte de l’accessibilité numérique dans les projets, des
          composants normés, des modèles accessibles et une documentation dédiée et évolutive sont
          mis à la disposition des équipes projets.
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Tests utilisateurs
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Si des tests utilisateurs sont organisés, en phase de conception, de validation ou
          d’évolution d’un site web ou d’une application, le panel d’utilisateurs constitué
          comprendra dans toute la mesure du possible des personnes en situation de handicap.
          {LINE_BREAK}
          Le Conseil national consultatif des personnes handicapées accompagne en particulier le
          pass Culture sur cette dimension.
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Prise en compte de l’accessibilité dans les procédures de marchés
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          L’accessibilité numérique et la conformité au RGAA doivent être prise en compte et
          participer à l’évaluation de la qualité de l’offre d’un prestataire lors de la commande de
          travaux au travers des appels d’offres notamment.
          {LINE_BREAK}
          Les procédures d’élaboration des marchés ainsi que les règles d’évaluation des
          candidatures seront adaptées pour davantage prendre en compte les exigences de conformité
          au RGAA.
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Recrutement
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Une attention particulière devra être portée sur les compétences en matière
          d’accessibilité numérique des personnels intervenant sur les services numériques, lors de
          la création des fiches de postes et les procédures de recrutement.
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Traitement des retours utilisateurs
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Conformément aux dispositions prévues par le RGAA et aux attentes légitimes des
          utilisateurs, un moyen de contact va être mis en place, au fur et à mesure des travaux de
          mise en conformité, sur chaque site ou application permettant aux utilisateurs en
          situation de handicap de signaler ses difficultés.
          {LINE_BREAK}
          Afin de répondre à ses demandes, la mise en place d’une procédure spécifique d’assistance
          va être étudiée avec l’ensemble des services et des personnels impliqués.
          {DOUBLE_LINE_BREAK}
          Dans l’attente les demandes seront traitées par le pôle Support, en étroite collaboration
          avec le pôle Accessibilité, responsable de l’élaboration, la mise en place et le suivi de
          ce schéma pluriannuel.
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <ContactSupportButton />
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Processus de contrôle et de validation
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Chaque site ou application fera l’objet lors de la mise en ligne initiale, lors d’une mise
          à jour substantielle, d’une refonte ou à la fin des opérations de mises aux normes, d’un
          contrôle permettant d’établir une déclaration de conformité conformément aux termes de la
          loi.
          {LINE_BREAK}
          Ces opérations de contrôles, réalisées en interne ou par l’intermédiaire de prestataires
          spécialisés, destinés à l’établissement ou la mise à jour des déclarations de conformité
          interviennent en complément des opérations habituelles de recette et contrôles
          intermédiaires qui sont organisées tout au long de la vie des projets.
        </Typo.Body>
      </Typo.ButtonText>
      <StyledSeparator />
      <TitleText>Périmètre technique et fonctionnel</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Recensement
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          La SAS pass Culture gère 4 sites Internet et deux applications (IOS et Android) à
          destination de ses utilisateurs.
          {LINE_BREAK}
          Elle gère également de nombreux outils et applications à destination de ses
          collaborateurs.
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Évaluation et qualification
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Chaque site ou application a été qualifié selon des critères tels que&nbsp;:
        </Typo.Body>
      </Typo.ButtonText>
      <VerticalUl>
        <BulletListItem text="la fréquentation ;" />
        <BulletListItem text="le service rendu ;" />
        <BulletListItem text="la criticité ;" />
        <BulletListItem text="le cycle de vie (date de la prochaine refonte) ;" />
        <BulletListItem text="les technologies employées." />
      </VerticalUl>
      <Spacer.Column numberOfSpaces={5} />
      <Typo.Body>
        Des évaluations rapides de l’accessibilité, permettant de servir de socle à l’élaboration
        des interventions d’audits ont été ou vont être réalisées sur l’ensemble des sites et
        applications concernées.
        {LINE_BREAK}
        Ces évaluations portent sur un petit nombre de critères choisis pour leur pertinence en
        termes d’évaluation de la complexité et la faisabilité de la mise aux normes RGAA. L’annexe
        1 (infra&nbsp;: «&nbsp;Annexe 1&nbsp;: périmètre technique et fonctionnel public&nbsp;»)
        décrit les éléments pouvant être rendus publics du périmètre technique et fonctionnel. En
        effet, certaines applications peuvent ne pas être rendues publiques pour des raisons de
        sécurité ou de confidentialité par exemple.
      </Typo.Body>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Agenda planifié des interventions
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Compte tenu des informations recueillies lors de l’élaboration de ce schéma, la complexité
          des sites et applications, leur classement par ordre de priorité et leur évaluation en
          termes de faisabilité, les opérations de mise en conformité vont s’étaler sur les années
          2021 à 2022 et au-delà.
        </Typo.Body>
      </Typo.ButtonText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.ButtonText>
        Plans annuels
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Ce schéma pluriannuel sera accompagné de plans annuels d’actions qui décriront en détail
          les opérations mises en œuvre pour prendre en charge l’ensemble des besoins en termes
          d’accessibilité numérique de la SAS pass Culture.
        </Typo.Body>
      </Typo.ButtonText>
      <StyledSeparator />
      <TitleText>Annexe 1&nbsp;: Périmètre technique et fonctionnel</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Body>
        La liste ci-dessous présente les sites et applications de la SAS pass Culture ouverts au
        public&nbsp;:
        {DOUBLE_LINE_BREAK}
        Site institutionnel&nbsp;:
      </Typo.Body>
      <TouchableLink
        as={ButtonQuaternaryPrimary}
        wording="https://pass.culture.fr/"
        justifyContent="flex-start"
        icon={ExternalSiteFilled}
        externalNav={{ url: 'https://pass.culture.fr/' }}
      />
      <Typo.Body>Application Utilisateurs&nbsp;:</Typo.Body>
      <TouchableLink
        as={ButtonQuaternaryPrimary}
        wording="https://passculture.app/accueil"
        justifyContent="flex-start"
        icon={ExternalSiteFilled}
        externalNav={{ url: 'https://passculture.app/accueil' }}
      />
      <Typo.Body>Site acteurs culturels&nbsp;:</Typo.Body>
      <TouchableLink
        as={ButtonQuaternaryPrimary}
        wording="https://passculture.pro/"
        justifyContent="flex-start"
        icon={ExternalSiteFilled}
        externalNav={{ url: 'https://passculture.pro/' }}
      />
      <StyledSeparator />
      <TitleText>Plan annuel 2022</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <VerticalUl>
        <BulletListItem text="Constitution du pôle Accessibilité">
          <ActionPlanTag />
        </BulletListItem>
        <BulletListItem text="Nomination de 2 personnes référentes sur l’accessibilité numérique">
          <ActionPlanTag />
        </BulletListItem>
        <BulletListItem text="Formation de l’ensemble des développeurs travaillant sur le présent site">
          <ActionPlanTag />
        </BulletListItem>
        <BulletListItem text="Organisation d’une journée dédiée à l’accessibilité numérique avec les développeurs travaillant sur le présent site">
          <ActionPlanTag />
        </BulletListItem>
        <BulletListItem text="Audit d’accessibilité pour le présent site">
          <ActionPlanTag />
        </BulletListItem>
        <BulletListItem text="Publication de la déclaration de mise en conformité pour le présent site">
          <ActionPlanTag />
        </BulletListItem>
        <BulletListItem text="Rencontre avec des utilisateurs en situation de handicap">
          <ActionPlanTag done={false} />
        </BulletListItem>
        <BulletListItem text="Formation du pôle Communication, Marketing, Recherche">
          <ActionPlanTag done={false} />
        </BulletListItem>
      </VerticalUl>
      <StyledSeparator />
      <TitleText>Plan annuel 2023</TitleText>
      <Spacer.Column numberOfSpaces={6} />
      <StyledBody>En cours de constitution</StyledBody>
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
