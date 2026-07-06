// eslint-disable-next-line no-restricted-imports
import FastImage from '@d11/react-native-fast-image'
import React, { FunctionComponent } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { buildCategoryIllustrationUrl } from 'shared/illustrations/buildCategoryIllustrationUrl'
import { IllustrationColorKey } from 'theme/types'
import { ActionCardBase } from 'ui/components/ActionCardBase'

type Props = {
  height: number
  width: number
  isFocus: boolean
  venueName: string
  volunteeringUrl?: string | null
  accessibilityLabel: string
  onFocus: () => void
  onBlur: () => void
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

const VOLUNTEER_ILLUSTRATION_URL = buildCategoryIllustrationUrl('benevolat.png')
const VOLUNTEER_BACKGROUND_COLOR: IllustrationColorKey = 'positive02'

export const VolunteerCard: FunctionComponent<Props> = ({
  height,
  width,
  isFocus,
  venueName,
  volunteeringUrl,
  accessibilityLabel,
  onFocus,
  onBlur,
  onPress,
  style,
}) => {
  const theme = useTheme()

  return (
    <ActionCardBase
      height={height}
      width={width}
      isFocus={isFocus}
      url={volunteeringUrl}
      title={`Deviens bénévole pour\n“${venueName}”`}
      subtitle="Donne de ton temps pour la culture\u00a0!"
      callToAction="Voir les missions sur jeveuxaider.gouv"
      accessibilityLabel={accessibilityLabel}
      visual={
        <ContainedImage
          source={{ uri: VOLUNTEER_ILLUSTRATION_URL }}
          resizeMode="contain"
          testID="imageBusinessIllustration"
        />
      }
      backgroundColor={theme.designSystem.color.illustration[VOLUNTEER_BACKGROUND_COLOR]}
      desktopLayout="overlay"
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      style={style}
    />
  )
}

const ContainedImage = styled(FastImage)({
  aspectRatio: 3 / 2,
  height: '100%',
  position: 'absolute',
  right: 0,
  top: 0,
})
