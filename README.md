# Tauschen

Create translation files compatible with [vue-i18n](https://github.com/kazupon/vue-i18n).

Will match translation strings in the format:

- `{{ $t('Some string') }}`
- `{{ $t("Some string") }}`
- `{{$t('Some string')}}`
- `{{$t("Some string")}}`

### Commands

`generate`

Take a src directory and create a translation map file (Will recursively match
`*.vue` files).
