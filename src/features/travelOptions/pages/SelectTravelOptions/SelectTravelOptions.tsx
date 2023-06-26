import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import MapComponent from '../../components/MapComponent/MapComponent'
import TravelListModal from '../../components/TravelListModal/TravelListModal'
import { useGeolocation } from 'libs/geolocation'
import { PageHeaderSecondary } from 'ui/components/headers/PageHeaderSecondary'
import { useNavigation } from '@react-navigation/native'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import styled from 'styled-components'
import { ColorsEnum } from 'ui/theme/colors'

interface Location {
  latitude: number
  longitude: number
}

export const SelectTravelOptions = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [currentLocation, setCurrentLocation] = useState<any | null>(null)
  const { userPosition: position } = useGeolocation()
  const { goBack } = useNavigation<UseNavigationType>()

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        setCurrentLocation(position)
        setTimeout(() => {
          setIsLoading(false)
        }, 5000)
      } catch (error) {
        console.error('Error getting current location:', error)
        setIsLoading(false)
      }
    }

    fetchCurrentLocation()
  }, [position])

  return (
    <View style={{ flex: 1 }}>
      <PageHeaderSecondary
        onGoBack={goBack}
        title=""
        backIconColor={ColorsEnum.BLACK}
        backgroundColor={ColorsEnum.WHITE}
      />
      {currentLocation && <MapComponent currentLocation={currentLocation} />}
      <TravelListModal isLoading={isLoading} />
    </View>
  )
}
