"use client";

import { useState } from "react";
import Loader from "./Loader";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Background from "./Background";
import SmoothScroll from "./SmoothScroll";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading ? (
          <Loader key="loader" onComplete={() => setLoading(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Background />
            <SmoothScroll>
              <Navbar />
              <main className="relative z-10 flex min-h-screen flex-col overflow-hidden">
                {children}
              </main>
              <Footer />
            </SmoothScroll>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
