import antfu from '@antfu/eslint-config'

export default antfu(
    {
        e18e: false,
        stylistic: {
            indent: 4
        },
        formatters: {
            css: true,
            html: true,
            markdown: 'prettier'
        }
    },
    {
        rules: {
            'style/comma-dangle': ['error', 'never'],
            'antfu/if-newline': 'off',
            'yaml/indent': ['error', 2],
            'node/prefer-global/process': 'off',
            'no-console': 'off',
            'no-alert': 'off'
        }
    },
    {
        name: 'for node env files',
        files: ['plugins/**/*.ts', 'vite.config.ts'],
        rules: {
            'no-console': 'off'
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
            'antfu/top-level-function': 'off',
            'vue/block-order': 'off',
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
                    void: 'always',
                    normal: 'always',
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
)
