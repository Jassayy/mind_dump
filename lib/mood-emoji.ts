/**
 * Maps mood strings to emojis
 */
export function getMoodEmoji(mood: string | null | undefined): string {
  if (!mood) return "😐";

  const moodLower = mood.toLowerCase().trim();

  // Happy moods
  if (moodLower.includes("happy") || moodLower.includes("joy") || moodLower.includes("cheerful") || moodLower.includes("excited")) {
    return "😊";
  }
  if (moodLower.includes("very happy") || moodLower.includes("ecstatic") || moodLower.includes("elated")) {
    return "😄";
  }
  if (moodLower.includes("grateful") || moodLower.includes("thankful")) {
    return "🙏";
  }

  // Sad moods
  if (moodLower.includes("sad") || moodLower.includes("unhappy") || moodLower.includes("down")) {
    return "😢";
  }
  if (moodLower.includes("very sad") || moodLower.includes("depressed") || moodLower.includes("hopeless")) {
    return "😭";
  }
  if (moodLower.includes("lonely") || moodLower.includes("isolated")) {
    return "😔";
  }

  // Angry moods
  if (moodLower.includes("angry") || moodLower.includes("mad") || moodLower.includes("furious")) {
    return "😠";
  }
  if (moodLower.includes("frustrated") || moodLower.includes("annoyed")) {
    return "😤";
  }

  // Anxious/Stressed moods
  if (moodLower.includes("anxious") || moodLower.includes("worried") || moodLower.includes("nervous")) {
    return "😰";
  }
  if (moodLower.includes("stressed") || moodLower.includes("overwhelmed")) {
    return "😓";
  }
  if (moodLower.includes("panic") || moodLower.includes("panic")) {
    return "😱";
  }

  // Tired/Sleepy moods
  if (moodLower.includes("tired") || moodLower.includes("exhausted") || moodLower.includes("sleepy")) {
    return "😴";
  }

  // Confused moods
  if (moodLower.includes("confused") || moodLower.includes("uncertain") || moodLower.includes("lost")) {
    return "😕";
  }

  // Calm/Peaceful moods
  if (moodLower.includes("calm") || moodLower.includes("peaceful") || moodLower.includes("relaxed")) {
    return "😌";
  }
  if (moodLower.includes("content") || moodLower.includes("satisfied")) {
    return "🙂";
  }

  // Neutral moods
  if (moodLower.includes("neutral") || moodLower.includes("okay") || moodLower.includes("fine")) {
    return "😐";
  }

  // Surprised
  if (moodLower.includes("surprised") || moodLower.includes("shocked")) {
    return "😲";
  }

  // Love/Affection
  if (moodLower.includes("love") || moodLower.includes("loving") || moodLower.includes("affectionate")) {
    return "🥰";
  }

  // Proud
  if (moodLower.includes("proud") || moodLower.includes("accomplished")) {
    return "😎";
  }

  // Default neutral
  return "😐";
}

