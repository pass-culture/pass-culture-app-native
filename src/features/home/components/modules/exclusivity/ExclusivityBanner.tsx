import React, { memo, useEffect } from 'react'
import styled from 'styled-components/native'

import { ExclusivityImage } from 'features/home/components/modules/exclusivity/ExclusivityImage'
import { ExclusivityBannerProps } from 'features/home/components/modules/exclusivity/ExclusivityModule'
import { ContentTypes } from 'libs/contentful'
import { analytics } from 'libs/firebase/analytics'

const UnmemoizedExclusivityBanner = ({
  alt,
  image: imageURL,
  moduleId,
  homeEntryId,
  index,
  style,
}: ExclusivityBannerProps) => {
  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage(moduleId, ContentTypes.EXCLUSIVITY, index, homeEntryId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, homeEntryId])

  return (
    <ImageContainer style={style} testID="exclusivity-banner">
      <ExclusivityImage imageURL={imageURL} alt={alt} />
    </ImageContainer>
  )
}

export const ExclusivityBanner = memo(UnmemoizedExclusivityBanner)

const ImageContainer = styled.View({
  flex: 1,
})
