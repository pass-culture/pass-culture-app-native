import BottomSheet, { BottomSheetProps, BottomSheetView } from '@gorhom/bottom-sheet'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import React, { forwardRef } from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

export type VenueMapBottomSheetProps = Omit<BottomSheetProps, 'children'>

export const VenueMapBottomSheet = forwardRef<BottomSheetMethods, VenueMapBottomSheetProps>(
  function VenueMapBottomSheet(props, ref) {
    return (
      <StyledBottomSheet ref={ref} {...props}>
        <BottomSheetView>
          <Typo.Body>COUCOU</Typo.Body>
        </BottomSheetView>
      </StyledBottomSheet>
    )
  }
)

const StyledBottomSheet = styled(BottomSheet).attrs<VenueMapBottomSheetProps>({
  containerStyle: { zIndex: 99 },
})``
