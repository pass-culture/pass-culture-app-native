import React, { useState } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { useVenueQuery } from 'features/venue/queries/useVenueQuery'
import { getDetailedAccessibilityInfo } from 'shared/accessibility/getDetailedAccessibilityInfo'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { styledButton } from 'ui/components/buttons/styledButton'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { InputText } from 'ui/designSystem/InputText/InputText'
import { Typo } from 'ui/theme'

export const CheatcodesScreenAccesLibre = () => {
  const { designSystem } = useTheme()
  const [value, setValue] = useState('')
  const [venueId, setVenueId] = useState<number | null>(null)

  const { data: venue } = useVenueQuery(venueId || 0, { enabled: !!venueId })

  const details = getDetailedAccessibilityInfo(venue?.externalAccessibilityData)

  const onPress = () => {
    const parsedId = parseInt(value, 10)
    if (!isNaN(parsedId)) {
      setVenueId(parsedId)
    }
  }

  return (
    <CheatcodesTemplateScreen title="AccesLibre 🌈" flexDirection="column">
      <InputText
        label="Rentrer un ID de lieu avec AccesLibre"
        keyboardType="number-pad"
        value={value}
        onChangeText={setValue}
      />

      <SearchVenueButton
        wording="Rechercher un lieu"
        onPress={onPress}
        disabled={value.length < 1}
      />

      {venue ? (
        venue.externalAccessibilityData ? (
          details?.map((detail, index) => (
            <View key={index}>
              <StyledViewGap gap={5}>
                <StyledView>
                  <detail.icon
                    color={
                      detail.isAccessible
                        ? designSystem.color.icon.success
                        : designSystem.color.icon.error
                    }
                  />
                  <Typo.Title3>{detail.category}</Typo.Title3>
                </StyledView>
                {Object.entries(detail.description).map(([key, value]) => (
                  <View key={key}>
                    <Typo.BodyAccent>{key}</Typo.BodyAccent>
                    <Typo.Body>{value}</Typo.Body>
                  </View>
                ))}
              </StyledViewGap>
              <StyledSeparator />
            </View>
          ))
        ) : (
          <Typo.Title4>Lieu non disponible sur AccesLibre</Typo.Title4>
        )
      ) : null}
    </CheatcodesTemplateScreen>
  )
}

const SearchVenueButton = styledButton(ButtonPrimary)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.m,
  marginBottom: theme.designSystem.size.spacing.xl,
}))

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
  marginBottom: theme.designSystem.size.spacing.l,
}))
const StyledViewGap = styled(ViewGap)(({ theme }) => ({
  marginBottom: theme.designSystem.size.spacing.s,
}))

const StyledView = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
