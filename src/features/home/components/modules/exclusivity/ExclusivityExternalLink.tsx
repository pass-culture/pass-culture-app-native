import React, { memo, useEffect } from 'react'
import styled from 'styled-components/native'

import { ExclusivityImage } from 'features/home/components/modules/exclusivity/ExclusivityImage'
import { ExclusivityBannerProps } from 'features/home/components/modules/exclusivity/ExclusivityModule'
import { ContentTypes } from 'libs/contentful'
import { analytics } from 'libs/firebase/analytics'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { customFocusOutline } from 'ui/theme/customFocusOutline/customFocusOutline'

interface ExclusivityExternalLinkProps extends ExclusivityBannerProps {
  url: string
}

const UnmemoizedExclusivityExternalLink = ({
  alt,
  image: imageURL,
  moduleId,
  homeEntryId,
  index,
  url,
  style,
}: ExclusivityExternalLinkProps) => {
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage(moduleId, ContentTypes.EXCLUSIVITY, index, homeEntryId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, homeEntryId])

  return (
    <StyledTouchableLink
      highlight
      onFocus={onFocus}
      onBlur={onBlur}
      isFocus={isFocus}
      externalNav={{ url }}
      style={style}
      accessibilityLabel={alt}>
      <ExclusivityImage imageURL={imageURL} alt={alt} />
    </StyledTouchableLink>
  )
}

export const ExclusivityExternalLink = memo(UnmemoizedExclusivityExternalLink)

const StyledTouchableLink = styled(ExternalTouchableLink)<{
  isFocus?: boolean
}>(({ theme, isFocus }) => ({
  flex: 1,
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))
