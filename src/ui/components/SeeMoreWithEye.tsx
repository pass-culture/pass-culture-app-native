import React from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { EyeSophisticated as DefaultEyeSophisticated } from 'ui/svg/icons/EyeSophisticated'
import { getSpacing, Typo } from 'ui/theme'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type Props = {
  title: string
  onPressSeeMore: () => void
  titleSeeMoreLink?: InternalNavigationProps['navigateTo']
}

export const SeeMoreWithEye = ({ title, onPressSeeMore, titleSeeMoreLink }: Props) => {
  return (
    <React.Fragment>
      <TitleSeparator />
      {titleSeeMoreLink ? (
        <StyledTouchableLink
          navigateTo={titleSeeMoreLink}
          onBeforeNavigate={onPressSeeMore}
          accessibilityLabel={`Voir plus d’offres de la sélection ${title}`}
          highlight={false}>
          <EyeSophisticated />
          <SeeAllText>Voir tout</SeeAllText>
        </StyledTouchableLink>
      ) : (
        <StyledTouchable
          onPress={onPressSeeMore}
          accessibilityLabel={`Voir plus d’offres de la sélection ${title}`}>
          <React.Fragment>
            <EyeSophisticated />
            <SeeAllText>Voir tout</SeeAllText>
          </React.Fragment>
        </StyledTouchable>
      )}
    </React.Fragment>
  )
}

const TitleSeparator = styled.View(({ theme }) => ({
  width: 1,
  height: getSpacing(5),
  backgroundColor: theme.designSystem.color.background.subtle,
  marginLeft: getSpacing(4),
  marginRight: getSpacing(3),
}))

const StyledTouchableLink: typeof InternalTouchableLink = styled(InternalTouchableLink).attrs(
  ({ theme }) => ({
    hoverUnderlineColor: theme.designSystem.color.text.default,
  })
)({
  flexDirection: 'row',
  alignItems: 'center',
  padding: getSpacing(1),
})

const StyledTouchable = styledButton(Touchable)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  padding: getSpacing(1),
  ...getHoverStyle({ underlineColor: theme.designSystem.color.text.default }),
}))

const EyeSophisticated = styled(DefaultEyeSophisticated).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const SeeAllText = styled(Typo.BodyAccent)({
  marginLeft: getSpacing(2),
})
