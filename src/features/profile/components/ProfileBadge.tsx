import React, { FunctionComponent } from 'react'
import { openInbox } from 'react-native-email-link'
import styled from 'styled-components/native'

import { shouldOpenInbox } from 'features/profile/utils'
import { ButtonQuaternaryBlack } from 'ui/components/buttons/ButtonQuaternaryBlack'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing, Typo, Spacer } from 'ui/theme'
interface ProfileBadgeProps {
  message: string
  popOverIcon?: FunctionComponent<IconInterface>
  callToActionIcon?: FunctionComponent<IconInterface> | null
  callToActionMessage?: string | null
  callToActionLink?: string | null
  testID?: string
}

const renderCallToAction = (
  callToActionMessage?: string | null,
  callToActionLink?: string | null,
  callToActionIcon?: FunctionComponent<IconInterface> | null
) => {
  if (!callToActionMessage || !callToActionLink) return null

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={4} />
      <TouchableLink
        as={ButtonQuaternaryBlack}
        icon={callToActionIcon || undefined}
        testID="call-to-action-button"
        externalNav={shouldOpenInbox(callToActionLink) ? undefined : { url: callToActionLink }}
        onPress={() => {
          shouldOpenInbox(callToActionLink) && openInbox()
        }}
        wording={callToActionMessage}
        justifyContent="flex-start"
        numberOfLines={2}
      />
    </React.Fragment>
  )
}

export function ProfileBadge(props: ProfileBadgeProps) {
  const Icon =
    props.popOverIcon &&
    styled(props.popOverIcon).attrs(({ theme }) => ({
      color: theme.colors.greyDark,
      size: theme.icons.sizes.standard,
    }))``

  return (
    <Container testID={props.testID || 'profile-badge'}>
      {Icon && !props.callToActionIcon ? (
        <IconContainer>
          <Icon />
        </IconContainer>
      ) : null}
      <TextContainer>
        <Caption callToAction={props.callToActionMessage && props.callToActionLink}>
          {props.message}
        </Caption>
        {renderCallToAction(
          props.callToActionMessage,
          props.callToActionLink,
          props.callToActionIcon
        )}
      </TextContainer>
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.colors.greyLight,
  borderRadius: 6,
  padding: getSpacing(4),
}))

const IconContainer = styled.View({
  paddingRight: getSpacing(4),
})

const TextContainer = styled.View({
  flex: 1,
})

const Caption = styled(Typo.Caption)<{ callToAction: string | null | undefined }>(
  ({ theme, callToAction }) => ({
    color: callToAction ? theme.colors.greyDark : theme.colors.black,
  })
)
