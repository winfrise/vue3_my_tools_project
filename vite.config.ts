// 引入 Node.js 路径处理模块
import { resolve } from 'path';
// 用于加载 .env 环境变量（即使在 config 加载阶段）
import { loadEnv } from 'vite';
// Vite 配置类型定义，提升 TypeScript 智能提示
import type { UserConfig, ConfigEnv } from 'vite';

// Vue 官方插件：支持 .vue 单文件组件
import Vue from '@vitejs/plugin-vue';
// 支持在 Vue 中使用 JSX/TSX 语法
import VueJsx from '@vitejs/plugin-vue-jsx';

// 开发时显示构建进度条
import progress from 'vite-plugin-progress';
// 支持在 index.html 中使用 EJS 模板语法（如 <%= title %>）
import { ViteEjsPlugin } from 'vite-plugin-ejs';
// 提供 mock 数据服务（开发 & 生产均可启用）
import { viteMockServe } from 'vite-plugin-mock';
// 清理未使用的图标（配合 unocss/preset-icons 使用）
import PurgeIcons from 'vite-plugin-purge-icons';
// 构建完成后自动复制服务器访问地址到剪贴板
import ServerUrlCopy from 'vite-plugin-url-copy';
// 自动生成 SVG 雪碧图（将 src/assets/svgs 下的 SVG 合并为 symbol）
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
// 按需引入第三方 UI 库的样式（此处用于 Element Plus）
import {
    createStyleImportPlugin,
    ElementPlusResolve,
} from 'vite-plugin-style-import';

// UnoCSS 原子化 CSS 引擎（替代 Tailwind）
import UnoCSS from 'unocss/vite';
// 构建产物分析插件（生成依赖体积可视化报告）
import { visualizer } from 'rollup-plugin-visualizer';

// 自动导入 API（如 ref, computed, ElMessage 等）
import AutoImport from 'unplugin-auto-import/vite';
// 自动注册组件（无需手动 import 和 components 注册）
import Components from 'unplugin-vue-components/vite';
// 专为 Element Plus 设计的解析器（实现按需加载）
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// 获取项目根目录路径
const root = process.cwd();

/**
 * 辅助函数：将相对路径转换为绝对路径
 * @example pathResolve('src') → /your/project/src
 */
function pathResolve(dir: string) {
    return resolve(root, '.', dir);
}

/**
 * Vite 主配置函数（支持动态根据命令和模式返回不同配置）
 * @param command - 'serve'（开发） 或 'build'（构建）
 * @param mode - 当前环境模式（如 'development', 'production'）
 */
