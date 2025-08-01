"use client"

import { motion } from "framer-motion"
import { Code, Cpu, Zap, Users } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: Code,
      title: "Simple Syntax",
      description: "Clean, beginner-friendly syntax that's easy to learn and understand.",
    },
    {
      icon: Cpu,
      title: "Compiler Visualization",
      description: "See exactly how your code gets processed through each compilation phase.",
    },
    {
      icon: Zap,
      title: "Interactive Learning",
      description: "Run code examples and watch the compilation process in real-time.",
    },
    {
      icon: Users,
      title: "Educational Focus",
      description: "Designed specifically for teaching compiler concepts to beginners.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            About NovaScript
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A revolutionary approach to learning compiler design through hands-on experience
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-white">What is NovaScript?</h2>
            <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
              <p>
                NovaScript is an educational programming language designed to demystify the compilation process. Built
                with C++ for the core compiler and enhanced with JavaScript for interactive visualization, it provides a
                unique learning experience.
              </p>
              <p>
                Unlike traditional compiler courses that focus on theory, NovaScript lets you see, touch, and interact
                with every phase of compilation. From lexical analysis to code generation, every step is visualized and
                explained.
              </p>
              <p>
                Whether you're a computer science student, a curious developer, or an educator looking for better
                teaching tools, NovaScript makes compiler concepts accessible and engaging.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Tech Stack</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">C++ - Core compiler implementation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-300">JavaScript - Interactive simulation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-gray-300">Tailwind CSS - Modern styling</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300">Next.js - Web framework</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Choose NovaScript?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors group"
              >
                <feature.icon className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
