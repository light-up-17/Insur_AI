import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from './AuthForm';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (err, formData) => {
    if (err) {
      setError(err.message);
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password, formData.category);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-[#111111] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left side form */}
      <div className="w-2/3 flex items-center justify-center bg-[#111111]">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-1">Log in</h2>
          <p className="text-sm mb-6">
            New to Insur-AI?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="hover:underline"
              style={{ color: '#1cb08b' }}
            >
              Sign up for an account.
            </button>
          </p>

          <AuthForm
            mode="login"
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            onToggleMode={() => navigate('/signup')}
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

export default Login;
