import { useState } from 'react';

const AuthForm = ({
  mode,
  onSubmit,
  loading,
  error,
  onToggleMode
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    countryCode: '+91',
    category: 'USER',
    agreeToTerms: false,
    agreeToPolicy: false
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const categories = [
    { value: 'USER', label: 'User' },
    { value: 'AGENT', label: 'Agent' },
    { value: 'ADMIN', label: 'Admin' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        onSubmit(new Error('Passwords do not match'));
        return;
      }
      if (!formData.agreeToTerms || !formData.agreeToPolicy) {
        onSubmit(new Error('You must agree to terms and policy'));
        return;
      }
    }
    
    onSubmit(null, { ...formData, rememberMe });
  };

  return (
    <div className="w-full font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>

      {error && (
        <div className="bg-red-600 text-white px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category dropdown */}
        <div>
          <label className="block text-sm font-bold mb-1 text-white">Category</label>
          <div className="relative">
            <div
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="w-full bg-[#2c2c2c] border border-[#333333] rounded px-3 py-2 text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1cb08b] focus:border-[#1cb08b]"
            >
              {categories.find(cat => cat.value === formData.category)?.label || 'Select Category'}
            </div>
            {categoryOpen && (
              <div className="absolute top-full left-0 right-0 bg-[#2c2c2c] border border-[#333333] rounded mt-1 z-10">
                {categories.map(cat => (
                  <div
                    key={cat.value}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category: cat.value }));
                      setCategoryOpen(false);
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-[#1cb08b] text-white"
                  >
                    {cat.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Signup extra fields */}
        {mode === 'signup' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="bg-[#2b2b2b] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1cb08b] focus:border-[#1cb08b]"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="bg-[#2b2b2b] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1cb08b] focus:border-[#1cb08b]"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="bg-[#2b2b2b] border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#1cb08b] focus:border-[#1cb08b]"
              >
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+91">+91 (IN)</option>
              </select>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="col-span-2 bg-[#2b2b2b] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1cb08b] focus:border-[#1cb08b]"
              />
            </div>
          </>
        )}

        {/* Email */}
        <div>
          <label className="block text-sm font-bold mb-1 text-white">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-[#2b2b2b] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1cb08b] focus:border-[#1cb08b]"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <label className="block text-sm font-bold mb-1 text-white">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full bg-[#2b2b2b] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1cb08b] focus:border-[#1cb08b]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-sm text-gray-400 hover:text-white focus:outline-none"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        {mode === 'login' && (
          <div className="text-right">
            <a href="#" className="text-sm text-gray-400 hover:text-white">Forgot Password?</a>
          </div>
        )}

        {mode === 'signup' && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full bg-[#2b2b2b] border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1cb08b] focus:border-[#1cb08b]"
          />
        )}

        {/* Remember me for login */}
        {mode === 'login' && (
          <div className="flex items-center text-gray-300">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2 accent-[#1cb08b]"
            />
            <label htmlFor="rememberMe" className="text-sm">Remember me</label>
          </div>
        )}

        {/* Signup agreements */}
        {mode === 'signup' && (
          <div className="space-y-2 text-gray-300 text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mr-2 accent-[#1cb08b]"
                required
              />
              I agree to the Terms and Conditions *
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="agreeToPolicy"
                checked={formData.agreeToPolicy}
                onChange={handleChange}
                className="mr-2 accent-[#1cb08b]"
                required
              />
              I agree to the Privacy Policy *
            </label>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-medium py-2 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? 'Loading in...' : mode === 'login' ? 'Sign in' : 'Sign up'}
        </button>
      </form>

      
    </div>
  );
};

export default AuthForm;
