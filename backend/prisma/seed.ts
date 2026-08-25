import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const promptChapters = [
  {
    title: 'What a prompt really is',
    reward: 20,
    paras: [
      "A prompt is the instruction you give an AI. It's the single biggest lever you control: the same model gives a vague, risky answer to a vague prompt and a sharp, useful one to a well-built prompt.",
      "Prompt engineering isn't a trick. It's the habit of telling the model exactly who to be, what to do, what to work from, and what shape you want back.",
    ],
    key: "The prompt is your steering wheel. Better instructions, better output — from the very same model.",
    quiz: [
      {
        q: "Why does prompt quality matter so much?",
        opts: [
          "Better prompts unlock a smarter model",
          "The same model gives far better output to a clearer prompt",
          "It changes what the model was trained on",
        ],
        correct: 1,
        explain:
          "The model is fixed. Your instruction is what changes — and it changes the answer dramatically.",
      },
      {
        q: "Prompt engineering is best described as…",
        opts: [
          "A secret hack to bypass limits",
          "The habit of giving clear, complete instructions",
          "Something only engineers can do",
        ],
        correct: 1,
        explain:
          "It's a communication skill: telling the model who to be, the task, the material, and the format.",
      },
    ],
  },
  {
    title: 'Give it a role',
    reward: 20,
    paras: [
      "Start by telling the model who to be. 'You are a hospitalist writing for a covering colleague' shifts its vocabulary, depth, and priorities toward that lens.",
      "A role focuses the model. Without one it writes for a generic average reader; with one it writes for yours.",
    ],
    key: "Naming a role — who the model is, and who it's writing for — focuses everything that follows.",
    quiz: [
      {
        q: "What does assigning a role do?",
        opts: [
          "Speeds up the response",
          "Shifts vocabulary, depth and priorities to that lens",
          "Makes the answer longer",
        ],
        correct: 1,
        explain:
          "A persona reframes the whole answer toward that role's knowledge and audience.",
      },
      {
        q: "Best role line for a patient leaflet?",
        opts: [
          "'You are an AI'",
          "'You are a nurse explaining to a patient with no medical background'",
          "'Answer well'",
        ],
        correct: 1,
        explain:
          "It names both the persona and the audience, which is what steers tone and level.",
      },
    ],
  },
  {
    title: 'State the task and give context',
    reward: 20,
    paras: [
      "Name the one job precisely — 'summarise the overnight events', not 'help with this patient'. One clear task beats a vague request every time.",
      "Then give it the material and the setting to work from: the notes, the result, 'post-op day 2'. The model can only use what you put in front of it.",
    ],
    key: "One precise task + the actual material it needs. Don't make the model guess either.",
    quiz: [
      {
        q: "Which is the stronger task instruction?",
        opts: [
          "'Help me with this patient'",
          "'Summarise the overnight events in 5 bullets'",
          "'Do your best'",
        ],
        correct: 1,
        explain:
          "It names one job and its shape — the model knows exactly what to produce.",
      },
      {
        q: "Why include context like the chart or 'post-op day 2'?",
        opts: [
          "It's polite",
          "The model can only reason from what you give it",
          "It makes the prompt longer",
        ],
        correct: 1,
        explain: "Context is the raw material. Without it the model fills gaps by guessing.",
      },
    ],
  },
  {
    title: 'Specify format and constraints',
    reward: 25,
    paras: [
      "Tell it the shape and length you want: 'five bullets, plain language, under 80 words'. Format is the difference between something you can use at a glance and a wall of text.",
      "Then set the guardrails: 'flag anything you're unsure of', 'do not invent values'. Constraints are where safety lives in a prompt.",
    ],
    key: "Format controls usefulness; constraints control safety. Always set both for clinical work.",
    quiz: [
      {
        q: "What does specifying format achieve?",
        opts: [
          "A prettier answer",
          "Output you can actually use at a glance",
          "Nothing important",
        ],
        correct: 1,
        explain:
          "Shape and length decide whether the output fits your workflow or has to be reworked.",
      },
      {
        q: "Which is a safety constraint?",
        opts: [
          "'Make it friendly'",
          "'Do not invent values; flag anything uncertain'",
          "'Use bullet points'",
        ],
        correct: 1,
        explain:
          "It stops the model fabricating and surfaces its uncertainty — the safety guardrail.",
      },
    ],
  },
  {
    title: 'Zero-shot vs few-shot',
    reward: 25,
    paras: [
      "Zero-shot is just asking, with no examples — fast and fine for simple, common tasks the model has seen endlessly.",
      "Few-shot means showing one or two worked examples of the output you want. The model copies the pattern, which is the best way to lock a house style or a fixed layout.",
    ],
    key: "No example = zero-shot (simple tasks). Show examples = few-shot (house style, fixed format).",
    quiz: [
      {
        q: "When is few-shot most useful?",
        opts: [
          "For very simple questions",
          "When you need a specific format or house style",
          "When you want a faster reply",
        ],
        correct: 1,
        explain:
          "Examples teach the exact pattern you want repeated — ideal for consistent layouts.",
      },
      {
        q: "Zero-shot means…",
        opts: [
          "Asking with no examples",
          "Asking zero questions",
          "Turning the model off",
        ],
        correct: 0,
        explain: "Zero-shot is a plain request with no worked examples attached.",
      },
    ],
  },
  {
    title: 'Ask it to reason (chain-of-thought)',
    reward: 25,
    paras: [
      "For anything with a 'why', ask the model to reason step by step before giving its answer. This surfaces the logic so you can check each step instead of trusting a bare conclusion.",
      "Seeing the reasoning is also how you catch a wrong turn early — the mistake usually shows up in a step, not just the final line.",
    ],
    key: "Ask for step-by-step reasoning on anything non-trivial, so you can verify the logic, not just the answer.",
    quiz: [
      {
        q: "Why ask for step-by-step reasoning?",
        opts: [
          "It looks thorough",
          "It surfaces the logic so you can check it",
          "It makes the model smarter",
        ],
        correct: 1,
        explain:
          "Visible steps let you verify the path, and spot where a wrong answer went off.",
      },
      {
        q: "Chain-of-thought is most useful for…",
        opts: [
          "A one-word lookup",
          "A question with a 'why' or several steps",
          "Saying hello",
        ],
        correct: 1,
        explain:
          "Multi-step or reasoned questions benefit most from showing the working.",
      },
    ],
  },
  {
    title: 'Iterate — and always verify',
    reward: 30,
    paras: [
      "Your first prompt is a draft. Read the output, see what's off, and refine: tighten the task, add a constraint, give an example. Two or three passes usually gets there.",
      "And the golden rule: a great prompt lowers the error rate, it never removes it. Every AI draft still goes through input → AI draft → your review → verify → sign-off.",
    ],
    key: "Prompting is iterative, and it never replaces verification. AI drafts; you decide.",
    quiz: [
      {
        q: "A strong prompt means you can…",
        opts: [
          "Skip checking the output",
          "Trust it fully",
          "Still must verify before you use it",
        ],
        correct: 2,
        explain:
          "Good prompting improves the odds — it never removes the need to verify and sign off.",
      },
      {
        q: "The safe workflow always ends with…",
        opts: [
          "Copy and paste",
          "Your review, verification and sign-off",
          "Sending it straight to the patient",
        ],
        correct: 1,
        explain:
          "Input → AI draft → review → verify → sign-off. Your judgment is the final word.",
      },
    ],
  },
];

