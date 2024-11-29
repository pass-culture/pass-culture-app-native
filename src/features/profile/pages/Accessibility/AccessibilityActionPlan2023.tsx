import React from 'react'

import { ActionPlanTag } from 'features/profile/components/Buttons/ActionPlanTag/ActionPlanTag'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const AccessibilityActionPlan2023 = () => (
  <React.Fragment>
    <TypoDS.Title4 {...getHeadingAttrs(2)}>Plan annuel 2023</TypoDS.Title4>
    <Spacer.Column numberOfSpaces={6} />
    <VerticalUl>
      <BulletListItem text="Formation des équipes produit aux enjeux de l’accessibilité">
        <ActionPlanTag />
      </BulletListItem>

      <BulletListItem text="Formation des équipes territoires à l’accompagnement direct de jeunes en situation de handicap">
        <ActionPlanTag />
      </BulletListItem>

      <BulletListItem text="Formation des développeurs du site ">
        <ExternalTouchableLink
          as={ButtonInsideText}
          typography="Caption"
          wording="https://passculture.pro/"
          icon={ExternalSiteFilled}
          externalNav={{ url: 'https://passculture.pro/' }}
        />
        <ActionPlanTag />
      </BulletListItem>

      <BulletListItem text="Réalisation d’un audit d’accessibilité du site ">
        <ExternalTouchableLink
          as={ButtonInsideText}
          typography="Caption"
          wording="https://passculture.pro/"
          icon={ExternalSiteFilled}
          externalNav={{ url: 'https://passculture.pro/' }}
        />
        <ActionPlanTag />
      </BulletListItem>

      <BulletListItem text="Diffusion d’information sur le pass Culture via les MDPH (Maisons départementales des personnes handicapées)">
        <ActionPlanTag />
      </BulletListItem>

      <BulletListItem>
        <TypoDS.Body>
          Maquettage d’un nouveau site{' '}
          <ExternalTouchableLink
            as={ButtonInsideText}
            typography="Caption"
            wording="https://pass.culture.fr/"
            icon={ExternalSiteFilled}
            externalNav={{ url: 'https://pass.culture.fr/' }}
          />{' '}
          100% accessible
          <ActionPlanTag />
        </TypoDS.Body>
      </BulletListItem>

      <BulletListItem text="Mise en place d’un partenariat avec Acceslibre pour compléter les informations d’accessibilité des partenaires culturels">
        <ActionPlanTag />
      </BulletListItem>
    </VerticalUl>
  </React.Fragment>
)
