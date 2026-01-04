// 引入vue模版的eslint
import pluginVue from 'eslint-plugin-vue';
import eslint from '@eslint/js';
// ts-eslint解析器，使 eslint 可以解析 ts 语法
import tseslint from 'typescript-eslint';
// vue文件解析器
import vueParser from 'vue-eslint-parser';
import prettier from 'eslint-plugin-prettier';

export default tseslint.config({
    // ignores: ['node_modules', 'prettier.config.cjs', 'dist*'],
    files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
    // tseslint.config添加了extends扁平函数，直接用。否则是eslint9.0版本是没有extends的
    extends: [
        eslint.configs.recommended,
        ...tseslint.configs.recommended,
        ...pluginVue.configs['flat/essential'],
    ],
    plugins: {
        prettier,
    },
    languageOptions: {
        parser: vueParser, // 使用vue解析器，这个可以识别vue文件
        parserOptions: {
            parser: tseslint.parser, // 在vue文件上使用ts解析器
            sourceType: 'module',
            ecmaVersion: 2020,
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
    rules: {
        'vue/attributes-order': 'error',
        'vue/multi-word-component-names': 'off',
    },
});
