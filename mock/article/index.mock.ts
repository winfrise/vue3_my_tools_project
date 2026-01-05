const mockArticles = () => {
    const total = 100;
    const list = Array.from({ length: total }, (_, i) => ({
        id: i + 1,
        title: `文章标题 ${i + 1}`,
        author: [
            'Michelle',
            'Ruth',
            'Angela',
            'Mary',
            'Eric',
            'Michael',
            'Linda',
            'Donald',
        ][i % 8],
        createdAt: new Date(
            1970 + Math.floor(Math.random() * 50),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28)
        )
            .toISOString()
            .split('T')[0],
        importance: Math.floor(Math.random() * 3) + 1,
        views: Math.floor(Math.random() * 1000),
        content: `<p>I am the content of article ${i + 1}</p>`,
    }));

    return {
        code: 0,
        msg: 'success',
        data: {
            list,
            total,
        },
    };
};

export default [
    {
        url: '/mock/articles',
        method: 'GET',
        response: ({ query }) => {
            const { page = 1, limit = 10 } = query;
            const offset = (page - 1) * limit;
            const data = mockArticles();
            const paginatedList = data.data.list.slice(
                offset,
                offset + Number(limit)
            );
            console.log(typeof offset, typeof limit);
            return {
                ...data,
                data: {
                    ...data.data,
                    list: paginatedList,
                },
            };
        },
    },
];
