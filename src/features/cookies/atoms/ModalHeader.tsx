import React, { ReactNode } from 'react'
import styled from 'styled-components/native'

import { BackButton } from 'ui/components/headers/BackButton'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  title: string
  onGoBackPress?: () => void
  rightButton?: ReactNode
}

export const ModalHeader = ({ title, onGoBackPress, rightButton }: Props) => {
  return (
    <Container>
      {onGoBackPress || rightButton ? (
        <ButtonContainer>
          {!!onGoBackPress && <BackButton onGoBack={onGoBackPress} />}
          <Spacer.Flex />
          {!!rightButton && rightButton}
        </ButtonContainer>
      ) : null}
      <StyledTitle4>{title}</StyledTitle4>
      <Spacer.Column numberOfSpaces={5} />
    </Container>
  )
}

const Container = styled.View({
  width: '100%',
})

const StyledTitle4 = styled(Typo.Title4).attrs(getHeadingAttrs(1))({
  textAlign: 'center',
})

const ButtonContainer = styled.View({
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: getSpacing(3),
})
