import React, { useEffect, useState } from 'react';
import bgImage from '../assets/images/bg.png';
import iconImage from '../assets/images/icon.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import fram1 from '../assets/images/fram1.png';
import Frame from '../assets/images/Frame.png';
import { useNavigate } from 'react-router-dom';

const Home = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isFormValid = username.trim() !== '' && password.trim() !== '';

  useEffect(() => {
    const token = localStorage.getItem('craftdelhiadmin_token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });

    const data = await response.json();

    if (data.status && data.token) {
      if (data.role !== 1) {
        setError('🚫 You are not authorized to login.');
        setLoading(false);
        return;
      }

      localStorage.setItem('craftdelhiadmin_token', data.token);
      localStorage.setItem('user', JSON.stringify({ username }));
      localStorage.setItem('Adminname', 'Rajesh Kumar');

      setIsAuthenticated(true);
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    } else if (data.message?.includes('Pending approval')) {
      setError('⏳ Your account is pending admin approval.');
    } else {
      setError('❌ Invalid email or password.');
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('Something went wrong. Please try again later.');
  }

  setLoading(false);
};


  // const logout = () => {
  //   localStorage.removeItem('craftdelhiadmin_token');
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('name');
  //   setIsAuthenticated(false);
  //   window.dispatchEvent(new Event('storage'));
  //   navigate('/');
  // };

  const resetPassword = () => {
    navigate('/reset-password');
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex justify-center items-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-[604px] p-5 bg-white rounded-[20px] shadow-lg flex flex-col items-center gap-5"
      >
        {/* Logo Section */}
        <div className="flex items-center gap-2.5 self-stretch px-3 py-1 bg-white rounded-[100px] justify-center">
          <div className="w-[40.17px] h-[40.68px] relative">
            <img src={iconImage} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="w-[1.86px] h-[38.40px] bg-[#024a63] rounded-sm" />
          <div className="w-[88px] h-[48.96px] relative">
            <div className="absolute text-[#ee6f69] text-[24.89px] font-bold font-['Cinzel']">CRAFT</div>
            <div className="absolute text-[#024a63] text-[21.85px] font-bold font-['Cormorant Garamond'] tracking-[5.90px] top-[22.96px]">DELHI</div>
          </div>
        </div>

        {/* Login Heading */}
        <div className="self-stretch h-[79px] flex-col justify-start items-center gap-[15px] flex">
          <div className="text-center text-black text-xl sm:text-2xl font-bold font-['Montserrat'] leading-loose">
            CRAFT DELHI ADMIN PLATFORM
          </div>
          <div className="text-center text-[#ee6f69] text-xl sm:text-2xl font-bold font-['Montserrat'] leading-loose">
            LOGIN
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {/* Form Fields */}
        <div className="self-stretch flex flex-col gap-4">
          {/* Username Field */}
          <div className="flex flex-col gap-3">
            <label className="text-black text-[10px] font-bold uppercase tracking-widest">Email ADDRESS</label>
            <input
              type="email"
              className="h-14 px-3 bg-white rounded outline outline-1 outline-slate-200 w-full"
              placeholder="Enter your email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-3">
            <label className="text-black text-[10px] font-bold uppercase tracking-widest">Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                className="h-14 px-3 bg-white rounded outline outline-1 outline-slate-200 w-full"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
  type="submit"
  className={`self-stretch p-4 rounded font-semibold transition-all flex justify-center items-center gap-2 ${
    isFormValid && !loading
      ? 'bg-[#024a63] hover:bg-[#023a52] text-white cursor-pointer'
      : 'bg-gray-300 text-black cursor-not-allowed'
  }`}
  disabled={!isFormValid || loading}
>
  {loading ? (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  ) : (
    'Login'
  )}
        </button>

        <div className="text-right w-full">
          <span onClick={resetPassword} className="text-blue-700 text-md font-bold cursor-pointer hover:underline">
            Reset Password?
          </span>
        </div>
      </form>

      <div className="absolute bottom-0 left-0 sm:block">
        <img
          src={Frame}
          alt="Bottom Left"
          className="w-[120px] md:w-[200px] lg:w-[318px] h-[90px] md:h-[150px] lg:h-[224.30px] object-fill"
        />
      </div>

      <div className="absolute bottom-0 right-0 sm:block">
        <img
          src={fram1}
          alt="Bottom Right"
          className="w-[120px] md:w-[200px] lg:w-[318px] h-[90px] md:h-[150px] lg:h-[224.30px] object-fill"
        />
      </div>
    </div>
  );
};

export default Home;
