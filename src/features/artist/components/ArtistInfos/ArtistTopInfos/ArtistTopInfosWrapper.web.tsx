import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'

export const ArtistTopInfosWrapper = styled(ViewGap)(({ theme }) => ({
  alignItems: 'center',
  flexDirection: theme.isDesktopViewport ? 'row' : undefined,
  marginLeft: theme.isDesktopViewport ? theme.contentPage.marginHorizontal : 0, // this should not be defined here
}))
