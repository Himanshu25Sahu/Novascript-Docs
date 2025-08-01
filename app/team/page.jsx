"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Code, Palette } from "lucide-react"

export default function TeamPage() {
  const team = [
    {
      id: 1,
      name: "Alex Chen",
      role: "Language Designer & Compiler Engineer",
      bio: "Passionate about programming languages and compiler design. Led the development of NovaScript's core compiler in C++ and designed the language syntax.",
      image: "/placeholder.svg?height=300&width=300",
      skills: ["C++", "Compiler Design", "Language Theory", "Algorithm Design"],
      github: "https://github.com/alexchen",
      linkedin: "https://linkedin.com/in/alexchen",
      email: "alex@novascript.dev",
      icon: Code,
    },
    {
      id: 2,
      name: "Sarah Rodriguez",
      role: "Frontend Developer & UX Designer",
      bio: "Specializes in creating intuitive user experiences and interactive visualizations. Built the web interface and designed the compiler phase animations.",
      image: "/placeholder.svg?height=300&width=300",
      skills: ["JavaScript", "React", "UI/UX Design", "Data Visualization"],
      github: "https://github.com/sarahrodriguez",
      linkedin: "https://linkedin.com/in/sarahrodriguez",
      email: "sarah@novascript.dev",
      icon: Palette,
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
            Meet the Creators
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The passionate developers behind NovaScript's innovative approach to teaching compiler concepts
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Profile Image */}
              <div className="relative h-80 bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
                <div className="relative z-10 w-48 h-48 bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-600 group-hover:border-blue-500 transition-colors">
                  <member.icon className="w-24 h-24 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
                {/* Floating Elements */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-blue-500/20 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-purple-500/20 rounded-full animate-pulse delay-1000"></div>
              </div>

              {/* Member Info */}
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-blue-400 font-medium mb-4">{member.role}</p>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">{member.bio}</p>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-700 rounded-full text-gray-300 hover:bg-gray-600 hover:text-white transition-colors group/link"
                  >
                    <Github className="w-5 h-5 group-hover/link:scale-110 transition-transform" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-700 rounded-full text-gray-300 hover:bg-blue-600 hover:text-white transition-colors group/link"
                  >
                    <Linkedin className="w-5 h-5 group-hover/link:scale-110 transition-transform" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="p-3 bg-gray-700 rounded-full text-gray-300 hover:bg-purple-600 hover:text-white transition-colors group/link"
                  >
                    <Mail className="w-5 h-5 group-hover/link:scale-110 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-gray-700 rounded-lg p-8 text-center"
        >
          <h3 className="text-2xl font-semibold text-white mb-4">Want to Contribute?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            NovaScript is an open-source project. We welcome contributions from developers, educators, and anyone
            passionate about making compiler concepts more accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/novascript/novascript"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>View on GitHub</span>
            </a>
            <a
              href="mailto:team@novascript.dev"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Get in Touch</span>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
