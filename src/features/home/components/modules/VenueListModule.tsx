import React, { CSSProperties, FunctionComponent } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { VenueListModuleItem } from 'features/home/components/modules/VenueListModuleItem'
import { VenueMapLocationModal } from 'features/location/components/VenueMapLocationModal'
import { useInitialVenuesActions } from 'features/venueMap/store/initialVenuesStore'
import { useSelectedVenueActions } from 'features/venueMap/store/selectedVenueStore'
import { VenueHit } from 'libs/algolia/types'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useLocation } from 'libs/location'
import { LocationMode } from 'libs/location/types'
import { useModal } from 'ui/components/modals/useModal'
import { Touchable } from 'ui/components/touchable/Touchable'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { ArrowRight } from 'ui/svg/icons/ArrowRight'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type HeaderProps = {
  onPress?: VoidFunction
  featureFlag?: boolean
}

const ListHeaderComponent: FunctionComponent<HeaderProps> = ({ onPress }) => {
  const focusProps = useHandleFocus()
  const { removeSelectedVenue } = useSelectedVenueActions()
  const { setInitialVenues } = useInitialVenuesActions()

  const handleOnBeforeNavigate = () => {
    removeSelectedVenue()
    setInitialVenues([])
    analytics.logConsultVenueMap({ from: 'venueList' })
  }

  const getComponentAndProps = () => {
    const Component = onPress ? StyledTouchable : StyledInternalTouchableLink
    const touchableProps = onPress
      ? { onPress }
      : { navigateTo: { screen: 'VenueMap' }, onBeforeNavigate: handleOnBeforeNavigate }
    return { Component, props: touchableProps }
  }

  const { Component, props } = getComponentAndProps()

  return (
    <React.Fragment>
      <Component {...props} {...focusProps}>
        <Typo.Caption>{'Les lieux culturels à proximité'.toUpperCase()}</Typo.Caption>
        <ArrowRightIcon testID="arrow-right" />
      </Component>
      <Spacer.Column numberOfSpaces={4} />
    </React.Fragment>
  )
}

const keyExtractor: (item: VenueHit) => string = (item) => item.id.toString()

type Props = {
  venues: VenueHit[]
  moduleId: string
  homeVenuesListEntryId?: string
}

export const VenueListModule: FunctionComponent<Props> = ({
  venues,
  moduleId,
  homeVenuesListEntryId,
}) => {
  const { selectedLocationMode } = useLocation()
  const {
    showModal: showVenueMapLocationModal,
    visible: venueMapLocationModalVisible,
    hideModal: hideVenueMapLocationModal,
  } = useModal()

  const enabledVenueMap = useFeatureFlag(RemoteStoreFeatureFlags.WIP_VENUE_MAP)
  const isLocated = selectedLocationMode !== LocationMode.EVERYWHERE
  const shouldTriggerModal = enabledVenueMap && !isLocated

  const onPress = shouldTriggerModal ? showVenueMapLocationModal : undefined

  return (
    <React.Fragment>
      <StyledFlatList
        listAs="ul"
        itemAs="li"
        data={venues}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <VenueListModuleItem
            item={item}
            moduleId={moduleId}
            homeVenuesListEntryId={homeVenuesListEntryId}
          />
        )}
        ItemSeparatorComponent={SpacerSeparator}
        ListHeaderComponent={<ListHeaderComponent onPress={onPress} />}
      />
      <VenueMapLocationModal
        visible={venueMapLocationModalVisible}
        dismissModal={hideVenueMapLocationModal}
      />
    </React.Fragment>
  )
}

const SpacerSeparator = () => <Spacer.Column numberOfSpaces={8} />

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

const ArrowRightIcon = styled(ArrowRight).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))({})
