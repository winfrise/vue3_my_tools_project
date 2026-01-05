<template>
    <div class="demo-block">
        <div class="demo-title">{{ props.title }}</div>
        <!-- 组件预览区 -->
        <div class="demo-preview">
            <slot name="demo"></slot>
        </div>

        <!-- 代码展示区 -->
        <div class="demo-code">
            <!-- 头部：始终显示 -->
            <div class="code-header">
                <span>示例代码</span>
                <div class="code-actions">
                    <button @click="toggleExpand" class="action-btn">
                        {{ expanded ? '收起代码' : '查看代码' }}
                    </button>
                    <button @click="copySource" class="action-btn copy-btn">
                        复制代码
                    </button>
                </div>
            </div>

            <!-- 代码内容：可折叠 -->
            <div class="code-content-wrapper" :class="{ expanded }">
                <pre
                    class="code-content"
                ><code v-html="highlightedCode"></code></pre>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useClipboard } from '@vueuse/core';

const props = defineProps<{
    title: string;
    source: string;
}>();

const expanded = ref(false);
const { copy, isSupported } = useClipboard();

const toggleExpand = () => {
    expanded.value = !expanded.value;
};

const copySource = async () => {
    if (!isSupported.value) {
        alert('当前浏览器不支持剪贴板 API');
        return;
    }
    try {
        await copy(props.source);
        alert('✅ 代码已复制到剪贴板！');
    } catch {
        alert('❌ 复制失败，请手动复制');
    }
};

// 简易代码高亮（支持 Vue + TS）
const highlightedCode = computed(() => {
    let code = props.source
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // 关键字高亮
    // code = code.replace(
    //     /\b(import|export|from|as|const|let|var|function|return|if|else|for|of|in|while|switch|case|default|try|catch|finally|await|async|new|class|extends|super|this|true|false|null|undefined|typeof|void|delete|with|debugger|setup|defineProps|defineEmits)\b/g,
    //     '<span class="kw">$1</span>'
    // );

    // 字符串高亮
    code = code.replace(
        /('[^']*'|"[^"]*"|`[^`]*`)/g,
        '<span class="str">$1</span>'
    );

    // 注释高亮
    code = code.replace(/(\/\/.*$)/gm, '<span class="comment">$1</span>');
    code = code.replace(
        /(\/\*[\s\S]*?\*\/)/g,
        '<span class="comment">$1</span>'
    );

    // 模板标签高亮
    code = code.replace(
        /(&lt;\/?[\w-]+(?:\s+[\w-]+(?:=("|').*?\2)?)*\s*\/?&gt;)/g,
        '<span class="tag">$1</span>'
    );

    return code;
});
</script>

<style scoped>
.demo-block {
    margin: 24px 0;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    overflow: hidden;
}

.demo-title {
    font-size: 24px;
    line-height: 1;
    padding: 15px 16px 0;
}

.demo-preview {
    padding: 16px;
}

.demo-code {
    background-color: #f5f7fa;
}

.code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    font-size: 14px;
    color: #606266;
    background-color: #fff;
    border-top: 1px solid #e4e7ed;
}

.code-actions {
    display: flex;
    gap: 8px;
}

.action-btn {
    padding: 4px 8px;
    font-size: 12px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    color: #606266;
    transition: all 0.2s;
}

.action-btn:hover {
    color: #409eff;
    border-color: #409eff;
}

.copy-btn {
    color: #409eff;
    border-color: #409eff;
}

/* 仅折叠代码内容 */
.code-content-wrapper {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.code-content-wrapper.expanded {
    max-height: 1000px;
}

.code-content {
    margin: 0;
    padding: 16px;
    background: #282c34;
    color: #abb2bf;
    font-family: Consolas, Monaco, 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
    overflow-x: auto;
}

/* 高亮样式 */
.kw {
    color: #c678dd;
    font-weight: bold;
}
.str {
    color: #98c379;
}
.comment {
    color: #5c6370;
    font-style: italic;
}
.tag {
    color: #e06c75;
}
</style>
