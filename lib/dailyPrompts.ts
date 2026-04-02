const prompts = [
  "What's one small thing that made today feel okay?",
  "What are you carrying right now that you wish you could put down?",
  "What does your body feel like today — tired, restless, heavy, light?",
  "What's one thing you're grateful for, even if today was hard?",
  "What would you tell a friend who was feeling exactly how you feel right now?",
  "What's something you've been avoiding thinking about?",
  "What made you smile recently, even briefly?",
  "What do you need most right now — rest, connection, space, or something else?",
  "What's one thing you did today that took courage, even if it seems small?",
  "If today had a color, what would it be and why?",
  "What's something kind you could do for yourself today?",
  "What's been on your mind when you wake up lately?",
  "What's one thing you're looking forward to, even something tiny?",
  "When did you last feel truly calm? What was happening?",
  "What would make tomorrow feel a little better than today?",
  "What's something you wish people understood about how you're feeling?",
  "What emotion have you been pushing away lately?",
  "What does home feel like to you right now?",
  "What's one thing you accomplished today, no matter how small?",
  "Who or what has been giving you strength lately?",
  "What's something you've been hard on yourself about?",
  "What would it feel like to give yourself permission to just rest today?",
  "What's a memory that makes you feel safe?",
  "What's something new you noticed about yourself recently?",
  "What do you wish you could say out loud but haven't?",
  "What's been draining your energy lately?",
  "What would your ideal day look like right now?",
  "What's something you've overcome that you don't give yourself credit for?",
  "How have you grown in the past year, even through hard times?",
  "What does being okay mean to you today?",
];

export function getDailyPrompt(): string {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return prompts[dayOfYear % prompts.length];
}