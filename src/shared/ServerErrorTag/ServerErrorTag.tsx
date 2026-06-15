import React from 'react'
import styled from 'styled-components/native'

import { Tag } from 'ui/designSystem/Tag/Tag'
import { TagVariant } from 'ui/designSystem/Tag/types'
import { Warning } from 'ui/svg/icons/Warning'

export const ServerErrorTag = () => (
  <TagContainer>
    <Tag label="Problème serveur" variant={TagVariant.WARNING} Icon={Warning} />
  </TagContainer>
)

const TagContainer = styled.View(({ theme }) => ({
  justifyContent: 'center',
  flexDirection: 'row',
  marginTop: theme.designSystem.size.spacing.m,
}))
