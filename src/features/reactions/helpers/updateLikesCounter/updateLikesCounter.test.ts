import { updateLikesCounter } from 'features/reactions/helpers/updateLikesCounter/updateLikesCounter'

describe('updateLikesCounter', () => {
  it('should return likes counter + 1 when there is a new like', () => {
    const currentLikes = 10
    const isLike = true
    const result = updateLikesCounter(currentLikes, isLike)

    expect(result).toEqual(11)
  })

  it('should return likes counter - 1 when there is a new dislike and counter > 0', () => {
    const currentLikes = 10
    const isLike = false
    const result = updateLikesCounter(currentLikes, isLike)

    expect(result).toEqual(9)
  })

  it('should return likes counter to 0 when there is a new dislike and counter = 0', () => {
    const currentLikes = 0
    const isLike = false
    const result = updateLikesCounter(currentLikes, isLike)

    expect(result).toBe(0)
  })
})
