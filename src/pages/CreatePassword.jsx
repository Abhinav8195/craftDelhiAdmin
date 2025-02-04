import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/images/bg.png';
import fram1 from '../assets/images/fram1.png';
import Frame from '../assets/images/Frame.png';
import IconLockUnlocked_01 from '../assets/images/IconLockUnlocked_01.png';
import IconFaceWink from '../assets/images/IconFaceWink.png';

const CreatePassword = () => {
  const [fadeIn, setFadeIn] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  // Check passwords match in real-time
  const isPasswordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const handleConfirm = () => {
    if (isPasswordsMatch) {
      setIsSuccess(true);
    } else {
      alert('Please make sure both passwords match.');
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex justify-center items-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {!isSuccess ? (
        <div className="w-[608px] h-[496px] px-5 pt-[50px] pb-[30px] bg-white rounded-[10px] shadow-lg flex flex-col justify-start items-center gap-[30px]">
          <img src={IconLockUnlocked_01} alt="Logo" className="w-20 h-20" />
          <h2 className="text-2xl font-bold">Create New Password!</h2>
          
          <div className="w-full flex flex-col gap-4">
            {/* New Password */}
            <div>
              <label className="self-stretch text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 px-3 border rounded focus:outline-none"
                placeholder="Enter password"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="self-stretch text-black text-[10px] font-bold font-['Montserrat'] uppercase leading-none tracking-widest">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full h-12 px-3 border rounded focus:outline-none ${
                  confirmPassword && !isPasswordsMatch ? 'border-red-500' : ''
                }`}
                placeholder="Confirm password"
              />
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            className={`w-full py-3 text-white rounded transition ${
              isPasswordsMatch ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!isPasswordsMatch}
          >
            Confirm
          </button>
        </div>
      ) : (
        <div className="w-[608px] h-[412px] px-5 pt-[50px] pb-[30px] bg-white rounded-lg shadow-lg flex flex-col items-center gap-[30px]">
          <img src={IconFaceWink} alt="Success" className="w-20 h-20" />
          <h2 className="text-2xl font-bold text-green-500">Success!</h2>
          <p>Your password has been successfully reset. You can now log in with your new password.</p>
          <button
            className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate('/')}
          >
            Back to Login
          </button>
        </div>
      )}

      {/* Background Decorations */}
      <img src={Frame} alt="Decoration" className="absolute bottom-0 left-0 w-[200px]" />
      <img src={fram1} alt="Decoration" className="absolute bottom-0 right-0 w-[200px]" />
    </div>
  );
};

export default CreatePassword;
