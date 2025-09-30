import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#111111] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-[#333333]">
        <div className="flex items-center space-x-4">
          <img src="/logo.svg" alt="Insur-AI Logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold">Insur-AI</h1>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-200 transition duration-200"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-transparent border-2 border-white text-white font-semibold py-2 px-4 rounded hover:bg-white hover:text-black transition duration-200"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center text-center py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h2 className="text-5xl font-extrabold mb-6">Revolutionize Your Insurance Experience</h2>
        <p className="text-lg text-gray-300 max-w-3xl mb-10">
          Insur-AI offers AI-powered corporate policy automation, real-time agent availability, and seamless claims processing.
        </p>
        <div className="flex space-x-6">
          <button
            onClick={() => navigate('/login')}
            className="bg-white text-black font-semibold py-3 px-6 rounded shadow hover:bg-gray-200 transition duration-200"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-transparent border-2 border-white text-white font-semibold py-3 px-6 rounded hover:bg-white hover:text-black transition duration-200"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-[#1c1c1c] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <span className="text-[#1cb08b] text-4xl mb-4 block">✔</span>
              <h3 className="text-xl font-semibold mb-2">AI-Driven Policy Management</h3>
              <p className="text-gray-400 text-sm">Automate and optimize your policy workflows with intelligent AI solutions.</p>
            </div>
            <div>
              <span className="text-[#1cb08b] text-4xl mb-4 block">✔</span>
              <h3 className="text-xl font-semibold mb-2">Real-Time Agent Availability</h3>
              <p className="text-gray-400 text-sm">Connect instantly with available agents to get your queries resolved.</p>
            </div>
            <div>
              <span className="text-[#1cb08b] text-4xl mb-4 block">✔</span>
              <h3 className="text-xl font-semibold mb-2">Automated Claims Processing</h3>
              <p className="text-gray-400 text-sm">Speed up claims with automated verification and processing.</p>
            </div>
            <div>
              <span className="text-[#1cb08b] text-4xl mb-4 block">✔</span>
              <h3 className="text-xl font-semibold mb-2">Secure User Dashboard</h3>
              <p className="text-gray-400 text-sm">Manage your policies and claims securely from your personalized dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Insur-AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-[#1cb08b]">Efficiency</h3>
              <p className="text-gray-300">Reduce manual processes by up to 70% with our AI-powered automation tools.</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-[#1cb08b]">Reliability</h3>
              <p className="text-gray-300">Ensure 99.9% uptime and secure data handling for peace of mind.</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-[#1cb08b]">Innovation</h3>
              <p className="text-gray-300">Stay ahead with cutting-edge AI technology tailored for insurance needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-[#1cb08b] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Insurance Operations?</h2>
          <p className="text-lg mb-8">Join thousands of businesses already using Insur-AI to streamline their processes.</p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded hover:bg-white hover:text-[#1cb08b] transition duration-200"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#333333] py-6 text-center text-gray-500 text-sm">
        &copy; 2025 Insur-AI. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
