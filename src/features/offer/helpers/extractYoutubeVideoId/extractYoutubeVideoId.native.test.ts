import { extractYoutubeVideoId } from 'features/offer/helpers/extractYoutubeVideoId/extractYoutubeVideoId'

describe('extractYoutubeVideoId', () => {
  it('should extract video ID from standard YouTube URL', () => {
    const url = 'https://www.youtube.com/watch?v=hWdLhB2okqA'

    expect(extractYoutubeVideoId(url)).toBe('hWdLhB2okqA')
  })

  it('should extract video ID when there are extra query params', () => {
    const url = 'https://www.youtube.com/watch?v=hWdLhB2okqA&t=30s'

    expect(extractYoutubeVideoId(url)).toBe('hWdLhB2okqA')
  })

  it('should return undefined if "v" parameter is missing', () => {
    const url = 'https://www.youtube.com/watch?time=30'

    expect(extractYoutubeVideoId(url)).toBeUndefined()
  })

  it('should return undefined if URL is not a YouTube watch URL', () => {
    const url = 'https://www.google.com'

    expect(extractYoutubeVideoId(url)).toBeUndefined()
  })

  it('should handle malformed URLs without throwing', () => {
    const url = 'not a real url'

    expect(extractYoutubeVideoId(url)).toBeUndefined()
  })
})
