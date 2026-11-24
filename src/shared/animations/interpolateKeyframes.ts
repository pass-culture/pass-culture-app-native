type Keyframe = {
  /** Time in milliseconds from the start of the animation */
  at: number
  value: number
}

export type KeyframeTrack = readonly Keyframe[]

// Equivalent to cubic-bezier(0.33, 0, 0.67, 1), the default ease of After Effects / Lottie
const easeInOut = (t: number) => {
  'worklet'
  return t * t * (3 - 2 * t)
}

/**
 * Returns the value of a keyframe track at a given time, easing between keyframes.
 * Before the first keyframe (resp. after the last one), the first (resp. last) value is held.
 */
export const interpolateKeyframes = (time: number, track: KeyframeTrack): number => {
  'worklet'
  const first = track[0]
  const last = track.at(-1)
  if (!first || !last) return 0
  if (time <= first.at) return first.value
  if (time >= last.at) return last.value

  for (let i = 1; i < track.length; i++) {
    const to = track[i]
    const from = track[i - 1]
    if (to && from && time <= to.at) {
      const progress = (time - from.at) / (to.at - from.at)
      return from.value + (to.value - from.value) * easeInOut(progress)
    }
  }
  return last.value
}
