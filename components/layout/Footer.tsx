"use client";

import { motion } from "framer-motion";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-background pt-20 pb-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <h3 className="font-hero text-4xl text-white mb-4 tracking-wider">SC</h3>
            <p className="text-secondary-foreground text-sm max-w-sm mb-8 leading-relaxed">
              Building intelligent AI applications, scalable software, and modern digital experiences focused on performance and real-world impact.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/Santhoshcv07" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-border flex-center text-secondary-foreground hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-1" data-magnetic="true">
                <FiGithub size={18} />
              </a>
              <a href="https://www.linkedin.com/in/santhosh-cv07" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-border flex-center text-secondary-foreground hover:border-primary hover:text-primary transition-all duration-300 hover:-translate-y-1" data-magnetic="true">
                <FiLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg text-white mb-6 font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              {['About', 'Tech Stack', 'Experience', 'Projects', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-secondary-foreground hover:text-primary transition-colors duration-300 inline-block hover:translate-x-1 transform">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg text-white mb-6 font-semibold">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-primary mt-0.5 shrink-0" />
                <a href="mailto:santhoshcv825@gmail.com" className="text-sm text-secondary-foreground hover:text-primary transition-colors duration-300 break-all">
                  santhoshcv825@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-secondary-foreground">
                  +91 7619444518
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-secondary-foreground">
                  Karnataka, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Santhosh CV. All rights reserved.
          </p>
          
          <p className="text-xs text-muted-foreground text-center">
            Building intelligent solutions for a better tomorrow.
          </p>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-medium text-secondary-foreground hover:text-primary transition-colors duration-300 group"
            data-magnetic="true"
          >
            <span>Back to top</span>
            <div className="w-8 h-8 rounded-full border border-border flex-center group-hover:border-primary group-hover:-translate-y-1 transition-all duration-300">
              <ArrowUp size={14} className="group-hover:animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
