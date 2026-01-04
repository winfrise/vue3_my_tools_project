// composables/useTableData.ts
import { ref, onMounted } from 'vue';
import axios from 'axios';

export function useSimpleTable(url: string) {
    const data = ref([]);
    const loading = ref(false);
    const total = ref(0);
    const page = ref(1);
    const limit = ref(10);

    const fetchData = async () => {
        loading.value = true;
        try {
            const res = await axios.get(url, {
                params: { page: page.value, limit: limit.value },
            });
            data.value = res.data.data.list;
            total.value = res.data.data.total;
        } finally {
            loading.value = false;
        }
    };

    onMounted(fetchData);

    return {
        data,
        loading,
        total,
        page,
        limit,
        fetchData,
    };
}
