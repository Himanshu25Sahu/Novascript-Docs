"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Code, Palette } from "lucide-react"

export default function TeamPage() {
  const team = [
{
    id: 1,
    name: "Himanshu Sahu",
    role: "Language Designer & Full-Stack Developer",
    bio: "Software developer skilled in C++, React, and Node.js. Designed NovaScript’s syntax and built its compiler core. Passionate about language design, systems programming, and building real-world applications.",
    avatar: "/himanshu.jpeg?height=300&width=300", // Replace with actual image path if available
    skills: ["C++", "React.js", "Node.js", "Next.js", "Typescript"],
    github: "https://github.com/Himanshu25Sahu",
    linkedin: "https://www.linkedin.com/in/himanshu-sahu-303b2b25a/",
    email: "himpreetak@gmail.com",
    icon: Code,
  },
    {
      id: 2,
      name: "JM Mushraf",
      role: "Language Designer & Full-Stack Developer",
      bio: "Passionate software developer skilled in building scalable web applications using MongoDB, Express, React,next.js,and Node.js. Proficient in C++ for system-level programming, logic building, and implementing core algorithms.",
      avatar: "/mushraf.png?height=300&width=300",
      skills: ["C++", "React.js", "Node.js", "Next.js", "Typescript"],
      github: "https://github.com/JM-Mushraf",
      linkedin: "https://www.linkedin.com/in/mushraf-jm-386564306/",
      email: "mushraf1786@gmail.com",
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
            The team behind NovaScript built it as a fun and practical project to explore language design and interpreter development.
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
                  <img src={member.avatar} className="w-full h-full object-cover rounded-full" ></img>
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

      </div>
    </div>
  )
}
