"use client"

import { motion } from "framer-motion"
import { FileText, ImageIcon, Video, Code, Calendar } from "lucide-react"

export default function NotesPage() {
  const notes = [
    {
      id: 1,
      type: "image",
      title: "Initial Language Syntax Design",
      description: "Early sketches of NovaScript syntax and grammar rules",
      date: "2024-01-15",
      icon: ImageIcon,
      content: "Scanned whiteboard drawings showing variable declarations, loop structures, and function definitions.",
    },
    {
      id: 2,
      type: "document",
      title: "Lexical Analysis Planning",
      description: "Token definitions and regular expressions for the lexer",
      date: "2024-01-20",
      icon: FileText,
      content: "Detailed documentation of all token types: keywords, identifiers, operators, literals, and delimiters.",
    },
    {
      id: 3,
      type: "video",
      title: "Parser Development Session",
      description: "Screen recording of building the recursive descent parser",
      date: "2024-01-25",
      icon: Video,
      content: "Live coding session showing the implementation of parsing functions for expressions and statements.",
    },
    {
      id: 4,
      type: "code",
      title: "AST Node Structures",
      description: "C++ class definitions for Abstract Syntax Tree nodes",
      date: "2024-02-01",
      icon: Code,
      content: "Complete class hierarchy for representing different types of AST nodes in the compiler.",
    },
    {
      id: 5,
      type: "image",
      title: "Error Handling Flowchart",
      description: "Visual representation of error detection and recovery strategies",
      date: "2024-02-05",
      icon: ImageIcon,
      content: "Flowchart showing how different types of errors are caught and reported to the user.",
    },
    {
      id: 6,
      type: "document",
      title: "Type System Specification",
      description: "Formal specification of NovaScript's type system",
      date: "2024-02-10",
      icon: FileText,
      content: "Rules for type checking, implicit conversions, and type compatibility in expressions.",
    },
    {
      id: 7,
      type: "video",
      title: "Interpreter Implementation",
      description: "Building the tree-walking interpreter",
      date: "2024-02-15",
      icon: Video,
      content: "Step-by-step implementation of the interpreter that executes the AST directly.",
    },
    {
      id: 8,
      type: "image",
      title: "Web Interface Mockups",
      description: "UI/UX designs for the interactive web interface",
      date: "2024-02-20",
      icon: ImageIcon,
      content: "Wireframes and mockups showing the layout of the code editor and visualization panels.",
    },
  ]

  const getTypeColor = (type) => {
    switch (type) {
      case "image":
        return "blue"
      case "document":
        return "green"
      case "video":
        return "purple"
      case "code":
        return "orange"
      default:
        return "gray"
    }
  }

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
            Development Notes
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Behind-the-scenes documentation, sketches, and planning materials from our development process
          </p>
        </motion.div>

        {/* Notes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Note Header */}
              <div className={`bg-${getTypeColor(note.type)}-600/20 border-b border-gray-700 p-4`}>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-${getTypeColor(note.type)}-600 rounded-lg`}>
                    <note.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {note.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{note.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note Content */}
              <div className="p-6">
                <p className="text-gray-300 mb-4">{note.description}</p>

                {/* Placeholder Content */}
                <div className="space-y-4">
                  {note.type === "image" && (
                    <div className="bg-gray-700 rounded-lg h-40 flex items-center justify-center border-2 border-dashed border-gray-600">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Scanned Image Placeholder</p>
                      </div>
                    </div>
                  )}

                  {note.type === "video" && (
                    <div className="bg-gray-700 rounded-lg h-40 flex items-center justify-center border-2 border-dashed border-gray-600">
                      <div className="text-center">
                        <Video className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Video Recording Placeholder</p>
                      </div>
                    </div>
                  )}

                  {note.type === "code" && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                      <pre className="text-gray-400 text-sm font-mono">
                        <code>{`// ${note.title}
class ASTNode {
    // Implementation details...
};`}</code>
                      </pre>
                    </div>
                  )}

                  {note.type === "document" && (
                    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <div className="space-y-2">
                        <div className="h-2 bg-gray-600 rounded w-full"></div>
                        <div className="h-2 bg-gray-600 rounded w-4/5"></div>
                        <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-600 rounded w-5/6"></div>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-gray-400 text-sm mt-4 italic">{note.content}</p>
              </div>

              {/* Note Footer */}
              <div className="px-6 py-3 bg-gray-700/50 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-1 bg-${getTypeColor(note.type)}-600/20 text-${getTypeColor(note.type)}-400 text-xs font-medium rounded-full capitalize`}
                  >
                    {note.type}
                  </span>
                  <button className="text-gray-400 hover:text-white text-sm transition-colors">View Details →</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 bg-purple-900/20 border border-purple-700/50 rounded-lg p-8 text-center"
        >
          <h3 className="text-2xl font-semibold text-purple-400 mb-4">Development Process</h3>
          <p className="text-gray-300 mb-6">
            These notes represent our iterative development process, from initial concept sketches to final
            implementation. Each artifact tells part of the story of how NovaScript came to life.
          </p>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-blue-400 font-semibold mb-1">Planning</div>
              <div className="text-gray-300">Initial designs and specifications</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-green-400 font-semibold mb-1">Implementation</div>
              <div className="text-gray-300">Core compiler development</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-purple-400 font-semibold mb-1">Testing</div>
              <div className="text-gray-300">Validation and debugging</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-orange-400 font-semibold mb-1">Documentation</div>
              <div className="text-gray-300">User guides and examples</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
