import styled from 'styled-components/native'

// to have a correct layout, the parent of StickyWrapper must be in `position: relative;`
export const StickyWrapper = styled.View({
  position: 'absolute',
  bottom: 0,
  width: '100%',
})
