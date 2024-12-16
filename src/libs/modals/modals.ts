import { AchievementEnum } from 'api/gen'

import { createModal } from './modal.creator'

export const achievementsModal = createModal<{ names: AchievementEnum[] }>('achievements')
