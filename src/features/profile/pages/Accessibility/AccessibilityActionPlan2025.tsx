import React from 'react'

import {
  ActionPlanStatus,
  ActionPlanTag,
} from 'features/profile/components/Buttons/ActionPlanTag/ActionPlanTag'
import { BulletListItem } from 'ui/components/BulletListItem'
import { VerticalUl } from 'ui/components/Ul'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const AccessibilityActionPlan2025 = () => (
  <React.Fragment>
    <Typo.Title4 {...getHeadingAttrs(2)}>Plan annuel 2025</Typo.Title4>
    <Spacer.Column numberOfSpaces={6} />
    <VerticalUl>
      <BulletListItem text="Réaliser un audit interne sur les parcours clés de la version web">
        <ActionPlanTag status={ActionPlanStatus.TODO} />
      </BulletListItem>

      <BulletListItem text="Valider la certification “Développer des sites web accessibles” (tous les développeurs front-end)">
        <ActionPlanTag status={ActionPlanStatus.ONGOING} />
      </BulletListItem>

      <BulletListItem text="Former un développeur à l’audit d’accessibilité numérique des applications mobiles">
        <ActionPlanTag status={ActionPlanStatus.TODO} />
      </BulletListItem>

      <BulletListItem text="Mettre en place un process de vérification d’accessibilité RGAA pour les nouvelles fonctionnalités">
        <ActionPlanTag status={ActionPlanStatus.TODO} />
      </BulletListItem>

      <BulletListItem text="Revoir l’accessibilité de tous les mails transactionnels">
        <ActionPlanTag status={ActionPlanStatus.TODO} />
      </BulletListItem>

      <BulletListItem text="Atteindre 100% d’accessibilité de la version web sur les parcours clés">
        <ActionPlanTag status={ActionPlanStatus.TODO} />
      </BulletListItem>

      <BulletListItem text="Informer des modalités de mises en accessibilité des offres">
        <ActionPlanTag status={ActionPlanStatus.TODO} />
      </BulletListItem>

      <BulletListItem text="Renforcer la visibilité sur le pass d’offres accessibles auprès des publics concernés (partenariats et inscriptions d’AC spécialisées…)">
        <ActionPlanTag status={ActionPlanStatus.TODO} />
      </BulletListItem>

      <BulletListItem text="Proposer un mode sombre aux utilisateurs">
        <ActionPlanTag status={ActionPlanStatus.TODO} />
      </BulletListItem>

      <BulletListItem text="Mettre en place un design system 100% accessible">
        <ActionPlanTag status={ActionPlanStatus.TODO} />
      </BulletListItem>
    </VerticalUl>
  </React.Fragment>
)
