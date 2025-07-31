import React, { ComponentProps } from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { Li } from 'ui/components/Li'
import { More } from 'ui/svg/icons/More'
import { getSpacing } from 'ui/theme'

export interface SearchListFooterProps {
  isFetchingNextPage: boolean
  nbLoadedHits: number
  nbHits: number
  autoScrollEnabled: boolean
  onPress?: VoidFunction
  style?: ComponentProps<typeof Li>['style']
}

export const SearchListFooter = ({
  isFetchingNextPage,
  nbLoadedHits,
  nbHits,
  autoScrollEnabled,
  onPress,
  style,
}: SearchListFooterProps) => {
  const showMoreButton = !autoScrollEnabled && nbLoadedHits < nbHits

  return isFetchingNextPage && nbLoadedHits < nbHits ? (
    <Li style={style}>
      <StyledActivityIndicator testID="activity-indicator" />
      <Footer testID="footer" />
    </Li>
  ) : (
    <Li style={style}>
      {showMoreButton ? <Separator /> : null}
      <Footer>
        {showMoreButton ? (
          <ButtonSecondary
            mediumWidth
            icon={More}
            wording="Afficher plus de résultats"
            onPress={onPress}
          />
        ) : null}
      </Footer>
    </Li>
  )
}

SearchListFooter.displayName = 'SearchListFooter'

const Footer = styled.View(({ theme }) => ({
  height: theme.tabBar.height + getSpacing(10),
  alignItems: 'center',
}))

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.designSystem.color.background.subtle,
  marginHorizontal: theme.designSystem.size.spacing.xl,
  marginVertical: theme.designSystem.size.spacing.l,
}))

const StyledActivityIndicator = styled(ActivityIndicator)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
