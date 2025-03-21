import React, { useState } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { useVenue } from 'features/venue/api/useVenue'
import { getDetailedAccessibilityInfo } from 'shared/accessibility/getDetailedAccessibilityInfo'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { TextInput } from 'ui/components/inputs/TextInput'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Spacer, Typo } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

export const CheatcodesScreenAccesLibre = () => {
  const [value, setValue] = useState('')
  const [venueId, setVenueId] = useState<number | null>(null)
  const { data: venue } = useVenue(venueId)

  const details = getDetailedAccessibilityInfo(venue?.externalAccessibilityData)

  const onPress = () => {
    setVenueId(parseInt(value))
  }

  return (
    <CheatcodesTemplateScreen title="AccesLibre 🌈" flexDirection="column">
      <TextInput
        label="Rentrer un ID de lieu avec AccesLibre"
        placeholder="859"
        keyboardType="number-pad"
        value={value}
        onChangeText={setValue}
      />
      <Spacer.Column numberOfSpaces={3} />
      <ButtonPrimary wording="Rechercher un lieu" onPress={onPress} disabled={value.length < 1} />
      <Spacer.Column numberOfSpaces={6} />
      {venue ? (
        venue.externalAccessibilityData ? (
          details?.map((detail, index) => (
            <View key={index}>
              <ViewGap gap={5}>
                <StyledView>
                  <detail.icon
                    color={detail.isAccessible ? ColorsEnum.GREEN_VALID : ColorsEnum.ERROR}
                  />
                  <Typo.Title3>{detail.category}</Typo.Title3>
                </StyledView>
                {Object.entries(detail.description).map(([key, value]) => (
                  <View key={key}>
                    <Typo.BodyAccent>{key}</Typo.BodyAccent>
                    <Typo.Body>{value}</Typo.Body>
                  </View>
                ))}
                <Spacer.Column numberOfSpaces={2} />
              </ViewGap>
              <Separator.Horizontal />
              <Spacer.Column numberOfSpaces={4} />
            </View>
          ))
        ) : (
          <Typo.Title4>Lieu non disponible sur AccesLibre</Typo.Title4>
        )
      ) : null}
    </CheatcodesTemplateScreen>
  )
}

const StyledView = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
