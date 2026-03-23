import React, { useEffect, useRef } from 'react'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { AnimatedView, AnimatedViewRefType } from 'libs/react-native-animatable'

const PROGRESS_DURATION_IN_MS = 800

interface Props {
  currentStep: number
  totalStep: number
}

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
    <BarBackground
      accessibilityLabel={accessibilityText}
      accessibilityRole={AccessibilityRole.PROGRESSBAR}
      accessible>
      <BarColorContainer
        transition="width"
        width={progressionRatio}
        isFull={isComplete}
        duration={PROGRESS_DURATION_IN_MS}
        ref={barRef}
      />
    </BarBackground>
  )
}

const BarBackground = styled.View(({ theme }) => ({
  width: '100%',
  height: theme.designSystem.size.spacing.s,
  backgroundColor: theme.designSystem.color.background.disabled,
  justifyContent: 'flex-start',
}))

const BarColorContainer = styled(AnimatedView)<{ width: number; isFull?: boolean }>(
  ({ theme, width, isFull }) => ({
    borderBottomRightRadius: isFull ? 0 : 3,
    borderTopRightRadius: isFull ? 0 : 3,
    overflow: 'hidden',
    height: '100%',
    width: `${width}%`,
    backgroundColor: theme.designSystem.color.background.brandPrimary,
  })
)
