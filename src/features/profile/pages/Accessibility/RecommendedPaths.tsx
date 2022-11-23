import React from 'react'

import { PageProfileSection } from 'features/profile/pages/PageProfileSection/PageProfileSection'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ButtonInsideText } from 'ui/components/buttons/buttonInsideText/ButtonInsideText'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK, LINE_BREAK } from 'ui/theme/constants'

export function RecommendedPaths() {
  return (
    <PageProfileSection title="Parcours recommandés">
      <Typo.Body>
        En complément de la mise en conformité du pass Culture au regard des critères du RGAA qui
        reste partielle, les équipes du pass Culture se sont attachées à travailler des parcours
        critiques pour l’utilisation de son dispositif.
        {DOUBLE_LINE_BREAK}
        En particulier, l’obtention du crédit pass Culture peut se faire selon trois méthodes en
        fonction de sa situation&nbsp;:
        {DOUBLE_LINE_BREAK}
        <VerticalUl>
          <BulletListItem text="en indiquant ses identifiants EduConnect" />
          <BulletListItem text="en présentant sa carte d’identité" />
          <BulletListItem text="en remplissant un formulaire sur ">
            <TouchableLink
              as={ButtonInsideText}
              typography="Caption"
              wording="Démarches simplifiées"
              icon={ExternalSiteFilled}
              externalNav={{ url: 'https://www.demarches-simplifiees.fr/' }}
            />
          </BulletListItem>
        </VerticalUl>
        {DOUBLE_LINE_BREAK}
        Pour les utilisateurs en situation de handicap, il est recommandé d’utiliser ses
        identifiants EduConnect ou de passer par la plateforme Démarches simplifiées.
        {LINE_BREAK}
        Ces sites étant gérés par la Direction Interministérielle du Numérique ou par le Ministère
        de l’Éducation Nationale de la Jeunesse et des Sports, leur niveau d’accessibilité est
        maintenu dans le temps.
      </Typo.Body>
    </PageProfileSection>
  )
}
