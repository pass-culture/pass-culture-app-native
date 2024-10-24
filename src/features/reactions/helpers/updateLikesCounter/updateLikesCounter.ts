export function updateLikesCounter(currentLikes: number, isLike: boolean) {
  const newLikes = currentLikes + (isLike ? 1 : -1)
  return Math.max(newLikes, 0)
}
