"use client"

import { motion, AnimatePresence } from "framer-motion"
import { FileText, ImageIcon, Video, Code, Calendar, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function NotesPage() {
  const [fullScreenMedia, setFullScreenMedia] = useState(null)
  const [carouselIndex, setCarouselIndex] = useState({})

  const notes = [
    {
      id: 1,
      type: "image",
      title: "Initial Language Syntax Design",
      description: "Early sketches of NovaScript syntax and grammar rules",
      icon: ImageIcon,
      image_src: "/desgine.jpg",
      content: "Scanned whiteboard drawings showing variable declarations, loop structures, and function definitions.",
      githubLink: "https://github.com/Himanshu25Sahu/Novascript"
    },
    {
      id: 2,
      type: "document",
      title: "Lexical Analysis Planning",
      description: "Token definitions and regular expressions for the lexer",
      date: "2024-01-20",
      icon: FileText,
      content: `
This section documents the design and implementation of the lexical analysis phase of the NovaScript interpreter.

Key components:

- **Token Definitions**: Each source code input is broken down into tokens such as keywords (e.g., 'if', 'while'), identifiers, operators (+, -, *, /), literals (numbers, strings), and delimiters (;, (), {}).
- **Regular Expressions**: Regex rules were written to match each token category. For example, identifiers are matched using [a-zA-Z_][a-zA-Z0-9_]*, while numeric literals match [0-9]+(\\.[0-9]+)?.
- **Symbol Table Integration**: As shown in the symbol table figure, identifiers are stored and assigned unique references during scanning, enabling the compiler to link symbols through various phases.

Referencing the second image:
- The lexical analyzer outputs token sequences with ID mappings like ⟨id,1⟩, ⟨id,2⟩, etc., feeding the syntax analyzer.
- These token IDs correspond to entries in the symbol table, maintaining identifier consistency.

The process sets the stage for the **syntax analyzer**, which builds an abstract representation (parse tree) of expressions like:
\`position = initial + rate * 60\`

This tree is refined through semantic checks — type casting, for example — such as converting integer literals to float using inttofloat, as annotated in the semantic analysis stage.

These hand-drawn sketches (to be added) represent initial planning for:
- The top-down parse construction (e.g., S → cAd and A → ab | a)
- Parse trees for specific inputs like \`cad\`
- Token stream structure and parser input mapping

Overall, this document reflects both conceptual and technical preparation in defining how raw source code is tokenized for the NovaScript interpreter.
`,
      githubLink: "https://github.com/Himanshu25Sahu/Novascript"
    },
    {
      id: 3,
      type: "code",
      title: "AST Node Structures",
      description: "C++ class definitions for Abstract Syntax Tree nodes",
      icon: Code,
      images: ["/HW1.jpg", "/HW2.jpg"],
      code: `class LiteralExpr : public Expr {
public:
    Token value;
    Type inferredType = Type::NONE;

    explicit LiteralExpr(Token v) : value(std::move(v)) {}
    void print(std::ostream& os, int indent) const override {
        printIndent(os, indent);
        os << "LiteralExpr: " << value.lexeme << " (" << tokenTypeToString(value.type) << ")\\n";
    }
    Token getToken() const override { return value; }
    ExprPtr clone() const override {
        return std::make_unique<LiteralExpr>(value);
    }
private:
    static std::string tokenTypeToString(TokenType type) {
        switch (type) {
            case TokenType::NUMBER: return "NUMBER";
            case TokenType::STRING: return "STRING";
            default: return "UNKNOWN";
        }
    }
};`,
      content: "Complete class hierarchy for representing different types of AST nodes in the compiler.",
      githubLink: "https://github.com/Himanshu25Sahu/Novascript"
    },
    {
      id: 4,
      type: "image",
      title: "Error Handling Flowchart",
      description: "Visual representation of error detection and recovery strategies",
      icon: ImageIcon,
      image_src: "/Error.png",
      content: "Errors are handled and reported to the user effectively to ensure reliability.",
      githubLink: "https://github.com/Himanshu25Sahu/Novascript"
    },
    {
      id: 5,
      type: "document",
      title: "Type System Specification",
      description: "Formal specification of NovaScript's type system",
      icon: FileText,
      content: `• Primitive Types: Number, String, Boolean, Null
• Inferred typing via expression evaluation
• Implicit conversions allowed between Number ↔ Boolean
• Type checking enforced at compile-time
• Function parameters and return types must be explicitly defined
• Errors on incompatible binary operations (e.g., string + number without coercion)
• Type compatibility rules allow expression substitution`,
      githubLink: "https://github.com/Himanshu25Sahu/Novascript"
    },
    {
      id: 6,
      type: "video",
      title: "Interpreter Implementation",
      description: "Building the tree-walking interpreter",
      icon: Video,
      image_src: "/compile.mp4",
      content: "Step-by-step implementation of the interpreter that executes the AST directly.",
      githubLink: "https://github.com/Himanshu25Sahu/Novascript"
    },
  ]

  const getTypeColor = (type) => {
    switch (type) {
      case "image": return "blue"
      case "document": return "green"
      case "video": return "purple"
      case "code": return "orange"
      default: return "gray"
    }
  }

  const Carousel = ({ images, noteId }) => {
    const currentIndex = carouselIndex[noteId] || 0

    const nextSlide = () => {
      setCarouselIndex((prev) => ({
        ...prev,
        [noteId]: (currentIndex + 1) % images.length
      }))
    }

    const prevSlide = () => {
      setCarouselIndex((prev) => ({
        ...prev,
        [noteId]: (currentIndex - 1 + images.length) % images.length
      }))
    }

    return (
      <div className="relative w-full h-48">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${noteId}-${currentIndex}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full cursor-pointer"
            onClick={() => setFullScreenMedia({ type: "image", src: images[currentIndex] })}
          >
            <Image
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              width={500}
              height={300}
              className="rounded-lg object-cover w-full h-full"
            />
          </motion.div>
        </AnimatePresence>
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800/80 p-2 rounded-full hover:bg-gray-700/80 transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800/80 p-2 rounded-full hover:bg-gray-700/80 transition-all"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-500"}`}
            />
          ))}
        </div>
      </div>
    )
  }

  const FullScreenMedia = ({ media, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-gray-800/80 rounded-full hover:bg-gray-700/80 transition-all"
      >
        <X className="w-6 h-6 text-white" />
      </button>
      {media.type === "image" && (
        <Image
          src={media.src}
          alt="Full screen media"
          width={1200}
          height={800}
          className="max-w-full max-h-full object-contain"
        />
      )}
      {media.type === "video" && (
        <video
          controls
          autoPlay
          className="max-w-full max-h-full object-contain"
        >
          <source src={media.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {fullScreenMedia && (
        <FullScreenMedia
          media={fullScreenMedia}
          onClose={() => setFullScreenMedia(null)}
        />
      )}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Development Notes
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore the behind-the-scenes documentation, sketches, and planning materials that shaped NovaScript's development journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className="group bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div className={`bg-${getTypeColor(note.type)}-600/20 border-b border-gray-700 p-4 flex items-center space-x-3`}>
                <div className={`p-2 bg-${getTypeColor(note.type)}-600 rounded-lg`}>
                  <note.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
                    {note.title}
                  </h3>
                  {note.date && (
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{note.date}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <p className="text-gray-300 mb-4 text-sm">{note.description}</p>

                <div className="space-y-4">
                  {note.type === "image" && note.image_src && (
                    <div className="cursor-pointer" onClick={() => setFullScreenMedia({ type: "image", src: note.image_src })}>
                      <Image
                        src={note.image_src}
                        alt={note.title}
                        width={500}
                        height={300}
                        className="rounded-lg object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {note.type === "video" && note.image_src && (
                    <div className="relative group/video cursor-pointer" onClick={() => setFullScreenMedia({ type: "video", src: note.image_src })}>
                      <video
                        controls
                        preload="metadata"
                        className="rounded-lg w-full h-48 bg-black transition-transform duration-300 group-hover/video:scale-105"
                      >
                        <source src={note.image_src} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 bg-black/50 rounded-lg">
                        <span className="text-white text-sm font-medium">View Full Screen</span>
                      </div>
                    </div>
                  )}

                  {note.type === "code" && note.images && (
                    <Carousel images={note.images} noteId={note.id} />
                  )}

                  {note.type === "code" && note.code && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                      <pre className="text-gray-400 text-sm font-mono whitespace-pre-wrap">
                        <code>{note.code}</code>
                      </pre>
                    </div>
                  )}

                  {note.type === "document" && (
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600 text-gray-300 text-sm whitespace-pre-line">
                      {note.content}
                    </div>
                  )}
                </div>

                <p className="text-gray-400 text-sm mt-4 italic">{note.content}</p>
              </div>

              <div className="px-6 py-3 bg-gray-700/50 border-t border-gray-700 flex items-center justify-between">
                <span
                  className={`px-3 py-1 bg-${getTypeColor(note.type)}-600/20 text-${getTypeColor(note.type)}-400 text-xs font-medium rounded-full capitalize`}
                >
                  {note.type}
                </span>
                <a
                  href={note.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 text-sm font-medium transition-colors duration-200"
                >
                  View Details →
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-12 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-700/50 rounded-xl p-8 text-center"
        >
          <h3 className="text-2xl font-semibold text-purple-400 mb-4">Development Process</h3>
          <p className="text-gray-300 mb-6 text-sm max-w-3xl mx-auto">
            These notes capture our iterative journey, from initial concept sketches to polished implementation, showcasing the evolution of NovaScript.
          </p>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            {[
              { title: "Planning", desc: "Initial designs and specifications", color: "blue" },
              { title: "Implementation", desc: "Core compiler development", color: "green" },
              { title: "Testing", desc: "Validation and debugging", color: "purple" },
              { title: "Documentation", desc: "User guides and examples", color: "orange" },
            ].map((stage, index) => (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-300"
              >
                <div className={`text-${stage.color}-400 font-semibold mb-1`}>{stage.title}</div>
                <div className="text-gray-300">{stage.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #4b5563 #1f2937;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  )
}