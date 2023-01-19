import styled from 'styled-components/native'

import { padding } from 'ui/theme'

export const Row = styled.View<{ half?: boolean }>(({ half = false }) => ({
  width: half ? '50%' : '100%',
  ...padding(2, 0.5),
}))
