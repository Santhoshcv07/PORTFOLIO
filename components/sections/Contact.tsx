"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import { m as motion, useScroll, useTransform, AnimatePresence, Variants, useInView } from "framer-motion";
import { Send, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import emailjs from "@emailjs/browser";

// --- Stagger Configurations ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 } }
};


const socialLinks = [
  { icon: Mail, link: "mailto:santhoshcv825@gmail.com" },
  { icon: FiGithub, link: "https://github.com/Santhoshcv07" },
  { icon: FiLinkedin, link: "https://www.linkedin.com/in/santhosh-cv07" },
];

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "200px 0px 200px 0px" });
  const [formState, setFormState] = useState({ name: "", email: "", message: "", honeypot: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Scroll parallax for left content
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);

  // Fixed random particles for purity
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      width: Math.random() * 2 + 1 + "px",
      height: Math.random() * 2 + 1 + "px",
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      duration: 15 + Math.random() * 20 + "s",
      delay: "-" + Math.random() * 20 + "s",
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1️⃣ Send message to you
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE!,
        {
          name: formState.name,
          email: formState.email,
          message: formState.message,
          title: "Portfolio Contact",
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      // 2️⃣ Send auto reply
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE!,
        {
          name: formState.name,
          email: formState.email,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      // Success
      setIsSuccess(true);
      setFormState({ name: "", email: "", message: "", honeypot: "" });

      setTimeout(() => {
        setIsSuccess(false);
      }, 6000);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section 
      id="contact" 
      ref={containerRef} 
      className="relative py-32 overflow-hidden min-h-screen flex items-center bg-background"
    >

      {/* Animated Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="hero-grain" />
        
        {/* Floating CSS Particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/40 pointer-events-none will-change-transform"
            style={{
              width: p.width,
              height: p.height,
              left: p.left,
              top: p.top,
              animationName: isInView ? 'particle-drift' : 'none',
              animationDuration: p.duration,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
              animationDelay: p.delay,
              boxShadow: "0 0 8px 1px rgba(0,217,255,0.3)"
            }}
          />
        ))}

        {/* Ambient Glow */}
        <div 
          className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[80px] rounded-full pointer-events-none will-change-transform" 
          style={{ animation: isInView ? "ambient-breathe 10s ease-in-out infinite" : 'none', transform: "translateZ(0)" }}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Left - Content */}
          <motion.div
            className="flex flex-col gap-8 will-change-transform"
            style={{ y: y1 }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div>
              <motion.span variants={fadeUp} className="text-primary font-mono text-sm tracking-widest mb-4 block">07</motion.span>
              
              {/* Premium Heading */}
              <motion.h2 variants={fadeUp} className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-wider mb-6 leading-none relative">
                LET'S BUILD <br />
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-[0_0_15px_rgba(0,217,255,0.3)] inline-block my-2"
                >
                  SOMETHING
                </motion.span> <br />
                EXTRAORDINARY
              </motion.h2>

              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10 mt-6 px-4 py-2 rounded-full border border-success/30 bg-success/5 w-fit shadow-[inset_0_0_10px_rgba(0,255,136,0.05)] hover:bg-success/10 transition-colors duration-300">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" style={{ animation: "ambient-breathe 2s ease-in-out infinite" }}></span>
                </span>
                <span className="text-xs font-medium text-success tracking-wide uppercase">Available for new opportunities</span>
              </motion.div>

              <motion.p variants={fadeUp} className="text-secondary-foreground text-lg leading-relaxed font-sans max-w-lg mb-12 hover:text-white/80 transition-colors duration-500">
                Have a project in mind, a question, or just want to say hi? I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
              </motion.p>

              <motion.div variants={fadeUp} className="flex items-center gap-6">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon-ripple relative group w-14 h-14 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/70 hover:text-primary hover:border-primary/50 transition-all duration-500 hover:scale-[1.08] hover:-translate-y-1 active:scale-95 overflow-hidden shadow-[0_0_0_rgba(0,217,255,0)] hover:shadow-[0_0_20px_rgba(0,217,255,0.2),inset_0_0_10px_rgba(0,217,255,0.1)]"
                    data-magnetic="true"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="absolute inset-0 rounded-full bg-primary/20 scale-0 group-hover:scale-150 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-0 group-hover:opacity-100" />
                    <social.icon size={24} className="relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            className="relative w-full max-w-xl ml-auto"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <div className="absolute inset-0 bg-primary/5 blur-[60px] rounded-full pointer-events-none will-change-transform" style={{ transform: "translateZ(0)" }} />

            <motion.form
              variants={fadeUp}
              onSubmit={handleSubmit}
              className="relative glass p-8 md:p-12 rounded-[32px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl flex flex-col gap-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_25px_50px_rgba(0,0,0,0.3)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_25px_50px_rgba(0,0,0,0.4),0_0_40px_rgba(0,217,255,0.05)] transition-shadow duration-700"
            >
              {/* Spam Protection Honeypot */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  name="honeypot"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formState.honeypot}
                  onChange={handleChange}
                />
              </div>

              <AnimatePresence mode="wait">
                {isSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="bg-success/10 border border-success/30 text-success px-6 py-4 rounded-2xl flex flex-col items-center text-center shadow-[0_0_20px_rgba(0,255,136,0.15)] overflow-hidden"
                  >
                    <CheckCircle2 size={24} className="mb-2 text-success" />
                    <span className="text-lg font-bold mb-1">Thank you!</span>
                    <span className="text-sm">Your message has been sent successfully. I'll get back to you soon.</span>
                  </motion.div>
                )}
                {errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl flex flex-col items-center text-center overflow-hidden"
                  >
                    <span className="text-lg font-bold mb-1">❌ Error</span>
                    <span className="text-sm">{errorMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={fadeUp} className="flex flex-col gap-2 relative group">
                <label htmlFor="name" className="text-xs uppercase tracking-widest text-secondary-foreground font-medium ml-4 group-focus-within:text-primary group-hover:text-white transition-colors duration-300">Your Name</label>
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 blur-sm transition-opacity duration-500" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    style={{ caretColor: '#00D9FF' }}
                    className="relative w-full bg-background/50 border border-white/10 rounded-2xl px-6 py-4 text-base text-white font-sans focus:outline-none focus:border-primary focus:bg-white/[0.02] hover:-translate-y-[2px] transition-all duration-300 placeholder:text-white/20 focus:placeholder:opacity-0 shadow-sm"
                    placeholder="John Doe"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col gap-2 relative group">
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-secondary-foreground font-medium ml-4 group-focus-within:text-primary group-hover:text-white transition-colors duration-300">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 blur-sm transition-opacity duration-500" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    style={{ caretColor: '#00D9FF' }}
                    className="relative w-full bg-background/50 border border-white/10 rounded-2xl px-6 py-4 text-base text-white font-sans focus:outline-none focus:border-primary focus:bg-white/[0.02] hover:-translate-y-[2px] transition-all duration-300 placeholder:text-white/20 focus:placeholder:opacity-0 shadow-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col gap-2 relative group">
                <label htmlFor="message" className="text-xs uppercase tracking-widest text-secondary-foreground font-medium ml-4 group-focus-within:text-primary group-hover:text-white transition-colors duration-300">Message</label>
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 blur-sm transition-opacity duration-500" />
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{ caretColor: '#00D9FF' }}
                    className="relative w-full bg-background/50 border border-white/10 rounded-2xl px-6 py-4 text-base text-white font-sans focus:outline-none focus:border-primary focus:bg-white/[0.02] hover:-translate-y-[2px] transition-all duration-300 resize-none placeholder:text-white/20 focus:placeholder:opacity-0 shadow-sm"
                    placeholder="Tell me about your project..."
                  />
                </div>
              </motion.div>

              <motion.button
                variants={fadeUp}
                type="submit"
                disabled={isSubmitting}
                className={`w-full group relative flex items-center justify-center gap-3 px-8 py-5 mt-4 bg-white text-black font-button font-bold rounded-2xl overflow-hidden transition-all duration-300 ${isSubmitting ? 'opacity-90 cursor-wait' : 'hover:scale-[1.02] hover:shadow-[0_10px_30px_rgba(0,217,255,0.3)] active:scale-95'}`}
                data-magnetic="true"
              >
                <span className={`relative z-10 flex items-center gap-2 transition-all duration-300 ${isSuccess ? 'text-white' : ''}`}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin text-primary" />
                      <span>SENDING...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 size={20} className="text-white" />
                      <span>SENT SUCCESSFULLY</span>
                    </>
                  ) : (
                    <>
                      <span>SEND MESSAGE</span>
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </span>
                
                {/* Background animations */}
                <div className={`absolute inset-0 bg-primary transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] z-0 ${isSuccess ? 'translate-y-0' : 'translate-y-[101%] group-hover:translate-y-0'}`} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[button-sweep_2s_ease-in-out_infinite] z-0" />
                
                {/* Success particles omitted for render purity, or implemented in a separate client component if needed. For now just removing the inline Math.random logic to keep the component pure. */}
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
