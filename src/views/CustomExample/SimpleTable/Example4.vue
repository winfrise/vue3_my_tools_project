// ArticleList.vue
<script setup>
import { useSimpleTable } from '@/custom-hooks/useSimpleTable';

const {
    data: tableData,
    loading,
    total,
    page,
    limit,
    fetchData,
} = useSimpleTable('/mock/articles');
const currentPage = page;
const pageSize = limit;
// ...
</script>
