import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components/native'

import { mapSubscriptionThemeToIllustration } from 'features/subscription/helpers/mapSubscriptionThemeToIllustration'
import { mapSubscriptionThemeToName } from 'features/subscription/helpers/mapSubscriptionThemeToName'
import { SubscriptionTheme } from 'features/subscription/types'
import { accessibleRadioProps } from 'shared/accessibilityProps/accessibleRadioProps'
import { IllustratedRadioSelector } from 'ui/components/radioSelector/IllustratedRadioSelector'
import { getSpacing } from 'ui/theme'

interface Props {
  thematic: SubscriptionTheme
  checked: boolean
  onPress: () => void
}

export const SubscriptionCategoryButton = ({ thematic, checked, onPress }: Props) => {
  const { illustration: Illustration, gradients } = mapSubscriptionThemeToIllustration(thematic)

  return (
    <IllustratedRadioSelector
      {...accessibleRadioProps({ label: mapSubscriptionThemeToName[thematic], checked })}
      label={mapSubscriptionThemeToName[thematic]}
      onPress={onPress}
      checked={checked}
      Illustration={() => (
        <React.Fragment>
          <IllustrationContainer>
            <StyledLinearGradient colors={[gradients[0] as string, gradients[1] as string]}>
              <IllustrationWrapper>
                <Illustration />
              </IllustrationWrapper>
            </StyledLinearGradient>
          </IllustrationContainer>
        </React.Fragment>
      )}
    />
  )
}

const IllustrationContainer = styled.View({
  height: getSpacing(16),
  width: getSpacing(16),
  borderRadius: getSpacing(2),
  overflow: 'hidden',
})

const IllustrationWrapper = styled.View({
  position: 'absolute',
})

const StyledLinearGradient = styled(LinearGradient)({
  flex: 1,
})
