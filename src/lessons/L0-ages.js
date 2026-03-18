const lessonL0 = {
  id: "L0",
  title: "Ages - Simple Addition",
  problemStatement: "Selvi and Thamarai are siblings. Thamarai is 4 years older than Selvi.",
  question: "If Selvi is x years old, how old is Thamarai?",
  
  steps: [
    {
      id: "step1",
      title: "Understand the Problem",
      prompts: [
        {
          id: "understand-1",
          type: "open-ended",
          question: "What does 'older by 4' mean in your own words?",
          placeholder: "Type your explanation here...",
          validation: {
            type: "keywords",
            keywords: ["4", "more", "add", "years", "plus"],
            minWords: 3,
            feedback: {
              success: "Good explanation! You understand the relationship.",
              hint: "Think about how many more years Thamarai has lived compared to Selvi."
            }
          }
        }
      ]
    },
    {
      id: "step2",
      title: "Try with Concrete Numbers",
      prompts: [
        {
          id: "concrete-1",
          type: "numerical",
          question: "If Selvi is 10 years old, how old is Thamarai?",
          placeholder: "Enter a number",
          validation: {
            type: "exact",
            correctAnswer: 14,
            feedback: {
              success: "Correct! Thamarai is 14 years old.",
              error: "Not quite. If Thamarai is 4 years older than Selvi, and Selvi is 10, what would Thamarai's age be?"
            }
          }
        },
        {
          id: "concrete-2",
          type: "open-ended",
          question: "How did you figure that out?",
          placeholder: "Explain your thinking...",
          validation: {
            type: "keywords",
            keywords: ["add", "plus", "10", "4", "14"],
            minWords: 3,
            feedback: {
              success: "Great! You identified the operation.",
              hint: "What did you do to 10 to get 14?"
            }
          }
        }
      ]
    },
    {
      id: "step3",
      title: "Identify the Pattern",
      prompts: [
        {
          id: "pattern-1",
          type: "multiple-choice",
          question: "What mathematical operation are you using?",
          options: [
            { value: "addition", label: "Addition" },
            { value: "subtraction", label: "Subtraction" },
            { value: "multiplication", label: "Multiplication" },
            { value: "division", label: "Division" }
          ],
          validation: {
            type: "exact",
            correctAnswer: "addition",
            feedback: {
              success: "Exactly! We're adding 4 to Selvi's age.",
              error: "Think about what you did in the previous step. Did you add, subtract, multiply, or divide?"
            }
          }
        }
      ]
    },
    {
      id: "step4",
      title: "Write the General Expression",
      prompts: [
        {
          id: "variable-def",
          type: "text",
          question: "Let x be:",
          placeholder: "What does x represent?",
          validation: {
            type: "keywords",
            keywords: ["selvi", "age"],
            feedback: {
              success: "Perfect! x represents Selvi's age.",
              hint: "What are we trying to find a general expression for? Whose age is changing?"
            }
          }
        },
        {
          id: "expression",
          type: "expression",
          question: "Thamarai's age:",
          placeholder: "Write using x",
          validation: {
            type: "expression",
            correctAnswers: ["x + 4", "x+4", "4+x", "4 + x"],
            feedback: {
              success: "Excellent! You've created the algebraic expression: x + 4",
              error: "Remember: Thamarai is 4 years older than Selvi. If Selvi's age is x, what expression represents being 4 years older?"
            }
          }
        }
      ]
    }
  ],
  
  completion: {
    message: "🎉 Great work! You've successfully translated a word problem into an algebraic expression.",
    nextStep: "Ready to see this visually? Click the Desmos tab to explore your expression as a graph."
  }
};

export default lessonL0;