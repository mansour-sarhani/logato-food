import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';

export default [
    { files: ['**/*.{js,mjs,cjs,jsx}'] },
    { languageOptions: { globals: globals.browser } },
    {
        languageOptions: {
            parser: '@babel/eslint-parser',
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    presets: ['@babel/preset-react'],
                },
            },
        },
    },
    pluginJs.configs.recommended,
    pluginReact.configs.recommended,
    {
        plugins: {
            prettier: pluginPrettier,
        },
        rules: {
            ...configPrettier.rules,
            'prettier/prettier': 'error',
        },
    },
];
