import React, { forwardRef, LegacyRef } from 'react'
import { ActivityIndicator, View } from 'react-native'
import styled from 'styled-components/native'

import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { More } from 'ui/svg/icons/More'
import { getSpacing, Spacer } from 'ui/theme'

export interface SearchListFooterProps {
  isFetchingNextPage: boolean
  nbLoadedHits: number
  nbHits: number
  autoScrollEnabled: boolean
  onPress?: () => void
}

export const SearchListFooter: React.FC<SearchListFooterProps> = forwardRef(
  ({ isFetchingNextPage, nbLoadedHits, nbHits, autoScrollEnabled, onPress }, ref) => {
    const showMoreButton = !autoScrollEnabled && nbLoadedHits < nbHits
    return isFetchingNextPage && nbLoadedHits < nbHits ? (
      <View ref={ref as LegacyRef<View>}>
        <Spacer.Column numberOfSpaces={4} />
        <ActivityIndicator testID="activity-indicator" />
        <Spacer.Column numberOfSpaces={4} />
        <Footer testID="footer" />
      </View>
    ) : (
      <React.Fragment>
        {!!showMoreButton && <Separator />}
        <Footer>
          {!!showMoreButton && (
            <ButtonSecondary
              mediumWidth
              icon={More}
              wording="Afficher plus de résultats"
              onPress={onPress}
            />
          )}
        </Footer>
      </React.Fragment>
    )
  }
)
SearchListFooter.displayName = 'SearchListFooter'

const Footer = styled.View(({ theme }) => ({
  height: theme.tabBar.height + getSpacing(10),
  alignItems: 'center',
}))

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
  marginHorizontal: getSpacing(6),
  marginVertical: getSpacing(4),
}))
