import { AchievementEnum, BookingOfferResponse, OfferResponse, ReactionTypeEnum } from 'api/gen'
import { ReactionChoiceModalBodyEnum, ReactionFromEnum } from 'features/reactions/enum'
import { OfferImageBasicProps } from 'features/reactions/types'

import { createModal } from './modal.creator'
import { createModalFactory } from './modals.factory'

export const achievementsModal = createModal<{ names: AchievementEnum[] }>('achievements')

// reactionModal à réadapter
export const reactionModal = createModal<{
  offer: OfferResponse | BookingOfferResponse
  dateUsed: string
  defaultReaction?: ReactionTypeEnum | null
  from: ReactionFromEnum
  bodyType: ReactionChoiceModalBodyEnum
  offerImages?: OfferImageBasicProps[]
}>('reaction')

export const modalFactory = createModalFactory()
