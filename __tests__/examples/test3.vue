<template>
  <div class="ssn-widget">
    <label-widget
      v-bind:field="field"
      v-bind:fieldId="getFieldId()"
      ></label-widget>

    <readonly-widget
      v-if="isReadOnly"
      v-bind:value="field.value"></readonly-widget>

    <input
      v-if="!(detail && confirmed) && !isReadOnly"
      ref="ssn"
      name="ssn"
      autocomplete="off"
      type="text"
      required
      v-model="ssn"
      class="mutt-field mutt-field-text input">

    <button
      v-if="!detail && !isReadOnly"
      class="btn btn--search"
      v-on:click.prevent="lookup()">
      <span>{{ $t('Search') }}</span>
    </button>

    <help-widget v-bind:field="field" />

    <error-widget
      v-if="!isReadOnly && errors"
      v-bind:field="field"
      v-bind:errors="errors"
      v-bind:errorClass="getErrorClass()"></error-widget>

    <div v-if="detail && !isReadOnly" class="ssn-widget__details">
      <template v-if="confirmed">
        <h3>
          {{ ssn }} - {{ displayResult }}
        </h3>
        <button
          class="btn btn--secondary btn--secondary--darkbg"
          v-on:click.prevent="clear()">
          <span>{{ $t('Re-enter SSN') }}</span>
        </button>
      </template>

      <template v-if="!confirmed">
        <h2>{{ $t('Are these details correct?') }}</h2>
        <h3>
          {{ displayResult }}
        </h3>
        <ul class="button-list">
          <li>
            <button
              class="btn btn--secondary btn--secondary--darkbg"
              v-on:click.prevent="clear()"><span>{{ $t('No') }}</span></button>
          </li>
          <li>
            <button
              class="btn"
              v-on:click.prevent="select()"><span>{{ $t('Yes') }}</span></button>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
import MuttVue from 'mutt-forms-vue'
import axios from 'axios'
import format from 'string-format'

export default {
  name: 'mutt-personnummer',
  mixins: [
    MuttVue.mixin,
  ],
  data() {
    return {
      ssn: '',
      detail: null,
      errors: null,
      processing: false,
      config: {},
      displayTemplate: '{givenName} {lastName}',

      // Note: Default is true to show populated values
      confirmed: true,
    }
  },
  methods: {
    init() {
      if (!this.field.options.hasOwnProperty('ssn')) {
        throw new Error(
          this.$t('[SSN] Invalid config for widget - missing ssn config!')
        )
      }

      const requiredConfig = [
        this.field.options.ssn.hasOwnProperty('host'),
        this.field.options.ssn.hasOwnProperty('username'),
        this.field.options.ssn.hasOwnProperty('password'),
      ]

      if (!requiredConfig.every((e) => e === true)) {
        throw new Error(
          this.$t('[SSN] Invalid config - missing paramater!')
        )
      }

      if (this.field.options.ssn.hasOwnProperty('template')) {
        this.displayTemplate = this.field.options.ssn.template
      }

      // No-op for i18n integration if not present
      if (!this.hasOwnProperty('$t')) {
        this.$t = (str) => {
          return str
        }
      }

      // Guard against field value being undefined
      if (!this.field.value) {
        this.field.value = null
      }

      this.ssn = this.field.value
    },
    validate() {
      if (!this.ssn || this.ssn === '') {
        this.errors = [
          this.$t('Please enter a Personnummer.'),
        ]
        console.debug('[SSN] Invalid', this.ssn)
        return false
      }

      return true
    },
    async lookup() {
      if (this.processing === true) {
        return
      }

      if (!this.validate()) {
        return
      }

      this.processing = true

      // Lookup the SSN number
      let response

      try {
        response = await axios({
          url: this.field.options.ssn.host,
          params: {
            SSN: this.ssn,
          },
          headers: {
            Accept: 'application/json',
            Package: 'personbasic',
          },
          auth: {
            username: this.field.options.ssn.username,
            password: this.field.options.ssn.password,
          },
          withCredentials: true,
        })
      } catch (error) {
        console.error('[SSN] Lookup Error', error.response)
        return
      }

      console.debug('[SSN] Lookup Response', response)

      if (response.status === 200) {
        if (response.data.basic) {
          this.confirmed = false
          this.detail = response.data
        } else {
          /* eslint-disable */
          this.errors = [
            this.$t('Sorry we were unable to find that Personnummer.')
          ]
          /* eslint-enable */
        }
      } else {
        this.errors = [
          this.$t('Sorry, something has gone wrong. Please try again later.'),
        ]
      }
      this.processing = false
    },
    select() {
      // Commit the value
      this.field.value = this.ssn

      if (!this.field.validate()) {
        return
      }

      this.confirmed = true

      this.errors = null

      this.$emit('callback', {
        action: 'ssnSelect',
        bubble: true,
        result: this.detail,
      })

      this.$emit('callback', {
        action: 'toggleOverlay',
        validated: true,
      })
    },
    clear() {
      this.ssn = ''
      this.detail = null

      this.$nextTick(() => {
        this.$refs['ssn'].focus()
      })
    },
    getValue() {
      return this.ssn
    },
    setValue(value) {
      this.ssn = value
    },
  },
  computed: {
    displayResult() {
      if (this.detail === null) {
        return null
      }

      const detail = Object.assign({
        ssn: this.ssn,
      }, this.detail.basic)

      return format(this.displayTemplate, detail)
    },
  },
  watch: {
    ssn() {
      this.errors = null

      // If there is SSN detail and the value is
      // changing then we shoudl clear it
      if (this.detail) {
        this.$emit('callback', {
          action: 'ssnClear',
          bubble: true,
        })

        this.detail = null
        this.field.value = ''
      }
    },
  },
}
</script>
