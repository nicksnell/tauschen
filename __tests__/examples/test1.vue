<template>
    <main>
        <h1>{{ $t('Title of thing') }}</h1>
        <p>{{ $t('Some detail about things') }}</p>
        <p>{{ $t('Footer') }}</p>
    </main>
</template>

<script>
export default {
  name: 'test',
  methods: {
    test() {
      return this.$t('Another thing')
    }
  }
}
</script>
