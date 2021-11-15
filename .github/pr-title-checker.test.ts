// See https://github.com/Slashgear/action-check-pr-title/blob/main/src/run.js#L17

const REGEX = new RegExp(
  /(\(?\[?PC-[0-9]+\)?\]? )?(build|ci|docs|feat|fix|perf|refactor|test)\(\w+\): \w+/i
)

const invalidPullRequestTitles: string[] = [
  '[PC-1234] tech(home): Add color to button', // invalid type
  '[PC-1234] Add color to button', // no scope nor type
  '[PC-1234] feat: Add color to button', // No scope
  'feat: Add color to button [PC-1234]', // jira ticket at the end
]

const validPullRequestTitles: string[] = [
  '[PC-1234] feat(home): Add color to button',
  '(PC-1234) feat(home): Add color to button',
  'PC-1234 feat(home): Add color to button',
  'feat(home): Add color to button', // jira ticket is optionel, although better to have it
]

describe('pr-title-checker', () => {
  it.each(invalidPullRequestTitles)('should not allow invalid PR titles: "%s"', (title) => {
    expect(REGEX.test(title)).toBeFalsy()
  })

  it.each(validPullRequestTitles)('should allow valid PR titles: "%s"', (title) => {
    expect(REGEX.test(title)).toBeTruthy()
  })
})
