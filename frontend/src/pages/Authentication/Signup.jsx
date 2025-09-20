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
    <div className="flex h-screen bg-[#111111] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left side form */}
      <div className="w-2/3 flex items-center justify-center bg-[#111111]">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-1">Sign up</h2>
          <p className="text-sm mb-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="hover:underline"
              style={{ color: '#1cb08b' }}
            >
              Sign in here.
            </button>
          </p>
          <AuthForm
            mode="signup"
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            onToggleMode={() => navigate('/login')}
          />
        </div>
      </div>

      {/* Right side branding */}
      <div className="w-1/3 bg-[#111111] border-l border-[#333333] flex relative">
        
        <div className="w-1/3 flex flex-row items-center justify-center">
          <img src="/logo.svg" alt="Insur-AI Logo" className="w-16 h-16 mr-4" />
          <h1 className="text-2xl font-bold text-white">Insur-AI</h1>
        </div>
        <div className="w-2/3"></div>
      </div>
    </div>
  );
};

export default Signup;
