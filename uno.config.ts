// 引入 UnoCSS 核心模块
import {
    defineConfig,
    toEscapedSelector as e,
    presetUno,
    presetIcons,
} from 'unocss';
// 引入变体分组转换器（支持如 `(hover:focus)` 这样的写法）
import transformerVariantGroup from '@unocss/transformer-variant-group';
// 用于在构建时读取 Vite 环境变量
import { loadEnv } from 'vite';
// 从项目常量中导入图标前缀（例如 'i-' 或 'icon-'）
import { ICON_PREFIX } from './src/constants';

// 获取项目根目录路径
const root = process.cwd();

/**
 * 动态创建图标预设（presetIcons）
 * 根据环境变量 VITE_USE_ONLINE_ICON 决定是否启用本地图标集
 * - 如果为 'true'：不使用本地图标预设（可能使用在线图标服务或 Element Plus 自带图标）
 * - 如果为 'false'：启用 presetIcons，使用本地 SVG 图标（通过 unplugin-icons 自动加载）
 */
const createPresetIcons = () => {
    // 判断当前是否为构建命令（vite build）
    const isBuild = !!process.argv[4];
    let env = {} as any;

    // 根据命令行参数加载对应的 .env 文件
    if (!isBuild) {
        // 开发环境：process.argv[3] 通常是 '--mode development'
        env = loadEnv(process.argv[3], root);
    } else {
        // 构建环境：process.argv[4] 通常是 '--mode production'
        env = loadEnv(process.argv[4], root);
    }

    // @ts-ignore：跳过 TypeScript 类型检查（因为 env 是动态对象）
    if (env.VITE_USE_ONLINE_ICON === 'true') {
        // 不使用本地图标预设 → 返回空数组
        return [];
    } else {
        // 启用本地图标预设
        return [
            presetIcons({
                autoInstall: false, // 禁用自动安装图标包（由 unplugin-icons 处理）
                prefix: ICON_PREFIX, // 使用项目定义的图标前缀，如 'i-'
            }),
        ];
    }
};

// 导出 UnoCSS 配置
export default defineConfig({
    /**
     * 自定义原子类规则（Rules）
     * 每条规则是一个 [匹配正则, 生成函数] 的数组
     * 生成函数接收匹配结果和上下文，返回 CSS 字符串
     */
    rules: [
        // 文本溢出省略号
        [
            /^overflow-ellipsis$/, // 匹配 class="overflow-ellipsis"
            ([], { rawSelector }) => {
                const selector = e(rawSelector); // 转义选择器（防注入）
                return `
${selector} {
  text-overflow: ellipsis;
}
`;
            },
        ],
    ],

    /**
     * 预设（Presets）
     * - presetUno：启用基础原子类（类似 Tailwind）
     *   - dark: 'class' → 通过 <html class="dark"> 切换暗色主题
     *   - attributify: false → 禁用属性模式（如 p="4"），只支持 class 模式
     * - ...createPresetIcons()：动态决定是否启用图标预设
     */
    presets: [
        presetUno({ dark: 'class', attributify: false }),
        ...createPresetIcons(),
    ],

    /**
     * 转换器（Transformers）
     * - transformerVariantGroup：支持变体分组语法，例如：
     *     class="(hover:focus:text-red)"
     */
    transformers: [transformerVariantGroup()],

    /**
     * 内容扫描配置
     * 告诉 UnoCSS 从哪些文件中提取 class 名称
     * 默认已包含常见框架，这里显式指定以确保覆盖
     */
    content: {
        pipeline: {
            include: [
                /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html|ts)($|\?)/,
            ],
        },
    },
});
