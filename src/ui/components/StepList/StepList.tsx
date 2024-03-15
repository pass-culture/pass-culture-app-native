import React, { ReactElement } from 'react'

import { InternalStep } from 'ui/components/InternalStep/InternalStep'
import { Li } from 'ui/components/Li'
import { StepProps } from 'ui/components/Step/Step'
import { VerticalUl } from 'ui/components/Ul'
import { StepVariant } from 'ui/components/VerticalStepper/types'

interface StepListProps {
  currentStepIndex: number
  children: ReactElement<StepProps>[]
}

function getVariantFromIndex(currentStepIndex: number, stepIndex: number) {
  if (currentStepIndex < stepIndex) return StepVariant.future
  if (currentStepIndex === stepIndex) return StepVariant.in_progress
  return StepVariant.complete
}

/**
 * Create a step list that automatically assigns correct `StepVariant` based on
 * `currentStepIndex` value.
 *
 * @example
 * <StepList currentStepIndex={0}>
 *   <Step>
 *     <MyWonderfulComponent />
 *   </Step>
 *   <Step>
 *     <AnotherComponent />
 *   </Step>
 *   <Step>
 *     <FinalComponent />
 *   </Step>
 * </StepList>
 */
export function StepList({ currentStepIndex, children, ...props }: StepListProps) {
  if (currentStepIndex > children.length - 1) {
    console.warn(
      `[StepList] - Given (\`currentStepIndex\`: ${currentStepIndex}) but children length is ${
        children.length
      }. Maximum \`currentStepIndex\` should be ${children.length - 1}.`
    )
  }

  return (
    <VerticalUl {...props}>
      {React.Children.map(children, (child, index) => {
        return (
          <Li>
            <InternalStep
              variant={getVariantFromIndex(currentStepIndex, index)}
              isFirst={index === 0}
              isLast={index === children.length - 1}
              {...child.props}
            />
          </Li>
        )
      })}
    </VerticalUl>
  )
}
