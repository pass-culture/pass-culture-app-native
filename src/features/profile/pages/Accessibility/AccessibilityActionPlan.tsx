import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { AccessibilityActionPlanSection } from 'features/profile/components/AccessibilityActionPlanSection/AccessibilityActionPlanSection'
import { ContactSupportButton } from 'features/profile/components/Buttons/ContactSupportButton/ContactSupportButton'
import { accessibility2022 } from 'features/profile/pages/Accessibility/accessibility2022'
import { accessibility2023 } from 'features/profile/pages/Accessibility/accessibility2023'
import { accessibility2024 } from 'features/profile/pages/Accessibility/accessibility2024'
import { accessibility2025 } from 'features/profile/pages/Accessibility/accessibility2025'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonQuaternaryPrimary } from 'ui/components/buttons/ButtonQuaternaryPrimary'
import { Separator } from 'ui/components/Separator'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK, LINE_BREAK } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export function AccessibilityActionPlan() {
  const { goBack } = useGoBack(...getProfileHookConfig('Accessibility'))
  const { designSystem } = useTheme()

  return (
    <SecondaryPageWithBlurHeader
      onGoBack={goBack}
      title="Schéma pluriannuel"
      enableMaxWidth={false}>
      <Typo.BodyItalic>Schéma pluriannuel d’accessibilité 2022 - 2024</Typo.BodyItalic>
      <StyledBody marginTop={designSystem.size.spacing.l}>
        L’article 47 de la loi n° 2005-102 du 11 février 2005 pour l’égalité des droits et des
        chances, la participation et la citoyenneté des personnes rend obligatoire à tout service de
        communication publique en ligne d’être accessible à tous.
      </StyledBody>
      <StyledSeparator />
      <TitleText>Définition de l’accessibilité numérique</TitleText>
      <StyledBody marginTop={designSystem.size.spacing.l}>
        L’accessibilité numérique permet d’accéder aux contenus (sites web, documents bureautiques,
        supports multimédias, intranets d’entreprise, applications mobiles…), quelle que soit sa
        façon de naviguer.
      </StyledBody>
      <StyledBodyAccent marginBottom={designSystem.size.spacing.xl}>
        L’accessibilité numérique est indispensable aux personnes en situation de handicap
        pour&nbsp;:
      </StyledBodyAccent>
      <VerticalUl>
        <BulletListItem groupLabel="Raisons" index={0} total={4} text="s’informer ;" />
        <BulletListItem groupLabel="Raisons" index={1} total={4} text="communiquer ;" />
        <BulletListItem
          groupLabel="raisons"
          index={2}
          total={4}
          text="accomplir des démarches administratives ;"
        />
        <BulletListItem
          groupLabel="raisons"
          index={3}
          total={4}
          text="mener une activité professionnelle…"
        />
      </VerticalUl>
      <StyledBody marginTop={designSystem.size.spacing.l}>
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
      </StyledBody>
      <StyledSeparator />
      <TitleText>Politique d’accessibilité</TitleText>
      <StyledBody
        marginTop={designSystem.size.spacing.l}
        marginBottom={designSystem.size.spacing.xl}>
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
      </StyledBody>
      <VerticalUl>
        <BulletListItem
          groupLabel="Missions"
          index={0}
          total={5}
          text="promouvoir l’accessibilité par la diffusion des normes et des bonnes pratiques ;"
        />
        <BulletListItem
          groupLabel="Missions"
          index={1}
          total={5}
          text="accompagner les équipes internes par des actions notamment de formation ;"
        />
        <BulletListItem
          groupLabel="Missions"
          index={2}
          total={5}
          text="contrôler et veiller à l’application de la loi n° 2005-102 du 11 février 2005 en procédant à des audits réguliers ;"
        />
        <BulletListItem
          groupLabel="Missions"
          index={3}
          total={5}
          text="assurer la prise en charge des demandes des utilisateurs et de manière générale la qualité du service rendu aux utilisateurs en situation de handicap ;"
        />
        <BulletListItem
          groupLabel="Missions"
          index={4}
          total={5}
          text="faire une veille sur les évolutions réglementaires."
        />
      </VerticalUl>
      <StyledSeparator />
      <TitleText>
        Ressources humaines et financières affectées à l’accessibilité numérique
      </TitleText>
      <StyledBody marginTop={designSystem.size.spacing.l}>
        Le pilotage et le suivi de la conformité au RGAA reviennent au pôle Accessibilité. Cette
        équipe transverse est notamment composée d’une personne en lien avec les publics,
        d’ingénieurs en informatique, d’une designeuse, et d’une personne dédiée à la conception du
        produit.
      </StyledBody>
      <StyledSeparator />
      <TitleText>Organisation de la prise en compte de l’accessibilité numérique</TitleText>
      <StyledBodyAccent marginBottom={designSystem.size.spacing.xl}>
        La prise en compte de l’accessibilité numérique nécessite&nbsp;:
      </StyledBodyAccent>
      <VerticalUl>
        <BulletListItem
          groupLabel="Nécessites"
          index={0}
          total={4}
          text="de poursuivre l’adaptation de l’organisation interne de production et de gestion des sites web et application concernés ;"
        />
        <BulletListItem
          groupLabel="Nécessites"
          index={1}
          total={4}
          text="de poursuivre l’accompagnement des équipes ;"
        />
        <BulletListItem
          groupLabel="Nécessites"
          index={2}
          total={4}
          text="de veiller à la prise en compte de l’accessibilité dans les procédures de marché ;"
        />
        <BulletListItem
          groupLabel="Nécessites"
          index={3}
          total={4}
          text="de prendre en charge des personnes en situation de handicap lorsqu’elles signalent des difficultés."
        />
      </VerticalUl>
      <StyledBody
        marginTop={designSystem.size.spacing.xl}
        marginBottom={designSystem.size.spacing.xl}>
        Les éléments ci-dessous décrivent les points importants sur lesquels la SAS pass Culture
        s’appuiera pour améliorer l’accessibilité numérique de l’ensemble de ses sites web et
        applications.
      </StyledBody>
      <Typo.BodyAccent>
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
      </Typo.BodyAccent>
      <StyledBodyAccent marginBottom={designSystem.size.spacing.xl}>
        Plus précisément, notre action consiste à&nbsp;:
      </StyledBodyAccent>
      <VerticalUl>
        <BulletListItem
          groupLabel="Actions"
          index={0}
          total={2}
          text="sensibiliser pour bien faire comprendre l’importance du respect des règles de bonnes pratiques d’accessibilité numérique ;"
        />
        <BulletListItem
          groupLabel="Actions"
          index={1}
          total={2}
          text="former pour acquérir les bonnes pratiques indispensables pour produire des sites et applications accessibles (graphisme, ergonomie, développement) et publier des contenus accessibles."
        />
      </VerticalUl>
      <StyledBodyAccent marginBottom={designSystem.size.spacing.xl}>
        Recours à des compétences externes
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Chaque fois que nécessaire, la SAS pass Culture fait appel à des intervenants externes
          afin de l’accompagner dans la prise en compte de l’accessibilité. Cela recouvre par
          exemple les actions de sensibilisation et de formation, les actions d’accompagnements et
          plus particulièrement les actions d’audits et de certification des sites web et
          applications concernés.
        </Typo.Body>
      </StyledBodyAccent>
      <Typo.BodyAccent>
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
      </Typo.BodyAccent>
      <StyledBodyAccent marginBottom={designSystem.size.spacing.xl}>
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
      </StyledBodyAccent>
      <Typo.BodyAccent>
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
      </Typo.BodyAccent>
      <StyledBodyAccent>
        Recrutement
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Une attention particulière devra être portée sur les compétences en matière
          d’accessibilité numérique des personnels intervenant sur les services numériques, lors de
          la création des fiches de postes et les procédures de recrutement.
        </Typo.Body>
      </StyledBodyAccent>
      <StyledBodyAccent marginBottom={designSystem.size.spacing.xl}>
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
      </StyledBodyAccent>
      <ContactSupportButton />
      <StyledBodyAccent>
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
      </StyledBodyAccent>
      <StyledSeparator />
      <TitleText>Périmètre technique et fonctionnel</TitleText>
      <StyledBodyAccent>
        Recensement
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          La SAS pass Culture gère 4 sites Internet et deux applications (IOS et Android) à
          destination de ses utilisateurs.
          {LINE_BREAK}
          Elle gère également de nombreux outils et applications à destination de ses
          collaborateurs.
        </Typo.Body>
      </StyledBodyAccent>
      <StyledBodyAccent>
        Évaluation et qualification
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Chaque site ou application a été qualifié selon des critères tels que&nbsp;:
        </Typo.Body>
      </StyledBodyAccent>
      <VerticalUl>
        <BulletListItem groupLabel="Critères" index={0} total={5} text="la fréquentation ;" />
        <BulletListItem groupLabel="Critères" index={1} total={5} text="le service rendu ;" />
        <BulletListItem groupLabel="Critères" index={2} total={5} text="la criticité ;" />
        <BulletListItem
          groupLabel="Critères"
          index={3}
          total={5}
          text="le cycle de vie (date de la prochaine refonte) ;"
        />
        <BulletListItem
          groupLabel="Critères"
          index={4}
          total={5}
          text="les technologies employées."
        />
      </VerticalUl>
      <StyledBody
        marginTop={designSystem.size.spacing.xl}
        marginBottom={designSystem.size.spacing.xl}>
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
      </StyledBody>
      <Typo.BodyAccent>
        Agenda planifié des interventions
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Compte tenu des informations recueillies lors de l’élaboration de ce schéma, la complexité
          des sites et applications, leur classement par ordre de priorité et leur évaluation en
          termes de faisabilité, les opérations de mise en conformité vont s’étaler sur les années
          2021 à 2022 et au-delà.
        </Typo.Body>
      </Typo.BodyAccent>
      <StyledBodyAccent>
        Plans annuels
        {DOUBLE_LINE_BREAK}
        <Typo.Body>
          Ce schéma pluriannuel sera accompagné de plans annuels d’actions qui décriront en détail
          les opérations mises en œuvre pour prendre en charge l’ensemble des besoins en termes
          d’accessibilité numérique de la SAS pass Culture.
        </Typo.Body>
      </StyledBodyAccent>
      <StyledSeparator />
      <TitleText>Annexe 1&nbsp;: Périmètre technique et fonctionnel</TitleText>
      <StyledBody marginTop={designSystem.size.spacing.l}>
        La liste ci-dessous présente les sites et applications de la SAS pass Culture ouverts au
        public&nbsp;:
        {DOUBLE_LINE_BREAK}
        Site institutionnel&nbsp;:
      </StyledBody>
      <ExternalTouchableLink
        as={ButtonQuaternaryPrimary}
        wording="https://pass.culture.fr/"
        justifyContent="flex-start"
        icon={ExternalSiteFilled}
        externalNav={{ url: 'https://pass.culture.fr/' }}
      />
      <Typo.Body>Application Utilisateurs&nbsp;:</Typo.Body>
      <ExternalTouchableLink
        as={ButtonQuaternaryPrimary}
        wording="https://passculture.app/"
        justifyContent="flex-start"
        icon={ExternalSiteFilled}
        externalNav={{ url: 'https://passculture.app/' }}
      />
      <Typo.Body>Site acteurs culturels&nbsp;:</Typo.Body>
      <ExternalTouchableLink
        as={ButtonQuaternaryPrimary}
        wording="https://passculture.pro/"
        justifyContent="flex-start"
        icon={ExternalSiteFilled}
        externalNav={{ url: 'https://passculture.pro/' }}
      />
      <StyledSeparator />
      <AccessibilityActionPlanSection title="Plan annuel 2025" items={accessibility2025} />
      <StyledSeparator />
      <AccessibilityActionPlanSection title="Plan annuel 2024" items={accessibility2024} />
      <StyledSeparator />
      <AccessibilityActionPlanSection title="Plan annuel 2023" items={accessibility2023} />
      <StyledSeparator />
      <AccessibilityActionPlanSection title="Plan annuel 2022" items={accessibility2022} />
      <Spacer.BottomScreen />
    </SecondaryPageWithBlurHeader>
  )
}

const TitleText = styled(Typo.Title4).attrs(getHeadingAttrs(2))``

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xl,
}))

const StyledBody = styled(Typo.Body)<{ marginTop: number; marginBottom?: number }>(
  ({ marginTop, marginBottom }) => ({
    marginTop,
    marginBottom,
  })
)

const StyledBodyAccent = styled(Typo.BodyAccent)<{ marginBottom?: number }>(
  ({ theme, marginBottom }) => ({
    marginTop: theme.designSystem.size.spacing.xl,
    marginBottom,
  })
)