const hallChapters = [
  {
    title: 'What a language model actually is',
    reward: 20,
    paras: [
      "An AI like ChatGPT or Claude is a language model. It was trained by reading an enormous amount of text and learning one narrow skill extremely well: predicting the next word.",
      "It does not have a database of facts it looks things up in. It has patterns. When you ask a question, it generates a reply word by word, each one the most statistically likely continuation of what came before.",
    ],
    key: "The model predicts plausible text. It was never built to store or check facts.",
    quiz: [
      {
        q: "When you ask a medical model a question, what is it fundamentally doing?",
        opts: [
          "Searching a verified medical database",
          "Predicting the most likely next words",
          "Reasoning from first principles like a clinician",
        ],
        correct: 1,
        explain:
          "It generates the most probable continuation. Plausibility, not truth, is what it optimises for.",
      },
      {
        q: "Does the model store facts it looks up?",
        opts: [
          "Yes, like a search engine",
          "No — it holds patterns, not a fact database",
          "Only for medicine",
        ],
        correct: 1,
        explain:
          "It has statistical patterns, not a lookup table of verified facts.",
      },
    ],
  },
  {
    title: 'Tokens: how it reads and writes',
    reward: 20,
    paras: [
      "The model doesn't see whole words. Text is broken into 'tokens' — chunks of characters — and it predicts one token at a time.",
      "This is why it can split a drug name oddly, miscount, or mangle an unusual abbreviation: the pieces it works with aren't the units a clinician thinks in.",
    ],
    key: "Everything is tokens. Odd splits explain many small, confident errors.",
    quiz: [
      {
        q: "Why can a model garble an unusual drug abbreviation?",
        opts: [
          "It ran out of memory",
          "It works in tokens, not clinical concepts",
          "It was never shown any drug names",
        ],
        correct: 1,
        explain:
          "Tokenisation chops text into fragments that don't match clinical units, so rare terms fracture.",
      },
    ],
  },
  {
    title: 'Training data and the cutoff',
    reward: 20,
    paras: [
      "A model only knows what was in its training data, and that data has a cutoff date. Anything published after it is invisible to the model.",
      "So a guideline that changed last month, or a drug approved this year, simply doesn't exist in its world — yet it will still answer as if it does.",
    ],
    key: "No knowledge after the cutoff. 'Current' from a model may be out of date.",
    quiz: [
      {
        q: "A model cites the 'latest' guideline. What must you check?",
        opts: [
          "That it sounds authoritative",
          "The version and date against the issuing body",
          "Whether it used formal language",
        ],
        correct: 1,
        explain:
          "Its knowledge stops at a date. Always confirm the guideline version at the source.",
      },
    ],
  },
  {
    title: 'What "hallucination" really means',
    reward: 25,
    paras: [
      "A hallucination is when the model produces something fluent, specific, and completely made up — a fake citation, an invented statistic, a dose that doesn't exist.",
      "It isn't lying. It has no concept of true or false. It's filling a gap with the most likely-looking text, and sometimes the most likely-looking text is fiction.",
    ],
    key: "A hallucination is confident invention, not a deliberate lie.",
    quiz: [
      {
        q: "Why does a model hallucinate a citation that looks perfect?",
        opts: [
          "It's trying to deceive you",
          "It has learned what citations look like, not which are real",
          "The citation was corrupted in transit",
        ],
        correct: 1,
        explain:
          "It reproduces the shape of a citation. The format is learned; the existence is not.",
      },
    ],
  },
  {
    title: 'Why it always sounds so sure',
    reward: 25,
    paras: [
      "The model's tone is generated the same way as its content — by predicting confident-sounding text. It has no internal signal that says 'I'm unsure here.'",
      "So a correct answer and a hallucinated one arrive with exactly the same certainty. Fluency is not a measure of accuracy.",
    ],
    key: "Confidence is a writing style, not a truth signal.",
    quiz: [
      {
        q: "What does a model's confident tone tell you about accuracy?",
        opts: [
          "It's probably correct",
          "Nothing — tone and truth are unrelated",
          "It double-checked the answer",
        ],
        correct: 1,
        explain:
          "Tone is generated like everything else. Certainty and correctness are unrelated.",
      },
    ],
  },
  {
    title: 'Prompts steer the prediction',
    reward: 25,
    paras: [
      "Because it predicts from context, the words you give it shape what comes out. Vague prompts pull vague, generic, error-prone text.",
      "Give it role, constraints, and examples and you steer it toward better predictions — but steering reduces error, it never removes the need to verify.",
    ],
    key: "Better prompts lower the error rate; they don't remove it.",
    quiz: [
      {
        q: "What does a clearer, more specific prompt do?",
        opts: [
          "Guarantees a correct answer",
          "Improves the odds of a useful answer",
          "Lets you skip verification",
        ],
        correct: 1,
        explain:
          "Good prompting shifts the odds toward useful output. Verification is still required.",
      },
    ],
  },
  {
    title: 'Retrieval and grounding',
    reward: 30,
    paras: [
      "Some tools 'ground' the model by feeding it real documents to answer from — retrieval. This cuts hallucination sharply because the answer is pulled from a source, not invented.",
      "But grounding is only as good as the source and can still be misread. A cited source means check the source, not trust it blindly.",
    ],
    key: "Grounding reduces invention but never replaces your own check of the source.",
    quiz: [
      {
        q: "An AI answer shows a linked source. What's the right move?",
        opts: [
          "Trust it — it's grounded",
          "Open the source and confirm it says that",
          "Ignore the link",
        ],
        correct: 1,
        explain:
          "Grounding lowers risk but can misread. Open the source and confirm it supports the claim.",
      },
    ],
  },
  {
    title: 'The high-risk zones in the clinic',
    reward: 30,
    paras: [
      "Hallucinations are most dangerous where a small error has a big consequence: doses, drug interactions, citations, statistics, translated instructions, and anything time-sensitive.",
      "These are exactly the places to slow down and verify — never the places to copy and paste.",
    ],
    key: "Doses, citations, numbers, and translations are the verify-every-time zones.",
    quiz: [
      {
        q: "Which output deserves the most scrutiny?",
        opts: [
          "A general explanation of a condition",
          "A specific dose or drug interaction",
          "A friendly patient greeting",
        ],
        correct: 1,
        explain:
          "Specific, high-stakes facts like dosing carry the greatest risk from a confident error.",
      },
    ],
  },
  {
    title: 'The human-in-the-loop workflow',
    reward: 30,
    paras: [
      "The safe pattern is always: input → AI draft → your review → verify → sign-off. The model drafts; you decide.",
      "The unsafe pattern is input → AI → copy → paste → done. The difference is your judgment, and it's what keeps the output — and the patient — safe.",
    ],
    key: "AI drafts, you decide. Never let a draft become the final word untouched.",
    quiz: [
      {
        q: "What separates the safe workflow from the unsafe one?",
        opts: [
          "Using a faster model",
          "A human review-and-verify step before sign-off",
          "Writing longer prompts",
        ],
        correct: 1,
        explain:
          "The verify-before-sign-off step is the safeguard. Copy-paste-done removes it.",
      },
    ],
  },
  {
    title: 'Becoming a safe AI practitioner',
    reward: 35,
    paras: [
      "You now know why AI hallucinates: it predicts plausible text, has no facts or truth-sense, stops at a cutoff, and always sounds sure.",
      "That knowledge is the shield. Used with verification and good prompts, AI lifts the repetitive load while your expertise stays firmly in charge.",
    ],
    key: "Understanding the failure modes is what lets you use AI confidently and safely.",
    quiz: [
      {
        q: "What makes you safe to use AI in practice?",
        opts: [
          "Trusting fluent answers",
          "Knowing how it fails and verifying accordingly",
          "Avoiding AI entirely",
        ],
        correct: 1,
        explain:
          "Knowing the failure modes and verifying is exactly what safe, confident practice looks like.",
      },
    ],
  },
];

