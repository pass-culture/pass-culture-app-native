import { useNavigation } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { VenueMapFiltersModalStackParamList } from 'features/navigation/VenueMapFiltersStackNavigator/types'
import { VenueMapFiltersModal } from 'features/venueMap/pages/modals/VenueMapFiltersModal/VenueMapFiltersModal'

type Props = StackScreenProps<VenueMapFiltersModalStackParamList, 'VenueMapTypeFilter'>

const titleId = uuidv4()

export const VenueMapTypeFilter: FunctionComponent<Props> = ({ navigation }) => {
  const { navigate } = useNavigation<UseNavigationType>()

  const onGoBack = () => {
    navigation.goBack()
  }

  const onClose = () => {
    navigate('VenueMap')
  }

  return (
    <VenueMapFiltersModal
      titleId={titleId}
      title="Type de lieu"
      handleGoBack={onGoBack}
      handleOnClose={onClose}
      shouldDisplayBackButton
      shouldDisplayCloseButton>
      <View />
    </VenueMapFiltersModal>
  )
}
