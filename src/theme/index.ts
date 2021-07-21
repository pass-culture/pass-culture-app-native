import { theme as idCheckTheme } from '@pass-culture/id-check/src/theme'
import deepmerge from 'deepmerge'
import { DefaultTheme } from 'styled-components/native'
import './styled.d'

const theme: DefaultTheme = deepmerge(idCheckTheme, {})

export { theme }