const promptlabDummyChapters = [
  {
    title: 'The Blank Box',
    reward: 20,
    paras: [
      "A prompt is the instruction you give an AI. The biggest problem isn't picking the wrong AI — it's asking it the wrong question. A blank question gets a blank answer.",
      "Before you open the chat, finish this sentence: 'I need it to ___ (task) using ___ (this data), so I can ___ (my goal).' That's not overthinking. That's preparing to be understood.",
    ],
    key: "If you don't know what to ask, you're not ready to ask it yet — start from the task.",
    quiz: [
      {
        id: 'ch01-q01',
        type: 'T1',
        mistake_tag: 'blank-start',
        q: 'A doctor opens ChatGPT and types: "Hi, can you help me with medicine?" What\'s the problem?',
        opts: [
          "It's too polite",
          "There's no task in it — the AI has nothing to do",
          "Medicine can't be discussed with AI",
          "It should be in formal English",
        ],
        correct: 1,
        explain:
          "There's no task in it — the AI has nothing to do. Better: Draft a discharge summary for a 45M admitted 3 days for uncomplicated cellulitis of the left leg, treated with IV antibiotics, now afebrile and walking.",
        better_prompt:
          'Draft a discharge summary for a 45M admitted 3 days for uncomplicated cellulitis of the left leg, treated with IV antibiotics, now afebrile and walking.',
      },
      {
        id: 'ch01-q02',
        type: 'T1',
        mistake_tag: 'blank-start',
        q: "Which of these is the best way to start when you don't know what to ask?",
        opts: [
          'Ask the AI what it can do',
          'Copy a prompt from the internet',
          'Think of one task from your day that took too long, and describe it',
          'Start with a simple question to warm it up',
        ],
        correct: 2,
        explain:
          'Think of one task from your day that took too long, and describe it. Better: I spend 20 minutes writing referral letters. Here\'s my last one: [paste]. Turn this into a template I can reuse.',
        better_prompt:
          "I spend 20 minutes writing referral letters. Here's my last one: [paste]. Turn this into a template I can reuse.",
      },
      {
        id: 'ch01-q03',
        type: 'T2',
        mistake_tag: 'blank-start',
        q: 'You want help explaining a diabetes diagnosis to a patient. Which prompt is better?',
        opts: [
          'Tell me about diabetes',
          'Write 5 lines explaining a new type 2 diabetes diagnosis to a 55-year-old farmer with limited schooling. Simple words, no jargon.',
        ],
        correct: 1,
        explain: 'The first gets you a textbook. The second gets you something you can actually say out loud in OPD.',
        better_prompt:
          'Write 5 lines explaining a new type 2 diabetes diagnosis to a 55-year-old farmer with limited schooling. Simple words, no jargon.',
      },
      {
        id: 'ch01-q04',
        type: 'T1',
        mistake_tag: 'blank-start',
        q: 'A resident says: "I tried AI once, it gave a useless answer, so I stopped." What most likely went wrong?',
        opts: [
          'They used the wrong AI tool',
          "Their first prompt was too broad, and they didn't try a second one",
          "AI isn't useful for medicine",
          'They needed the paid version',
        ],
        correct: 1,
        explain:
          "Almost every \"AI is useless\" story is a one-line prompt, tried once. The answer quality is mostly a function of what you put in, and of whether you pushed back on the first reply.",
      },
      {
        id: 'ch01-q05',
        type: 'T1',
        mistake_tag: 'blank-start',
        q: 'Which of these is NOT a good first task to try AI on?',
        opts: [
          'Drafting a patient instruction sheet',
          'Summarising a long guideline',
          'Rewriting a referral letter',
          'Deciding the final diagnosis for a patient in front of you',
        ],
        correct: 3,
        explain:
          "Start where being wrong is cheap and you can check the output easily. Drafting and summarising, yes. Final clinical decisions, never — you're the one who signs.",
      },
      {
        id: 'ch01-q06',
        type: 'T1',
        mistake_tag: 'blank-start',
        q: '"Start with the task, not the topic" means —',
        opts: [
          'Keep prompts short',
          "Say what you want made, not what subject you're interested in",
          'Always mention your specialty',
          'Ask one question at a time',
        ],
        correct: 1,
        explain:
          '"Hypertension" is a topic. "Draft a 5-point lifestyle sheet for a newly diagnosed hypertensive" is a task. Only the second one produces something you can use.',
      },
    ],
  },
  {
    title: 'Be Specific',
    reward: 20,
    paras: [
      "A vague prompt pulls a vague, textbook answer every time. 'What could be causing chest pain?' gets a list. Add three lines of detail — age, risk factors, duration, vitals — and suddenly it's a ranked differential for your patient.",
      'Numbers and constraints are your leverage. They tell the model exactly which patient this is, not just which disease. That\'s the difference between a generic answer and one you can act on.',
    ],
    key: "A textbook list isn't a diagnosis. Numbers and constraints turn it into one.",
    quiz: [
      {
        id: 'ch02-q01',
        type: 'T1',
        mistake_tag: 'vagueness',
        q: 'A GP types: "What could be causing chest pain in a 60-year-old?" What\'s the main problem?',
        opts: [
          'The prompt is too long',
          'No clinical context — no history, vitals, duration or risk factors',
          'It didn\'t say "please"',
          "Chest pain shouldn't be discussed with AI",
        ],
        correct: 1,
        explain:
          'Without context you get a textbook list in no useful order. Three lines of detail turns it into a ranked, usable differential. Better: 60F, smoker, hypertensive. 2 hours of central crushing chest pain radiating to jaw. BP 150/95, HR 98. Rank the top 3 differentials and the immediate action for each. Bullets, under 120 words.',
        better_prompt:
          '60F, smoker, hypertensive. 2 hours of central crushing chest pain radiating to jaw. BP 150/95, HR 98. Rank the top 3 differentials and the immediate action for each. Bullets, under 120 words.',
      },
      {
        id: 'ch02-q02',
        type: 'T2',
        mistake_tag: 'vagueness',
        q: 'Which prompt will give a more useful answer?',
        opts: [
          'Write discharge instructions for a patient after surgery',
          'Write discharge instructions for a 32F after laparoscopic appendicectomy, day 2, going home to a village 40km away. Cover wound care, red flags, when to return. 8 lines, simple English.',
        ],
        correct: 1,
        explain:
          'The second one knows the patient, the distance, and what must be covered. That\'s the difference between a template and something you can hand over.',
        better_prompt:
          'Write discharge instructions for a 32F after laparoscopic appendicectomy, day 2, going home to a village 40km away. Cover wound care, red flags, when to return. 8 lines, simple English.',
      },
      {
        id: 'ch02-q03',
        type: 'T3',
        mistake_tag: 'vagueness',
        q: 'You prompt: "Explain hypertension." What will you most likely get back?',
        opts: [
          'A one-line definition',
          'A long general article covering definition, causes, types and treatment — most of it useless to you right now',
          'A question asking what you need',
          'Nothing useful at all',
        ],
        correct: 1,
        explain:
          'Vague in, long and generic out. The AI fills the space you didn\'t define. Narrow it and it narrows with you.',
      },
      {
        id: 'ch02-q04',
        type: 'T1',
        mistake_tag: 'vagueness',
        q: 'Which detail would improve this prompt the MOST: "Suggest antibiotics for a chest infection"?',
        opts: [
          'Adding "please suggest"',
          'Adding age, allergies, severity, comorbidities and local resistance pattern',
          'Asking it to be brief',
          "Saying you're a doctor",
        ],
        correct: 1,
        explain:
          'Antibiotic choice is entirely driven by those variables. Without them the answer is a textbook list, not advice for your patient. (And you still verify against local guidelines before prescribing.)',
      },
      {
        id: 'ch02-q05',
        type: 'T1',
        mistake_tag: 'vagueness',
        q: 'True or false, roughly: adding three lines of patient context usually makes the answer noticeably better.',
        opts: [
          'True — context is the single biggest lever on answer quality',
          'False — the AI already knows medicine, context doesn\'t matter',
          'True, but only for rare diseases',
          'False — long prompts confuse the model',
        ],
        correct: 0,
        explain: 'The model knows general medicine. What it doesn\'t know is *your* patient. That gap is what you\'re filling.',
      },
      {
        id: 'ch02-q06',
        type: 'T1',
        mistake_tag: 'vagueness',
        q: 'Which of these is specific enough to give a useful answer?',
        opts: [
          'Tell me about paediatric fever',
          'How to treat fever in kids',
          '3-year-old, 38.9°C for 2 days, feeding well, no rash, immunised. List the red flags I should rule out before sending home.',
          'Fever management guidelines',
        ],
        correct: 2,
        explain:
          'Age, temperature, duration, negatives, and a clear task. That\'s a prompt the AI can actually work with.',
      },
    ],
  },
  {
    title: 'Give It a Role',
    reward: 20,
    paras: [
      "Without a role set, the AI picks its own — usually a generic, mid-level average-reader voice. Set a role, and everything changes: depth, vocabulary, priorities, what gets assumed and what gets spelled out.",
      "Say who you are and who you're writing for. 'You are a physician advising a GP overnight' is not decoration. It's what steers the entire answer toward something useful for that actual moment.",
    ],
    key: "No role means the model picks one for you. Name it, or it names itself.",
    quiz: [
      {
        id: 'ch03-q01',
        type: 'T1',
        mistake_tag: 'no-role',
        q: 'What does adding "You are a paediatrician explaining to a worried parent" do?',
        opts: [
          'Makes the AI more accurate',
          'Sets the tone, depth and vocabulary of the answer',
          'Makes the answer longer',
          'Nothing — it\'s just decoration',
        ],
        correct: 1,
        explain:
          'A role doesn\'t add knowledge. It picks *which* knowledge and *how* it\'s said. Same question, wildly different answer for a parent vs a colleague.',
      },
      {
        id: 'ch03-q02',
        type: 'T2',
        mistake_tag: 'no-role',
        q: 'You want an answer you can read out to a patient. Which opening is better?',
        opts: [
          'Explain anaemia.',
          'You are a physician explaining to a patient with no medical background. Explain anaemia.',
        ],
        correct: 1,
        explain:
          'Without the role, the AI defaults to a mid-level, textbook register — too technical for a patient, too shallow for a colleague. Naming the audience fixes both.',
        better_prompt:
          'You are a physician explaining to a patient with no medical background. Explain anaemia.',
      },
      {
        id: 'ch03-q03',
        type: 'T1',
        mistake_tag: 'no-role',
        q: 'Which role instruction is most useful for a clinical prompt?',
        opts: [
          'You are a genius doctor',
          'You are the best AI in the world',
          'You are a physician advising a junior doctor in a district hospital, following national guidelines',
          'You are very smart',
        ],
        correct: 2,
        explain:
          'Flattery does nothing. A role works when it carries real information: who you are, who you\'re advising, what setting, which guidelines.',
      },
      {
        id: 'ch03-q04',
        type: 'T1',
        mistake_tag: 'no-role',
        q: "If you don't give a role, what happens?",
        opts: [
          'The AI refuses to answer',
          'The AI picks a default one — usually a generic, cautious, mid-level explainer',
          'The answer is always wrong',
          'The AI asks you for one',
        ],
        correct: 1,
        explain:
          "There's always a role. If you don't set it, you get the default — and the default is nobody's ideal reader.",
      },
      {
        id: 'ch03-q05',
        type: 'T3',
        mistake_tag: 'no-role',
        q: 'Same question, two roles. Which pair of answers should you expect? "You are explaining to a first-year MBBS student" vs "You are explaining to a consultant cardiologist"',
        opts: [
          'Almost identical answers',
          'Different depth, different vocabulary, different assumptions about what needs explaining',
          'The second will refuse to answer',
          'Only the length will change',
        ],
        correct: 1,
        explain:
          'The role changes what gets assumed and what gets spelled out. That\'s the whole point of setting it.',
      },
      {
        id: 'ch03-q06',
        type: 'T4',
        mistake_tag: 'no-role',
        q: 'Build the role line for this task: you want a referral letter to a neurologist, written the way a GP would write it.',
        opts: [
          'Write a good referral letter',
          'You are a GP writing a referral letter to a consultant neurologist. Use standard referral letter structure.',
          'You are a neurologist',
          'Act like a doctor and write something formal',
        ],
        correct: 1,
        explain:
          'The role is *who is writing*, not who is reading — plus what form the output should take. Option (c) puts the AI on the wrong side of the letter.',
        better_prompt:
          'You are a GP writing a referral letter to a consultant neurologist. Use standard referral letter structure.',
      },
    ],
  },
  {
    title: 'Say the Task Out Loud',
    reward: 20,
    paras: [
      "A topic isn't a task. 'Diabetes management' is something to think about. 'Rank first-line therapies for newly diagnosed type 2 diabetes with mild CKD' is a job with a deliverable. The second one knows exactly what to produce.",
      'Open every prompt with a verb: summarise, rank, draft, compare, flag, explain. A noun leaves the AI guessing. A verb tells it what to do.',
    ],
    key: "A topic tells the model what to think about. A verb tells it what to do.",
    quiz: [
      {
        id: 'ch04-q01',
        type: 'T1',
        mistake_tag: 'no-task',
        q: '"Diabetes in pregnancy." What\'s missing?',
        opts: [
          "The patient's name",
          'A verb — what do you actually want done?',
          'A polite greeting',
          'Nothing, this is fine',
        ],
        correct: 1,
        explain:
          'Nouns are topics. Verbs are tasks. *Summarise. Rank. Draft. Compare. Rewrite. List.* Start the request with one. Better: Summarise the screening and management approach for gestational diabetes in 6 bullets, for a GP refresher.',
        better_prompt:
          'Summarise the screening and management approach for gestational diabetes in 6 bullets, for a GP refresher.',
      },
      {
        id: 'ch04-q02',
        type: 'T2',
        mistake_tag: 'no-task',
        q: 'Which prompt states the task clearly?',
        opts: [
          'Anticoagulation in AF',
          'Compare warfarin and DOACs for stroke prevention in AF. Table with 4 rows: efficacy, monitoring, cost, reversal.',
        ],
        correct: 1,
        explain:
          '"Compare… table with 4 rows" is a job with a deliverable. The first is a topic heading.',
        better_prompt:
          'Compare warfarin and DOACs for stroke prevention in AF. Table with 4 rows: efficacy, monitoring, cost, reversal.',
      },
      {
        id: 'ch04-q03',
        type: 'T1',
        mistake_tag: 'no-task',
        q: 'Which of these is a task verb?',
        opts: ['About', 'Regarding', 'Draft', 'Concerning'],
        correct: 2,
        explain:
          'Small thing, big effect. Prompts that begin with a verb get outputs you can use; prompts that begin with a preposition get essays.',
      },
      {
        id: 'ch04-q04',
        type: 'T1',
        mistake_tag: 'no-task',
        q: 'You want three things: a summary, a patient version, and a follow-up plan. What should you do?',
        opts: [
          'Ask all three in one long sentence',
          'Number them: "1. Summarise… 2. Rewrite for the patient… 3. List follow-up steps…"',
          'Ask for the summary only, then start a new chat',
          'Ask the AI to figure out what you need',
        ],
        correct: 1,
        explain:
          'Numbered tasks come back as numbered sections. Buried in a sentence, one of the three usually gets dropped.',
      },
      {
        id: 'ch04-q05',
        type: 'T3',
        mistake_tag: 'no-task',
        q: "You prompt: \"Asthma management in children, I need it for tomorrow's teaching session.\" What will you likely get?",
        opts: [
          'A ready-made teaching plan',
          'A general overview — because you mentioned the context but never said "make me a teaching plan"',
          'A refusal',
          'A list of questions',
        ],
        correct: 1,
        explain:
          'Mentioning why you need something isn\'t the same as saying what to make. The AI heard "asthma in children" and produced exactly that.',
      },
      {
        id: 'ch04-q06',
        type: 'T4',
        mistake_tag: 'no-task',
        q: 'Turn this into a task: "Post-operative pain."',
        opts: [
          'Tell me about post-operative pain',
          'Post-operative pain management guidelines',
          'List a step-up analgesia plan for day 1 after open appendicectomy in a healthy 25M, with doses and review points.',
          'Explain post-operative pain in detail',
        ],
        correct: 2,
        explain:
          'A verb (*list*), a deliverable (*step-up plan*), a patient, and what it must contain. That\'s a task.',
        better_prompt:
          'List a step-up analgesia plan for day 1 after open appendicectomy in a healthy 25M, with doses and review points.',
      },
    ],
  },
  {
    title: 'Control the Format',
    reward: 20,
    paras: [
      "Without a format request, you get a wall of text. The model defaults to being thorough over being scannable, and that default costs you minutes on a busy shift.",
      "Name the shape: '5 bullets, under 80 words', 'table with 3 columns', 'numbered list, plain language'. That's not being picky. That's asking for output you can actually use without rewriting.",
    ],
    key: "If you didn't ask for a shape, you get a paragraph. Ask for the shape you'll actually use.",
    quiz: [
      {
        id: 'ch05-q01',
        type: 'T1',
        mistake_tag: 'no-format',
        q: "You asked a good question but got 900 words you don't have time to read. What did you forget?",
        opts: [
          'To ask nicely',
          'To say how long the answer should be and what shape it should take',
          "To give the patient's age",
          'To use the paid version',
        ],
        correct: 1,
        explain:
          'If you don\'t set a limit, the AI fills the space. "6 bullets, under 100 words" is one line that saves you every time.',
      },
      {
        id: 'ch05-q02',
        type: 'T2',
        mistake_tag: 'no-format',
        q: 'Which will give you something you can paste straight into a note?',
        opts: [
          'Explain the plan for this patient',
          'Write the plan as 4 numbered lines, present tense, under 60 words, no headings.',
        ],
        correct: 1,
        explain:
          'Format instructions are what turn output into something usable without reformatting.',
        better_prompt:
          'Write the plan as 4 numbered lines, present tense, under 60 words, no headings.',
      },
      {
        id: 'ch05-q03',
        type: 'T1',
        mistake_tag: 'no-format',
        q: 'Which of these is a format instruction?',
        opts: [
          'You are a cardiologist',
          'The patient is 60 years old',
          'Answer as a table with 3 columns',
          'Rank the differentials',
        ],
        correct: 2,
        explain:
          'Role, data, task, format — four different jobs. (a) is role, (b) is data, (d) is task. Only (c) describes the shape of the answer.',
      },
      {
        id: 'ch05-q04',
        type: 'T1',
        mistake_tag: 'no-format',
        q: 'What does adding "no disclaimers, no introduction" do?',
        opts: [
          'Makes the AI less safe',
          'Removes the padding so you get straight to the content',
          'Makes it shorter but less accurate',
          'Nothing',
        ],
        correct: 1,
        explain:
          'Telling it what to leave out is as powerful as telling it what to include. You\'ll strip two paragraphs of preamble off every answer.',
      },
      {
        id: 'ch05-q05',
        type: 'T3',
        mistake_tag: 'no-format',
        q: 'You add "under 50 words" to a prompt. What changes?',
        opts: [
          'The answer becomes less accurate',
          'The answer keeps only the most important points and drops the rest',
          'Nothing changes',
          'The AI refuses',
        ],
        correct: 1,
        explain:
          'A word limit is a prioritisation instruction in disguise. It forces the model to choose. That\'s often exactly what you want.',
      },
      {
        id: 'ch05-q06',
        type: 'T4',
        mistake_tag: 'no-format',
        q: 'You want a patient handout. Which format line fits best?',
        opts: [
          'Make it detailed and comprehensive',
          '8 short lines, simple English, one idea per line, no medical terms. End with when to come back.',
          'Write it professionally',
          'Use proper medical terminology',
        ],
        correct: 1,
        explain:
          'Every part of (b) is checkable — line count, language level, structure, ending. "Professionally" and "comprehensive" mean nothing to the model.',
        better_prompt:
          '8 short lines, simple English, one idea per line, no medical terms. End with when to come back.',
      },
    ],
  },
];

