import React, { Fragment, FunctionComponent } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { SectionWithDivider } from 'ui/components/SectionWithDivider'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalTouchableLinkProps } from 'ui/components/touchableLink/types'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { Venue } from 'ui/svg/icons/Venue'
import { Typo } from 'ui/theme'
import { AVATAR_SMALL } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type ProposedBySectionProps = {
  name: string
  navigateTo?: InternalTouchableLinkProps['navigateTo']
  imageUrl?: string | null
}

export const ProposedBySection: FunctionComponent<ProposedBySectionProps> = ({
  name,
  imageUrl,
  navigateTo,
}) => {
  const { icons, designSystem, isDesktopViewport } = useTheme()

  const content = (
    <InfoHeader
      title={name}
      rightComponent={
        navigateTo ? <RightFilled size={icons.sizes.extraSmall} testID="RightFilled" /> : undefined
      }
      defaultThumbnailSize={AVATAR_SMALL}
      thumbnailComponent={
        <Avatar size={AVATAR_SMALL} rounded={false} borderRadius={designSystem.size.borderRadius.m}>
          {imageUrl ? (
            <FullSizeImage url={imageUrl} testID="VenueImage" />
          ) : (
            <DefaultVenueAvatar testID="DefaultImage">
              <Venue color={designSystem.color.icon.inverted} size={29} />
            </DefaultVenueAvatar>
          )}
        </Avatar>
      }
    />
  )

  const Wrapper = isDesktopViewport ? Fragment : StyledSectionWithDivider

  return (
    <Wrapper>
      <ViewGap gap={4}>
        <Typo.Title3 {...getHeadingAttrs(2)}>Proposé par</Typo.Title3>
        {navigateTo ? (
          <InternalTouchableLink navigateTo={navigateTo}>{content}</InternalTouchableLink>
        ) : (
          content
        )}
      </ViewGap>
    </Wrapper>
  )
}

const StyledSectionWithDivider = styled(SectionWithDivider).attrs<{
  gap?: number
  visible?: boolean
}>({
  visible: true,
  margin: true,
  gap: 8,
})({})

const FullSizeImage = styled(FastImage)({
  width: '100%',
  height: '100%',
})

const DefaultVenueAvatar = styled.View(({ theme }) => ({
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.designSystem.color.background.brandPrimary,
}))
