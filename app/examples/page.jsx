"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, RotateCcw, Clock, CheckCircle } from "lucide-react"

export default function ExamplesPage() {
  const [runningExample, setRunningExample] = useState(null)
  const [completedPhases, setCompletedPhases] = useState({})

  const examples = [
    {
      id: 1,
      title: "Hello World",
      description: "A simple greeting program",
      code: `let a be "Hello World"
say a`,
      output: "Hello World",
    },
    {
      id: 2,
      title: "while Loop Counter",
      description: "Counting from 10 to 20",
      code: `let a be 10
repeat while a<=20
    say "count: ",a
    set a to a + 1
end`,
      output: "Count: 10\nCount: 11\nCount: 12\nCount: 13\nCount: 14\nCount: 15\nCount: 16\nCount: 17\nCount: 18\nCount: 19\nCount: 20",
    },
    {
      id: 3,
      title: "Factorial Function",
      description: "Calculate factorial",
      code: `define function factorial(n)
  let result be 1
  let i be 1

  repeat while i<=n
    set result to result*i
    set i to i+1
  end

  return result
end

let answer be call factorial(5)
say "5! = ",answer`,
      output: "5! = 120",
    },
    {
      id: 4,
      title: "Conditional Logic",
      description: "Conditions applied to a variable value check",
      code: `let age be 11
when age>=18 then
    say "u can vote"
otherwise
    say "u cant vote"
end`,
      output: "Equal to 10",
    },
  ]

  const phases = ["Lexical", "Syntax", "Semantic","Target Code","Output"]

  const runExample = async (exampleId) => {
    setRunningExample(exampleId)
    setCompletedPhases({ [exampleId]: [] })

    for (let i = 0; i < phases.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCompletedPhases((prev) => ({
        ...prev,
        [exampleId]: [...(prev[exampleId] || []), i],
      }))
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    setRunningExample(null)
  }

  const resetExample = (exampleId) => {
    setCompletedPhases((prev) => ({
      ...prev,
      [exampleId]: [],
    }))
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
            Code Examples
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Run these examples and watch the compilation process in action
          </p>
        </motion.div>

        {/* Examples Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {examples.map((example, index) => (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{example.title}</h3>
                    <p className="text-gray-300 text-sm">{example.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => runExample(example.id)}
                      disabled={runningExample === example.id}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>{runningExample === example.id ? "Running..." : "Run"}</span>
                    </button>
                    <button
                      onClick={() => resetExample(example.id)}
                      className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Code Block */}
              <div className="p-6">
                <div className="bg-gray-900 rounded-lg p-4 mb-6">
                  <pre className="text-gray-100 font-mono text-sm leading-relaxed overflow-x-auto">
                    <code>{example.code}</code>
                  </pre>
                </div>

                {/* Phase Progress */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-3">Compilation Phases</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {phases.map((phase, phaseIndex) => {
                      const isCompleted = completedPhases[example.id]?.includes(phaseIndex)
                      const isRunning =
                        runningExample === example.id && completedPhases[example.id]?.length === phaseIndex

                      return (
                        <div
                          key={phase}
                          className={`flex items-center justify-center p-3 rounded-lg border transition-all ${
                            isCompleted
                              ? "bg-green-600 border-green-500 text-white"
                              : isRunning
                                ? "bg-blue-600 border-blue-500 text-white animate-pulse"
                                : "bg-gray-700 border-gray-600 text-gray-300"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : isRunning ? (
                              <Clock className="w-4 h-4 animate-spin" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-current" />
                            )}
                            <span className="text-sm font-medium">{phase}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Output */}
                {completedPhases[example.id]?.length === phases.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-900 rounded-lg p-4 border-l-4 border-green-500"
                  >
                    <h4 className="text-lg font-semibold text-green-400 mb-2">Output</h4>
                    <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap">{example.output}</pre>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 bg-blue-900/20 border border-blue-700/50 rounded-lg p-8 text-center"
        >
          <h3 className="text-2xl font-semibold text-blue-400 mb-4">Want to Learn More?</h3>
          <p className="text-gray-300 mb-6">
            Dive deeper into how each compilation phase works by visiting our detailed phases guide.
          </p>
          <a
            href="/phases"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <span>Explore Compilation Phases</span>
            <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
              →
            </motion.div>
          </a>
        </motion.div>
      </div>
    </div>
  )
}
