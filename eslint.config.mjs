import typescriptEslintParser from '@typescript-eslint/parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';

export default [
    {
        // Ignore specific directories from linting
        ignores: ['node_modules/**', 'dist/**'],
    },
    {
        // Apply configuration to TypeScript files
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptEslintParser,
            ecmaVersion: 2020,
            sourceType: 'module',
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
        },
        rules: {
            // Core ESLint rules
            'no-unused-vars': ['warn', { 
                'args': 'none',  // Ignore unused function arguments
                'varsIgnorePattern': '^_',  // Allow unused variables starting with an underscore
            }],
            // TypeScript-specific rules
            '@typescript-eslint/no-unused-vars': ['warn', {
                'args': 'none',  // Ignore unused function arguments
                'varsIgnorePattern': '^_',  // Allow unused variables starting with an underscore
            }],
            '@typescript-eslint/no-explicit-any': 'warn',  // Warn about usage of 'any'
            '@typescript-eslint/explicit-function-return-type': 'off',  // Do not enforce return types on functions
            '@typescript-eslint/no-non-null-assertion': 'warn',  // Warn about non-null assertions
        },
    },
];
