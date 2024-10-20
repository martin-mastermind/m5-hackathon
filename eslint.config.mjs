import eslintConfigPrettier from '@vue/eslint-config-prettier'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  plugins: {
    prettier: eslintConfigPrettier,
  },
  rules: {
    ...eslintConfigPrettier.rules,
  },
}).overrideRules({
  'vue/max-attributes-per-line': ['warn', { singleline: 3 }],
})
