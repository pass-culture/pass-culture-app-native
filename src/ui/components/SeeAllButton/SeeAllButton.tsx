import React from 'react'
import { Platform } from 'react-native'

import { SeeAllButtonWrapper } from 'ui/components/SeeAllButton/SeeAllButtonWrapper'
import { SeeAllInSearchButton } from 'ui/components/SeeAllButton/SeeAllInSearchButton'
import { SeeAllInVerticalPlaylistButton } from 'ui/components/SeeAllButton/SeeAllInVerticalPlaylistButton'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

const isWeb = Platform.OS === 'web'

type Props = {
  playlistTitle: string
  data?: {
    onBeforeNavigate: () => void
    navigateToSearchPlaylist?: InternalNavigationProps['navigateTo']
    navigateToVerticalPlaylist?: InternalNavigationProps['navigateTo']
    hidePlaylistSeeAll?: boolean
    hideSearchSeeAll?: boolean
  }
}

export const SeeAllButton = ({ playlistTitle, data }: Props) => {
  const noSeeAllButton = !data
  const accessibilityLabel = `Tout voir pour la sélection ${playlistTitle}`

  if (noSeeAllButton) return null

  const {
    navigateToSearchPlaylist,
    navigateToVerticalPlaylist,
    hidePlaylistSeeAll = false,
    hideSearchSeeAll = false,
    onBeforeNavigate,
  } = data

  const noNavigationToAnyPlaylist = !navigateToSearchPlaylist && !navigateToVerticalPlaylist
  const showSeeAllInVerticalButton = !hidePlaylistSeeAll && !isWeb
  const showSeeAllInSearchButton = !hideSearchSeeAll

  if (noNavigationToAnyPlaylist) return null

  if (navigateToVerticalPlaylist && showSeeAllInVerticalButton) {
    return (
      <SeeAllButtonWrapper>
        <SeeAllInVerticalPlaylistButton
          accessibilityLabel={accessibilityLabel}
          onBeforeNavigate={onBeforeNavigate}
          navigateTo={navigateToVerticalPlaylist}
        />
      </SeeAllButtonWrapper>
    )
  }

  if (navigateToSearchPlaylist && showSeeAllInSearchButton) {
    return (
      <SeeAllButtonWrapper>
        <SeeAllInSearchButton
          accessibilityLabel={accessibilityLabel}
          onBeforeNavigate={onBeforeNavigate}
          navigateTo={navigateToSearchPlaylist}
        />
      </SeeAllButtonWrapper>
    )
  }

  return null
}
