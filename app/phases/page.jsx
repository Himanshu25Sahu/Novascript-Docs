"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, ChevronRight } from "lucide-react"

export default function PhasesPage() {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const sampleCode = `
let a be 10
repeat while a>0
  say a
  set a to a-1
end
  `

  const phases = [
  {
    name: "Lexical Analysis",
    description: "Breaking code into tokens (keywords, identifiers, operators, literals)",
    tokens: [
      "let", "a", "be", "10",
      "repeat", "while", "a", ">", "0",
      "say", "a",
      "set", "a", "to", "a", "-", "1",
      "end"
    ],
    color: "blue",
  },
  {
    name: "Syntax Analysis",
    description: "Building an Abstract Syntax Tree (AST) from tokens",
    tree: {
      name: "RepeatWhile",
      children: [
        { name: "Condition: a > 0" },
        {
          name: "Body",
          children: [
            { name: "say a" },
            { name: "set a to a - 1" }
          ]
        }
      ]
    },
    color: "green",
  },
  {
    name: "Semantic Analysis",
    description: "Type checking and scope validation",
    checks: [
      { check: "Variable 'a' declared", status: "✓" },
      { check: "Type of 'a' is integer", status: "✓" },
      { check: "'a > 0' is valid boolean condition", status: "✓" },
      { check: "'say' can output integer", status: "✓" }
    ],
    color: "yellow",
  },
  {
    name: "Code Execution",
    description: "Running the interpreted code",
    output: ["10", "9", "8", "7", "6", "5", "4", "3", "2", "1"],
    color: "purple",
  }
]


  const runPhases = async () => {
    setIsRunning(true)
    setCurrentPhase(0)

    for (let i = 0; i < phases.length; i++) {
      setCurrentPhase(i)
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    setIsRunning(false)
  }

  const reset = () => {
    setCurrentPhase(0)
    setIsRunning(false)
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
            How NovaScript Code Gets Executed
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Watch your code transform through each compilation phase
          </p>
        </motion.div>

        {/* Code Sample */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gray-800 rounded-lg border border-gray-700 mb-12 overflow-hidden"
        >
          <div className="bg-gray-700 px-4 py-2 border-b border-gray-600 flex justify-between items-center">
            <span className="text-sm text-gray-300 font-mono">sample.nova</span>
            <div className="flex space-x-2">
              <button
                onClick={runPhases}
                disabled={isRunning}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-1 rounded text-sm transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>{isRunning ? "Running..." : "Run"}</span>
              </button>
              <button
                onClick={reset}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
          <pre className="p-6 text-gray-100 font-mono text-lg leading-relaxed">
            <code>{sampleCode}</code>
          </pre>
        </motion.div>

        {/* Phase Visualization */}
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              className={`relative bg-gray-800 rounded-lg border-2 transition-all duration-500 ${
                currentPhase >= index
                  ? `border-${phase.color}-500 shadow-lg shadow-${phase.color}-500/20`
                  : "border-gray-700"
              }`}
            >
              {/* Phase Number */}
              <div
                className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentPhase >= index ? `bg-${phase.color}-500 text-white` : "bg-gray-600 text-gray-300"
                }`}
              >
                {index + 1}
              </div>

              <div className="p-6">
                <h3
                  className={`text-lg font-semibold mb-2 transition-colors ${
                    currentPhase >= index ? `text-${phase.color}-400` : "text-gray-400"
                  }`}
                >
                  {phase.name}
                </h3>
                <p className="text-gray-300 text-sm mb-4">{phase.description}</p>

                {/* Phase Content */}
                <AnimatePresence>
                  {currentPhase >= index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden"
                    >
                      {phase.tokens && (
                        <div className="flex flex-wrap gap-1">
                          {phase.tokens.map((token, i) => (
                            <motion.span
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono"
                            >
                              {token}
                            </motion.span>
                          ))}
                        </div>
                      )}

                      {phase.tree && (
                        <div className="text-xs font-mono">
                          <TreeNode node={phase.tree} />
                        </div>
                      )}

                      {phase.checks && (
                        <div className="space-y-1">
                          {phase.checks.map((check, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.2 }}
                              className="flex items-center space-x-2 text-xs"
                            >
                              <span className="text-green-400">{check.status}</span>
                              <span className="text-gray-300">{check.check}</span>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {phase.output && (
                        <div className="bg-gray-900 rounded p-3 font-mono text-sm">
                          {phase.output.map((line, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.5 }}
                              className="text-green-400"
                            >
                              {line}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-800 rounded-full h-2 mb-8">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentPhase + 1) / phases.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}

function TreeNode({ node, level = 0 }) {
  return (
    <div className={`ml-${level * 4}`}>
      <div className="flex items-center space-x-1 text-green-400">
        {level > 0 && <ChevronRight className="w-3 h-3" />}
        <span>{node.name}</span>
      </div>
      {node.children && (
        <div className="ml-2">
          {node.children.map((child, i) => (
            <TreeNode key={i} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
