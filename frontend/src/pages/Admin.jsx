import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const badgeCls = {
  active:    'bg-green-500/20 text-green-400',
  completed: 'bg-blue-500/20 text-blue-400',
  cancelled: 'bg-slate-500/20 text-slate-400',
};

export default function Admin() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch {
      toast.error('Failed to load bookings');
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const stats = [
    { label: 'Total Bookings', value: bookings.length, color: 'text-indigo-400' },
    { label: 'Active',         value: bookings.filter((b) => b.status === 'active').length, color: 'text-green-400' },
    { label: 'Completed',      value: bookings.filter((b) => b.status === 'completed').length, color: 'text-blue-400' },
    { label: 'Revenue',        value: `$${bookings.reduce((s, b) => s + (b.totalAmount || 0), 0)}`, color: 'text-amber-400' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-center">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-slate-400 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <h3 className="text-lg font-semibold text-white mb-4">All Bookings</h3>
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-800 text-slate-400">
            <tr>
              {['User', 'Email', 'Slot', 'Vehicle', 'Start', 'Status', 'Amount'].map((h) => (
                <th key={h} className="px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => (
              <tr key={b._id} className={`border-t border-slate-700 ${i % 2 === 0 ? 'bg-slate-900' : 'bg-slate-800/50'}`}>
                <td className="px-4 py-3 text-white">{b.user?.name}</td>
                <td className="px-4 py-3 text-slate-400">{b.user?.email}</td>
                <td className="px-4 py-3 text-white font-medium">{b.slot?.slotNumber}</td>
                <td className="px-4 py-3 text-slate-300">{b.vehicleNumber}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(b.startTime).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${badgeCls[b.status]}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">${b.totalAmount}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-500">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
