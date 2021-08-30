import 'styled-components/native'
import { AppThemeType } from 'theme/index'

declare module 'styled-components/native' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends AppThemeType {}
}
