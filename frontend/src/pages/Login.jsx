import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import StarBackground from '../components/StarBackground';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-[80vh]">
      <StarBackground />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center text-white">Welcome back</h2>
        <p className="text-slate-400 text-sm text-center -mt-2">Sign in to your account</p>

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors [box-shadow:inset_0_2px_6px_rgba(0,0,0,0.5)]"
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors [box-shadow:inset_0_2px_6px_rgba(0,0,0,0.5)]"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2.5 font-semibold transition-colors cursor-pointer"
        >
          Login
        </button>
        <p className="text-center text-slate-400 text-sm">
          No account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300">Register</Link>
        </p>
      </form>
    </div>
  );
}
