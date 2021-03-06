import React from 'react'
import LinearGradient from 'react-native-linear-gradient'

import { ColorsEnum } from 'ui/theme'

export const DiagonalStripe: React.FC = ({ children }) => (
  <LinearGradient
    colors={[ColorsEnum.WHITE, ColorsEnum.GREY_DARK, ColorsEnum.WHITE]}
    start={{ x: 0.0, y: 0.0 }}
    end={{ x: 1.0, y: 1.0 }}
    locations={[0.48, 0.5, 0.52]}>
    {children}
  </LinearGradient>
)
