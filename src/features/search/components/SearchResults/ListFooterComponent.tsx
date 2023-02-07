import React, { forwardRef } from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'

import { SearchHit } from 'libs/search'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { More } from 'ui/svg/icons/More'
import { getSpacing, Spacer } from 'ui/theme'

export interface ListFooterComponentProps {
  isFetchingNextPage: boolean
  hits: SearchHit[]
  nbHits: number
  autoScrollEnabled: boolean
  onPress?: () => void
}

export const ListFooterComponent: React.FC<ListFooterComponentProps> = forwardRef(
  ({ isFetchingNextPage, hits, nbHits, autoScrollEnabled, onPress }, ref) => {
    const showMoreButton = !autoScrollEnabled && hits.length < nbHits

    return isFetchingNextPage && hits.length < nbHits ? (
      <React.Fragment ref={ref}>
        <Spacer.Column numberOfSpaces={4} />
        <ActivityIndicator testID="activity-indicator" />
        <Spacer.Column numberOfSpaces={4} />
        <Footer testID="footer" />
      </React.Fragment>
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
ListFooterComponent.displayName = 'ListFooterComponent'

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
