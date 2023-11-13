import React from 'react'
import { ActivityIndicator, View } from 'react-native'
import styled from 'styled-components/native'

import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { OnLayoutProps } from 'ui/components/OptimizedList/types'
import { More } from 'ui/svg/icons/More'
import { getSpacing, Spacer } from 'ui/theme'

export interface SearchListFooterProps extends Partial<OnLayoutProps> {
  isFetchingNextPage: boolean
  nbLoadedHits: number
  nbHits: number
  autoScrollEnabled: boolean
  onPress?: VoidFunction
}

export const SearchListFooter = ({
  isFetchingNextPage,
  nbLoadedHits,
  nbHits,
  autoScrollEnabled,
  onPress,
  onLayout,
}: SearchListFooterProps) => {
  const showMoreButton = !autoScrollEnabled && nbLoadedHits < nbHits

  return isFetchingNextPage && nbLoadedHits < nbHits ? (
    <View onLayout={onLayout}>
      <Spacer.Column numberOfSpaces={4} />
      <ActivityIndicator testID="activity-indicator" />
      <Spacer.Column numberOfSpaces={4} />
      <Footer testID="footer" />
    </View>
  ) : (
    <Footer onLayout={onLayout}>
      {showMoreButton ? (
        <ButtonSecondary
          mediumWidth
          icon={More}
          wording="Afficher plus de résultats"
          onPress={onPress}
        />
      ) : null}
    </Footer>
  )
}

SearchListFooter.displayName = 'SearchListFooter'

const Footer = styled(View)(({ theme }) => ({
  height: theme.tabBar.height + getSpacing(10),
  alignItems: 'center',
}))
