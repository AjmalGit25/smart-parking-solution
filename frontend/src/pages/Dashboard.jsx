import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const STATUS_COLOR = {
  available: 'bg-green-500 hover:scale-105',
  occupied:  'bg-red-500 cursor-not-allowed opacity-75',
  reserved:  'bg-amber-500 cursor-not-allowed opacity-75',
};

const LEGEND = [
  { label: 'Available', cls: 'bg-green-500' },
  { label: 'Occupied',  cls: 'bg-red-500' },
  { label: 'Reserved',  cls: 'bg-amber-500' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [vehicle, setVehicle] = useState('');

  const fetchSlots = async () => {
    const { data } = await api.get('/slots');
    setSlots(data);
  };

  useEffect(() => { fetchSlots(); }, []);

  const handleSeed = async () => {
    try {
      const { data } = await api.post('/slots/seed');
      toast.success(data.message);
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Seed failed');
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', { slotId: selected._id, vehicleNumber: vehicle });
      toast.success('Slot booked!');
      setSelected(null);
      setVehicle('');
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
  };

  const floors = [...new Set(slots.map((s) => s.floor))].sort();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Parking Map</h2>
        {user?.role === 'admin' && (
          <button
            onClick={handleSeed}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition-colors"
          >
            Seed Slots
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-8">
        {LEGEND.map(({ label, cls }) => (
          <div key={label} className="flex items-center gap-2 text-sm text-slate-400">
            <span className={`w-3 h-3 rounded-sm ${cls}`} />
            {label}
          </div>
        ))}
      </div>

      {/* Floors */}
      {floors.map((floor) => (
        <div key={floor} className="mb-10">
          <h3 className="text-slate-400 font-semibold mb-4 flex items-center gap-2">
            <span className="bg-slate-700 text-white text-xs px-2 py-1 rounded">Floor {floor}</span>
          </h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-3">
            {slots
              .filter((s) => s.floor === floor)
              .map((slot) => (
                <button
                  key={slot._id}
                  onClick={() => slot.status === 'available' && setSelected(slot)}
                  title={`${slot.type} — ${slot.status}`}
                  className={`flex flex-col items-center justify-center gap-0.5 min-h-18 rounded-xl text-white font-semibold text-sm transition-transform ${STATUS_COLOR[slot.status]}`}
                >
                  <span>{slot.slotNumber}</span>
                  <span className="text-[10px] font-normal opacity-85 capitalize">{slot.type}</span>
                </button>
              ))}
          </div>
        </div>
      ))}

      {slots.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <p className="text-4xl mb-3">🅿️</p>
          <p>No slots yet.{user?.role === 'admin' ? ' Click "Seed Slots" to get started.' : ' Ask an admin to seed the slots.'}</p>
        </div>
      )}

      {/* Booking Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <form
            onSubmit={handleBook}
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4 shadow-2xl"
          >
            <div>
              <h3 className="text-xl font-bold text-white">Book {selected.slotNumber}</h3>
              <p className="text-slate-400 text-sm mt-1 capitalize">
                {selected.type} · Floor {selected.floor}
              </p>
            </div>
            <input
              placeholder="Vehicle Number (e.g. ABC-123)"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              required
              className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <div className="flex gap-3 mt-1">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 font-semibold cursor-pointer transition-colors"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg py-2.5 font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
