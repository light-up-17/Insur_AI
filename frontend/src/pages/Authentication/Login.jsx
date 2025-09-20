import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './AuthForm';


const Login = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userCategory, setUserCategory] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (err, formData) => {
    if (err) {
      setError(err.message);
      return;
    }

    setLoading(true);
    setError('');
    setUserCategory('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          category: formData.category,
        }),
      });

      if (!response.ok) throw new Error('Invalid credentials');

      const user = await response.json();
      console.log('Logged in:', user);

      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setUserCategory(user.category);

      navigate('/dashboard');
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

          {userCategory && (
            <p className="text-center text-sm mt-3">
              Logged in as <span className="font-bold">{userCategory}</span>
            </p>
          )}
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
