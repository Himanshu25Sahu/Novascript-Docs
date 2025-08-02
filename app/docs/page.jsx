"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronRight, Menu, X } from "lucide-react"

export default function DocsPage() {
  const [selectedTopic, setSelectedTopic] = useState("variables")
  const [sidebarOpen, setSidebarOpen] = useState(false)

 const topics = [
  {
    id: "variables",
    title: "Variables",
    content: `# Variable Declaration in NovaScript
let name be "John"
let age be 25
let isStudent be true

# Variable Assignment
set a as 20
set b as "hello"
`,
  },
  {
    id: "loops",
    title: "Loops",
    content: `
# While Loop
let count be 0
repeat while count < 3
  say count
  set count as count + 1
end

#for loop
repeat for i from 1 to 5
    say i
end

  `,
  },
  {
    id: "conditionals",
    title: "Conditionals",
    content: `
    let age be 18
    when age>=18 then
      say "You're allowed to vote"
    otherwise
      say "You're not allowed to vote"
    end
  `,
  },
  {
    id: "functions",
    title: "Functions",
    content: `
    define function add(a,b)
      say a+b
    end

    define function mySay(a)
      let i be 0
      repeat while i<a
        say i
        set i to i+1
      end
    
    call mySay(5)
    
    `,
  },
  {
    id: "errors",
    title: "Error Handling",
    content: `
    try
      let num be 0
      let result be 100/0
      say result
    catch error
      say "An error occured"
      say error
    `,
  },
  {
    id: "limitations",
    title: "Limitations",
    content: `# NovaScript Limitations

# 1. No support for complex data structures like arrays or objects
# 2. Minimal standard library
# 3. No file I/O operations
# 4. Basic type system: integer, float, string, boolean
# 5. No classes or OOP
# 6. No modules or import system yet
# 7. No handling of recursive functions
`,
  },
]

  const currentTopic = topics.find((topic) => topic.id === selectedTopic)

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-gray-800 p-2 rounded-lg border border-gray-700"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed lg:sticky top-16 left-0 h-screen w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto z-40"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Documentation</h2>
          <nav className="space-y-2">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  setSelectedTopic(topic.id)
                  setSidebarOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between group ${
                  selectedTopic === topic.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span>{topic.title}</span>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    selectedTopic === topic.id ? "rotate-90" : "group-hover:translate-x-1"
                  }`}
                />
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 ml-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            key={selectedTopic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-white mb-8">{currentTopic?.title}</h1>

            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="bg-gray-700 px-4 py-2 border-b border-gray-600">
                <span className="text-sm text-gray-300 font-mono">NovaScript</span>
              </div>
              <pre className="p-6 text-sm text-gray-100 font-mono overflow-x-auto leading-relaxed">
                <code>{currentTopic?.content}</code>
              </pre>
            </div>

            <div className="mt-8 bg-blue-900/20 border border-blue-700/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-2">💡 Learning Tip</h3>
              <p className="text-gray-300">
                Try running this code in the{" "}
                <a href="/examples" className="text-blue-400 hover:underline">
                  Examples
                </a>{" "}
                section to see how the compiler processes each statement step by step.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