async function main(): Promise<void> {
  console.log('Starting seed...');

  // Clear existing chapters
  await prisma.chapter.deleteMany({});
  console.log('Cleared existing chapters');

  // Seed prompt chapters
  for (let i = 0; i < promptChapters.length; i++) {
    const ch = promptChapters[i];
    await prisma.chapter.create({
      data: {
        track: 'prompt',
        index: i,
        title: ch.title,
        paras: ch.paras,
        key: ch.key,
        reward: ch.reward,
        quiz: ch.quiz,
      },
    });
  }
  console.log(`Seeded ${promptChapters.length} prompt chapters`);

  // Seed hall chapters
  for (let i = 0; i < hallChapters.length; i++) {
    const ch = hallChapters[i];
    await prisma.chapter.create({
      data: {
        track: 'hall',
        index: i,
        title: ch.title,
        paras: ch.paras,
        key: ch.key,
        reward: ch.reward,
        quiz: ch.quiz,
      },
    });
  }
  console.log(`Seeded ${hallChapters.length} hall chapters`);

  // Seed promptlab_dummy chapters
  for (let i = 0; i < promptlabDummyChapters.length; i++) {
    const ch = promptlabDummyChapters[i];
    await prisma.chapter.create({
      data: {
        track: 'promptlab_dummy',
        index: i,
        title: ch.title,
        paras: ch.paras,
        key: ch.key,
        reward: ch.reward,
        quiz: ch.quiz,
      },
    });
  }
  console.log(`Seeded ${promptlabDummyChapters.length} promptlab_dummy chapters`);

  // Verify counts
  const promptCount = await prisma.chapter.count({
    where: { track: 'prompt' },
  });
  const hallCount = await prisma.chapter.count({
    where: { track: 'hall' },
  });
  const dummyCount = await prisma.chapter.count({
    where: { track: 'promptlab_dummy' },
  });
  console.log(
    `\nVerification: prompt=${promptCount}, hall=${hallCount}, promptlab_dummy=${dummyCount}, total=${promptCount + hallCount + dummyCount}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
