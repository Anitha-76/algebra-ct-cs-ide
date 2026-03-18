import './style.css'
import { makeEmbed } from "@ironm00n/pyret-embed/api";

let calculator = null;

function ensureDesmos() {
  if (calculator) return calculator;
  const elt = document.getElementById('desmos');
  if (!elt) return null;
  calculator = Desmos.GraphingCalculator(elt, {
    expressions: true,
    settingsMenu: true
  });
  
  // THIS AUTO-LOADS THE GRAPH
  calculator.setExpression({ id: 'expr', latex: 'y=x+4', color: '#2E7D32' });
  
  // THIS ADDS THE SLIDER
  calculator.setExpression({ 
    id: 'slider', 
    latex: 'x=10',
    sliderBounds: { min: 0, max: 20, step: 1 }
  });
  
  return calculator;
}

const tabs = Array.from(document.querySelectorAll('[role="tab"]'))
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'))

let pyretEmbed = null;

async function ensurePyret() {
  if (pyretEmbed) return pyretEmbed;
  const container = document.getElementById("pyret");
  if (!container) return null;
  pyretEmbed = await makeEmbed("pyret-1", container);
  pyretEmbed.sendReset({
    editorContents: "use context starter2024\n\n# Lesson 1A: Ages\nfun older-by-4(x): x + 4 end\n\ncheck:\n  older-by-4(10) is 14\nend",
    replContents: "",
    definitionsAtLastRun: "",
    interactionsSinceLastRun: [],
  });
  return pyretEmbed;
}

function activateTab(tab) {
  tabs.forEach(t => {
    const selected = t === tab
    t.setAttribute('aria-selected', selected ? 'true' : 'false')
    t.tabIndex = selected ? 0 : -1
  })
  
  const idToShow = tab.getAttribute('aria-controls')
  panels.forEach(p => {
    if (p.id === idToShow) p.removeAttribute('hidden')
    else p.setAttribute('hidden', 'true')
  })
  
  if (tab.id === 'tab-desmos') {
    ensureDesmos()
  }
  
  if (tab.id === "tab-pyret") {
    ensurePyret();
  }
}

tabs.forEach(t => t.addEventListener('click', () => activateTab(t)))
activateTab(document.getElementById('tab-task'))

const btnSave = document.getElementById('btn-save')
const btnLoad = document.getElementById('btn-load')

btnSave.addEventListener('click', () => {
  const calc = ensureDesmos()
  if (!calc) return
  localStorage.setItem('desmos_state_lesson1', JSON.stringify(calc.getState()))
})

btnLoad.addEventListener('click', () => {
  const calc = ensureDesmos()
  if (!calc) return
  const raw = localStorage.getItem('desmos_state_lesson1')
  if (!raw) return
  calc.setState(JSON.parse(raw))
})

// ============================================
// INQUIRY-BASED TASK VALIDATION
// ============================================

window.addEventListener('load', () => {
  const btn1 = document.getElementById('btn-step1');
  if (btn1) btn1.addEventListener('click', checkStep1);
});

function checkStep1() {
  const answer = document.getElementById('answer-1').value.toLowerCase();
  const feedback = document.getElementById('feedback-1');
  
  if (answer.length < 5) {
    feedback.className = 'feedback feedback-error';
    feedback.textContent = 'Please provide a more complete explanation.';
    return;
  }
  
  const keywords = ['4', 'more', 'add', 'years', 'plus', 'older'];
  const hasKeyword = keywords.some(kw => answer.includes(kw));
  
  if (hasKeyword) {
    feedback.className = 'feedback feedback-success';
    feedback.textContent = '✓ Good explanation! You understand the relationship.';
    
    setTimeout(() => {
      document.getElementById('progress-1').classList.add('completed');
      document.getElementById('progress-2').classList.add('active');
      
      const step1 = document.getElementById('step-1');
      step1.classList.add('hidden');
      step1.style.display = 'none';
      
      const step2 = document.getElementById('step-2');
      step2.classList.remove('hidden');
      step2.style.display = 'block';
      
      const btn2a = document.getElementById('btn-step2a');
      if (btn2a) btn2a.addEventListener('click', checkStep2a);
    }, 1500);
  } else {
    feedback.className = 'feedback feedback-error';
    feedback.textContent = '💡 Hint: Think about how many more years Thamarai has lived compared to Selvi.';
  }
}

