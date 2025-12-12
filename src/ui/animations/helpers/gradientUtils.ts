import { LottieColor, LottieGradient } from 'ui/animations/type'

export const patchGradientStops = (gradient: LottieGradient, newColor: LottieColor) => {
  const stops = gradient.k?.k
  if (!Array.isArray(stops)) return

  const patched = [...stops]
  for (let i = 0; i + 3 < patched.length; i += 4) {
    patched[i + 1] = newColor[0]
    patched[i + 2] = newColor[1]
    patched[i + 3] = newColor[2]
  }

  if (gradient.k) {
    gradient.k.k = patched
  } else {
    gradient.k = { k: patched }
  }
}
