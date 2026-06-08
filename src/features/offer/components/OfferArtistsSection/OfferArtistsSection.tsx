import React, { FunctionComponent, useState } from 'react'
import { styled, useTheme } from 'styled-components/native'

import { CategoryIdEnum, OfferArtist, SubcategoryIdEnum } from 'api/gen'
import { formatArtists } from 'features/artist/helpers/formatArtists'
import { getArtistRole } from 'features/artist/helpers/getArtistRole'
import { getArtistSectionTitle } from 'features/artist/helpers/getArtistSectionTitle'
import { getArtistsFilterButtons } from 'features/offer/helpers/getArtistsFilterButtons/getArtistsFilterButtons'
import { SingleFilterButton } from 'features/search/components/Buttons/SingleFilterButton/SingleFilterButton'
import { analytics } from 'libs/analytics/provider'
import { FastImage } from 'libs/resizing-image-on-demand/FastImage'
import { accessibilityRoleInternalNavigation } from 'shared/accessibility/helpers/accessibilityRoleInternalNavigation'
import { Avatar } from 'ui/components/Avatar/Avatar'
import { AvatarList } from 'ui/components/Avatar/AvatarList'
import { DefaultAvatar } from 'ui/components/Avatar/DefaultAvatar'
import { InfoHeader } from 'ui/components/InfoHeader/InfoHeader'
import { SeeAllButton } from 'ui/components/SeeAllButton/SeeAllButton'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { RightFilled } from 'ui/svg/icons/RightFilled'
import { Typo } from 'ui/theme'
import { AVATAR_MEDIUM } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  artists: OfferArtist[]
  offerCategoryId: CategoryIdEnum
  offerSubcategoryId: SubcategoryIdEnum
  offerId: number
  onPlaylistItemPress: (artistId: string, artistName: string) => void
}

export const OfferArtistsSection: FunctionComponent<Props> = ({
  artists,
  offerCategoryId,
  offerSubcategoryId,
  offerId,
  onPlaylistItemPress,
}) => {
  const { designSystem } = useTheme()
  const sectionTitle = getArtistSectionTitle(offerSubcategoryId)
  const formattedArtists = formatArtists(artists, offerCategoryId)
  const filterButtons = getArtistsFilterButtons(artists, offerCategoryId)

  const [selectedFilterRoles, setSelectedFilterRoles] = useState<string[]>([])

  const filteredFormattedArtists = formattedArtists.filter((artist) => {
    if (!artist.role) return false
    return selectedFilterRoles.includes(artist.role)
  })

  const handleFilterPress = (role: string) => {
    setSelectedFilterRoles((prev) =>
      prev.includes(role) ? prev.filter((id) => id !== role) : [...prev, role]
    )
  }

  const title = artists.length === 1 ? sectionTitle.singular : sectionTitle.plural

  const onSeeAllBeforeNavigate = () => {
    void analytics.logClickSeeAll({
      type: 'artists',
      moduleName: title,
      from: 'offer',
    })
  }

  const navigateToVerticalPlaylist = {
    screen: 'VerticalPlaylistArtists' as const,
    params: { title, subtitle: undefined, offerId },
  }

  const soloArtist = artists[0]

  return (
    <ViewGap gap={4}>
      <SeeAllButtonContainer gap={3}>
        <TitleContainer>
          <Typo.Title4 {...getHeadingAttrs(2)}>{title}</Typo.Title4>
        </TitleContainer>
        {artists.length > 1 ? (
          <SeeAllButton
            playlistTitle={title}
            data={{
              onBeforeNavigate: onSeeAllBeforeNavigate,
              navigateToVerticalPlaylist,
              hideSearchSeeAll: true,
            }}
          />
        ) : null}
      </SeeAllButtonContainer>

      {artists.length === 1 && soloArtist ? (
        <InternalTouchableLink
          navigateTo={{ screen: 'Artist', params: { id: soloArtist.id } }}
          accessibilityLabel={`Accéder à la page artiste de ${soloArtist.name}`}
          accessibilityRole={accessibilityRoleInternalNavigation()}
          onBeforeNavigate={() => onPlaylistItemPress(soloArtist.id ?? '', soloArtist.name)}>
          <InfoHeader
            title={soloArtist.name}
            subtitle={soloArtist.role ? getArtistRole(soloArtist.role, offerCategoryId) : undefined}
            defaultThumbnailSize={AVATAR_MEDIUM}
            thumbnailComponent={
              <Avatar
                size={AVATAR_MEDIUM}
                rounded={false}
                borderRadius={designSystem.size.borderRadius.pill}>
                {soloArtist.image ? (
                  <ArtistImage url={soloArtist.image} testID="ArtistImage" />
                ) : (
                  <DefaultAvatar testID="defaultArtistAvatar" />
                )}
              </Avatar>
            }
            rightComponent={<RightFilled size={designSystem.size.icon.s} testID="RightFilled" />}
          />
        </InternalTouchableLink>
      ) : (
        <React.Fragment>
          {filterButtons.length > 1 ? (
            <ButtonsContainer
              horizontal
              showsHorizontalScrollIndicator={false}
              testID="filterButtons">
              {filterButtons.map(({ role, label }) => (
                <SingleFilterButton
                  key={role}
                  testID={role}
                  label={label}
                  isSelected={selectedFilterRoles.includes(role)}
                  onPress={() => handleFilterPress(role)}
                />
              ))}
            </ButtonsContainer>
          ) : null}
          <AvatarList
            data={selectedFilterRoles.length > 0 ? filteredFormattedArtists : formattedArtists}
            avatarConfig={{ size: AVATAR_MEDIUM }}
            onItemPress={onPlaylistItemPress}
            withMargins={false}
          />
        </React.Fragment>
      )}
    </ViewGap>
  )
}

const ArtistImage = styled(FastImage)(({ theme }) => ({
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.designSystem.color.background.subtle,
  borderWidth: 1,
  borderColor: theme.designSystem.color.border.subtle,
}))

const ButtonsContainer = styled.ScrollView.attrs(({ theme }) => ({
  contentContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: theme.designSystem.size.spacing.s,
  },
}))``

const TitleContainer = styled.View({
  flex: 1,
})

const SeeAllButtonContainer = styled(ViewGap)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
})
