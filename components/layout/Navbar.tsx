"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import Link from "next/link";

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
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
              <Link 
                href={link.href}
                className="relative text-sm font-medium text-white/80 hover:text-white transition-colors duration-300 py-2 group"
                data-magnetic="true"
              >
                {link.name}
                {/* Active/Hover Indicator */}
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary transition-all duration-300 ${activeSection === link.href.substring(1) ? "opacity-100 scale-100 shadow-[0_0_8px_rgba(0,217,255,0.8)]" : "opacity-0 scale-0 group-hover:opacity-50 group-hover:scale-100"}`} />
              </Link>
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
            className="group flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/20 text-white font-button text-sm hover:border-primary hover:text-primary hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(0,217,255,0.2)] transition-all duration-300"
            data-magnetic="true"
          >
            <span>Resume</span>
            <ArrowDown size={14} className="group-hover:translate-y-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-primary w-full origin-left"
        style={{ scaleX }}
      />
    </motion.header>
  );
}
