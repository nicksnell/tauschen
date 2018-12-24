import {getRegExp} from '../src/lib'

describe('test the template matching regular expression', () => {
  it('matches a template with single quotes', () => {
    const template = "<div>{{ $t('Test String') }}</div>"
    const regex = getRegExp()
    const result = regex.exec(template)
    expect(result[2]).toBe('Test String')
  })

  it('matches a template with single quotes and no spaces', () => {
    const template = "<div>{{$t('Test String')}}</div>"
    const regex = getRegExp()
    const result = regex.exec(template)
    expect(result[2]).toBe('Test String')
  })

  it('matches a template with double quotes', () => {
    const template = '<div>{{ $t("Test String") }}</div>'
    const regex = getRegExp()
    const result = regex.exec(template)
    expect(result[2]).toBe('Test String')
  })

  it('matches a template with double quotes and no spaces', () => {
    const template = '<div>{{$t("Test String")}}</div>'
    const regex = getRegExp()
    const result = regex.exec(template)
    expect(result[2]).toBe('Test String')
  })
})
