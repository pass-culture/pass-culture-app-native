import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const ArtistHeaderWrapper = styled(ViewGap)(({ theme }) => ({
  alignItems: 'center',
  flexDirection: theme.isDesktopViewport ? 'row' : undefined,
  marginLeft: theme.isDesktopViewport ? theme.contentPage.marginHorizontal : 0, // this should not be defined here
}))

// Header is a row on desktop: name and children are left-aligned next to the avatar
export const ArtistNameContainer = styled(ViewGap)(({ theme }) => ({
  alignItems: theme.isDesktopViewport ? 'flex-start' : 'center',
}))