function checkStep2a() {
  const answer = document.getElementById('answer-2a').value;
  const feedback = document.getElementById('feedback-2a');
  
  if (answer === '14') {
    feedback.className = 'feedback feedback-success';
    feedback.textContent = '✓ Correct! Thamarai is 14 years old.';
    
    setTimeout(() => {
      const container = document.getElementById('step-2b-container');
      container.classList.remove('hidden');
      container.style.display = 'block';
      
      const btn2b = document.getElementById('btn-step2b');
      if (btn2b) btn2b.addEventListener('click', checkStep2b);
    }, 1000);
  } else {
    feedback.className = 'feedback feedback-error';
    feedback.textContent = '❌ Not quite. If Thamarai is 4 years older than Selvi, and Selvi is 10, what would Thamarai\'s age be?';
  }
}

function checkStep2b() {
  const answer = document.getElementById('answer-2b').value.toLowerCase();
  const feedback = document.getElementById('feedback-2b');
  
  if (answer.length < 5) {
    feedback.className = 'feedback feedback-error';
    feedback.textContent = 'Please explain how you calculated it.';
    return;
  }
  
  const keywords = ['add', 'plus', '10', '4', '14'];
  const hasKeyword = keywords.some(kw => answer.includes(kw));
  
  if (hasKeyword) {
    feedback.className = 'feedback feedback-success';
    feedback.textContent = '✓ Great! You identified the operation.';
    
    setTimeout(() => {
      document.getElementById('progress-2').classList.add('completed');
      document.getElementById('progress-3').classList.add('active');
      
      const step2 = document.getElementById('step-2');
      step2.classList.add('hidden');
      step2.style.display = 'none';
      
      const step3 = document.getElementById('step-3');
      step3.classList.remove('hidden');
      step3.style.display = 'block';
      
      const btn3 = document.getElementById('btn-step3');
      if (btn3) btn3.addEventListener('click', checkStep3);
    }, 1500);
  } else {
    feedback.className = 'feedback feedback-error';
    feedback.textContent = '💡 Hint: What did you do to 10 to get 14?';
  }
}

function checkStep3() {
  const selected = document.querySelector('input[name="operation"]:checked');
  const feedback = document.getElementById('feedback-3');
  
  if (!selected) {
    feedback.className = 'feedback feedback-error';
    feedback.textContent = 'Please select an operation.';
    return;
  }
  
  if (selected.value === 'addition') {
    feedback.className = 'feedback feedback-success';
    feedback.textContent = '✓ Exactly! We\'re adding 4 to Selvi\'s age.';
    
    setTimeout(() => {
      document.getElementById('progress-3').classList.add('completed');
      document.getElementById('progress-4').classList.add('active');
      
      const step3 = document.getElementById('step-3');
      step3.classList.add('hidden');
      step3.style.display = 'none';
      
      const step4 = document.getElementById('step-4');
      step4.classList.remove('hidden');
      step4.style.display = 'block';
      
      const btn4a = document.getElementById('btn-step4a');
      if (btn4a) btn4a.addEventListener('click', checkStep4a);
    }, 1500);
  } else {
    feedback.className = 'feedback feedback-error';
    feedback.textContent = '❌ Think about what you did in the previous step. Did you add, subtract, multiply, or divide?';
  }
}

function checkStep4a() {
  const answer = document.getElementById('answer-4a').value.toLowerCase();
  const feedback = document.getElementById('feedback-4a');
  
  if (answer.includes('selvi')) {
    feedback.className = 'feedback feedback-success';
    feedback.textContent = '✓ Perfect! x represents Selvi\'s age.';
    
    setTimeout(() => {
      const container = document.getElementById('step-4b-container');
      container.classList.remove('hidden');
      container.style.display = 'block';
      
      const btn4b = document.getElementById('btn-step4b');
      if (btn4b) btn4b.addEventListener('click', checkStep4b);
    }, 1000);
  } else {
    feedback.className = 'feedback feedback-error';
    feedback.textContent = '💡 Hint: Whose age is changing? What are we trying to find?';
  }
}

function checkStep4b() {
  const answer = document.getElementById('answer-4b').value.replace(/\s/g, '').toLowerCase();
  const feedback = document.getElementById('feedback-4b');
  
  const validAnswers = ['x+4', '4+x'];
  const isCorrect = validAnswers.includes(answer);
  
  if (isCorrect) {
    feedback.className = 'feedback feedback-success';
    feedback.textContent = '✓ Excellent! You\'ve created the algebraic expression: x + 4';
    
    setTimeout(() => {
      document.getElementById('progress-4').classList.add('completed');
      
      const step4 = document.getElementById('step-4');
      step4.classList.add('hidden');
      step4.style.display = 'none';
      
      const completion = document.getElementById('completion');
      completion.classList.remove('hidden');
      completion.style.display = 'block';
    }, 1500);
  } else {
    feedback.className = 'feedback feedback-error';
    feedback.textContent = '❌ Remember: Thamarai is 4 years older than Selvi. If Selvi\'s age is x, what expression represents being 4 years older?';
  }
}