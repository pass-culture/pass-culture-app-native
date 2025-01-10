import React from 'react'

import {
  ActionPlanStatus,
  ActionPlanTag,
} from 'features/profile/components/Buttons/ActionPlanTag/ActionPlanTag'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Spacer, TypoDS } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const AccessibilityActionPlan2024 = () => (
  <React.Fragment>
    <TypoDS.Title4 {...getHeadingAttrs(2)}>Plan annuel 2024</TypoDS.Title4>
    <Spacer.Column numberOfSpaces={6} />
    <VerticalUl>
      <BulletListItem text="Mise en place d’une solution permettant aux jeunes en situation de handicap de retrouver facilement les offres accessibles">
        <ActionPlanTag status={ActionPlanStatus.DONE} />
      </BulletListItem>

      <BulletListItem>
        <TypoDS.Body>
          Publier la déclaration d’accessibilité du site{' '}
          <ExternalTouchableLink
            as={ButtonInsideText}
            typography="BodyAccentXs"
            wording="https://passculture.pro/"
            icon={ExternalSiteFilled}
            externalNav={{ url: 'https://passculture.pro/' }}
          />
          <ActionPlanTag status={ActionPlanStatus.DONE} />
        </TypoDS.Body>
      </BulletListItem>

      <BulletListItem text="Intégrer les données d’Acceslibre pour améliorer l’information sur l’accessibilité des lieux">
        <ActionPlanTag status={ActionPlanStatus.DONE} />
      </BulletListItem>

      <BulletListItem text="Mener des actions de sensibilisation des partenaires culturels sur l’information d’accessibilité de leurs lieux">
        <ActionPlanTag status={ActionPlanStatus.DONE} />
      </BulletListItem>

      <BulletListItem>
        <TypoDS.Body>
          Publier la déclaration d’accessibilité du site{' '}
          <ExternalTouchableLink
            as={ButtonInsideText}
            typography="BodyAccentXs"
            wording="https://pass.culture.fr/"
            icon={ExternalSiteFilled}
            externalNav={{ url: 'https://pass.culture.fr/' }}
          />
          <ActionPlanTag status={ActionPlanStatus.DONE} />
        </TypoDS.Body>
      </BulletListItem>

      <BulletListItem>
        <TypoDS.Body>
          Formation des Product Manager du site{' '}
          <ExternalTouchableLink
            as={ButtonInsideText}
            typography="BodyAccentXs"
            wording="https://passculture.pro/"
            icon={ExternalSiteFilled}
            externalNav={{ url: 'https://passculture.pro/' }}
          />
          <ActionPlanTag status={ActionPlanStatus.DONE} />
        </TypoDS.Body>
      </BulletListItem>

      <BulletListItem text="Sensibilisation des équipes internes aux enjeux d’accessibilité">
        <ActionPlanTag status={ActionPlanStatus.DONE} />
      </BulletListItem>

      <BulletListItem text="Mettre en place une charte graphique 100% accessible">
        <ActionPlanTag status={ActionPlanStatus.TODO} />
      </BulletListItem>

      <BulletListItem text="Réaliser un nouvel audit d’accessibilité du portail pro par un cabinet externe">
        <ActionPlanTag status={ActionPlanStatus.TODO} />
      </BulletListItem>

      <BulletListItem>
        <TypoDS.Body>
          Rendre le site{' '}
          <ExternalTouchableLink
            as={ButtonInsideText}
            typography="BodyAccentXs"
            wording="https://passculture.app/"
            icon={ExternalSiteFilled}
            externalNav={{ url: 'https://passculture.app/' }}
          />{' '}
          100% accessible
          <ActionPlanTag status={ActionPlanStatus.ONGOING} />
        </TypoDS.Body>
      </BulletListItem>

      <BulletListItem text="Améliorer la lisibilité de l’accessibilité des offres avec la mise en place des modalités d’accessibilité par offre">
        <ActionPlanTag status={ActionPlanStatus.ONGOING} />
      </BulletListItem>
    </VerticalUl>
  </React.Fragment>
)
