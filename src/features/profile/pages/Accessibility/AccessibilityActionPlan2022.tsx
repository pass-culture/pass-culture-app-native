import React from 'react'

import { ActionPlanTag } from 'features/profile/components/Buttons/ActionPlanTag/ActionPlanTag'
import { BulletListItem } from 'ui/components/BulletListItem'
import { VerticalUl } from 'ui/components/Ul'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const AccessibilityActionPlan2022 = () => (
  <React.Fragment>
    <Typo.Title4 {...getHeadingAttrs(2)}>Plan annuel 2022</Typo.Title4>
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
        <ActionPlanTag />
      </BulletListItem>

      <BulletListItem text="Formation du pôle Communication, Marketing, Recherche">
        <ActionPlanTag />
      </BulletListItem>
    </VerticalUl>
  </React.Fragment>
)
