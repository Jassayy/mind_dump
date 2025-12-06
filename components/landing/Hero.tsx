"use client";

import { sniglet } from "@/fonts/fonts";
import { Button } from "../ui/button";
import { motion } from "motion/react";
import { useState } from "react";
import LoginModal from "../auth/LoginModal";

export default function Hero() {
  const [showLogin, setShowLogin] = useState(false);
  const handleLoginModal = () => {
    setShowLogin(!showLogin);
  };
  return (
    <section className="min-h-screen w-full flex flex-col justify-center items-center text-center px-6 md:px-12 lg:px-24 py-20 gap-10">
      {/* Title & Tagline */}
      <div className="flex flex-col justify-center items-center gap-3">
        <h1
          className={`${sniglet.className} text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 
          font-extrabold leading-tight drop-shadow-lg flex gap-1 relative`}
        >
          Min
          {/* Animate 'd' -> move to end to become 'p' */}
          <motion.span
            initial={{ x: 0, rotate: 0 }}
            animate={{ x: 400, rotate: 180, y: 20 }} // shifting right
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="inline-block"
          >
            d
          </motion.span>
          Dum
          {/* Animate 'p' -> move to middle to become 'd' */}
          <motion.span
            initial={{ x: 0, rotate: 180, y: 20 }}
            animate={{ x: -400, rotate: 0, y: 0 }} // shifting left
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.05 }}
            className="inline-block"
          >
            d
          </motion.span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-700">
          Rant about it. Feel lighter.
        </p>
      </div>

      <div>
        <Button
          className="px-6 py-3 text-lg sm:text-xl rounded-full hover:scale-105 transition-transform shadow-md hover:cursor-pointer"
          onClick={handleLoginModal}
        >
          Ready to rant?
        </Button>
        <LoginModal open={showLogin} onClose={handleLoginModal} />
      </div>
    </section>
  );
}
