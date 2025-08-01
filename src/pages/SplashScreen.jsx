import Lottie from "lottie-react";
import LottieInvoice from "../assets/pay invoice blue.json";
import React from "react";

const SplashScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-blue-300">
      <div className="flex flex-col items-center">
        <Lottie
          animationData={LottieInvoice}
          loop={true}
          style={{ height: 200, width: 200 }}
        />
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-2 tracking-wide animate-fade-in">
          Invoice Builder
        </h1>
        <p className="text-xl md:text-2xl text-blue-400 mb-6 text-center animate-fade-in-slow">
          Professional Invoicing, Simplified 🚀
        </p>
        <div className="loader mt-8" />
        <p className="text-gray-500 mt-4 animate-pulse">
          Loading your dashboard...
        </p>
      </div>
      {/* Loader CSS */}
      <style>
        {`
        .loader {
          border: 8px solid #cfe2ff;
          border-top: 8px solid #2563eb;
          border-radius: 50%;
          width: 56px;
          height: 56px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-fade-in {
          animation: fadeIn 1s ease;
        }
        .animate-fade-in-slow {
          animation: fadeIn 2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        `}
      </style>
    </div>
  );
};

export default SplashScreen;
