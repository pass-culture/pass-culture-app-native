import React from 'react'
import styled from 'styled-components/native'

export const Cards = () => {
  return (
    <CardContainer>
      <Card />
      {/* <ImageTile /> */}
    </CardContainer>
  )
}

const Card = styled.View({})
const CardContainer = styled.View({})
