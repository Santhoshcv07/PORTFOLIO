"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Send, Mail } from "lucide-react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState({ name: "", email: "", message: "", honeypot: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);

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

      setFormState({
        name: "",
        email: "",
        message: "",
        honeypot: "",
      });

      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        "Failed to send message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" ref={containerRef} className="relative py-32 overflow-hidden min-h-screen flex items-center">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 relative z-10 w-full">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

          {/* Left - Content */}
          <motion.div
            className="flex flex-col gap-8"
            style={{ y: y1 }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <span className="text-primary font-mono text-sm tracking-widest mb-4 block">07</span>
              <h2 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white uppercase tracking-wider mb-6 leading-none">
                LET'S BUILD <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">SOMETHING</span> <br />
                EXTRAORDINARY
              </h2>

              <div className="flex items-center gap-3 mb-10 mt-6 px-4 py-2 rounded-full border border-success/30 bg-success/5 w-fit">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                </span>
                <span className="text-xs font-medium text-success tracking-wide uppercase">Available for new opportunities</span>
              </div>

              <p className="text-secondary-foreground text-lg leading-relaxed font-sans max-w-lg mb-12">
                Have a project in mind, a question, or just want to say hi? I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
              </p>

              <div className="flex items-center gap-6">
                {[
                  { icon: Mail, link: "mailto:santhoshcv825@gmail.com" },
                  { icon: FiGithub, link: "https://github.com/Santhoshcv07" },
                  { icon: FiLinkedin, link: "https://www.linkedin.com/in/santhosh-cv07" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-14 h-14 rounded-full glass flex-center text-white hover:text-primary border border-white/10 hover:border-primary transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(0,217,255,0.2)]"
                    data-magnetic="true"
                  >
                    <social.icon size={24} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            className="relative w-full max-w-xl ml-auto"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

            <form
              onSubmit={handleSubmit}
              className="relative glass p-8 md:p-12 rounded-[32px] border border-white/10 flex flex-col gap-6"
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

              {isSuccess && (
                <div className="bg-success/10 border border-success/30 text-success px-6 py-4 rounded-2xl flex flex-col items-center text-center">
                  <span className="text-lg font-bold mb-1">✅ Thank you!</span>
                  <span className="text-sm">Your message has been sent successfully. I'll get back to you as soon as possible.</span>
                </div>
              )}

              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl flex flex-col items-center text-center">
                  <span className="text-lg font-bold mb-1">❌ Error</span>
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}
              <div className="flex flex-col gap-2 relative group">
                <label htmlFor="name" className="text-xs uppercase tracking-widest text-secondary-foreground font-medium ml-4">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-background/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-sans focus:outline-none focus:border-primary transition-colors duration-300"
                  placeholder="John Doe"
                />
              </div>

              <div className="flex flex-col gap-2 relative group">
                <label htmlFor="email" className="text-xs uppercase tracking-widest text-secondary-foreground font-medium ml-4">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-background/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-sans focus:outline-none focus:border-primary transition-colors duration-300"
                  placeholder="john@example.com"
                />
              </div>

              <div className="flex flex-col gap-2 relative group">
                <label htmlFor="message" className="text-xs uppercase tracking-widest text-secondary-foreground font-medium ml-4">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-background/50 border border-white/10 rounded-2xl px-6 py-4 text-white font-sans focus:outline-none focus:border-primary transition-colors duration-300 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full group relative flex items-center justify-center gap-3 px-8 py-5 mt-4 bg-white text-black font-button font-bold rounded-2xl overflow-hidden transition-all duration-300 ${isSubmitting ? 'opacity-80' : 'hover:scale-[1.02]'}`}
                data-magnetic="true"
              >
                <span className={`relative z-10 flex items-center gap-2 transition-all duration-300 ${isSuccess ? 'text-white' : ''}`}>
                  {isSubmitting ? 'SENDING...' : isSuccess ? 'MESSAGE SENT!' : 'SEND MESSAGE'}
                  {!isSubmitting && !isSuccess && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </span>
                <div className={`absolute inset-0 bg-primary transition-transform duration-500 ease-out z-0 ${isSuccess ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
