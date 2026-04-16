import React from 'react'

import { SeeAllButtonWrapper } from 'ui/components/SeeAllButton/SeeAllButtonWrapper'
import { SeeAllInSearchButton } from 'ui/components/SeeAllButton/SeeAllInSearchButton'
import { SeeAllInVerticalPlaylistButton } from 'ui/components/SeeAllButton/SeeAllInVerticalPlaylistButton'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

type Props = {
  playlistTitle: string
  seeAllButton?: {
    onBeforeNavigate: () => void
    navigateToSearchPlaylist?: InternalNavigationProps['navigateTo']
    navigateToVerticalPlaylist?: InternalNavigationProps['navigateTo']
    hideSeeAllButton?: boolean
  }
}

export const SeeAllButton = ({ playlistTitle, seeAllButton }: Props) => {
  const noSeeAllButton = !seeAllButton
  const accessibilityLabel = `Tout voir pour la sélection ${playlistTitle}`

  if (noSeeAllButton) return null

  const {
    navigateToSearchPlaylist,
    navigateToVerticalPlaylist,
    hideSeeAllButton,
    onBeforeNavigate,
  } = seeAllButton

  const noNavigationToAnyPlaylist = !navigateToSearchPlaylist && !navigateToVerticalPlaylist
  const showSeeAllButton = !hideSeeAllButton

  if (noNavigationToAnyPlaylist) return null

  if (navigateToVerticalPlaylist && showSeeAllButton) {
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

  if (navigateToSearchPlaylist) {
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
