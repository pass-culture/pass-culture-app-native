import React, { useMemo } from 'react'

import {
  InlineSegment,
  parseAnswerMarkdown,
} from 'cheatcodes/pages/features/conversationalSearch/helpers/parseAnswerMarkdown'
import { BulletListItem } from 'ui/components/BulletListItem'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { VerticalUl } from 'ui/components/Ul'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Link } from 'ui/designSystem/Link/Link'
import { Typo } from 'ui/theme'

const LIST_GROUP_LABEL = 'Réponse de l’agent'

type Props = {
  text: string
}

const renderSegments = (segments: InlineSegment[]) =>
  segments.map((segment, index) => {
    const key = `${index}-${segment.text}`
    if (segment.type === 'bold') {
      return <Typo.BodyAccent key={key}>{segment.text}</Typo.BodyAccent>
    }
    if (segment.type === 'link') {
      return (
        <ExternalTouchableLink
          key={key}
          as={Link}
          externalNav={{ url: segment.url, params: { shouldLogEvent: false } }}
          wording={segment.text}
          isInsideText
        />
      )
    }
    return segment.text
  })

export const ConversationalSearchAnswer = ({ text }: Props) => {
  const blocks = useMemo(() => parseAnswerMarkdown(text), [text])

  return (
    <ViewGap gap={3}>
      {blocks.map((block, blockIndex) => {
        const key = `${block.type}-${blockIndex}`

        if (block.type === 'list') {
          return (
            <VerticalUl key={key} gap={2}>
              {block.items.map((item, itemIndex) => (
                <BulletListItem
                  key={`${key}-${itemIndex}`}
                  index={itemIndex}
                  total={block.items.length}
                  groupLabel={LIST_GROUP_LABEL}
                  text={renderSegments(item.segments)}
                  nestedListTexts={item.nested.length ? item.nested.map(renderSegments) : undefined}
                />
              ))}
            </VerticalUl>
          )
        }

        if (block.type === 'heading') {
          return <Typo.BodyAccent key={key}>{renderSegments(block.segments)}</Typo.BodyAccent>
        }

        return <Typo.Body key={key}>{renderSegments(block.segments)}</Typo.Body>
      })}
    </ViewGap>
  )
}
