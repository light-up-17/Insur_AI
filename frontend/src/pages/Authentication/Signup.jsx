import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (err, formData) => {
    if (err) {
      setError(err.message);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          countryCode: formData.countryCode,
          category: formData.category || 'USER',
        }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      await response.json();
      alert('Signup successful! You can now login.');
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">Insur-AI</h1>
        <p className="mt-2 text-center text-sm text-gray-600">Corporate Policy Automation System</p>
        <AuthForm
          mode="signup"
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          onToggleMode={() => navigate('/login')}
        />
      </div>
    </div>
  );
};

export default Signup;
