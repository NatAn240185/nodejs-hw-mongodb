export const calculatePaginationData = (count, perPage, page) => {
    const totalPages = count > 0 ? Math.ceil(count / perPage) : 0;
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;
  
    return {
      page,
      perPage,
      totalItems: count,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    };
  };