import React from 'react'
import styled from 'styled-components/native'

import { getProfilePropConfig } from 'features/navigation/navigators/ProfileStackNavigator/getProfilePropConfig'
import { BulletListItem } from 'ui/components/BulletListItem'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { Link } from 'ui/designSystem/Link/Link'
import { Typo } from 'ui/theme'
import { getTextSemanticAttrs } from 'ui/theme/typographyAttrs/getTextSemanticAttrs'

export const AccessibilityFeatures = () => (
  <React.Fragment>
    <TitleText>Fonctionnalités d’accessibilité</TitleText>
    <VerticalUl gap={6}>
      <BulletListItem
        groupLabel="Fonctionnalités d’accessibilité"
        text="Un mode sombre permettant d’utiliser l’application avec un thème sombre afin de réduire l’éblouissement, améliorer le confort visuel dans les environnements peu éclairés et répondre aux préférences d’affichage de l’utilisateur. "
        index={0}
        total={2}>
        <InternalTouchableLink
          as={Link}
          isInsideText
          variant="tertiary"
          wording="Voir la fonctionnalité."
          navigateTo={getProfilePropConfig('Appearance')}
        />
      </BulletListItem>
      <BulletListItem
        groupLabel="Fonctionnalités d’accessibilité"
        text="Utiliser l’application en orientation paysage lorsque l’appareil est tourné, offrant une plus grande flexibilité d’utilisation et répondant aux besoins de certains utilisateurs ou dispositifs d’assistance. "
        index={1}
        total={2}>
        <InternalTouchableLink
          as={Link}
          isInsideText
          variant="tertiary"
          wording="Voir la fonctionnalité."
          navigateTo={getProfilePropConfig('Appearance')}
        />
      </BulletListItem>
    </VerticalUl>
  </React.Fragment>
)

const TitleText = styled(Typo.Title4).attrs(getTextSemanticAttrs(2))``
