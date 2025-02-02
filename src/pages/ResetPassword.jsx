import React, { useState, useEffect } from 'react';
import bgImage from '../assets/images/bg.png';
import iconImage from '../assets/images/icon.png';
import fram1 from '../assets/images/fram1.png';
import Frame from '../assets/images/Frame.png';
import IconCheckVerified_03 from '../assets/images/IconCheckVerified_03.png'

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // New state for success message

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const isFormValid = email !== '';

  const validateForm = () => {
    let valid = true;

    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }

    return valid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      console.log('Login successful');
      setIsSuccess(true); // Set success to true after successful submission
    } else {
      console.log('Please fix the errors');
    }
  };

  const resetPassword = () => {
    console.log('Redirecting to reset password page...');
  };

  // Trigger fade-in effect on mount
  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex justify-center items-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Show success message when form is valid */}
      {isSuccess ? (
        <div className="w-[608px] h-[412px] px-5 pt-[50px] pb-[30px] bg-white rounded-[10px] shadow-[0px_20px_60px_0px_rgba(255,255,255,0.25)] flex-col justify-start items-center gap-[30px] inline-flex overflow-hidden">
          <div className="w-20 h-20 relative overflow-hidden">
          <img src={IconCheckVerified_03} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="self-stretch h-36 flex-col justify-start items-center gap-[18px] flex">
            <div className="self-stretch text-center text-black text-2xl font-bold font-['Montserrat'] leading-loose">
              Verification Code Sent!
            </div>
            <div className="self-stretch text-center text-[#ee6f69] text-xl font-normal font-['Montserrat'] leading-7">
              We have sent a one-time passcode to your registered email address.
            </div>
            <div className="self-stretch text-center text-black text-sm font-bold font-['Montserrat'] leading-tight">
              {email}
            </div>
          </div>
          <div className="self-stretch p-4 bg-[#456eff] rounded justify-center items-center gap-3 inline-flex overflow-hidden">
            <div className="text-center text-white text-sm font-medium font-['Montserrat'] leading-none">
              Continue
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[722px] h-auto px-5 py-10 bg-white rounded-[10px] shadow-[0px_20px_60px_0px_rgba(255,255,255,0.25)] flex-col justify-start items-start gap-[20px] inline-flex overflow-hidden">
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
            <div className="text-center text-black text-lg sm:text-2xl font-bold font-['Montserrat'] leading-loose">
              CRAFT DELHI ADMIN PLATFORM
            </div>
            <div className="text-center text-[#ee6f69] text-lg sm:text-2xl font-bold font-['Montserrat'] leading-loose">
              FORGOT PASSWORD
            </div>
          </div>

          <div className="self-stretch h-auto flex-col justify-start items-start gap-2.5 flex">
            <div className="self-stretch flex flex-col gap-3">
              <div className="text-black text-xs sm:text-sm font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Email Address</div>
              <div className={`h-12 px-3 bg-white rounded border ${emailError ? 'border-[#fe0000]' : 'border-[#e0e4f4]'} flex items-center`}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="off"
                  autoFocus="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="grow text-black text-sm sm:text-base font-normal font-['Montserrat'] leading-tight bg-transparent border-none outline-none focus:outline-none"
                />
              </div>
              {emailError && <div className="text-[#fe0000] text-xs">{emailError}</div>}
            </div>
          </div>

          <div className="self-stretch h-[63px] flex-col justify-start items-start gap-[15px] flex">
            <div
              className={`p-4 rounded justify-center items-center gap-3 inline-flex overflow-hidden w-full ${isFormValid ? 'bg-[#456eff]' : 'bg-[#cbd2ec]'}`}
              onClick={isFormValid ? handleLogin : null}
            >
              <div className="text-center text-white text-base sm:text-lg font-medium font-['Montserrat'] leading-none">
                Login
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`absolute bottom-0 left-0 sm:block ${fadeIn ? 'fade-in' : ''}`}>
        <img
          src={Frame}
          alt="Bottom Left"
          className="w-[120px] md:w-[200px] lg:w-[318px] h-[90px] md:h-[150px] lg:h-[224.30px] object-fill"
        />
      </div>

      <div className={`absolute bottom-0 right-0 sm:block ${fadeIn ? 'fade-in' : ''}`}>
        <img
          src={fram1}
          alt="Bottom Right"
          className="w-[120px] md:w-[200px] lg:w-[318px] h-[90px] md:h-[150px] lg:h-[224.30px] object-fill"
        />
      </div>
    </div>
  );
};

export default ResetPassword;
