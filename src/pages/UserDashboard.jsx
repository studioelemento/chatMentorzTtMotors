import { MessageCircle, CheckCircle2, DollarSign, Activity, Filter, ChevronLeft, ChevronRight, X, CreditCard, AlertTriangle, Settings } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useUsageData } from '../hooks/useUsageData';
import { useTableFilter } from '../hooks/useTableFilter';

export default function UserDashboard() {
  const { data, payments, creditLimit } = useUsageData();

  const {
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
  } = useTableFilter(data, 10);

  // Calculate totals based on the filtered data so stats update dynamically
  const totalSent = filteredData.reduce((acc, curr) => acc + (Number(curr.totalSent) || 0), 0);
  const totalDelivered = filteredData.reduce((acc, curr) => acc + (Number(curr.deliveredNo) || 0), 0);
  const totalAmount = filteredData.reduce((acc, curr) => acc + (Number(curr.amountSpent) || 0), 0);
  const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : 0;

  // Global lifetime stats for billing
  const totalAmountSpentLifetime = data.reduce((acc, curr) => acc + (Number(curr.amountSpent) || 0), 0);
  const totalCredited = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const rawAmountDue = totalAmountSpentLifetime - totalCredited;
  const amountDue = Math.max(0, rawAmountDue);
  const isOverLimit = rawAmountDue >= creditLimit;
  const availableCredit = Math.max(0, creditLimit - rawAmountDue);

  const stats = [
    { label: 'Total Messages Sent', value: totalSent.toLocaleString(), icon: MessageCircle, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Total Delivered', value: totalDelivered.toLocaleString(), icon: CheckCircle2, color: 'text-whatsapp', bg: 'bg-whatsapp/10' },
    { label: 'Delivery Rate', value: `${deliveryRate}%`, icon: Activity, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Filtered Amount Spent', value: `₹${totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Total Amount Spent Till Now', value: `₹${totalAmountSpentLifetime.toLocaleString('en-IN', {minimumFractionDigits: 2})}`, icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Total Amount Credited', value: `₹${totalCredited.toLocaleString('en-IN', {minimumFractionDigits: 2})}`, icon: CreditCard, color: 'text-whatsapp', bg: 'bg-whatsapp/10' },
    { label: 'Amount Due', value: `₹${amountDue.toLocaleString('en-IN', {minimumFractionDigits: 2})}`, icon: AlertTriangle, color: isOverLimit ? 'text-red-400' : 'text-orange-400', bg: isOverLimit ? 'bg-red-500/20' : 'bg-orange-400/10', wrapper: isOverLimit ? 'bg-red-500/10 border-red-500/50' : '', textOverride: isOverLimit ? 'text-red-400/80' : '', valueOverride: isOverLimit ? 'text-red-400' : '' },
    { label: 'Available Credit', value: `₹${availableCredit.toLocaleString('en-IN', {minimumFractionDigits: 2})}`, icon: Settings, color: isOverLimit ? 'text-red-400' : 'text-emerald-400', bg: isOverLimit ? 'bg-red-500/10' : 'bg-emerald-400/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">User Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">View your WhatsApp messaging performance and usage.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 ${stat.wrapper || ''}`}>
            <div className={`p-4 rounded-xl shrink-0 ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium truncate ${stat.textOverride || 'text-gray-500 dark:text-gray-400'}`} title={stat.label}>{stat.label}</p>
              <h3 className={`text-2xl font-bold mt-1 truncate ${stat.valueOverride || 'text-gray-900 dark:text-gray-100'}`} title={stat.value}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* History Table */}
      <div className="glass-panel p-0 relative z-10">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-20">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Usage History</h3>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto relative">
              <Filter className="w-4 h-4 text-gray-400 absolute left-3 z-10" />
              <DatePicker
                selected={monthFilter}
                onChange={handleMonthChange}
                dateFormat="yyyy-MM"
                showMonthYearPicker
                placeholderText="Select Month"
                className="input-field py-1.5 pl-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto relative">
              <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
              <DatePicker
                selected={dateFilter}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select Date"
                className="input-field py-1.5 text-sm"
              />
            </div>
            {(monthFilter || dateFilter) && (
              <button 
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-200 dark:bg-dark-700/50 hover:bg-gray-300 dark:hover:bg-dark-700 px-3 py-1.5 rounded-lg ml-2"
                title="Clear Filters"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-gray-50 dark:bg-dark-900/50 text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Message Type</th>
                <th className="px-6 py-4">Total Sent</th>
                <th className="px-6 py-4">Delivered</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-700/50">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No records found matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
                  const rate = row.totalSent > 0 ? (row.deliveredNo / row.totalSent) * 100 : 0;
                  return (
                    <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-dark-700/20 transition-colors align-top">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">{row.date}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">{row.name}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-300">{row.totalSent.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-gray-300">{row.deliveredNo.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          rate >= 90 ? 'bg-whatsapp/10 text-whatsapp' : 
                          rate >= 70 ? 'bg-yellow-400/10 text-yellow-400' : 
                          'bg-red-400/10 text-red-400'
                        }`}>
                          {rate.toFixed(1)}% Rate
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-emerald-400">
                        ₹{row.amountSpent.toFixed(2)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-dark-700 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-dark-700 hover:bg-gray-100 dark:hover:bg-dark-700/50 disabled:opacity-50 text-gray-600 dark:text-gray-400 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-dark-700 hover:bg-gray-100 dark:hover:bg-dark-700/50 disabled:opacity-50 text-gray-600 dark:text-gray-400 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
