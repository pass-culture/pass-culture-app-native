import { BackgroundColorKey } from 'theme/types'

export const gradientImagesMapping: Record<
  'Gold' | 'Aquamarine' | 'SkyBlue' | 'DeepPink' | 'Coral' | 'Lilac',
  [BackgroundColorKey, BackgroundColorKey]
> = {
  Gold: ['decorative04', 'decorative01'],
  Aquamarine: ['decorative04', 'decorative02'],
  SkyBlue: ['decorative03', 'decorative02'],
  DeepPink: ['decorative04', 'decorative05'],
  Coral: ['decorative02', 'decorative01'],
  Lilac: ['decorative05', 'decorative04'],
}
