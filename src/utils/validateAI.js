const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export async function validateAI(step, userAnswer) {
  if (!userAnswer || userAnswer.trim().length === 0) {
    return { isCorrect: false, message: 'Please enter an answer.' }
  }

  const attemptCount = step.attemptCount || 0
  const prompt = buildPrompt(step, userAnswer, attemptCount)

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.log('API error response:', data)
      return { isCorrect: false, message: 'Something went wrong. Please try again.' }
    }

    const text = data.content[0].text.trim()
    const cleaned = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(cleaned)
    return result

  } catch (error) {
    console.error('AI validation error:', error)
    return { isCorrect: false, message: 'Something went wrong. Please try again.' }
  }
}

function buildPrompt(step, userAnswer, attemptCount = 0) {

  if (step.validation.type === 'open-ended') {

    // Variable naming question (e.g. Step 5c)
    if (step.validation.targetVariable) {
      return `
You are validating a middle school student's answer in an algebra lesson about variable naming.

Question: "${step.prompt}"
Student's answer: "${userAnswer}"
Expected concept: "${step.validation.concept}"
Target variable: "${step.validation.targetVariable}"

Rules:
- The student must recognise that x cannot be reused because it already represents Selvi's age.
- If they propose any letter other than x AND explain (even briefly) why x cannot be used, mark isCorrect as true. Extract the letter they proposed and include it as chosenVariable.
- If they propose x, or show no understanding of why x is taken, mark isCorrect as false.
- Keep feedback to 1-2 sentences. Do not reveal the answer.

Respond ONLY with valid JSON in this exact format:
{"isCorrect": true, "chosenVariable": "t", "message": "Good reasoning!"}
or
{"isCorrect": false, "message": "Remember, x is already used for Selvi's age."}
      `.trim()
    }

    if (attemptCount === 0) {
      return `
You are validating a middle school student's answer in an algebra lesson.

Question: "${step.prompt}"
Student's answer: "${userAnswer}"
Expected concept: "${step.validation.concept}"

This is their FIRST attempt.

Rules:
- Accept ANY answer that shows genuine understanding of the concept, even if incomplete.
- The student does not need to write full sentences or use perfect terminology.
- If they mention key words like "older", "add", "more", "4", that is often enough.
- Only reject if completely wrong (e.g. "subtract", "divide", gibberish).
- Give BRIEF feedback only (1-2 sentences maximum).

Respond ONLY with valid JSON:
{"isCorrect": true, "message": "Good thinking! You've got the right idea."}
or
{"isCorrect": false, "message": "Not quite. Keep thinking about what 'older' means."}
      `.trim()
    } else {
      return `
You are validating a middle school student's answer in an algebra lesson.

Question: "${step.prompt}"
Student's answer: "${userAnswer}"
Expected concept: "${step.validation.concept}"

This is attempt number ${attemptCount + 1}. The student has used ${attemptCount} hints.

Rules:
- Be VERY accepting after multiple attempts.
- If they mention "older", "add", "4 years", "more" — ACCEPT IT as correct.
- They do not need perfect wording after struggling and using hints.
- Only reject if still completely wrong (subtract, divide, gibberish).

Respond ONLY with valid JSON:
{"isCorrect": true, "message": "Great job! You've worked hard to understand this."}
or
{"isCorrect": false, "message": "Check the hints again — you're close!"}
      `.trim()
    }
  }

  if (step.validation.type === 'expression') {
    if (attemptCount === 0) {
      return `
You are validating a student's algebraic expression.

Question: "${step.prompt}"
Expected answer: "${step.validation.answer}"
Student's answer: "${userAnswer}"

This is their FIRST attempt.

Rules:
- Check if mathematically equivalent (accept "x+4", "4+x", "x + 4", "Thamarai's age = x + 4", etc.).
- If wrong, give BRIEF feedback only: "Not quite. Think about the relationship."
- Do NOT reveal the answer.
- Keep it to 1 sentence.

Respond ONLY with valid JSON:
{"isCorrect": true, "message": "Perfect!"}
or
{"isCorrect": false, "message": "Not quite. Think about the relationship between the ages."}
      `.trim()
    } else {
      return `
You are validating a student's algebraic expression.

Question: "${step.prompt}"
Expected answer: "${step.validation.answer}"
Student's answer: "${userAnswer}"

This is attempt ${attemptCount + 1}.

Rules:
- Check if mathematically equivalent.
- Accept variations like "Thamarai's age = x + 4", "x+4", "4+x", etc.
- If wrong, encourage using hints: "Not quite. The hints below can help guide you."
- Keep it brief.

Respond ONLY with valid JSON:
{"isCorrect": true, "message": "Excellent work!"}
or
{"isCorrect": false, "message": "Not quite. Check the hints below!"}
      `.trim()
    }
  }
}