function parseDurationToSeconds(duration) {
  const regex =
    /(\d+)\s*(h|hr|hrs|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)?/gi;
  let totalSeconds = 0;
  let match;

  while ((match = regex.exec(duration)) !== null) {
    const value = parseInt(match[1]);
    const unit = match[2]?.toLowerCase() ?? "s";

    switch (unit) {
      case "h":
      case "hr":
      case "hrs":
      case "hour":
      case "hours":
        totalSeconds += value * 3600;
        break;
      case "m":
      case "min":
      case "mins":
      case "minute":
      case "minutes":
        totalSeconds += value * 60;
        break;
      default:
        totalSeconds += value;
    }
  }

  return totalSeconds;
}

function getDefaultRoutines() {
  const defaultList = [
    { name: "Explore New Tech", duration: "2h" },
    { name: "Practice Code", duration: "2h" },
    { name: "Job Hunting", duration: "1h" },
  ];

  return defaultList.map((item, index) => {
    const seconds = parseDurationToSeconds(item.duration);
    return {
      id: Date.now() + index,
      name: item.name,
      originalDurationSeconds: seconds,
      remainingSeconds: seconds,
      isRunning: false,
      isFinished: false,
    };
  });
}

export default getDefaultRoutines;
