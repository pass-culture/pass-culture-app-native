import { KeyframeTrack } from 'shared/animations/interpolateKeyframes'

/**
 * Favorite heart animation,
 *
 * - `at`: time in ms since the user pressed the button
 * - scale: 1 = icon size
 * - opacity: 0 = invisible, 1 = visible
 * - translateX: fraction of the icon size (0.04 = 4% of the icon width)
 */

export const ADD_FAVORITE_DURATION = 500

export const addFavoriteKeyframes = {
  // Whole heart squash & stretch, from its center
  heartScaleX: [
    { at: 0, value: 1 },
    { at: 120, value: 0.7 },
    { at: 240, value: 1.11 },
    { at: 300, value: 0.99 },
    { at: 360, value: 1.1 },
    { at: 420, value: 1 },
  ],
  heartScaleY: [
    { at: 0, value: 1 },
    { at: 120, value: 0.7 },
    { at: 240, value: 1.45 },
    { at: 300, value: 0.75 },
    { at: 360, value: 1.25 },
    { at: 420, value: 1 },
  ],
  // Outline -> filled cross-fade, at the top of the stretch
  outlineOpacity: [
    { at: 285, value: 1 },
    { at: 300, value: 0 },
  ],
  filledOpacity: [
    { at: 285, value: 0 },
    { at: 300, value: 1 },
  ],
} satisfies Record<string, KeyframeTrack>

export const REMOVE_FAVORITE_DURATION = 765

/**
 * Zigzag crack splitting the filled heart in two halves, from the top notch to the bottom tip.
 * Points are [x, y] in the heart icon viewBox (48 x 49).
 */
export const HEART_CRACK_POINTS: readonly (readonly [number, number])[] = [
  [24, 19.6],
  [24, 21.6],
  [19.5, 26.1],
  [26.1, 32.8],
  [22.3, 36.6],
  [22.9, 39.3],
  [24, 42.8],
  [24, 44.5],
]

export const removeFavoriteKeyframes = {
  // Filled heart wobbles from its bottom tip...
  filledScaleY: [
    { at: 0, value: 1 },
    { at: 95, value: 1.03 },
    { at: 185, value: 0.887 },
    { at: 280, value: 1.046 },
    { at: 420, value: 1 },
  ],
  // ...breaks in two halves...
  leftHalfTranslateX: [
    { at: 185, value: 0 },
    { at: 270, value: -0.036 },
  ],
  rightHalfTranslateX: [
    { at: 185, value: 0 },
    { at: 280, value: 0.036 },
  ],
  // ...fades out...
  filledOpacity: [
    { at: 420, value: 1 },
    { at: 500, value: 0 },
  ],
  // ...then the outline heart pops back in, from its center
  outlineScaleX: [
    { at: 545, value: 0 },
    { at: 625, value: 1.2 },
    { at: 685, value: 0.8 },
    { at: 710, value: 1.05 },
    { at: 735, value: 0.9 },
    { at: 765, value: 1 },
  ],
  outlineScaleY: [
    { at: 545, value: 0 },
    { at: 625, value: 1.35 },
    { at: 685, value: 0.7 },
    { at: 710, value: 1.15 },
    { at: 735, value: 0.86 },
    { at: 765, value: 1 },
  ],
} satisfies Record<string, KeyframeTrack>
