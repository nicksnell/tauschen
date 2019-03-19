import { getTemplateRegExp, getJsRegExp } from '../src/lib'

describe('test the template matching regular expression', () => {
  it('matches a template with single quotes', () => {
    const template = "<div>{{ $t('Test String') }}</div>"
    const regex = getTemplateRegExp()
    const result = regex.exec(template)
    expect(result[2]).toBe('Test String')
  })

  it('matches a template with single quotes and no spaces', () => {
    const template = "<div>{{$t('Test String')}}</div>"
    const regex = getTemplateRegExp()
    const result = regex.exec(template)
    expect(result[2]).toBe('Test String')
  })

  it('matches a template with double quotes', () => {
    const template = '<div>{{ $t("Test String") }}</div>'
    const regex = getTemplateRegExp()
    const result = regex.exec(template)
    expect(result[2]).toBe('Test String')
  })

  it('matches a template with double quotes and no spaces', () => {
    const template = '<div>{{$t("Test String")}}</div>'
    const regex = getTemplateRegExp()
    const result = regex.exec(template)
    expect(result[2]).toBe('Test String')
  })
})

describe('test the translation tags in scripts', () => {
  it('matches a string in script tags', () => {
    const script = "function() { return this.$t('Testing') }"
    const regex = getJsRegExp()
    const result = regex.exec(script)
    expect(result[2]).toBe('Testing')
  })
})
