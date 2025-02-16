import React, { useContext, useState } from 'react';
import bgImage from '../assets/images/bg.png';
import iconImage from '../assets/images/icon.png';
import IconEyeOff from '../assets/images/IconEyeOff.png';
import IconEye from '../assets/images/IconEye.png';
import fram1 from '../assets/images/fram1.png';
import Frame from '../assets/images/Frame.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import axios from 'axios';

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

const { login } = useContext(AuthContext);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const isFormValid = email !== '' && password !== '';

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validateForm = () => {
    let valid = true;

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };



const handleLogin = async () => {
  if (!validateForm()) {
    console.log("Please fix the errors");
    return;
  }

  try {
    const response = await axios.post("https://craftdelhibackend.onrender.com/api/auth/login", { email, password });

    

    if (response.data?.user?.role === "admin") {
      console.log("Admin Login Successful");
      login(response.data.token, response.data.user); 
      navigate("/");
    } else {
      console.log("Access Denied! Only Admins can login.");
      alert("Only Admins are allowed to login!");
    }
  } catch (error) {
    console.error("Login Error:", error.response?.data?.msg || "Server Error");
    alert(error.response?.data?.msg || "Invalid credentials");
  }
};

const navigate = useNavigate()
  const resetPassword = () => {
    navigate('/reset-password');
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex justify-center items-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-[722px] h-auto px-5 py-[30px] bg-white rounded-[10px] shadow-[0px_20px_60px_0px_rgba(255,255,255,0.25)] flex-col justify-start items-start gap-[30px] inline-flex overflow-hidden">
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

        <div className="self-stretch h-[79px] flex-col justify-start items-center gap-[15px] flex">
          <div className="text-center text-black text-xl sm:text-2xl font-bold font-['Montserrat'] leading-loose">
            CRAFT DELHI ADMIN PLATFORM
          </div>
          <div className="text-center text-[#ee6f69] text-xl sm:text-2xl font-bold font-['Montserrat'] leading-loose">
            LOGIN
          </div>
        </div>

        <div className="self-stretch h-auto flex-col justify-start items-start gap-2.5 flex">
          <div className="self-stretch flex flex-col gap-3">
            <div className="text-black text-[10px] sm:text-xs font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Email Address</div>
            <div className={`h-14  bg-white rounded border ${emailError ? 'border-[#fe0000]' : 'border-[#e0e4f4]'} flex items-center`}>
              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="off"
                autoFocus="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="grow h-14 text-black text-sm sm:text-base font-normal font-['Montserrat'] leading-tight bg-transparent border-none outline-none focus:outline-none"
              />
            </div>
            {emailError && <div className="text-[#fe0000] text-xs">{emailError}</div>}
          </div>

          <div className="self-stretch flex flex-col gap-3">
            <div className="text-black text-[10px] sm:text-xs font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Password</div>
            <div className={`h-14  bg-white rounded border ${passwordError ? 'border-[#fe0000]' : 'border-[#e0e4f4]'} flex items-center`}>
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="off"
                autoFocus="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="grow h-14 text-black text-sm sm:text-base font-normal font-['Montserrat'] leading-tight bg-transparent border-none outline-none focus:outline-none"
              />
              <div className="w-4 h-4 relative cursor-pointer" onClick={togglePasswordVisibility}>
                <img src={isPasswordVisible ? IconEye : IconEyeOff} alt="Toggle Visibility" className="w-full h-full object-cover" />
              </div>
            </div>
            {passwordError && <div className="text-[#fe0000] text-xs">{passwordError}</div>}
          </div>
        </div>

        <div className="self-stretch h-[83px] flex-col justify-start items-start gap-[15px] flex">
          <div
            className={`p-5 rounded justify-center items-center gap-3 inline-flex overflow-hidden w-full ${isFormValid ? 'bg-[#456eff]' : 'bg-[#cbd2ec]'}`}
            onClick={isFormValid ? handleLogin : null}
            style={{cursor:'pointer'}}
          >
            <div className="text-center text-white text-lg sm:text-xl font-medium font-['Montserrat'] leading-none">
              Login
            </div>
          </div>
          <div className="self-stretch flex justify-end">
            <button
              onClick={resetPassword}
              className="text-[#456eff] text-sm sm:text-base font-bold font-['Montserrat'] leading-tight"
            >
              Reset password
            </button>
          </div>
        </div>
      </div>

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
