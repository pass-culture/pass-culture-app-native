import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { VenueMapFiltersModalStackParamList } from 'features/navigation/VenueMapFiltersStackNavigator/types'
import { FILTERS_VENUE_TYPE_MAPPING } from 'features/venueMap/constant'
import { VenueMapFiltersModal } from 'features/venueMap/pages/modals/VenueMapFiltersModal/VenueMapFiltersModal'
import { MAP_VENUE_TYPE_TO_LABEL, VenueTypeCode } from 'libs/parsers/venueType'
import { Checkbox } from 'ui/components/inputs/Checkbox/Checkbox'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing, TypoDS } from 'ui/theme'

type Props = StackScreenProps<VenueMapFiltersModalStackParamList, 'VenueMapTypeFilter'>

const titleId = uuidv4()

export const VenueMapTypeFilter: FunctionComponent<Props> = ({ navigation, route }) => {
  const { title, filterGroup } = route.params
  const { navigate } = useNavigation<UseNavigationType>()

  const onGoBack = () => {
    navigation.goBack()
  }

  const onClose = () => {
    navigate('VenueMap')
  }

  const items: VenueTypeCode[] = FILTERS_VENUE_TYPE_MAPPING[filterGroup].filter(
    (item): item is VenueTypeCode => item in MAP_VENUE_TYPE_TO_LABEL
  )

  return (
    <VenueMapFiltersModal
      titleId={titleId}
      title="Type de lieu"
      handleGoBack={onGoBack}
      handleOnClose={onClose}
      shouldDisplayBackButton
      shouldDisplayCloseButton>
      <Container gap={6}>
        <TypoDS.Title1>{title}</TypoDS.Title1>
        <Checkbox label="Tout afficher" isChecked onPress={() => null} />
        {items.map((item) => (
          <Checkbox
            key={item}
            label={MAP_VENUE_TYPE_TO_LABEL[item]}
            isChecked={false}
            onPress={() => null}
          />
        ))}
      </Container>
    </VenueMapFiltersModal>
  )
}

const Container = styled(ViewGap)({
  paddingTop: getSpacing(6),
  paddingBottom: getSpacing(26),
})
