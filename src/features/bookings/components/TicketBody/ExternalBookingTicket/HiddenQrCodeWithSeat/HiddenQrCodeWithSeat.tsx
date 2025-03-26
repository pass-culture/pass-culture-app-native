import React from 'react'
import styled from 'styled-components/native'

import { BarCode } from 'ui/svg/icons/BarCode'
import { Typo, getSpacing } from 'ui/theme'

const QR_CODE_SIZE = getSpacing(50)

export const HiddenQrCodeWithSeat = ({ day, time }: { day: string; time: string }) => {
  return (
    <React.Fragment>
      <DashedContainer>
        <BarCode />
      </DashedContainer>
      <StyledBody>
        Ton billet sera disponible ici le {day} à {time}
      </StyledBody>
    </React.Fragment>
  )
}

const DashedContainer = styled.View(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  width: QR_CODE_SIZE,
  height: QR_CODE_SIZE,
  borderWidth: 2,
  borderColor: theme.colors.greySemiDark,
  borderRadius: 8,
  borderStyle: 'dashed',
  alignSelf: 'center',
  marginBottom: getSpacing(6),
}))

const StyledBody = styled(Typo.BodyAccentS)({
  textAlign: 'center',
})
