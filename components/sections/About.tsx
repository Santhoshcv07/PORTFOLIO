"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, Cpu, Brain, Zap } from "lucide-react";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [100, -100]);

  const cards = [
    { icon: Brain, title: "Problem Solver", desc: "Analytical & Logical" },
    { icon: Code2, title: "Clean Code", desc: "Scalable & Maintainable" },
    { icon: Zap, title: "Fast Learner", desc: "Always Improving" },
    { icon: Cpu, title: "AI Engineer", desc: "Intelligent Systems" },
  ];

  const stats = [
    { value: "8+", label: "Projects Completed" },
    { value: "5+", label: "Certifications Earned" },
    { value: "100%", label: "Dedication & Consistency" },
  ];

  return (
    <section id="about" ref={containerRef} className="relative py-32 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-20 relative z-10">
        
        <div className="flex items-center gap-4 mb-16">
          <span className="text-primary font-mono text-sm tracking-widest">01</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-white uppercase tracking-wider">
            Who <span className="text-primary">I Am</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <motion.div 
              className="relative w-full h-[500px] rounded-[24px] overflow-hidden glass p-4 group"
              style={{ y: y1, willChange: "transform" }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <div className="w-full h-full relative rounded-xl overflow-hidden bg-secondary">
                 <div className="absolute inset-0 bg-[url('/assets/images/me.jpeg')] bg-cover bg-top bg-no-repeat transition-transform duration-700 group-hover:scale-110 filter grayscale group-hover:grayscale-0" />
              </div>
            </motion.div>

            {/* Quote Card */}
            <motion.div 
              className="glass p-8 rounded-2xl relative overflow-hidden group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <p className="text-lg md:text-xl text-white font-heading font-medium italic relative z-10">
                <span className="text-primary text-3xl mr-2 font-serif">"</span>
                Code is not just what I write, it's how I solve problems, build solutions, and create value.
              </p>
              <p className="text-secondary-foreground text-sm mt-4 font-medium text-right">
                — Santhosh CV
              </p>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 flex flex-col gap-12">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl md:text-3xl text-white font-heading font-bold mb-6 leading-snug">
                I don't just write code.<br/>
                <span className="text-primary">I architect intelligent solutions.</span>
              </h3>
              
              <p className="text-secondary-foreground text-lg mb-6 leading-relaxed font-sans">
                My focus is creating AI-powered products that combine performance, clean architecture, and exceptional user experience.
              </p>
              
              <p className="text-secondary-foreground text-lg leading-relaxed font-sans">
                Every project is built with scalability, maintainability, and long-term thinking. I am passionate about turning complex problems into simple, efficient, and user-friendly digital solutions.
              </p>
            </motion.div>

            {/* Achievement Cards */}
            <div className="grid grid-cols-2 gap-4">
              {cards.map((card, idx) => (
                <motion.div 
                  key={card.title}
                  className="glass p-6 rounded-2xl flex flex-col items-start gap-4 hover:-translate-y-2 transition-transform duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex-center text-primary group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                    <card.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-heading font-semibold text-lg">{card.title}</h4>
                    <p className="text-secondary-foreground text-sm mt-1">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={stat.label}
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                >
                  <span className="text-4xl font-hero text-white tracking-wider">{stat.value}</span>
                  <span className="text-xs text-secondary-foreground uppercase tracking-widest">{stat.label}</span>
                </motion.div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
