import Dash from 'react-native-dash'
import styled from 'styled-components/native'

export const DashedSeparator = styled(Dash)({
  borderRadius: 100,
  overflow: 'hidden',
  width: '99%', // a 100% width put the first dot on the border of the view and a space at the end
  alignSelf: 'center',
})
