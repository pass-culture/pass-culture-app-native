import React, { ElementType, memo, useEffect } from 'react'
import styled from 'styled-components/native'

import { ExclusivityImage } from 'features/home/components/modules/exclusivity/ExclusivityImage'
import { ExclusivityBannerProps } from 'features/home/components/modules/exclusivity/ExclusivityModule'
import { isAppUrl } from 'features/navigation/helpers'
import { ContentTypes } from 'libs/contentful'
import { analytics } from 'libs/firebase/analytics'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
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

  const isUrlAnInternalUrl = isAppUrl(url)

  const TouchableLinkComponent: ElementType = isUrlAnInternalUrl
    ? StyledInternalTouchableLink
    : StyledExternalTouchableLink

  const touchableLinkProps = isUrlAnInternalUrl
    ? { navigateTo: { internalUrl: url } }
    : { externalNav: { url } }

  const sharedLinkProps = {
    highlight: true,
    accessibilityLabel: alt,
    isFocus,
    style,
    onFocus,
    onBlur,
  }

  return (
    <TouchableLinkComponent {...sharedLinkProps} {...touchableLinkProps}>
      <ExclusivityImage imageURL={imageURL} alt={alt} />
    </TouchableLinkComponent>
  )
}

export const ExclusivityExternalLink = memo(UnmemoizedExclusivityExternalLink)

const StyledExternalTouchableLink = styled(ExternalTouchableLink)<{
  isFocus?: boolean
}>(({ theme, isFocus }) => ({
  flex: 1,
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))

const StyledInternalTouchableLink = styled(InternalTouchableLink)<{
  isFocus?: boolean
}>(({ theme, isFocus }) => ({
  flex: 1,
  borderRadius: theme.borderRadius.radius,
  ...customFocusOutline({ isFocus, color: theme.colors.black }),
}))
