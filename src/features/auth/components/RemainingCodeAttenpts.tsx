import React from 'react'
import styled from 'styled-components/native'

import { plural } from 'libs/plural'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

type RemainingCodeAttemptsProps = {
  failedAttempts: number
  maxAttempts: number
  isAccountLocked: boolean
}

export const RemainingCodeAttempts = ({
  failedAttempts,
  maxAttempts,
  isAccountLocked,
}: RemainingCodeAttemptsProps) => {
  const shouldDisplayRemainingCodeAttempts =
    !isAccountLocked && failedAttempts > 0 && failedAttempts < maxAttempts

  if (!shouldDisplayRemainingCodeAttempts) return null

  const remainingAttempts = maxAttempts - failedAttempts

  const remainingAttemptsText = plural(remainingAttempts, {
    singular: '# essai',
    plural: '# essais',
  })

  return (
    <Container>
      <Typo.BodyXs>
        Attention, il te reste{SPACE}
        <Typo.BodyAccentXs>{remainingAttemptsText}</Typo.BodyAccentXs>
      </Typo.BodyXs>
    </Container>
  )
}

const Container = styled.View({ alignItems: 'center' })
