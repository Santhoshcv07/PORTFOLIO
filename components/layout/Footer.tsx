"use client";

import { m as motion, useMotionValue, useSpring, Variants } from "framer-motion";
import { ArrowUp, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { useRef, useCallback, useState } from "react";

// Stagger configurations
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  const currentYear = new Date().getFullYear();

  // Mouse tracking for flashlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  const [isHoveringFooter, setIsHoveringFooter] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }, [mouseX, mouseY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const motto = "Building intelligent solutions for a better tomorrow.";
  const mottoChars = motto.split("");

  return (
    <footer 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHoveringFooter(true)}
      onMouseLeave={() => setIsHoveringFooter(false)}
      className="relative bg-[#050505] pt-24 pb-10 overflow-hidden border-t border-white/[0.05]"
    >
      {/* 14. Mouse Interaction Flashlight */}
      <motion.div 
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none z-0 mix-blend-screen will-change-transform"
        style={{
          background: "radial-gradient(circle, rgba(0,217,255,0.08) 0%, transparent 60%)",
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isHoveringFooter ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* 1 & 2. Premium Background & Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Breathing glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[150px] rounded-full pointer-events-none will-change-transform" 
          style={{ animation: "ambient-breathe 15s ease-in-out infinite" }}
        />
        
        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          }}
        />

        {/* 15. Floating Particles (CSS) */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/40 pointer-events-none will-change-transform"
            style={{
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animation: `particle-drift ${10 + Math.random() * 20}s linear infinite`,
              animationDelay: `-${Math.random() * 20}s`,
              boxShadow: "0 0 10px 1px rgba(0,217,255,0.3)"
            }}
          />
        ))}
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 relative z-10">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20"
        >
          {/* Brand */}
          <motion.div variants={fadeUp} className="col-span-1 lg:col-span-2 pr-0 lg:pr-12">
            <div className="group relative inline-block mb-6 cursor-pointer" onClick={scrollToTop}>
              <h3 className="font-hero text-4xl text-white tracking-widest transition-all duration-500 group-hover:tracking-[0.3em] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-primary">
                SC
              </h3>
              <div className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[0_0_10px_rgba(0,217,255,0.5)]" />
            </div>
            
            <p className="text-secondary-foreground text-[15px] max-w-sm mb-10 leading-loose font-sans">
              Building <span className="text-primary/90 font-medium transition-colors duration-300 hover:text-primary">intelligent AI applications</span>, scalable software, and modern digital experiences focused on <span className="text-primary/90 font-medium transition-colors duration-300 hover:text-primary">performance</span> and real-world impact.
            </p>
            
            <div className="flex items-center gap-5">
              {[
                { icon: FiGithub, href: "https://github.com/Santhoshcv07" },
                { icon: FiLinkedin, href: "https://www.linkedin.com/in/santhosh-cv07" }
              ].map((social, idx) => (
                <a 
                  key={idx}
                  href={social.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-icon-ripple relative group w-11 h-11 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/70 hover:text-primary hover:border-primary/50 transition-all duration-500 hover:scale-[1.08] hover:-translate-y-1 active:scale-95 shadow-none hover:shadow-[0_0_20px_rgba(0,217,255,0.2),inset_0_0_10px_rgba(0,217,255,0.1)] overflow-hidden"
                  data-magnetic="true"
                >
                  <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-150 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 group-hover:opacity-100" />
                  <social.icon size={18} className="relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeUp} className="glass border border-white/[0.08] bg-white/[0.06] backdrop-blur-md p-8 rounded-[20px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.2)] hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-500">
            <h4 className="font-heading text-lg text-white mb-8 font-semibold tracking-wide flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#00d9ff]" />
              Quick Links
            </h4>
            <ul className="space-y-4">
              {['About', 'Tech Stack', 'Experience', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase().replace(' ', '-')}`} 
                    className="group relative flex items-center gap-2 text-sm text-secondary-foreground hover:text-white transition-all duration-300 py-1"
                  >
                    <ArrowRight size={14} className="text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                    <span className="relative group-hover:translate-x-1 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-[0_0_8px_#00d9ff]" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={fadeUp} className="glass border border-white/[0.08] bg-white/[0.06] backdrop-blur-md p-8 rounded-[20px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_30px_rgba(0,0,0,0.2)] hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-500">
            <h4 className="font-heading text-lg text-white mb-8 font-semibold tracking-wide flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#00d9ff]" />
              Contact
            </h4>
            <ul className="space-y-6">
              {[
                { icon: Mail, text: "santhoshcv825@gmail.com", href: "mailto:santhoshcv825@gmail.com" },
                { icon: Phone, text: "+91 7619444518", href: null },
                { icon: MapPin, text: "Karnataka, India", href: null }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 group">
                  <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] border border-transparent group-hover:border-primary/30 group-hover:shadow-[0_0_15px_rgba(0,217,255,0.2)]">
                    <item.icon size={14} className="text-primary group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </div>
                  {item.href ? (
                    <a href={item.href} className="text-sm text-secondary-foreground hover:text-primary transition-colors duration-300 break-all mt-1.5 font-medium">
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm text-secondary-foreground mt-1.5 font-medium group-hover:text-white transition-colors duration-300">
                      {item.text}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* 10. Animated Divider */}
        <div className="relative w-full h-[1px] mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#00d9ff]"
            animate={{ left: ["-10%", "110%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_#00d9ff]"
            animate={{ left: ["-10%", "110%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {/* 11. Copyright */}
          <p className="text-xs text-white/40 font-medium tracking-wide hover:text-white/60 transition-colors duration-300">
            © {currentYear} Santhosh CV. All rights reserved.
          </p>
          
          {/* 12. Center Motto */}
          <div className="text-xs text-white/50 font-medium text-center hidden md:flex font-mono tracking-wide">
            {mottoChars.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.02 }}
                className={char === " " ? "mr-1" : "hover:text-primary hover:drop-shadow-[0_0_8px_rgba(0,217,255,0.8)] transition-all duration-300"}
              >
                {char}
              </motion.span>
            ))}
          </div>
          
          {/* 13. Back to Top */}
          <button 
            onClick={scrollToTop}
            className="group relative flex items-center gap-3 text-xs font-semibold text-white/60 hover:text-white transition-all duration-500 uppercase tracking-widest active:scale-95"
            data-magnetic="true"
          >
            <span className="group-hover:text-primary transition-colors duration-300">Back to top</span>
            <div className="relative w-10 h-10 rounded-full border border-white/10 flex items-center justify-center overflow-hidden bg-white/[0.02] group-hover:border-primary/50 transition-all duration-500 shadow-[0_0_0_rgba(0,217,255,0)] group-hover:shadow-[0_0_20px_rgba(0,217,255,0.3)]">
              <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-full" />
              <ArrowUp size={16} className="relative z-10 text-white group-hover:text-primary group-hover:-translate-y-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              <ArrowUp size={16} className="absolute z-10 text-primary translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </div>
          </button>
        </motion.div>
      </div>
    </footer>
  );
}
