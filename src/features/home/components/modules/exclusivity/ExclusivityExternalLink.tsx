import React, { memo, useEffect, useState } from 'react'
import styled from 'styled-components/native'

import { ExclusivityImage } from 'features/home/components/modules/exclusivity/ExclusivityImage'
import { ExclusivityModuleProps } from 'features/home/components/modules/exclusivity/ExclusivityModule'
import { ContentTypes } from 'features/home/contentful'
import { analytics } from 'libs/firebase/analytics'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

interface ExclusivityExternalLinkProps extends ExclusivityModuleProps {
  url: string
}

const UnmemoizedExclusivityExternalLink = ({
  alt,
  image: imageURL,
  moduleId,
  homeEntryId,
  index,
  url,
}: ExclusivityExternalLinkProps) => {
  const [isFocus, setIsFocus] = useState(false)
  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage(moduleId, ContentTypes.EXCLUSIVITY, index, homeEntryId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, homeEntryId])

  return (
    <StyledTouchableLink
      highlight
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      isFocus={isFocus}
      externalNav={{ url }}
      testID="exclusivity-external-link">
      <ExclusivityImage imageURL={imageURL} alt={alt} />
    </StyledTouchableLink>
  )
}

export const ExclusivityExternalLink = memo(UnmemoizedExclusivityExternalLink)

const StyledTouchableLink = styled(TouchableLink)<{ isFocus?: boolean }>(({ theme, isFocus }) => ({
  flex: 1,
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))
