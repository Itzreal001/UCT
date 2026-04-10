import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function Register() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', username: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.firstName.trim()) e.firstName = 'First name is required';
    if (!formData.lastName.trim()) e.lastName = 'Last name is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Please enter a valid email';
    if (!formData.username.trim()) e.username = 'Username is required';
    else if (formData.username.length < 3) e.username = 'Username must be at least 3 characters';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setServerError('');
    try {
      await register({
        email: formData.email.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
      });
      setSuccess(true);
      setTimeout(() => setLocation('/dashboard'), 2000);
    } catch (err: any) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#003366] mb-4">Registration Successful!</h2>
            <p className="text-gray-600">Taking you to your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <Link href="/login" className="pb-4 font-semibold text-gray-500 hover:text-gray-700 transition-colors inline-block">Sign In</Link>
            <button className="pb-4 font-semibold text-[#003366] border-b-2 border-[#003366]">Register</button>
          </div>

          {serverError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{serverError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-gray-600 mb-6">
              Register for a new account. If your email or username is taken, please use an alternative.
            </p>

            {[
              { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter your first name' },
              { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter your last name' },
              { id: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email' },
              { id: 'username', label: 'Username', type: 'text', placeholder: 'Choose a username' },
            ].map(({ id, label, type, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">{label} *</label>
                <Input id={id} name={id} type={type} placeholder={placeholder}
                  value={formData[id as keyof typeof formData] as string} onChange={handleChange}
                  className={`w-full ${errors[id] ? 'border-red-500' : 'border-gray-300'}`} />
                {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]}</p>}
              </div>
            ))}

            {[
              { id: 'password', label: 'Password', show: showPassword, toggle: () => setShowPassword(!showPassword), placeholder: 'Create a strong password' },
              { id: 'confirmPassword', label: 'Confirm Password', show: showConfirm, toggle: () => setShowConfirm(!showConfirm), placeholder: 'Confirm your password' },
            ].map(({ id, label, show, toggle, placeholder }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">{label} *</label>
                <div className="relative">
                  <Input id={id} name={id} type={show ? 'text' : 'password'} placeholder={placeholder}
                    value={formData[id as keyof typeof formData] as string} onChange={handleChange}
                    className={`w-full pr-10 ${errors[id] ? 'border-red-500' : 'border-gray-300'}`} />
                  <button type="button" onClick={toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id]}</p>}
              </div>
            ))}

            <Button type="submit" disabled={isLoading}
              className="w-full bg-[#003366] hover:bg-[#1a4d7a] text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 mt-6">
              {isLoading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>

          <p className="text-center text-gray-600 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-[#003366] font-semibold hover:text-[#d4a574] transition-colors">Sign in here</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
