import React from 'react'
import styled from 'styled-components/native'

import { abTestOverridesActions } from 'shared/useABSegment/abTestOverrideStore'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Button } from 'ui/designSystem/Button/Button'
import { Typo } from 'ui/theme'

export const CheatcodeHeaderABTest = ({
  forcedCount,
  total,
}: {
  forcedCount: number
  total: number
}) => {
  return (
    <HeaderRow gap={16}>
      <Typo.BodyItalicAccent>
        {forcedCount > 0
          ? `${forcedCount} test${forcedCount > 1 ? 's' : ''} forcé${forcedCount > 1 ? 's' : ''} — ${total} au total`
          : `Aucun forçage — ${total} au total`}
      </Typo.BodyItalicAccent>
      {forcedCount > 0 ? (
        <Button
          variant="tertiary"
          wording="Tout réinitialiser"
          onPress={abTestOverridesActions.resetAll}
        />
      ) : null}
    </HeaderRow>
  )
}

const HeaderRow = styled(ViewGap)(() => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
}))
