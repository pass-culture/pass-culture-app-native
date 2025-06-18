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
import { AVATAR_BORDER_RADIUS_SMALL, AVATAR_SMALL } from 'ui/theme/constants'
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
  const theme = useTheme()

  const content = (
    <ViewGap gap={4}>
      <Typo.Title3 {...getHeadingAttrs(2)}>Proposé par</Typo.Title3>
      <InfoHeader
        title={name}
        rightComponent={
          navigateTo ? (
            <RightFilled size={theme.icons.sizes.extraSmall} testID="RightFilled" />
          ) : undefined
        }
        defaultThumbnailSize={AVATAR_SMALL}
        thumbnailComponent={
          <Avatar size={AVATAR_SMALL} rounded={false} borderRadius={AVATAR_BORDER_RADIUS_SMALL}>
            {imageUrl ? (
              <FullSizeImage url={imageUrl} testID="VenueImage" />
            ) : (
              <DefaultVenueAvatar testID="DefaultImage">
                <Venue color={theme.designSystem.color.icon.inverted} size={29} />
              </DefaultVenueAvatar>
            )}
          </Avatar>
        }
      />
    </ViewGap>
  )

  const Wrapper = theme.isDesktopViewport ? Fragment : StyledSectionWithDivider

  return (
    <Wrapper>
      {navigateTo ? (
        <InternalTouchableLink navigateTo={navigateTo} hoverUnderlineColor={theme.colors.white}>
          {content}
        </InternalTouchableLink>
      ) : (
        content
      )}
    </Wrapper>
  )
}

const StyledSectionWithDivider = styled(SectionWithDivider).attrs({
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
