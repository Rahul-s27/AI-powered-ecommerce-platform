import React from "react";
import TryOnForm from "../components/TryOnForm";

const TryOn: React.FC = () => {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x">
      <section className="w-full max-w-2xl mx-auto p-6 md:p-10 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl backdrop-blur-md border border-white/30 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 text-center drop-shadow-xl">Virtual Try-On</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center font-medium">
          Powered by Replicate IDM-VTON – Experience AI Fashion Instantly
        </p>
        <TryOnForm />
      </section>
    </main>
  );
};

export default TryOn;