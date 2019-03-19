import { getAllMatches } from '../src/lib'

describe('test all the matches are found', () => {
  it('match multiple matches', () => {
    const template = "<div>{{ $t('Test String') }}</div><div>{{ $t('New Thing') }}</div>"
    const result = getAllMatches(template)
    expect(result.length).toBe(2)
    expect(result[0]).toBe('Test String')
    expect(result[1]).toBe('New Thing')
  })
})
