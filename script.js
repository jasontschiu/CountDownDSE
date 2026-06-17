const exams = window.DSE_EXAMS.map((exam) => ({
  ...exam,
  examDate: new Date(exam.dateTime),
}));

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
    return "Exam day";
  }

  return `${remaining.days} Days ${pad(remaining.hours)}:${pad(
    remaining.minutes,
  )}:${pad(remaining.seconds)}`;
}

function formatCardCountdown(remaining) {
  if (remaining.finished) {
    return `
      <span class="countdown-days">Exam Day</span>
      <span class="countdown-clock">00:00:00</span>
    `;
  }

  return `
    <span class="countdown-days">${remaining.days} Days</span>
    <span class="countdown-clock">${pad(remaining.hours)}:${pad(
      remaining.minutes,
    )}:${pad(remaining.seconds)}</span>
  `;
}

function createCard(exam, index) {
  return `
    <button class="subject-card ${index % 2 ? "accent-card" : ""}" type="button" id="subject-${exam.key}" data-subject="${exam.key}">
      <span class="card-title">${exam.title}</span>
      <span class="card-title-zh">${exam.titleZh}</span>
      <span class="card-date">${exam.dateLabel}</span>
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

  dialogFields.tag.textContent = exam.tag;
  dialogFields.title.textContent = exam.title;
  dialogFields.titleZh.textContent = exam.titleZh;
  dialogFields.date.textContent = exam.dateLabel;
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
    ? "Today is exam day"
    : `${remaining.days} days left until ${activeExam.title}`;

  document.title = `${formatTitleTime(remaining)} | DSE Countdown`;
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

renderCards();
setupQuickLinks();
setDialogSubject(activeExam);
setInterval(updateCountdowns, 1000);
