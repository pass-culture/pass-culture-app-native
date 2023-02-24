import React from 'react'
import styled from 'styled-components/native'

import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { EyeSophisticated as DefaultEyeSophisticated } from 'ui/svg/icons/EyeSophisticated'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type Props = {
  title: string
  onPressSeeMore: () => void
  titleSeeMoreLink: InternalNavigationProps['navigateTo']
}

export const SeeMoreWithEye = ({ title, onPressSeeMore, titleSeeMoreLink }: Props) => (
  <React.Fragment>
    <Spacer.Row numberOfSpaces={4} />
    <TitleSeparator />
    <Spacer.Row numberOfSpaces={3} />
    <StyledTouchableLink
      navigateTo={titleSeeMoreLink}
      onBeforeNavigate={onPressSeeMore}
      accessibilityLabel={`Voir plus d’offres de la sélection ${title}`}>
      <EyeSophisticated />
      <Spacer.Row numberOfSpaces={2} />
      <StyledButtonText>En voir plus</StyledButtonText>
    </StyledTouchableLink>
  </React.Fragment>
)

const TitleSeparator = styled.View(({ theme }) => ({
  width: 1,
  height: getSpacing(5),
  backgroundColor: theme.colors.greyMedium,
}))

const StyledTouchableLink: typeof InternalTouchableLink = styled(InternalTouchableLink).attrs(
  ({ theme }) => ({
    hoverUnderlineColor: theme.colors.primary,
  })
)({
  flexDirection: 'row',
  alignItems: 'center',
  padding: getSpacing(1),
})

const StyledButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.primary,
}))

const EyeSophisticated = styled(DefaultEyeSophisticated).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.primary,
}))``
