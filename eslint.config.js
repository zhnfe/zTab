import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import stylistic from '@stylistic/eslint-plugin'

const vueConfig = defineConfigWithVueTs(
    vueTsConfigs.strict
)
export default [
    {
        name: 'app/files-to-lint',
        files: ['**/*.{js,ts,mts,tsx,vue}']
    },

    {
        name: 'app/files-to-ignore',
        ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/.nuxt/**', 'src/components/icons/**', '**/.local/**']
    },
    ...vueConfig,
    ...pluginVue.configs['flat/strongly-recommended'],
    {
        rules: {
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-explicit-any': 'off'
        }
    },
    {
        plugins: {
            '@stylistic': stylistic
        },
        rules: {
            ...stylistic.configs['recommended'].rules,
            '@stylistic/indent': ['error', 4],
            '@stylistic/comma-dangle': ['error', 'never'],
            '@stylistic/quote-props': ['error', 'as-needed'],
            '@stylistic/function-call-spacing': ['error', 'never'],
            '@stylistic/arrow-parens': ['error', 'as-needed']
        }
    },
    {
        name: 'for vue file',
        files: ['**/*.vue'],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        rules: {
            'vue/max-attributes-per-line': ['error', {
                singleline: {
                    max: 2
                },
                multiline: {
                    max: 1
                }
            }],
            'vue/html-indent': ['error', 4, {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: []
            }],
            'vue/singleline-html-element-content-newline': 'off',
            'vue/html-self-closing': ['error', {
                html: {
                    void: 'never',
                    normal: 'never',
                    component: 'always'
                },
                svg: 'always',
                math: 'always'
            }],
            'vue/multi-word-component-names': 'off',
            'vue/block-lang': ['error', {
                script: { lang: ['ts', 'tsx'] }
            }]
        }
    }
]
