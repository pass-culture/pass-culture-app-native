import styled from 'styled-components/native'

// to have a correct layout, the parent of StickyBottomWrapper must be in `position: relative;`
export const StickyBottomWrapper = styled.View({
  position: 'absolute',
  bottom: 0,
  width: '100%',
})
