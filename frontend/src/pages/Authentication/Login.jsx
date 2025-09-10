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
      setUser(user); // ✅ update React state immediately
      setUserCategory(user.category);

      navigate('/dashboard'); // ✅ direct redirect
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-center text-3xl font-extrabold text-white">Insur-AI</h1>
        <p className="mt-2 text-center text-sm text-white">Corporate Policy Automation System</p>

        <AuthForm
          mode="login"
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          onToggleMode={() => navigate('/signup')}
        />

        {userCategory && (
          <p className="text-center text-white font-medium">
            Logged in as <span className="font-bold">{userCategory}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
