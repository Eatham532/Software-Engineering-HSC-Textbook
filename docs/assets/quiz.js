(function(){
  // Debug flag: set window.__quiz_debug = false to silence logs
  window.__quiz_debug = false
  const QUIZ_DEBUG = typeof window !== 'undefined' && typeof window.__quiz_debug !== 'undefined' ? window.__quiz_debug : true;
  // Determine if a question (options list) is multi-select (more than one correct)
  function isMulti(question){
    const correctOptions = question.querySelectorAll('[data-correct]');
    return correctOptions.length > 1;
  }

  // Enhance Markdown-based quizzes: options are list items; mark selectable and handle input
  function enhanceMarkdownQuiz(container){
  // We'll only parse and strip markers on the option <li> elements, not on parent question <li>.
  const markerRe = /\{\s*data-correct\s*\}/g;
  const markerTestRe = /\{\s*data-correct\s*\}/; // non-global for reliable .test()

    // Questions are list items with a nested list of options
    const questions = container.querySelectorAll('ol > li');
    questions.forEach((q)=>{
      const optionsList = q.querySelector('ul, ol');
      if(!optionsList) return;
      // Wrap the question title (everything before the options list) in a dedicated element
      if(!q.querySelector('.q-title')){
        const nodes = [];
        for(const node of Array.from(q.childNodes)){
          if(node === optionsList) break;
          nodes.push(node);
        }
        if(nodes.length){
          const title = document.createElement('div');
          title.className = 'q-title';
          nodes.forEach(n=> title.appendChild(n));
          q.insertBefore(title, optionsList);
        }
      }
      q.setAttribute('data-question','');
      const multi = isMulti(optionsList);
      if(QUIZ_DEBUG) console.debug('quiz:found question', {questionText: q.textContent.split('\n')[0].trim(), multi});
      Array.from(optionsList.children).forEach((opt)=>{
        if(opt.tagName !== 'LI') return;
        if(opt.hasAttribute('data-quiz-opt')) return; // prevent duplicate binding on reinit
        // First, if the marker text is directly in this option, convert to attribute and strip marker
        if(markerTestRe.test(opt.innerHTML)){
          if(QUIZ_DEBUG) console.debug('quiz:marker found in option', opt.textContent.trim());
          opt.dataset.correct = '';
          opt.innerHTML = opt.innerHTML.replace(markerRe, '').trim();
        }
        // Hoist data-correct from any descendant (e.g., <p data-correct>) to the option <li>
        if(!opt.hasAttribute('data-correct')){
          const innerCorrect = opt.querySelector('[data-correct]');
          if(innerCorrect){ opt.setAttribute('data-correct',''); if(QUIZ_DEBUG) console.debug('quiz:hoisted data-correct to li', opt.textContent.trim()); }
        }
        opt.setAttribute('data-quiz-opt','');
        opt.tabIndex = 0;
        opt.setAttribute('role', multi ? 'checkbox' : 'radio');
        opt.setAttribute('aria-checked', 'false');
        opt.addEventListener('click', ()=>toggleOption(opt, multi));
        opt.addEventListener('keydown', (ev)=>{
          if(ev.key === ' ' || ev.key === 'Enter'){
            ev.preventDefault();
            toggleOption(opt, multi);
          }
        });
      });
    });
  }

  function toggleOption(opt, multi){
    const list = opt.parentElement;
    if(!multi){
      Array.from(list.children).forEach(li=>{
        if(li.tagName === 'LI'){
          li.classList.remove('selected');
          li.setAttribute('aria-checked','false');
        }
      });
    }
    const nowSelected = !opt.classList.contains('selected');
    opt.classList.toggle('selected', nowSelected);
    opt.setAttribute('aria-checked', nowSelected ? 'true' : 'false');
  if(QUIZ_DEBUG) console.debug('quiz:toggle', {text: opt.textContent.trim(), nowSelected, multi});
  }

  function grade(container){
    // Support both HTML-input quizzes and Markdown-enhanced quizzes
    let total = 0, correctCount = 0;
    const questions = container.querySelectorAll('[data-question]');
  if(QUIZ_DEBUG) console.debug('quiz:grade start', {questions: questions.length});
    questions.forEach((q)=>{
      total++;
      // Find the options list early so we can insert feedback right under the question title
      const optionsList = q.querySelector('ul, ol');
      const feedback = q.querySelector('.feedback') || (function(){
          const el = document.createElement('div');
          el.className = 'feedback';
          // Insert feedback before the options list so it sits under the question title
          if(optionsList){
            q.insertBefore(el, optionsList);
          } else {
            q.appendChild(el);
          }
          return el;
        })();

        // Clear previous markers
        q.querySelectorAll('.option-correct,.option-wrong').forEach(n=>n.classList.remove('option-correct','option-wrong'));
      feedback.textContent = '';
      feedback.classList.remove('is-correct','is-wrong');
        if(!optionsList) return;
      // Gather direct-child li nodes only
      const childLis = Array.from(optionsList.children).filter(n=>n.tagName==='LI');
      const markerTextRe = /\{\s*data-correct\s*\}/;
      const markerRe = /\{\s*data-correct\s*\}/g;
      const isLiCorrect = (li)=> li.hasAttribute('data-correct') || li.querySelector('[data-correct]') || li.querySelector('input[data-correct]') || markerTextRe.test(li.textContent);
  const isLiSelected = (li)=> li.classList.contains('selected') || !!li.querySelector('input:checked');
  const selected = childLis.filter(isLiSelected);
      let correctOptions = childLis.filter(isLiCorrect);
      // Fallback: if nothing looks correct, parse markers now and strip them
      if(correctOptions.length === 0){
        let touched = false;
        childLis.forEach(li=>{
          if(markerTextRe.test(li.innerHTML)){
            if(QUIZ_DEBUG) console.debug('quiz:fallback marker parse at grade', li.textContent.trim());
            li.setAttribute('data-correct','');
            li.innerHTML = li.innerHTML.replace(markerRe, '').trim();
            touched = true;
          }
        });
        if(touched){
          correctOptions = childLis.filter(isLiCorrect);
        }
      }
  if(QUIZ_DEBUG) console.debug('quiz:question state', {total, childLis: childLis.length, selected: selected.length, correct: correctOptions.length});

      // Mark selected options for visual feedback
      selected.forEach(li=>{
        const ok = isLiCorrect(li);
        li.classList.add(ok ? 'option-correct' : 'option-wrong');
        if(QUIZ_DEBUG) console.debug('quiz:selected', {text: li.textContent.trim(), ok});
      });

      // Determine correctness: sets must match (same count and all correct selected)
  const hasAnyCorrect = correctOptions.length > 0;
      let allMatch = true;
      for(const li of childLis){
        const shouldBeSelected = isLiCorrect(li);
        const isSel = isLiSelected(li);
        if(shouldBeSelected !== isSel){ allMatch = false; break; }
      }
      const isCorrect = hasAnyCorrect && allMatch;
  if(QUIZ_DEBUG) console.debug('quiz:grade result', {total, isCorrect});

      if(isCorrect){
        feedback.textContent = 'Correct';
        feedback.classList.add('is-correct');
        correctCount++;
      }else{
        feedback.textContent = 'Try again';
        feedback.classList.add('is-wrong');
      }
    });
    const score = container.querySelector('.quiz-score');
    if(score){ score.textContent = `${correctCount}/${total}`; }
  }

  function reset(container){
    // Clear selections for Markdown-enhanced quizzes
    container.querySelectorAll('li.selected').forEach(n=>{
      n.classList.remove('selected');
      n.setAttribute('aria-checked','false');
    });
    // Clear form inputs if present
    container.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(inp=>{
      inp.checked = false;
    });
    container.querySelectorAll('.option-correct,.option-wrong').forEach(n=>n.classList.remove('option-correct','option-wrong'));
    container.querySelectorAll('.feedback').forEach(n=>{ n.textContent=''; n.classList.remove('is-correct','is-wrong'); });
    const score = container.querySelector('.quiz-score');
    if(score){
      const total = countQuestions(container);
      score.textContent = `0/${total}`;
    }
  }

  function countQuestions(container){
    // Prefer elements flagged as data-question
    let qs = container.querySelectorAll('[data-question]');
    if(qs.length > 0) return qs.length;
    // Fallback: any ol > li that contains an inner list of options
    return Array.from(container.querySelectorAll('ol > li')).filter(li=> li.querySelector('ul, ol')).length;
  }

  function ensureControls(container){
    if(container.querySelector('.quiz-actions')) return;
    const actions = document.createElement('div');
    actions.className = 'quiz-actions';
    const gradeBtn = document.createElement('button');
    gradeBtn.className = 'md-button';
    gradeBtn.setAttribute('data-quiz-action','grade');
    gradeBtn.textContent = 'Check answers';
    const resetBtn = document.createElement('button');
    resetBtn.className = 'md-button md-button--secondary';
    resetBtn.setAttribute('data-quiz-action','reset');
    resetBtn.textContent = 'Reset';
  const score = document.createElement('span');
    score.className = 'quiz-score';
    score.setAttribute('aria-live','polite');
  // Initialize score with total question count
  const total = countQuestions(container);
  score.textContent = `0/${total}`;
    actions.appendChild(gradeBtn);
    actions.appendChild(resetBtn);
    actions.appendChild(score);
    container.appendChild(actions);
  }

  function init(){
    document.querySelectorAll('.quiz, .admonition.quiz').forEach(container=>{
      enhanceMarkdownQuiz(container);
      ensureControls(container);
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Document already loaded
    init();
  }
  if(window.document$){
    window.document$.subscribe(() => { init(); });
  }

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-quiz-action]');
    if(!btn) return;
    const container = btn.closest('.quiz, .admonition.quiz');
    if(!container) return;
    const act = btn.getAttribute('data-quiz-action');
    if(act==='grade'){ e.preventDefault(); grade(container); }
    if(act==='reset'){ e.preventDefault(); reset(container); }
  });
})();
