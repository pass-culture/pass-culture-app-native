import React, { memo, useEffect } from 'react'
import styled from 'styled-components/native'

import { ExclusivityImage } from 'features/home/components/modules/ExclusivityImage'
import { ExclusivityModuleProps } from 'features/home/components/modules/ExclusivityModule'
import { ContentTypes } from 'features/home/contentful'
import { analytics } from 'libs/firebase/analytics'

type ExclusivityBannerProps = Omit<ExclusivityModuleProps, 'offerId'>

const UnmemoizedExclusivityBanner = ({
  alt,
  image: imageURL,
  moduleId,
  homeEntryId,
  index,
}: ExclusivityBannerProps) => {
  useEffect(() => {
    analytics.logModuleDisplayedOnHomepage(moduleId, ContentTypes.EXCLUSIVITY, index, homeEntryId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, homeEntryId])

  return (
    <ImageContainer testID="exclusivity-banner">
      <ExclusivityImage imageURL={imageURL} alt={alt} />
    </ImageContainer>
  )
}

export const ExclusivityBanner = memo(UnmemoizedExclusivityBanner)

const ImageContainer = styled.View({
  flex: 1,
})
