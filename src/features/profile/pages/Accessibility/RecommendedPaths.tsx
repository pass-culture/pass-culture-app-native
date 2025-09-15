import React from 'react'

import { getProfileHookConfig } from 'features/navigation/ProfileStackNavigator/getProfileHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { BulletListItem } from 'ui/components/BulletListItem'
import { LinkInsideText } from 'ui/components/buttons/linkInsideText/LinkInsideText'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { SecondaryPageWithBlurHeader } from 'ui/pages/SecondaryPageWithBlurHeader'
import { Spacer, Typo } from 'ui/theme'
import { DOUBLE_LINE_BREAK, LINE_BREAK } from 'ui/theme/constants'

export function RecommendedPaths() {
  const { goBack } = useGoBack(...getProfileHookConfig('Accessibility'))
  return (
    <SecondaryPageWithBlurHeader
      title="Parcours recommandés web"
      enableMaxWidth={false}
      onGoBack={goBack}>
      <Typo.Body>
        En complément de la mise en conformité du pass Culture au regard des critères du RGAA qui
        reste partielle, les équipes du pass Culture se sont attachées à travailler des parcours
        critiques pour l’utilisation de son dispositif.
        {DOUBLE_LINE_BREAK}
        En particulier, l’obtention du crédit pass Culture peut se faire selon trois méthodes en
        fonction de sa situation&nbsp;:
      </Typo.Body>
      <Spacer.Column numberOfSpaces={5} />
      <VerticalUl>
        <BulletListItem text="en indiquant ses identifiants EduConnect" />
        <BulletListItem text="en présentant sa carte d’identité" />
        <BulletListItem text="en remplissant un formulaire sur ">
          <ExternalTouchableLink
            as={LinkInsideText}
            typography="BodyAccentXs"
            wording="Démarches simplifiées"
            externalNav={{ url: 'https://www.demarches-simplifiees.fr/' }}
            type={AccessibilityRole.LINK}
          />
        </BulletListItem>
      </VerticalUl>
      <Spacer.Column numberOfSpaces={5} />
      <Typo.Body>
        Pour les utilisateurs en situation de handicap, il est recommandé d’utiliser ses
        identifiants EduConnect ou de passer par la plateforme Démarches simplifiées.
        {LINE_BREAK}
        Ces sites étant gérés par la Direction Interministérielle du Numérique ou par le Ministère
        de l’Éducation Nationale de la Jeunesse et des Sports, leur niveau d’accessibilité est
        maintenu dans le temps.
      </Typo.Body>
    </SecondaryPageWithBlurHeader>
  )
}
