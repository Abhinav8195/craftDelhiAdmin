import React, { useEffect, useState } from 'react';
import IconPasscode from '../assets/images/IconPasscode.png';
import bgImage from '../assets/images/bg.png';
import fram1 from '../assets/images/fram1.png';
import Frame from '../assets/images/Frame.png';
import { useNavigate } from 'react-router-dom';


const OTPPage = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // State to hold OTP digits
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // To track button state
  const [isOtpCorrect, setIsOtpCorrect] = useState(true); // Track OTP correctness
const navigate=useNavigate();
  // Trigger fade-in effect on mount
  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    const isOtpComplete = otp.every((digit) => digit !== '');
    setIsButtonDisabled(!isOtpComplete); 
  }, [otp]);

  const handleChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) { 
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

   
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleContinue = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === '123456') {
      alert('OTP is correct!');
      setIsOtpCorrect(true);
      navigate('/create-password')
    } else {
      alert('Incorrect OTP. Please try again.');
      setIsOtpCorrect(false); // OTP is incorrect
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex justify-center items-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-[608px] h-[412px] px-5 pt-[50px] pb-[30px] bg-white rounded-[10px] shadow-[0px_20px_60px_0px_rgba(255,255,255,0.25)] flex-col justify-start items-center gap-[30px] inline-flex overflow-hidden">
        <div className="w-20 h-20 relative overflow-hidden">
          <img src={IconPasscode} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <div className="h-36 flex-col justify-start items-center gap-[18px] inline-flex">
          <div className="self-stretch text-center text-black text-2xl font-bold font-['Montserrat'] leading-loose">
            Enter Your OTP Code!
          </div>
          <div className="justify-start items-center gap-2 inline-flex">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className={`w-[47.83px] h-14 px-3 bg-[#f8f9fd] rounded border text-center text-black text-sm font-bold font-['Montserrat'] leading-tight ${isOtpCorrect ? 'border-[#d9d9d9]' : 'border-[#fe0000]'}`}
                maxLength="1"
              />
            ))}
          </div>
        </div>
        <div
          className={`self-stretch p-4 ${isButtonDisabled ? 'bg-[#cbd2ec]' : 'bg-[#024a63]'} rounded justify-center items-center gap-3 inline-flex overflow-hidden`}
          onClick={isButtonDisabled ? null : handleContinue}
        >
          <div className="text-center text-white text-sm font-medium font-['Montserrat'] leading-none">
            Confirm
          </div>
        </div>
      </div>

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

export default OTPPage;
