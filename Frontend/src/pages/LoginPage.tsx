import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import apiClient from '@/lib/api';
import { authHelpers, type LoginCredentials } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import logo from '@/assets/logo.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // Helper to detect if input is email, phone, or username
  const getInputType = (value: string): string => {
    if (value.includes('@')) return 'email';
    if (value.match(/^[\d+\-()\s]+$/)) return 'tel';
    return 'text';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/auth/login/', formData);
      const { user, access, refresh } = response.data;
      
      authHelpers.setAuth(user, access, refresh);
      
      // Redirect based on user type
      if (user.user_type === 'STUDENT') {
        navigate('/student');
      } else if (user.user_type === 'TUTOR') {
        navigate('/tutor');
      } else if (user.user_type === 'PARENT') {
        navigate('/parent');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cms-primary/10 to-cms-secondary/10">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl border border-gray-200">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={logo} alt="Capital Mathematics Studies Logo" className="h-24 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-cms-dark mb-2">Capital Mathematics Studies</h1>
          <p className="text-gray-600">Academy - Learning Management System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Email or Phone Number
            </label>
            <Input
              id="username"
              name="username"
              type={getInputType(formData.username)}
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Email or phone number"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-cms-primary hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Login with your email address or phone number</p>
        </div>
      </div>
    </div>
  );
}

