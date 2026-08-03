"use client";

import { useState, useEffect, useRef } from "react";
import { m as motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ArrowDown, Menu, X } from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import Link from "next/link";
import { useLenis } from "lenis/react";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#tech-stack" },
  { name: "Experience", href: "#experience" },
  { name: "Certificates", href: "#certificates" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const lenis = useLenis();
  const menuRef = useRef<HTMLDivElement>(null);
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      lenis?.scrollTo(href, { offset: -80, duration: 1.5, easing: (t) => 1 - Math.pow(1 - t, 4) });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute("id") || "";
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Mobile Menu Effects (Body scroll lock and Escape key)
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    handleNavClick(e, href);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${
        scrolled 
          ? "h-[80px] bg-background/70 backdrop-blur-xl border-white/5 shadow-lg shadow-black/20" 
          : "h-[100px] bg-transparent border-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
    >
      <div className="max-w-[1600px] mx-auto px-5 md:px-10 lg:px-16 h-full flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="group flex items-center gap-4" data-magnetic="true">
          <span className="font-hero text-4xl tracking-wider text-white group-hover:text-primary transition-colors duration-300">SC</span>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide">AI ENGINEER</span>
            <span className="text-[10px] text-secondary-foreground font-medium">Building Intelligent Solutions</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link, index) => (
            <div key={link.name} className="flex items-center gap-6">
              <a 
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative text-sm font-medium text-white/80 hover:text-white transition-colors duration-300 py-2 group cursor-pointer"
                data-magnetic="true"
              >
                {link.name}
                {/* Active/Hover Indicator */}
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-300 ${activeSection === link.href.substring(1) ? "opacity-100 scale-100 shadow-[0_0_8px_rgba(0,217,255,0.8)]" : "opacity-0 scale-0 group-hover:opacity-50 group-hover:scale-100"}`} />
              </a>
              {/* Separator Dot */}
              {index < navLinks.length - 1 && (
                <span className="w-1 h-1 rounded-full bg-primary/40" />
              )}
            </div>
          ))}
        </nav>

        {/* Actions Section */}
        <div className="flex items-center gap-5">
          <div className="hidden md:flex items-center gap-4 mr-2">
            <a href="https://github.com/Santhoshcv07" target="_blank" rel="noreferrer" className="text-white hover:text-primary transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,217,255,0.6)] transform hover:scale-110" data-magnetic="true">
              <FiGithub size={20} />
            </a>
            <a href="https://www.linkedin.com/in/santhosh-cv07" target="_blank" rel="noreferrer" className="text-white hover:text-primary transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,217,255,0.6)] transform hover:scale-110" data-magnetic="true">
              <FiLinkedin size={20} />
            </a>
          </div>
          
          <a 
            href="/assets/resume/resume.pdf" 
            target="_blank"
            className="hidden sm:flex group items-center gap-3 px-6 py-2.5 rounded-full border border-white/20 text-white font-button text-sm hover:border-primary hover:text-primary hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(0,217,255,0.2)] transition-all duration-300"
            data-magnetic="true"
          >
            <span>Resume</span>
            <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform duration-300" />
          </a>

          {/* Hamburger Button (Mobile Only) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full border border-white/10 bg-white/5 text-white hover:text-primary hover:border-primary/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Open Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Drawer */}
            <motion.div
              ref={menuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] max-w-[80vw] bg-surface/95 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)] z-[70] flex flex-col p-6 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center mb-10">
                <span className="font-hero text-2xl tracking-wider text-white">SC</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Close Navigation Menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="flex flex-col gap-6 flex-grow overflow-y-auto py-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleMobileNavClick(e, link.href)}
                    className={`text-lg font-medium transition-colors duration-300 flex items-center gap-4 ${
                      activeSection === link.href.substring(1)
                        ? "text-primary"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      activeSection === link.href.substring(1) ? "bg-primary scale-100" : "bg-transparent scale-0"
                    }`} />
                    {link.name}
                  </a>
                ))}
                <a 
                  href="/assets/resume/resume.pdf" 
                  target="_blank"
                  className="mt-6 flex items-center justify-center gap-3 px-6 py-3 rounded-full border border-primary/50 bg-primary/10 text-primary font-button text-sm hover:bg-primary/20 transition-all duration-300 sm:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Resume</span>
                  <ArrowDown size={14} />
                </a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-primary w-full origin-left"
        style={{ scaleX }}
      />
    </motion.header>
  );
}
