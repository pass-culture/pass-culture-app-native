import { EmojiOption, MoodboardOption } from 'features/moodSurvey/types'

export const mapEmojiToMoodboard = new Map<EmojiOption, MoodboardOption[]>([
  ['Festif', ['Classique', 'Dark mode', 'Fun', 'Summer vibe']],
  ['Chill', ['Romantique', 'Intello', 'Mélancolique', 'Créative']],
  ['In love', ['Cocooning', 'Insolite', 'Fun', 'Intello']],
  ['Aventure', ['Mystérieuse', 'Insolite', 'Intello', 'Créative']],
])
