// ===========================================================
// PromptNest — Prompt Generator Logic
// ===========================================================

// Grab all the elements we'll need to work with
const modeTabs = document.querySelectorAll('.mode-tab');
const subjectInput = document.getElementById('subject-input');
const styleSelect = document.getElementById('style-select');
const toneSelect = document.getElementById('tone-select');
const generateBtn = document.getElementById('generate-btn');
const outputWrap = document.getElementById('output-wrap');
const outputText = document.getElementById('output-text');
const copyBtn = document.getElementById('copy-btn');
const copyConfirm = document.getElementById('copy-confirm');

// Current mode: "image" or "chat"
let currentMode = 'image';

// Dropdown options for each mode
const styleOptions = {
  image: ['Photorealistic', 'Digital Art', 'Watercolor', 'Anime', '3D Render', 'Minimalist', 'Cinematic', 'Fantasy'],
  chat: ['Professional', 'Friendly & Casual', 'Academic', 'Persuasive', 'Step-by-step Guide', 'Creative/Storytelling']
};

const toneOptions = {
  image: ['Simple', 'Detailed', 'Highly Detailed'],
  chat: ['Brief', 'Detailed', 'In-depth with examples']
};

// Fill the Style and Detail-level dropdowns based on current mode
function populateDropdowns() {
  styleSelect.innerHTML = '';
  toneSelect.innerHTML = '';

  styleOptions[currentMode].forEach(option => {
    const el = document.createElement('option');
    el.value = option;
    el.textContent = option;
    styleSelect.appendChild(el);
  });

  toneOptions[currentMode].forEach(option => {
    const el = document.createElement('option');
    el.value = option;
    el.textContent = option;
    toneSelect.appendChild(el);
  });
}

// Run once on page load so dropdowns aren't empty
populateDropdowns();

// Handle clicking the Image / Chat mode tabs
modeTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // Update which tab looks "active"
    modeTabs.forEach(t => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');

    // Update current mode and refresh dropdowns for it
    currentMode = tab.dataset.mode;
    populateDropdowns();

    // Hide any previous output when switching modes
    outputWrap.classList.add('is-hidden');
  });
});

// Small helper: pick a random item from an array
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Build an image-generation prompt from the user's inputs
function buildImagePrompt(subject, style, detail) {
  const compositions = [
    'rule-of-thirds composition', 'centered symmetrical composition',
    'dynamic low-angle shot', 'wide establishing shot', 'close-up framing'
  ];
  const lighting = [
    'golden hour lighting', 'soft diffused studio lighting',
    'dramatic chiaroscuro lighting', 'natural overcast daylight', 'moody ambient lighting'
  ];
  const detailPhrases = {
    'Simple': 'clean, uncluttered composition',
    'Detailed': 'rich texture detail, balanced color palette, high resolution',
    'Highly Detailed': 'ultra-detailed textures, intricate fine detail, sharp focus, 8k resolution, professional quality'
  };
  const cameraHints = [
    'shot on 85mm lens, shallow depth of field',
    'shot on DSLR, f/1.8 aperture',
    'macro lens detail, crisp focus'
  ];

  let parts = [
    subject,
    `${style.toLowerCase()} style`,
    pickRandom(compositions),
    pickRandom(lighting),
    detailPhrases[detail]
  ];

  // Add a camera hint only when it makes sense for the style
  if (style === 'Photorealistic' || style === 'Cinematic') {
    parts.push(pickRandom(cameraHints));
  }

  return parts.join(', ');
}

// Build a chat/writing prompt using a Role → Task → Format structure
function buildChatPrompt(subject, style, detail) {
  const roleIntros = {
    'Professional': 'You are an experienced consultant with deep subject-matter expertise.',
    'Friendly & Casual': 'You are a knowledgeable friend explaining things in a relaxed, approachable way.',
    'Academic': 'You are a scholarly expert who writes with formal precision and well-structured reasoning.',
    'Persuasive': 'You are a skilled persuasive writer whose goal is to convince the reader.',
    'Step-by-step Guide': 'You are an instructor who breaks complex tasks into clear, actionable steps.',
    'Creative/Storytelling': 'You are a creative writer who uses narrative and vivid imagery.'
  };

  const formatByDetail = {
    'Brief': 'Keep your response short and to the point — no more than a few sentences.',
    'Detailed': 'Provide a well-organized, thorough response with clear explanations.',
    'In-depth with examples': 'Go in-depth, structure your response with headings if helpful, and include at least one concrete example for each key point.'
  };

  return `${roleIntros[style]} Task: ${subject}. ${formatByDetail[detail]}`;
}

// Handle clicking "Generate Prompt"
generateBtn.addEventListener('click', () => {
  const subject = subjectInput.value.trim();

  if (!subject) {
    subjectInput.focus();
    subjectInput.style.borderColor = '#9C3F52';
    return;
  }
  subjectInput.style.borderColor = '';

  const style = styleSelect.value;
  const detail = toneSelect.value;

  let result;
  if (currentMode === 'image') {
    result = buildImagePrompt(subject, style, detail);
  } else {
    result = buildChatPrompt(subject, style, detail);
  }

  outputText.textContent = result;
  outputWrap.classList.remove('is-hidden');
  copyConfirm.classList.add('is-hidden');
});

// Handle clicking "Copy prompt"
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(outputText.textContent).then(() => {
    copyConfirm.classList.remove('is-hidden');
    setTimeout(() => copyConfirm.classList.add('is-hidden'), 2000);
  });
});

// Auto-fill the footer copyright year
document.getElementById('year').textContent = new Date().getFullYear();