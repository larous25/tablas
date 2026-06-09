import js from '@eslint/js'
import globals from 'globals'
import prettier from 'eslint-config-prettier'

export default [
  js.configs.recommended,

  ignores: [
    'src/public/js/**'
  ],
  // Código de la aplicación
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node
      }
    }
  },

  // Archivos de pruebas
  {
    files: [
      '**/*.test.js',
      '**/*.spec.js',
      'tests/**/*.js',
      '__tests__/**/*.js'
    ],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      }
    }
  },

  prettier
]
