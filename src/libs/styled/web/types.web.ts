import { DefaultTheme as DefaultThemeWeb } from 'styled-components'
import { DefaultTheme } from 'styled-components/native'

import { Computed } from '../native/types'

export type ComputedTheme = DefaultThemeWeb & DefaultTheme & Computed
