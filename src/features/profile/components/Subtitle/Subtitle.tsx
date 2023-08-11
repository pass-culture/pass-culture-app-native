import React from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

type Props = {
  startSubtitle: string
  boldEndSubtitle?: string
}

export const Subtitle = ({ startSubtitle, boldEndSubtitle }: Props) => {
  return (
    <Row>
      <CaptionSubtitle>{startSubtitle}</CaptionSubtitle>
      {!!boldEndSubtitle && <ButtonTextSubtitle>&nbsp;{boldEndSubtitle}</ButtonTextSubtitle>}
    </Row>
  )
}

const Row = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
})

const CaptionSubtitle = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const ButtonTextSubtitle = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
