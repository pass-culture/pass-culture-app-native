import React, { ComponentProps } from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

import { Li } from 'ui/components/Li'
import { Button } from 'ui/designSystem/Button/Button'
import { PlainMore } from 'ui/svg/icons/PlainMore'

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
      <Footer>
        {showMoreButton ? (
          <Button
            variant="secondary"
            icon={PlainMore}
            wording="Afficher plus de résultats"
            onPress={onPress}
            fullWidth
          />
        ) : null}
      </Footer>
    </Li>
  )
}

SearchListFooter.displayName = 'SearchListFooter'

const Footer = styled.View(({ theme }) => ({
  height: theme.tabBar.height + theme.designSystem.size.spacing.xxxl,
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledActivityIndicator = styled(ActivityIndicator)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
