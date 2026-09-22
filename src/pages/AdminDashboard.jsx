import { useState } from 'react';
import { Plus, Trash2, Filter, ChevronLeft, ChevronRight, X, DollarSign, CreditCard, AlertTriangle, Settings } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { useUsageData } from '../hooks/useUsageData';
import { useTableFilter } from '../hooks/useTableFilter';

export default function AdminDashboard() {
  const { 
    data, addRecord, deleteRecord,
    payments, addPayment, deletePayment,
    creditLimit, updateCreditLimit
  } = useUsageData();
  
  const {
    monthFilter,
    dateFilter,
    currentPage,
    totalPages,
    paginatedData,
    handleMonthChange,
    handleDateChange,
    clearFilters,
    setCurrentPage,
  } = useTableFilter(data, 10);

  const [formData, setFormData] = useState({
    date: new Date(),
    name: '',
    totalSent: '',
    deliveredNo: '',
    amountSpent: ''
  });

  const [paymentData, setPaymentData] = useState({ date: new Date(), amount: '' });
  const [limitInput, setLimitInput] = useState(creditLimit.toString());

  const totalAmountSpent = data.reduce((acc, curr) => acc + (Number(curr.amountSpent) || 0), 0);
  const totalCredited = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const rawAmountDue = totalAmountSpent - totalCredited;
  const amountDue = Math.max(0, rawAmountDue);
  const isOverLimit = rawAmountDue >= creditLimit;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.name || !formData.totalSent || !formData.deliveredNo || !formData.amountSpent) return;
    
    addRecord({
      date: format(formData.date, 'yyyy-MM-dd'),
      name: formData.name,
      totalSent: parseInt(formData.totalSent, 10),
      deliveredNo: parseInt(formData.deliveredNo, 10),
      amountSpent: parseFloat(formData.amountSpent),
    });
    
    // Reset except date
    setFormData(prev => ({
      ...prev,
      name: '',
      totalSent: '',
      deliveredNo: '',
      amountSpent: ''
    }));
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentData.date || !paymentData.amount) return;
    addPayment({
      date: format(paymentData.date, 'yyyy-MM-dd'),
      amount: parseFloat(paymentData.amount)
    });
    setPaymentData({ date: new Date(), amount: '' });
  };

  const handleLimitSubmit = (e) => {
    e.preventDefault();
    if (limitInput) updateCreditLimit(limitInput);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors">Admin Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">Manage WhatsApp message usage and billing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300">
          <div className="p-4 rounded-xl shrink-0 bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400">
            <DollarSign className="w-8 h-8" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate text-gray-500 dark:text-gray-400" title="Total Spent">Total Spent</p>
            <h4 className="text-2xl font-bold truncate text-gray-900 dark:text-gray-100" title={`₹${totalAmountSpent.toLocaleString('en-IN', {minimumFractionDigits: 2})}`}>₹{totalAmountSpent.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h4>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300">
          <div className="p-4 rounded-xl shrink-0 bg-whatsapp/10 text-whatsapp">
            <CreditCard className="w-8 h-8" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate text-gray-500 dark:text-gray-400" title="Total Credited">Total Credited</p>
            <h4 className="text-2xl font-bold truncate text-gray-900 dark:text-gray-100" title={`₹${totalCredited.toLocaleString('en-IN', {minimumFractionDigits: 2})}`}>₹{totalCredited.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h4>
          </div>
        </div>
        <div className={`glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 ${isOverLimit ? 'bg-red-500/10 border-red-500/50' : ''}`}>
          <div className={`p-4 rounded-xl shrink-0 ${isOverLimit ? 'bg-red-500/20 text-red-500 dark:text-red-400' : 'bg-orange-500/10 dark:bg-orange-400/10 text-orange-500 dark:text-orange-400'}`}>
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium truncate ${isOverLimit ? 'text-red-500/80 dark:text-red-400/80' : 'text-gray-500 dark:text-gray-400'}`} title="Amount Due">Amount Due</p>
            <h4 className={`text-2xl font-bold truncate ${isOverLimit ? 'text-red-500 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`} title={`₹${amountDue.toLocaleString('en-IN', {minimumFractionDigits: 2})}`}>₹{amountDue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h4>
          </div>
        </div>
        <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300">
          <div className="p-4 rounded-xl shrink-0 bg-purple-500/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400">
            <Settings className="w-8 h-8" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate text-gray-500 dark:text-gray-400" title="Credit Limit">Credit Limit</p>
            <h4 className="text-2xl font-bold truncate text-gray-900 dark:text-gray-100" title={`₹${creditLimit.toLocaleString('en-IN', {minimumFractionDigits: 2})}`}>₹{creditLimit.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6 relative z-30">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <CreditCard className="w-5 h-5 text-whatsapp" />
            Add Payment / Credit
          </h3>
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 flex flex-col">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</label>
                <DatePicker 
                  selected={paymentData.date}
                  onChange={(date) => setPaymentData(p => ({ ...p, date }))}
                  dateFormat="yyyy-MM-dd"
                  className="input-field"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount Credited (₹)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  step="0.01"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData(p => ({ ...p, amount: e.target.value }))}
                  className="input-field"
                  min="0"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">Record Payment</button>
          </form>

          {payments.length > 0 && (
            <div className="mt-8 border-t border-gray-200 dark:border-dark-700 pt-6 transition-colors">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">Recent Payments</h4>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {payments.map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-dark-900/50 border border-gray-200 dark:border-dark-700/50 hover:bg-gray-100 dark:hover:bg-dark-700/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{payment.date}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Credited</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹{payment.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                      <button 
                        onClick={() => deletePayment(payment.id)}
                        className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-md transition-colors"
                        title="Delete Payment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="glass-panel p-6 relative z-20">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Settings className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            Update Credit Limit
          </h3>
          <form onSubmit={handleLimitSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Available Credit Limit (₹)</label>
              <input 
                type="number" 
                placeholder="0.00"
                step="0.01"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                className="input-field"
                min="0"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 text-gray-900 dark:text-white shadow-none">Set Credit Limit</button>
          </form>
        </div>
      </div>

      <div className="glass-panel p-6 relative z-10">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Plus className="w-5 h-5 text-whatsapp" />
          Add Usage Details
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</label>
            <DatePicker 
              selected={formData.date}
              onChange={handleFormDateChange}
              dateFormat="yyyy-MM-dd"
              className="input-field"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Message Type / Template Name</label>
            <input 
              type="text" 
              name="name"
              placeholder="e.g. Welcome Message"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sent</label>
            <input 
              type="number" 
              name="totalSent"
              placeholder="0"
              value={formData.totalSent}
              onChange={handleChange}
              className="input-field"
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivered No.</label>
            <input 
              type="number" 
              name="deliveredNo"
              placeholder="0"
              value={formData.deliveredNo}
              onChange={handleChange}
              className="input-field"
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount Spent (₹)</label>
            <input 
              type="number" 
              name="amountSpent"
              placeholder="0.00"
              step="0.01"
              value={formData.amountSpent}
              onChange={handleChange}
              className="input-field"
              min="0"
              required
            />
          </div>

          <div className="flex items-end">
            <button type="submit" className="btn-primary w-full">
              Save Details
            </button>
          </div>
        </form>
      </div>

      <div className="glass-panel p-0 relative z-10">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-20">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Usage Records</h3>
          
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
                <th className="px-6 py-4">Amount Spent</th>
                <th className="px-6 py-4 text-right">Action</th>
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
                paginatedData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-dark-700/20 transition-colors align-top">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">{row.date}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">{row.name}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-300">{row.totalSent.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-gray-300">{row.deliveredNo.toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-300">₹{row.amountSpent.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteRecord(row.id)}
                        className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-lg transition-colors inline-block"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
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
