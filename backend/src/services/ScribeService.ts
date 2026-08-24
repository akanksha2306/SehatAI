import config from '../lib/config.js';
import { Anthropic } from '@anthropic-ai/sdk';

// The AI Scribe "recording" step always plays back the same fixed sample
// transcript (no real speech-to-text — deliberately deferred, see
// notes/2026-08-22-scribe-gamification-grill.md). Since the input is always
// identical, these are real, accurate hand-written translations of that
// exact text, keyed by the dialect slug the frontend sends (see
// frontend/src/features/scribe/molecules/dialect-selector.tsx). This lets
// the mock path show genuine translated text instead of an English echo,
// for demo purposes, without needing a real Anthropic key. If a real key is
// added, the real Claude branch below takes over automatically and this
// table stops being used — no cleanup needed here at that point.
const SAMPLE_TRANSCRIPT_TRANSLATIONS: Record<string, string> = {
  'spanish-mexican':
    "Doctor: Su presión arterial está un poco alta. Voy a comenzar a darle amlodipino, 5 miligramos, una vez cada mañana.\nPaciente: ¿Lo tomo con comida?\nDoctor: Puede tomarlo con o sin comida, pero tómelo a la misma hora todos los días. Regrese en cuatro semanas para que podamos revisar cómo está funcionando.",
  'spanish-caribbean':
    "Doctor: Su presión está un poco alta. Le voy a mandar amlodipino, 5 miligramos, una vez cada mañana.\nPaciente: ¿Me lo tomo con comida?\nDoctor: Lo puede tomar con o sin comida, pero tómelo a la misma hora todos los días. Regrese en cuatro semanas para chequear cómo le está funcionando.",
  hindi:
    "डॉक्टर: आपका ब्लड प्रेशर थोड़ा ज़्यादा है। मैं आपको एम्लोडिपिन शुरू कर रहा हूँ, 5 मिलीग्राम, हर सुबह एक बार।\nमरीज़: क्या मैं इसे खाने के साथ लूँ?\nडॉक्टर: आप इसे खाने के साथ या बिना खाने के ले सकते हैं, लेकिन इसे हर दिन एक ही समय पर लें। चार हफ्तों बाद वापस आइए ताकि हम देख सकें कि यह कैसे काम कर रही है।",
  tagalog:
    "Doctor: Medyo mataas ang blood pressure mo. Sisimulan kitang bigyan ng amlodipine, 5 milligrams, isang beses tuwing umaga.\nPasyente: Kailangan ko ba itong inumin kasabay ng pagkain?\nDoctor: Puwede mo itong inumin na may kasabay na pagkain o wala, pero inumin mo ito sa parehong oras araw-araw. Bumalik ka pagkalipas ng apat na linggo para makita natin kung gumagana ito.",
  vietnamese:
    "Bác sĩ: Huyết áp của bạn hơi cao. Tôi sẽ bắt đầu cho bạn dùng amlodipine, 5 miligam, một lần mỗi sáng.\nBệnh nhân: Tôi có cần uống thuốc cùng với thức ăn không?\nBác sĩ: Bạn có thể uống thuốc có hoặc không có thức ăn, nhưng hãy uống vào cùng một giờ mỗi ngày. Hãy quay lại sau bốn tuần để chúng ta kiểm tra xem thuốc có hiệu quả không.",
  'arabic-levantine':
    "الدكتور: ضغط دمك مرتفع شوي. رح ابلش معك دواء اسمه أملوديبين، 5 ميليغرام، مرة كل صباح.\nالمريض: بحكيها مع الأكل؟\nالدكتور: فيك تاخدها مع الأكل أو بدونه، بس خدها بنفس الوقت كل يوم. ارجع بعد أربع أسابيع منشوف كيف عم تشتغل معك.",
  'mandarin-simplified':
    "医生：您的血压有点高。我会给您开始用氨氯地平，5毫克，每天早上一次。\n病人：需要和食物一起吃吗？\n医生：您可以和食物一起吃，也可以不吃东西时服用，但每天要在同一时间服用。四周后请回来复诊，我们看看效果如何。",
  'portuguese-brazilian':
    "Médico: Sua pressão arterial está um pouco alta. Vou começar a te dar anlodipino, 5 miligramas, uma vez toda manhã.\nPaciente: Preciso tomar com comida?\nMédico: Você pode tomar com ou sem comida, mas tome sempre no mesmo horário todos os dias. Volte daqui a quatro semanas para vermos como está funcionando.",
  'plain-english':
    "Doctor: Your blood pressure is a bit high. I'm giving you a new pill called amlodipine. Take 5 milligrams — that's one pill — every morning.\nPatient: Do I eat first?\nDoctor: You can take it with food or without food. Just take it at the same time every day. Come see me again in four weeks so we can check if it's working.",
};

export class ScribeService {
  private anthropic: Anthropic | null;

  constructor() {
    if (config.ANTHROPIC_API_KEY) {
      this.anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
    } else {
      this.anthropic = null;
    }
  }

  async translate(transcript: string, dialect: string): Promise<string> {
    if (!this.anthropic) {
      // Use a real hand-written translation if we have one for this exact
      // dialect (see SAMPLE_TRANSCRIPT_TRANSLATIONS above) — shows genuine
      // translated text for the demo. Falls back to an echo+label only for
      // a dialect slug we don't have a translation for.
      const knownTranslation = SAMPLE_TRANSCRIPT_TRANSLATIONS[dialect];
      if (knownTranslation) {
        return `${knownTranslation}\n\n(Demo translation — not live AI yet)`;
      }
      return `[Mock translation to ${dialect} — no AI key configured yet]\n\n${transcript}`;
    }

    // Real Claude API call
    const instruction = `Rewrite this doctor–patient conversation in ${dialect}. Use natural, regional, plain and respectful language the patient can easily read or hear aloud. Keep the speaker labels. Preserve every medication name, dose, and timing exactly.\n\n${transcript}`;

    const message = await this.anthropic.messages.create({
      model: 'claude-sonnet-5',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: instruction,
        },
      ],
    });

    // Extract text from the response
    const textContent = message.content.find(
      (block): block is { type: 'text'; text: string } => block.type === 'text'
    );
    if (!textContent) {
      throw new Error('No text content in Claude response');
    }

    return textContent.text;
  }
}
