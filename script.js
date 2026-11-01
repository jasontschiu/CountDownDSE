const exams = window.DSE_EXAMS.map((exam) => ({
  ...exam,
  examDate: new Date(exam.dateTime),
}));

const UI_TEXT = {
  en: {
    siteName: "WSCSS AI learning hub",
    cardExamDay: "Exam Day",
    titleExamDay: "Exam day",
    statusExamDay: "Today is exam day",
    days: (days) => `${days} Days`,
    daysLeft: (days, title) => `${days} days left until ${title}`,
  },
  "zh-Hant": {
    siteName: "WSCSS AI 學習中心",
    cardExamDay: "考試日",
    titleExamDay: "考試日",
    statusExamDay: "今天是考試日",
    days: (days) => `${days} 天`,
    daysLeft: (days, title) => `距離${title}還有 ${days} 天`,
  },
};

let activeExam = exams[0];

const dialog = document.querySelector("#examDialog");
const closeButton = document.querySelector(".close-button");
const dialogFields = {
  tag: document.querySelector("#dialogTag"),
  title: document.querySelector("#dialogTitle"),
  titleZh: document.querySelector("#dialogTitleZh"),
  date: document.querySelector("#dialogDate"),
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
  status: document.querySelector("#statusText"),
};

function getText() {
  return UI_TEXT[document.documentElement.lang];
}

function getExamText(exam) {
  if (document.documentElement.lang === "en") {
    return {
      tag: exam.tag,
      title: exam.title,
      subtitle: exam.titleZh,
      date: exam.dateLabel,
    };
  }

  return {
    tag: exam.tagZh,
    title: exam.titleZh,
    subtitle: exam.title,
    date: exam.dateLabelZh,
  };
}

function pad(value, length = 2) {
  return String(value).padStart(length, "0");
}

function getRemaining(examDate) {
  const distance = examDate.getTime() - Date.now();

  if (distance <= 0) {
    return {
      finished: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalSeconds = Math.floor(distance / 1000);

  return {
    finished: false,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function formatTitleTime(remaining) {
  if (remaining.finished) {
    return getText().titleExamDay;
  }

  return `${getText().days(remaining.days)} ${pad(remaining.hours)}:${pad(
    remaining.minutes,
  )}:${pad(remaining.seconds)}`;
}

function formatCardCountdown(remaining) {
  if (remaining.finished) {
    return `
      <span class="countdown-days">${getText().cardExamDay}</span>
      <span class="countdown-clock">00:00:00</span>
    `;
  }

  return `
    <span class="countdown-days">${getText().days(remaining.days)}</span>
    <span class="countdown-clock">${pad(remaining.hours)}:${pad(
      remaining.minutes,
    )}:${pad(remaining.seconds)}</span>
  `;
}

function createCard(exam, index) {
  const examText = getExamText(exam);

  return `
    <button class="subject-card ${index % 2 ? "accent-card" : ""}" type="button" id="subject-${exam.key}" data-subject="${exam.key}">
      <span class="card-title">${examText.title}</span>
      <span class="card-title-zh">${examText.subtitle}</span>
      <span class="card-date">${examText.date}</span>
      <span class="mini-countdown" data-countdown="${exam.key}">
        <span class="countdown-days">000 Days</span>
        <span class="countdown-clock">00:00:00</span>
      </span>
    </button>
  `;
}

function renderCards() {
  ["core", "elective"].forEach((group) => {
    const grid = document.querySelector(`[data-group="${group}"]`);
    const groupExams = exams
      .filter((exam) => exam.group === group)
      .sort((a, b) => a.examDate.getTime() - b.examDate.getTime());

    grid.innerHTML = groupExams.map(createCard).join("");
  });

  document.querySelectorAll(".subject-card").forEach((card) => {
    card.addEventListener("click", () => {
      const selectedExam = exams.find((exam) => exam.key === card.dataset.subject);
      setDialogSubject(selectedExam);
      dialog.showModal();
    });
  });
}

function setupQuickLinks() {
  document.querySelectorAll("[data-jump]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      jumpToSubject(link.dataset.jump);
    });
  });
}

function jumpToSubject(subjectKey) {
  const card = document.querySelector(`[data-subject="${subjectKey}"]`);

  if (!card) {
    return;
  }

  card.scrollIntoView({ behavior: "smooth", block: "center" });
  card.focus({ preventScroll: true });
  card.classList.add("is-highlighted");

  window.setTimeout(() => {
    card.classList.remove("is-highlighted");
  }, 1600);
}

function setDialogSubject(exam) {
  activeExam = exam;

  const examText = getExamText(exam);

  dialogFields.tag.textContent = examText.tag;
  dialogFields.title.textContent = examText.title;
  dialogFields.titleZh.textContent = examText.subtitle;
  dialogFields.date.textContent = examText.date;
  updateCountdowns();
}

function updateCountdowns() {
  exams.forEach((exam) => {
    const remaining = getRemaining(exam.examDate);
    const miniCountdown = document.querySelector(`[data-countdown="${exam.key}"]`);

    if (miniCountdown) {
      miniCountdown.innerHTML = formatCardCountdown(remaining);
    }
  });

  const remaining = getRemaining(activeExam.examDate);

  dialogFields.days.textContent = pad(remaining.days, 3);
  dialogFields.hours.textContent = pad(remaining.hours);
  dialogFields.minutes.textContent = pad(remaining.minutes);
  dialogFields.seconds.textContent = pad(remaining.seconds);
  dialogFields.status.textContent = remaining.finished
    ? getText().statusExamDay
    : getText().daysLeft(remaining.days, getExamText(activeExam).title);

  document.title = `${formatTitleTime(remaining)} | ${getText().siteName}`;
}

closeButton.addEventListener("click", () => {
  dialog.close();
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && dialog.open) {
    dialog.close();
  }
});

document.addEventListener("site-language-change", () => {
  renderCards();
  setDialogSubject(activeExam);
});

renderCards();
setupQuickLinks();
setDialogSubject(activeExam);
setInterval(updateCountdowns, 1000);
