import React, { CSSProperties, FunctionComponent } from 'react'
import { FlatList, Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { VenueHit } from 'libs/algolia/types'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { Position, useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { formatDistance } from 'libs/parsers/formatDistance'
import { useModal } from 'ui/components/modals/useModal'
import { Separator } from 'ui/components/Separator'
import { Tag } from 'ui/components/Tag/Tag'
import { Touchable } from 'ui/components/touchable/Touchable'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VenuePreview } from 'ui/components/VenuePreview/VenuePreview'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const IMAGE_SIZE = 72

const isWeb = Platform.OS === 'web'

type HeaderProps = {
  onPress?: VoidFunction
  featureFlag?: boolean
}

const ListHeaderComponent: FunctionComponent<HeaderProps> = ({ onPress }) => {
  const focusProps = useHandleFocus()

  const getComponentAndProps = () => {
    if (isWeb) {
      return { Component: StyledView, props: {} }
    } else {
      const Component = onPress ? StyledTouchable : StyledInternalTouchableLink
      const touchableProps = onPress ? { onPress } : { navigateTo: { screen: 'VenueMap' } }
      return { Component, props: touchableProps }
    }
  }

  const { Component, props } = getComponentAndProps()

  return (
    <React.Fragment>
      <Component {...props} {...focusProps}>
        <Typo.Caption>{'Les lieux culturels à proximité'.toUpperCase()}</Typo.Caption>
        {isWeb ? undefined : <ArrowRightIcon testID="arrow-right" />}
      </Component>
      <Spacer.Column numberOfSpaces={4} />
    </React.Fragment>
  )
}

const renderItem = ({ item }: { item: VenueHit }, userLocation: Position) => {
  const distance = formatDistance({ lat: item.latitude, lng: item.longitude }, userLocation)
  const address = [item.city, item.postalCode].filter(Boolean).join(', ')
  return (
    <InternalTouchableLink navigateTo={{ screen: 'Venue', params: { id: item.id } }}>
      <VenuePreview
        address={address}
        venueName={item.name}
        imageHeight={IMAGE_SIZE}
        imageWidth={IMAGE_SIZE}
        bannerUrl={item.bannerUrl}>
        {distance ? <StyledTag label={distance} /> : null}
      </VenuePreview>
    </InternalTouchableLink>
  )
}

const keyExtractor: (item: VenueHit) => string = (item) => item.id.toString()

type Props = {
  venues: VenueHit[]
}

export const VenueListModule: FunctionComponent<Props> = ({ venues }) => {
  const { userLocation, selectedLocationMode } = useLocation()
  const {
    showModal: showVenueMapLocationModal,
    visible: venueMapLocationModalVisible,
    hideModal: hideVenueMapLocationModal,
  } = useModal()

  const enabledVenueMap = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP)
  const isLocated = selectedLocationMode !== LocationMode.EVERYWHERE
  const shouldTriggerModal = enabledVenueMap && !isLocated && !isWeb

  const onPress = shouldTriggerModal ? showVenueMapLocationModal : undefined

  return (
    <React.Fragment>
      <StyledFlatList
        listAs="ul"
        itemAs="li"
        data={venues}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => renderItem({ item }, userLocation)}
        ItemSeparatorComponent={HorizontalSeparator}
        ListHeaderComponent={() => <ListHeaderComponent onPress={onPress} />}
      />
      <VenueMapLocationModal
        visible={venueMapLocationModalVisible}
        dismissModal={hideVenueMapLocationModal}
      />
    </React.Fragment>
  )
}

const StyledFlatList = styled(FlatList as typeof FlatList<VenueHit>)(({ theme }) => ({
  backgroundColor: theme.colors.goldLight100,
  borderRadius: getSpacing(4),
  padding: getSpacing(4),
  marginBottom: theme.home.spaceBetweenModules,
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const commonStyles: CSSProperties = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: getSpacing(2),
}

const StyledInternalTouchableLink = styled(InternalTouchableLink)({ ...commonStyles })

const StyledTouchable = styled(Touchable)({ ...commonStyles })

const StyledView = styled(View)({ ...commonStyles })

const StyledTag = styled(Tag)(({ theme }) => ({
  backgroundColor: theme.colors.white,
}))

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  backgroundColor: theme.colors.white,
}))

const HorizontalSeparator: FunctionComponent = () => (
  <React.Fragment>
    <Spacer.Column numberOfSpaces={4} />
    <StyledSeparator />
    <Spacer.Column numberOfSpaces={4} />
  </React.Fragment>
)

const ArrowRightIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))({})
