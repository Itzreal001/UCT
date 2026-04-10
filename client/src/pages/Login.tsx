import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [, setLocation] = useLocation();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.username.trim()) e.username = 'Email is required';
    if (!formData.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setServerError('');
    try {
      await signIn(formData.username.trim(), formData.password);
      setLocation('/dashboard');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        setServerError('Incorrect email or password.');
      } else if (code === 'auth/too-many-requests') {
        setServerError('Too many attempts. Please try again later.');
      } else {
        setServerError('Sign in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button className="pb-4 font-semibold text-[#003366] border-b-2 border-[#003366]">Sign In</button>
            <Link href="/register" className="pb-4 font-semibold text-gray-500 hover:text-gray-700 transition-colors inline-block">
              Register
            </Link>
          </div>

          {serverError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <Input
                id="username" name="username" type="text"
                placeholder="Enter your email"
                value={formData.username} onChange={handleChange}
                className={`w-full ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password} onChange={handleChange}
                  className={`w-full pr-10 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-[#003366]" />
                <span className="text-sm text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#003366] hover:text-[#d4a574] font-semibold transition-colors">
                Forgot password?
              </a>
            </div>

            <Button type="submit" disabled={isLoading}
              className="w-full bg-[#003366] hover:bg-[#1a4d7a] text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-8">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#003366] font-semibold hover:text-[#d4a574] transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
