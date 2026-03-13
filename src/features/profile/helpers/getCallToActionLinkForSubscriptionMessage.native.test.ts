import { openInbox } from 'react-native-email-link'

import { CallToActionIcon, SubscriptionMessage } from 'api/gen'
import { matchSubscriptionMessageIconToSvg } from 'features/profile/helpers/matchSubscriptionMessageIconToSvg'
import { shouldOpenInbox } from 'features/profile/helpers/shouldOpenInbox'

import { getCallToActionLinkForSubscriptionMessage } from './getCallToActionLinkForSubscriptionMessage'

jest.mock('features/profile/helpers/shouldOpenInbox', () => ({ shouldOpenInbox: jest.fn() }))
jest.mock('react-native-email-link', () => ({ openInbox: jest.fn() }))
jest.mock('features/profile/helpers/matchSubscriptionMessageIconToSvg', () => ({
  matchSubscriptionMessageIconToSvg: jest.fn(),
}))

const mockIcon = 'MockIcon'
const mockMatchSubscriptionMessageIconToSvg = matchSubscriptionMessageIconToSvg as jest.Mock
const mockShouldOpenInbox = shouldOpenInbox as jest.Mock

describe('getCallToActionLinkForSubscriptionMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockMatchSubscriptionMessageIconToSvg.mockReturnValue(mockIcon)
  })

  it('returns empty array if callToAction is missing', () => {
    const subscriptionMessage = {} as SubscriptionMessage

    const result = getCallToActionLinkForSubscriptionMessage(subscriptionMessage, true)

    expect(result).toEqual([])
  })

  it('returns empty array if callToActionTitle or callToActionLink is missing', () => {
    const subscriptionMessage = {
      userMessage: 'User message',
      callToAction: { callToActionTitle: 'Test' },
    }

    const result = getCallToActionLinkForSubscriptionMessage(subscriptionMessage, true)

    expect(result).toEqual([])
  })

  it('returns inbox action when mail app available and shouldOpenInbox is true', () => {
    mockShouldOpenInbox.mockReturnValueOnce(true)

    const subscriptionMessage = {
      userMessage: 'User message',
      callToAction: {
        callToActionTitle: 'Open mail',
        callToActionLink: 'mailto:test@mail.com',
        callToActionIcon: CallToActionIcon.EMAIL,
      },
    }

    const result = getCallToActionLinkForSubscriptionMessage(subscriptionMessage, true)

    expect(result).toEqual([
      {
        icon: mockIcon,
        wording: 'Open mail',
        onPress: openInbox,
      },
    ])

    expect(shouldOpenInbox).toHaveBeenCalledWith('mailto:test@mail.com')
  })

  it('returns external navigation when inbox should not be opened', () => {
    mockShouldOpenInbox.mockReturnValueOnce(false)

    const subscriptionMessage = {
      userMessage: 'User message',
      callToAction: {
        callToActionTitle: 'Visit site',
        callToActionLink: 'https://example.com',
        callToActionIcon: CallToActionIcon.EMAIL,
      },
    }

    const result = getCallToActionLinkForSubscriptionMessage(subscriptionMessage, true)

    expect(result).toEqual([
      {
        icon: mockIcon,
        wording: 'Visit site',
        externalNav: { url: 'https://example.com' },
      },
    ])
  })

  it('returns external navigation when mail app is not available', () => {
    mockShouldOpenInbox.mockReturnValueOnce(true)

    const subscriptionMessage = {
      userMessage: 'User message',
      callToAction: {
        callToActionTitle: 'Open mail',
        callToActionLink: 'mailto:test@mail.com',
        callToActionIcon: CallToActionIcon.EMAIL,
      },
    }

    const result = getCallToActionLinkForSubscriptionMessage(subscriptionMessage, false)

    expect(result).toEqual([
      {
        icon: mockIcon,
        wording: 'Open mail',
        externalNav: { url: 'mailto:test@mail.com' },
      },
    ])
  })
})
