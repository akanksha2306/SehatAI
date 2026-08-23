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

  // Verify counts
  const promptCount = await prisma.chapter.count({
    where: { track: 'prompt' },
  });
  const hallCount = await prisma.chapter.count({
    where: { track: 'hall' },
  });
  console.log(
    `\nVerification: prompt=${promptCount}, hall=${hallCount}, total=${promptCount + hallCount}`
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
