import React from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { Touchable } from 'ui/components/touchable/Touchable'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { EyeSophisticated as DefaultEyeSophisticated } from 'ui/svg/icons/EyeSophisticated'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHoverStyle } from 'ui/theme/getHoverStyle/getHoverStyle'

type Props = {
  title: string
  onPressSeeMore: () => void
  titleSeeMoreLink?: InternalNavigationProps['navigateTo']
}

export const SeeMoreWithEye = ({ title, onPressSeeMore, titleSeeMoreLink }: Props) => {
  return (
    <React.Fragment>
      <Spacer.Row numberOfSpaces={4} />
      <TitleSeparator />
      <Spacer.Row numberOfSpaces={3} />
      {titleSeeMoreLink ? (
        <StyledTouchableLink
          navigateTo={titleSeeMoreLink}
          onBeforeNavigate={onPressSeeMore}
          accessibilityLabel={`Voir plus d’offres de la sélection ${title}`}
          highlight={false}>
          <EyeSophisticated />
          <Spacer.Row numberOfSpaces={2} />
          <StyledButtonText>Voir tout</StyledButtonText>
        </StyledTouchableLink>
      ) : (
        <StyledTouchable
          onPress={onPressSeeMore}
          accessibilityLabel={`Voir plus d’offres de la sélection ${title}`}>
          <React.Fragment>
            <EyeSophisticated />
            <Spacer.Row numberOfSpaces={2} />
            <StyledButtonText>Voir tout</StyledButtonText>
          </React.Fragment>
        </StyledTouchable>
      )}
    </React.Fragment>
  )
}

const TitleSeparator = styled.View(({ theme }) => ({
  width: 1,
  height: getSpacing(5),
  backgroundColor: theme.colors.greyMedium,
}))

const StyledTouchableLink: typeof InternalTouchableLink = styled(InternalTouchableLink).attrs(
  ({ theme }) => ({
    hoverUnderlineColor: theme.colors.black,
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
  ...getHoverStyle(theme.colors.black),
}))

const StyledButtonText = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.black,
}))

const EyeSophisticated = styled(DefaultEyeSophisticated).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.colors.black,
}))``
