import { parseMarkdown } from 'libs/parsers/parseMarkdown/parseMarkdown'

describe('parseMarkdown', () => {
  it('should parse bold text', () => {
    const input = 'Text **bold** only'
    const output = parseMarkdown(input)

    expect(output).toEqual([{ text: 'Text ' }, { text: 'bold', isBold: true }, { text: ' only' }])
  })

  it('should parse italic text', () => {
    const input = 'Text _italic_ only'
    const output = parseMarkdown(input)

    expect(output).toEqual([
      { text: 'Text ' },
      { text: 'italic', isItalic: true },
      { text: ' only' },
    ])
  })

  it('should parse several styles in a single string', () => {
    const input = 'Text **bold** and _italic_.'
    const output = parseMarkdown(input)

    expect(output).toEqual([
      { text: 'Text ' },
      { text: 'bold', isBold: true },
      { text: ' and ' },
      { text: 'italic', isItalic: true },
      { text: '.' },
    ])
  })

  it('should ignore styles not closed correctly', () => {
    const input = '**Unfinished bold text and _italic too'
    const output = parseMarkdown(input)

    expect(output).toEqual([{ text: '**Unfinished bold text and _italic too' }])
  })

  it('should display plain text without styles', () => {
    const input = 'Text without style'
    const output = parseMarkdown(input)

    expect(output).toEqual([{ text: 'Text without style' }])
  })

  it('should parse several same styles in a single string', () => {
    const input = '**Bold1** and **Bold2**.'
    const output = parseMarkdown(input)

    expect(output).toEqual([
      { text: 'Bold1', isBold: true },
      { text: ' and ' },
      { text: 'Bold2', isBold: true },
      { text: '.' },
    ])
  })

  it('should parse nested text with different styles', () => {
    const input = '**Bold and _italic_**'
    const output = parseMarkdown(input)

    expect(output).toEqual([
      { text: 'Bold and ', isBold: true },
      { text: 'italic', isBold: true, isItalic: true },
    ])
  })

  it('should parse special characters correctly', () => {
    const input = 'Text with special characters: **éàç!**'
    const output = parseMarkdown(input)

    expect(output).toEqual([
      { text: 'Text with special characters: ' },
      { text: 'éàç!', isBold: true },
    ])
  })

  it('should not transform url pattern', () => {
    const input = '**Bold text** https://test_url_1 _italic text_ http://test_url_2'
    const output = parseMarkdown(input)

    expect(output).toEqual([
      { text: 'Bold text', isBold: true },
      { text: ' https://test_url_1 ' },
      { text: 'italic text', isItalic: true },
      { text: ' http://test_url_2' },
    ])
  })

  it('should return an empty array when style text is empty', () => {
    const input = '****'
    const output = parseMarkdown(input)

    expect(output).toEqual([])
  })

  it('should return an empty array when style text has an empty style text', () => {
    const input = '********'
    const output = parseMarkdown(input)

    expect(output).toEqual([])
  })
})
