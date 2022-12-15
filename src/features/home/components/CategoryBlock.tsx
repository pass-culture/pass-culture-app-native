import colorAlpha from 'color-alpha'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { theme } from 'theme'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { getSpacing, Typo } from 'ui/theme'

interface FilterProps {
  color: string
  opacity: number
}

interface CategoryBlockProps {
  title: string
  url: string
  filter: FilterProps
  imageUrl?: string
}
export const CategoryBlock: FunctionComponent<CategoryBlockProps> = ({
  title,
  url,
  imageUrl,
  filter,
}) => {
  return (
    <StyledExternalTouchableLink externalNav={{ url: url }}>
      <ImageBackground source={{ uri: imageUrl }}>
        <ContainerWithFilter filter={filter}>
          <StyledTitle numberOfLines={2}>{title}</StyledTitle>
        </ContainerWithFilter>
      </ImageBackground>
    </StyledExternalTouchableLink>
  )
}

const ContainerWithFilter = styled.View<{ filter: FilterProps }>(({ filter }) => ({
  paddingVertical: getSpacing(4),
  paddingHorizontal: getSpacing(3),
  backgroundColor: colorAlpha(filter.color, filter.opacity),
  flex: 1,
  borderRadius: theme.borderRadius.radius,
}))

const StyledTitle = styled(Typo.ButtonText)({
  color: theme.colors.white,
})

const ImageBackground = styled.ImageBackground({
  //the overflow: hidden allow to add border radius to the image
  //https://stackoverflow.com/questions/49442165/how-do-you-add-borderradius-to-imagebackground/57616397
  overflow: 'hidden',
  borderRadius: theme.borderRadius.radius,
  flex: 1,
})

const StyledExternalTouchableLink = styled(ExternalTouchableLink)({
  flex: 1,
  height: getSpacing(18),
})
