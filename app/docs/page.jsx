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
      content: `// Variable Declaration in NovaScript
let name = "John";
let age = 25;
let isStudent = true;

// Variable Types
let number = 42;        // Integer
let decimal = 3.14;     // Float
let text = "Hello";     // String
let flag = false;       // Boolean

// Variable Assignment
age = 26;               // Update existing variable
let newAge = age + 1;   // Create new variable from existing`,
    },
    {
      id: "loops",
      title: "Loops",
      content: `// For Loop
for (let i = 0; i < 5; i++) {
    print("Iteration: " + i);
}

// While Loop
let count = 0;
while (count < 3) {
    print("Count: " + count);
    count = count + 1;
}

// Nested Loops
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        print(i + " x " + j + " = " + (i * j));
    }
}`,
    },
    {
      id: "conditionals",
      title: "Conditionals",
      content: `// If Statement
let score = 85;
if (score >= 90) {
    print("Grade: A");
} else if (score >= 80) {
    print("Grade: B");
} else if (score >= 70) {
    print("Grade: C");
} else {
    print("Grade: F");
}

// Logical Operators
let age = 20;
let hasLicense = true;

if (age >= 18 && hasLicense) {
    print("Can drive");
} else {
    print("Cannot drive");
}`,
    },
    {
      id: "functions",
      title: "Functions",
      content: `// Function Declaration
function greet(name) {
    return "Hello, " + name + "!";
}

// Function Call
let message = greet("Alice");
print(message);

// Function with Multiple Parameters
function add(a, b) {
    return a + b;
}

let sum = add(5, 3);
print("Sum: " + sum);

// Recursive Function
function factorial(n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}`,
    },
    {
      id: "errors",
      title: "Error Handling",
      content: `// Common Syntax Errors
// Missing semicolon
let x = 5  // Error: Expected ';'

// Undefined variable
print(undefinedVar);  // Error: Variable not declared

// Type mismatch
let result = "hello" + 5;  // Warning: Implicit conversion

// Function errors
function test() {
    return x;  // Error: 'x' not defined in scope
}

// Division by zero
let result = 10 / 0;  // Runtime error`,
    },
    {
      id: "limitations",
      title: "Limitations",
      content: `// Current Limitations of NovaScript

// 1. No Arrays or Objects
// Arrays and complex data structures are not yet supported

// 2. Limited Standard Library
// Only basic print() function is available

// 3. No File I/O
// Cannot read from or write to files

// 4. Simple Type System
// Only supports: int, float, string, boolean

// 5. No Classes or Objects
// Object-oriented programming not supported

// 6. No Modules or Imports
// All code must be in a single file

// Future versions will address these limitations!`,
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
