import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const statusCls = {
  active:    'bg-green-500/20 text-green-400',
  completed: 'bg-blue-500/20 text-blue-400',
  cancelled: 'bg-slate-500/20 text-slate-400',
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const { data } = await api.get('/bookings/my');
    setBookings(data);
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCheckout = async (id) => {
    try {
      const { data } = await api.put(`/bookings/${id}/checkout`);
      toast.success(`Checked out! Total: $${data.totalAmount}`);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-3">📋</p>
          <p>No bookings yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 flex justify-between items-start gap-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-white font-semibold text-lg">{b.slot?.slotNumber}</span>
                <span className="text-slate-400 text-sm capitalize">Floor {b.slot?.floor} · {b.slot?.type}</span>
                <span className="text-slate-400 text-sm">🚘 {b.vehicleNumber}</span>
                <span className="text-slate-500 text-xs mt-1">Start: {new Date(b.startTime).toLocaleString()}</span>
                {b.endTime && <span className="text-slate-500 text-xs">End: {new Date(b.endTime).toLocaleString()}</span>}
                {b.totalAmount > 0 && (
                  <span className="text-indigo-400 font-semibold text-sm mt-1">💰 Total: ${b.totalAmount}</span>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${statusCls[b.status]}`}>
                  {b.status}
                </span>
                {b.status === 'active' && (
                  <>
                    <button
                      onClick={() => handleCheckout(b._id)}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      Checkout
                    </button>
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
