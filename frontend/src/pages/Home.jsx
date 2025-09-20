import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-center text-3xl font-extrabold text-white">Insur-AI</h1>
        <p className="mt-2 text-center text-sm text-white">Corporate Policy Automation System</p>
        <div className="mt-8 space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-white text-blue-600 font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-transparent border-2 border-white text-white font-semibold py-3 px-4 rounded-lg hover:bg-white hover:text-blue-600 transition duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
