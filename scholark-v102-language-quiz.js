(() => {
  if (window.__SCHOLARK_V102_LANGUAGE_QUIZ__) return;
  window.__SCHOLARK_V102_LANGUAGE_QUIZ__ = true;

  const VERSION = '20260916-language-choice-v2';
  const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();
  const key = value => clean(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/^[a-d]\s*[\).:\-]\s*/i, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

  let observer = null;

  function correctChoice(choice, answer) {
    const c = key(choice);
    const a = key(answer);
    if (!c || !a) return false;
    if (c === a) return true;
    if (a.length > 2 && (a === `the correct answer is ${c}` || a === `correct answer ${c}`)) return true;
    if (c.length > 2 && (a.endsWith(` ${c}`) || a.startsWith(`${c} `))) return true;
    return false;
  }

  function feedbackHost(exercise) {
    let host = exercise.querySelector('.v102-choice-feedback');
    if (host) return host;
    host = document.createElement('div');
    host.className = 'v102-choice-feedback';
    host.setAttribute('aria-live', 'polite');
    const actions = exercise.querySelector('.v93-actions');
    exercise.insertBefore(host, actions || null);
    return host;
  }

  function answerText(exercise) {
    const box = exercise.querySelector('[data-v93-answer-box]');
    const firstAi = box?.querySelector('.v93-ai');
    if (firstAi) return clean(firstAi.textContent);
    const raw = clean(box?.textContent || '');
    return clean(raw.replace(/^Answer:\s*/i, '').split(/\bWhy:\s*/i)[0]);
  }

  function lockChoices(exercise) {
    exercise.querySelectorAll('.v93-choice').forEach(choice => {
      choice.setAttribute('aria-disabled', 'true');
      choice.setAttribute('tabindex', '-1');
      choice.classList.add('v102-locked');
      if (choice instanceof HTMLButtonElement) choice.disabled = true;
    });
  }

  function revealCorrect(exercise) {
    const answer = answerText(exercise);
    exercise.querySelectorAll('.v93-choice').forEach(choice => {
      if (correctChoice(choice.textContent, answer)) choice.classList.add('v102-correct');
    });
  }

  function choose(exercise, choice) {
    if (!exercise || !choice) return;
    if (exercise.dataset.v102Solved === '1' || choice.getAttribute('aria-disabled') === 'true') return;

    const answer = answerText(exercise);
    const feedback = feedbackHost(exercise);
    const right = correctChoice(choice.textContent, answer);
    window.dispatchEvent(new CustomEvent('scholark:language-choice',{detail:{correct:right,choice:clean(choice.textContent),answer,at:Date.now()}}));

    choice.classList.add('v102-selected');
    choice.setAttribute('aria-pressed', 'true');

    if (right) {
      exercise.dataset.v102Solved = '1';
      choice.classList.add('v102-correct');
      feedback.className = 'v102-choice-feedback correct';
      feedback.textContent = '✓ Correct';
      lockChoices(exercise);

      const box = exercise.querySelector('[data-v93-answer-box]');
      const answerButton = exercise.querySelector('[data-v93-answer]');
      if (box) box.classList.add('open');
      if (answerButton) answerButton.textContent = 'Hide explanation';
      return;
    }

    choice.classList.add('v102-incorrect');
    choice.setAttribute('aria-disabled', 'true');
    choice.setAttribute('tabindex', '-1');
    if (choice instanceof HTMLButtonElement) choice.disabled = true;
    feedback.className = 'v102-choice-feedback incorrect';
    feedback.textContent = 'Not quite — try another answer.';
  }

  function toButton(choice, index) {
    if (choice instanceof HTMLButtonElement) {
      choice.type = 'button';
      return choice;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = choice.className;
    button.innerHTML = choice.innerHTML;
    for (const attr of choice.attributes) {
      if (attr.name === 'class') continue;
      button.setAttribute(attr.name, attr.value);
    }
    button.dataset.v102Choice = String(index);
    choice.replaceWith(button);
    return button;
  }

  function decorateExercise(exercise) {
    let choices = [...exercise.querySelectorAll('.v93-choice')];
    if (!choices.length) return;

    choices = choices.map((choice, index) => toButton(choice, index));
    exercise.dataset.v102Quiz = '1';

    choices.forEach((choice, index) => {
      choice.dataset.v102Choice = String(index);
      choice.setAttribute('aria-pressed', choice.getAttribute('aria-pressed') || 'false');
      choice.setAttribute('aria-label', `Choose ${clean(choice.textContent)}`);
      if (!choice.hasAttribute('tabindex')) choice.setAttribute('tabindex', '0');
    });

    const answerButton = exercise.querySelector('[data-v93-answer]');
    if (answerButton && answerButton.dataset.v102RevealBound !== '1') {
      answerButton.dataset.v102RevealBound = '1';
      answerButton.addEventListener('click', () => setTimeout(() => {
        const box = exercise.querySelector('[data-v93-answer-box]');
        if (!box?.classList.contains('open')) return;
        exercise.dataset.v102Solved = '1';
        revealCorrect(exercise);
        lockChoices(exercise);
        const feedback = feedbackHost(exercise);
        if (!feedback.textContent) {
          feedback.className = 'v102-choice-feedback revealed';
          feedback.textContent = 'Answer revealed';
        }
      }, 0));
    }
  }

  function decorate(root = document) {
    if (root.matches?.('.v93-exercise')) decorateExercise(root);
    root.querySelectorAll?.('.v93-exercise').forEach(decorateExercise);
  }

  function choiceFromEvent(event) {
    const choice = event.target?.closest?.('.v93-choice');
    if (!choice) return null;
    const exercise = choice.closest('.v93-exercise');
    if (!exercise) return null;
    return { choice, exercise };
  }

  function onChoiceClick(event) {
    const hit = choiceFromEvent(event);
    if (!hit) return;
    if (!String(location.hash || '').toLowerCase().startsWith('#language')) return;
    event.preventDefault();
    event.stopPropagation();
    choose(hit.exercise, hit.choice);
  }

  function onChoiceKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const hit = choiceFromEvent(event);
    if (!hit) return;
    if (!String(location.hash || '').toLowerCase().startsWith('#language')) return;
    event.preventDefault();
    event.stopPropagation();
    choose(hit.exercise, hit.choice);
  }

  function stopWatching() {
    observer?.disconnect();
    observer = null;
  }

  function startWatching() {
    if (!String(location.hash || '').toLowerCase().startsWith('#language')) {
      stopWatching();
      return;
    }
    decorate(document);
    if (observer) return;
    observer = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          decorate(node);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (!document.getElementById('scholark-v102-language-quiz-style')) {
    const style = document.createElement('style');
    style.id = 'scholark-v102-language-quiz-style';
    style.textContent = `
      .v93-choice{appearance:none;-webkit-appearance:none;display:inline-flex!important;align-items:center;justify-content:center;border:1px solid rgba(89,77,204,.10)!important;cursor:pointer!important;pointer-events:auto!important;position:relative;z-index:2;user-select:none;transition:transform .14s ease,background .14s ease,border-color .14s ease,box-shadow .14s ease;color:#29263a;outline:none;font:750 7.5px Inter,system-ui;padding:7px 9px;border-radius:9px;background:#f0eff7}
      .v93-choice:hover:not(.v102-locked):not(:disabled){background:#e8e4ff!important;border-color:rgba(89,77,204,.28)!important;transform:translateY(-1px)}
      .v93-choice:active:not(.v102-locked):not(:disabled){transform:translateY(0) scale(.98)}
      .v93-choice:focus-visible{box-shadow:0 0 0 3px rgba(109,93,252,.18);border-color:#6d5dfc!important}
      .v93-choice.v102-selected{border-color:#6d5dfc!important;background:#efedff!important}
      .v93-choice.v102-correct{background:#e9ffd9!important;border-color:#73b743!important;color:#285c16!important;box-shadow:0 0 0 2px rgba(115,183,67,.08)}
      .v93-choice.v102-incorrect{background:#fff0f0!important;border-color:#e57c7c!important;color:#9b3030!important}
      .v93-choice.v102-locked,.v93-choice:disabled{cursor:default!important;opacity:1}
      .v102-choice-feedback{min-height:0;margin-top:8px;font:850 8px/1.45 Inter,system-ui}
      .v102-choice-feedback.correct{color:#34751d}.v102-choice-feedback.incorrect{color:#a43a3a}.v102-choice-feedback.revealed{color:#6257c6}
    `;
    document.head.appendChild(style);
  }

  window.addEventListener('click', onChoiceClick, true);
  window.addEventListener('keydown', onChoiceKeydown, true);
  addEventListener('hashchange', () => setTimeout(startWatching, 20));
  addEventListener('pageshow', () => setTimeout(startWatching, 20));
  setTimeout(startWatching, 120);

  window.__SCHOLARK_V102_LANGUAGE_QUIZ_API__ = {
    version: VERSION,
    decorate: () => decorate(document),
    choose: (choice) => {
      const exercise = choice?.closest?.('.v93-exercise');
      if (exercise) choose(exercise, choice);
    }
  };
})();