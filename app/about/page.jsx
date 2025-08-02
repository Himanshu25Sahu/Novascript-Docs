"use client"

import { motion } from "framer-motion"
import { Code, Cpu, Zap, Users } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: Code,
      title: "Project-Based Learning",
      description: "Created as a hands-on project to explore language design and compiler basics.",
    },
    {
      icon: Cpu,
      title: "Custom Language Design",
      description: "A fun and challenging way to apply concepts like lexing, parsing, and execution in C++.",
    },
    {
      icon: Zap,
      title: "Showcase of Skills",
      description: "Demonstrates proficiency in C++, OOP, and building interpreters from scratch.",
    },
    {
      icon: Users,
      title: "Simplified Programming",
      description: "Designed to make coding feel more natural and beginner-friendly with English-like syntax.",
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
                NovaScript is an English-like programming language designed for beginners and fast prototyping. With a focus on clarity and readability, it uses natural language syntax to make programming intuitive and easy to understand
              </p>
              <p>
                NovaScript supports key programming concepts like variables, functions, loops, conditionals, lists, error handling, and more — all expressed in a clean, human-friendly format.
              </p>
              <p>
                It’s perfect for those new to coding or anyone who wants to quickly bring ideas to life. Learn more from this <a href="https://www.linkedin.com/posts/himanshu-sahu-303b2b25a_compilerdesign-recursivedescent-semanticanalysis-activity-7339534452844281857-j3aD?utm_source=share&utm_medium=member_desktop&rcm=ACoAAD_iEfMBHxjAi1obHV3wWlh6fSqaqagPUbY" className="text-blue-600">LinkedIn Post</a>.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Technologies</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">C++ - Core Interpreter implementation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-300">OOP - For modular design</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-gray-300">Custom Lexer and Parser</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-300">Error handling</span>
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
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why We Built NovaScript?</h2>
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
