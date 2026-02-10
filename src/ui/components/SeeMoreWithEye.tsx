import React from 'react'
import styled from 'styled-components/native'

import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { Button } from 'ui/designSystem/Button/Button'
import { EyeSophisticated } from 'ui/svg/icons/EyeSophisticated'

type Props = {
  title: string
  onPressSeeMore: () => void
  titleSeeMoreLink?: InternalNavigationProps['navigateTo']
}

export const SeeMoreWithEye = ({ title, onPressSeeMore, titleSeeMoreLink }: Props) => {
  const accessibilityLabel = `Voir plus d’offres de la sélection ${title}`

  return (
    <React.Fragment>
      <TitleSeparator />
      {titleSeeMoreLink ? (
        <InternalTouchableLink
          as={Button}
          navigateTo={titleSeeMoreLink}
          onBeforeNavigate={onPressSeeMore}
          wording="Voir tout"
          accessibilityLabel={accessibilityLabel}
          icon={EyeSophisticated}
          variant="tertiary"
          color="neutral"
        />
      ) : (
        <Button
          wording="Voir tout"
          onPress={onPressSeeMore}
          accessibilityLabel={accessibilityLabel}
          icon={EyeSophisticated}
          variant="tertiary"
          color="neutral"
        />
      )}
    </React.Fragment>
  )
}

const TitleSeparator = styled.View(({ theme }) => ({
  width: 1,
  height: theme.designSystem.size.spacing.xl,
  backgroundColor: theme.designSystem.color.background.subtle,
  marginHorizontal: theme.designSystem.size.spacing.l,
  alignSelf: 'center',
}))
