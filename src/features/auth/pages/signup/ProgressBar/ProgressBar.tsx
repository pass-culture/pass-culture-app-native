import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { AnimatedView, AnimatedViewRefType } from 'libs/react-native-animatable'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Rectangle } from 'ui/svg/Rectangle'
import { getSpacing } from 'ui/theme'

const PROGRESS_DURATION_IN_MS = 800

interface Props {
  currentStep: number
  totalStep: number
}

const accessibilityDescribedBy = uuidv4()

export const ProgressBar = ({ currentStep, totalStep }: Props) => {
  const barRef = useRef<AnimatedViewRefType>(null)
  const isComplete = currentStep === totalStep
  const isNotInRange = totalStep < 1 || currentStep > totalStep
  const progressionRatio = isNotInRange ? 0 : (currentStep / totalStep) * 100
  const accessibilityText = `Étape ${currentStep} sur ${totalStep}`

  useEffect(
    () => barRef.current?.transition({ width: '0%' }, { width: `${progressionRatio}%` }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  if (isNotInRange) return null

  return (
    <React.Fragment>
      <HiddenAccessibleText nativeID={accessibilityDescribedBy}>
        {accessibilityText}
      </HiddenAccessibleText>
      <BarBackground accessibilityDescribedBy={accessibilityDescribedBy}>
        <BarColorContainer
          transition="width"
          width={progressionRatio}
          isFull={isComplete}
          duration={PROGRESS_DURATION_IN_MS}
          ref={barRef}>
          <BarColor />
        </BarColorContainer>
      </BarBackground>
    </React.Fragment>
  )
}

const BarBackground = styled.View(({ theme }) => ({
  width: '100%',
  height: getSpacing(1.5),
  backgroundColor: theme.colors.greyLight,
  justifyContent: 'flex-start',
}))

const BarColorContainer = styled(AnimatedView)<{ width: number; isFull?: boolean }>(
  ({ width, isFull }) => ({
    borderBottomRightRadius: isFull ? 0 : 3,
    borderTopRightRadius: isFull ? 0 : 3,
    overflow: 'hidden',
    height: '100%',
    width: `${width}%`,
  })
)

const BarColor = styled(Rectangle).attrs({
  size: '100%',
})``
