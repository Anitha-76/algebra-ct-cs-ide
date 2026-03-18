// Local validation — fast, free, no API call needed

export function validateLocal(step, userAnswer) {
  const { validation } = step

  if (!userAnswer || userAnswer.trim().length === 0) {
    return { isCorrect: false, message: 'Please enter an answer.' }
  }

  if (validation.type === 'exact') {
    const isCorrect =
      String(userAnswer).trim().toLowerCase() ===
      String(validation.answer).trim().toLowerCase()

    return {
      isCorrect,
      message: isCorrect ? validation.successMessage : validation.hintMessage
    }
  }

  return { isCorrect: false, message: 'Unknown validation type.' }
}