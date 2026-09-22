import { useState, useMemo } from 'react';
import { format } from 'date-fns';

export function useTableFilter(data, pageSize = 10) {
  const [monthFilter, setMonthFilter] = useState(null); // Date object
  const [dateFilter, setDateFilter] = useState(null); // Date object
  const [currentPage, setCurrentPage] = useState(1);

  // When filters change, reset to page 1
  const handleMonthChange = (date) => {
    setMonthFilter(date);
    setDateFilter(null);
    setCurrentPage(1);
  };

  const handleDateChange = (date) => {
    setDateFilter(date);
    setMonthFilter(null);
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (dateFilter) {
        return item.date === format(dateFilter, 'yyyy-MM-dd');
      }
      if (monthFilter) {
        return item.date.startsWith(format(monthFilter, 'yyyy-MM'));
      }
      return true;
    });
  }, [data, monthFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const clearFilters = () => {
    setMonthFilter(null);
    setDateFilter(null);
    setCurrentPage(1);
  };

  return {
    monthFilter,
    dateFilter,
    currentPage,
    totalPages,
    paginatedData,
    filteredData,
    handleMonthChange,
    handleDateChange,
    clearFilters,
    setCurrentPage,
  };
}