export default ({ command, mode }: ConfigEnv): UserConfig => {
    let env = {} as any;
    const isBuild = command === 'build';

    // 动态加载 .env 文件（兼容 CLI 参数传递方式）
    if (!isBuild) {
        // 开发环境：从 process.argv 解析 --mode 参数
        const argvMode =
            process.argv[3] === '--mode' ? process.argv[4] : process.argv[3];
        env = loadEnv(argvMode, root);
    } else {
        // 构建环境：直接使用传入的 mode
        env = loadEnv(mode, root);
    }

    return {
        /**
         * 部署基础路径（影响静态资源 URL）
         * 例如：VITE_BASE_PATH=/admin/ → 所有资源路径前缀为 /admin/
         */
        base: env.VITE_BASE_PATH,

        /**
         * 插件列表（顺序很重要！）
         */
        plugins: [
            // 1. Vue SFC 支持
            Vue({
                script: {
                    defineModel: true, // ← 显式启用 Vue 3.4+ 的 defineModel 语法糖
                },
                template: {
                    compilerOptions: {
                        // 告诉 Vue 编译器：这些是自定义 Web Components，不要当作 Vue 组件处理
                        isCustomElement: tag => {
                            const customTags = [
                                'cropper-canvas',
                                'cropper-image',
                                'cropper-selection',
                                'cropper-crosshair',
                                'cropper-grid',
                                'cropper-handle',
                                'cropper-shade',
                            ];
                            return customTags.includes(tag);
                        },
                    },
                },
            }),

            // 2. 自动导入常用 API（避免重复 import）
            AutoImport({
                resolvers: [ElementPlusResolver()], // 自动导入 ElMessage 等
                dts: 'src/auto-imports.d.ts', // 生成类型声明文件，支持 TS 智能提示
            }),

            // 3. 自动注册组件（无需手动 components: {}）
            Components({
                resolvers: [
                    ElementPlusResolver({
                        // 若使用自定义主题，可设为 'sass'（默认 'css'）
                        // importStyle: 'sass'
                    }),
                ],
                dts: 'src/components.d.ts', // 生成组件类型声明
            }),

            // 4. JSX/TSX 支持
            VueJsx(),

            // 5. 构建完成后复制访问 URL 到剪贴板
            ServerUrlCopy(),

            // 6. 开发构建时显示进度条
            progress(),

            // 8. SVG 雪碧图插件：将本地 SVG 合并为 <symbol>，通过 <use> 引用
            createSvgIconsPlugin({
                iconDirs: [pathResolve('src/assets/svgs')], // SVG 文件目录
                symbolId: 'icon-[dir]-[name]', // 生成的 ID 格式
                svgoOptions: true, // 自动优化 SVG
            }),

            // 9. 清理未使用的图标（配合 UnoCSS preset-icons）
            PurgeIcons(),

            // 10. Mock 服务：开发时启用，生产也可按需启用
            env.VITE_USE_MOCK === 'true'
                ? viteMockServe({
                      ignore: /^\_/, // 忽略以下划线开头的文件
                      mockPath: 'mock', // mock 文件目录
                      localEnabled: !isBuild, // 开发环境启用
                      prodEnabled: isBuild, // 生产环境是否启用
                      injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer'
          setupProdMockServer()
          `, // 在生产构建时注入 mock 初始化代码
                  })
                : undefined,

            // 11. EJS 模板支持：允许在 index.html 中使用 <%= title %>
            ViteEjsPlugin({
                title: env.VITE_APP_TITLE, // 从 .env 读取应用标题
            }),

            // 12. UnoCSS 原子化 CSS 引擎
            UnoCSS(),
        ],

        /**
         * CSS 预处理器配置
         */
        css: {
            preprocessorOptions: {
                less: {
                    // 全局注入 variables.module.less，所有 .less 文件可直接使用其中变量
                    additionalData:
                        '@import "./src/styles/variables.module.less";',
                    javascriptEnabled: true, // 不推荐，启用 Less 的 JavaScript 表达式
                },
            },
        },

        /**
         * 模块解析配置（影响 import 路径）
         */
        resolve: {
            // 自动补全的文件扩展名
            extensions: [
                '.mjs',
                '.js',
                '.ts',
                '.jsx',
                '.tsx',
                '.json',
                '.less',
                '.css',
            ],
            // 路径别名（@ → src）
            alias: [
                {
                    find: /\@\//, // 匹配以 '@/' 开头的路径
                    replacement: `${pathResolve('src')}/`, // 替换为绝对路径
                },
            ],
        },

        /**
         * Esbuild 转换优化（Vite 默认使用 esbuild 进行预构建）
         */
        esbuild: {
            // 移除 console.log（仅当 VITE_DROP_CONSOLE=true）
            pure:
                env.VITE_DROP_CONSOLE === 'true' ? ['console.log'] : undefined,
            // 移除 debugger 语句（仅当 VITE_DROP_DEBUGGER=true）
            drop: env.VITE_DROP_DEBUGGER === 'true' ? ['debugger'] : undefined,
        },

        /**
         * 构建配置（仅在 vite build 时生效）
         */
        build: {
            minify: 'esbuild', // 明确指定使用 esbuild 压缩
            target: 'es2015', // 输出 JS 语法目标（兼容现代浏览器）
            outDir: env.VITE_OUT_DIR || 'dist', // 输出目录
            sourcemap: env.VITE_SOURCEMAP === 'true', // 是否生成 source map

            rollupOptions: {
                // 1. 依赖分析插件（仅当 VITE_USE_BUNDLE_ANALYZER=true）
                plugins:
                    env.VITE_USE_BUNDLE_ANALYZER === 'true'
                        ? [visualizer()]
                        : undefined,

                // 2. 代码分割策略（避免 vendor 过大）
                output: {
                    manualChunks: {
                        'vue-chunks': ['vue', 'vue-router', 'pinia'],
                        'element-plus': ['element-plus'],
                        'wang-editor': [
                            '@wangeditor/editor',
                            '@wangeditor/editor-for-vue',
                        ],
                        echarts: ['echarts', 'echarts-wordcloud'],
                    },
                },
            },

            // 是否拆分 CSS（默认 true，设为 false 可合并为单个 CSS）
            cssCodeSplit: !(env.VITE_USE_CSS_SPLIT === 'false'),
            // CSS 目标浏览器（影响 autoprefixer）
            cssTarget: ['chrome31'],
        },

        /**
         * 开发服务器配置（仅 vite dev 时生效）
         */
        server: {
            port: 4000, // 启动端口
            host: '0.0.0.0', // 允许外部访问（局域网可访问）
            hmr: {
                overlay: false, // 关闭错误遮罩层（推荐保留控制台查看）
            },
            proxy: {
                // 代理 /api 请求到后端服务，解决跨域
                '/api': {
                    target: 'http://127.0.0.1:8000',
                    changeOrigin: true, // 修改请求头中的 origin
                    rewrite: path => path.replace(/^\/api/, ''), // 去掉 /api 前缀
                },
            },
        },

        /**
         * 依赖预构建优化（提升冷启动速度）
         * 将大型依赖提前编译为 ES 模块
         */
        optimizeDeps: {
            include: [
                'vue',
                'vue-router',
                'vue-types',
                '@iconify/iconify', // Iconify 图标核心库
                '@vueuse/core',
                'axios',
                'qs',
                'echarts',
                'echarts-wordcloud',
                'qrcode',
                '@wangeditor/editor',
                '@wangeditor/editor-for-vue',
                'vue-json-pretty',
                '@zxcvbn-ts/core',
                'dayjs',
                'cropperjs',
            ],
        },
    };
};
