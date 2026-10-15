
const questions = [
  {
    key: "symptoms",
    title: "What have you been experiencing?",
    help: "Select all that apply. You can choose more than one.",
    type: "checkbox",
    required: true,
    options: [
      "Irregular or missed periods",
      "Acne or oily skin",
      "Increased facial or body hair",
      "Scalp hair thinning",
      "Unexpected weight changes",
      "Pelvic or lower abdominal discomfort",
      "Heavy or prolonged bleeding",
      "Something else"
    ]
  },
  {
    key: "duration",
    title: "How long have you noticed these changes?",
    help: "Choose the closest answer.",
    type: "radio",
    required: true,
    options: [
      "Less than a month",
      "1–3 months",
      "3–6 months",
      "More than 6 months",
      "I'm not sure"
    ]
  },
  {
    key: "periodPattern",
    title: "How would you describe your periods?",
    help: "This helps us understand your menstrual pattern.",
    type: "radio",
    required: true,
    options: [
      "Usually regular",
      "Sometimes irregular",
      "Often irregular or missed",
      "No periods currently",
      "Not applicable",
      "Prefer not to say"
    ]
  },
  {
    key: "ageRange",
    title: "Which age range are you in?",
    help: "This is optional and helps provide more relevant information.",
    type: "radio",
    required: false,
    options: [
      "Under 18",
      "18–24",
      "25–34",
      "35–44",
      "45 or older",
      "Prefer not to say"
    ]
  },
  {
    key: "notes",
    title: "Anything else you'd like us to know?",
    help: "Optional. Avoid sharing your name or other identifying details.",
    type: "textarea",
    required: false,
    options: []
  }
];

const form = document.querySelector("#quiz-form");
const container = document.querySelector("#question-container");
const stepLabel = document.querySelector("#step-label");
const progressLabel = document.querySelector("#progress-label");
const progressBar = document.querySelector("#progress-bar");
const backBtn = document.querySelector("#back-btn");
const nextBtn = document.querySelector("#next-btn");
const errorMessage = document.querySelector("#error-message");

let currentStep = 0;
const answers = {};

function renderQuestion() {
  const question = questions[currentStep];
  const progress = Math.round(
    ((currentStep + 1) / questions.length) * 100
  );

  stepLabel.textContent =
    `QUESTION ${currentStep + 1} OF ${questions.length}`;
  progressLabel.textContent = `${progress}%`;
  progressBar.style.width = `${progress}%`;

  backBtn.hidden = currentStep === 0;
  nextBtn.textContent =
    currentStep === questions.length - 1
      ? "Review answers →"
      : "Continue →";

  errorMessage.textContent = "";

  container.replaceChildren();

  const title = document.createElement("h2");
  title.className = "question-title";
  title.id = "question-title";
  title.textContent = question.title;

  const help = document.createElement("p");
  help.className = "question-help";
  help.textContent = question.help;

  container.append(title, help);

  if (question.type === "textarea") {
    const textarea = document.createElement("textarea");
    textarea.name = question.key;
    textarea.maxLength = 1000;
    textarea.rows = 4;
    textarea.placeholder = "Share any additional details...";
    textarea.className = "text-answer";
    textarea.style.cssText =
      "width:100%;padding:14px;border:1px solid #e9e2ed;" +
      "border-radius:12px;resize:vertical;font:inherit;";

    textarea.value = answers[question.key] || "";
    container.append(textarea);
    return;
  }

  const options = document.createElement("div");
  options.className = "options";

  question.options.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "option";

    const input = document.createElement("input");
    input.type = question.type;
    input.name = question.key;
    input.value = option;
    input.checked = question.type === "checkbox"
      ? (answers[question.key] || []).includes(option)
      : answers[question.key] === option;

    const text = document.createElement("span");
    text.textContent = option;

    label.append(input, text);
    options.append(label);
  });

  container.append(options);
}

function saveCurrentAnswer() {
  const question = questions[currentStep];

  if (question.type === "checkbox") {
    answers[question.key] = [
      ...container.querySelectorAll(
        `input[name="${question.key}"]:checked`
      )
    ].map(input => input.value);
  } else if (question.type === "radio") {
    const selected = container.querySelector(
      `input[name="${question.key}"]:checked`
    );
    answers[question.key] = selected ? selected.value : "";
  } else {
    answers[question.key] =
      container.querySelector("textarea").value.trim();
  }
}

function validateCurrentAnswer() {
  const question = questions[currentStep];
  const answer = answers[question.key];

  if (!question.required) return true;

  if (Array.isArray(answer) && answer.length > 0) return true;
  if (typeof answer === "string" && answer.trim().length > 0) {
    return true;
  }

  errorMessage.textContent =
    "Please select an answer before continuing.";
  return false;
}

function showReview() {
  stepLabel.textContent = "REVIEW YOUR ANSWERS";
  progressLabel.textContent = "100%";
  progressBar.style.width = "100%";
  backBtn.hidden = false;
  nextBtn.textContent = "Submit assessment →";

  container.replaceChildren();

  const title = document.createElement("h2");
  title.className = "question-title";
  title.textContent = "Let's review your answers.";

  const help = document.createElement("p");
  help.className = "question-help";
  help.textContent =
    "Check your responses before requesting an explanation.";

  container.append(title, help);

  questions.forEach(question => {
    const section = document.createElement("div");
    section.style.cssText =
      "padding:14px 0;border-bottom:1px solid #e9e2ed;";

    const heading = document.createElement("strong");
    heading.textContent = question.title;
    heading.style.cssText = "display:block;margin-bottom:7px;";

    const answer = document.createElement("p");
    answer.className = "result-copy";
    const value = answers[question.key];
    answer.textContent =
      Array.isArray(value) && value.length
        ? value.join(", ")
        : value || "Not provided";

    section.append(heading, answer);
    container.append(section);
  });

  const note = document.createElement("p");
  note.className = "question-help";
  note.textContent =
    "If you have sudden severe pain, fainting, very heavy bleeding, " +
    "or another potentially urgent symptom, seek prompt medical care " +
    "rather than waiting for an AI assessment.";
  container.append(note);
}


form.addEventListener("submit", async event => {
  event.preventDefault();

  // On the review screen, submit to the backend.
  if (nextBtn.textContent.startsWith("Submit")) {
    await submitAssessment(event);
    return;
  }

  saveCurrentAnswer();

  if (!validateCurrentAnswer()) return;

  if (currentStep < questions.length - 1) {
    currentStep++;
    renderQuestion();
  } else {
    showReview();
  }
});

function submitAssessment(event) {
  event.preventDefault();

  const result = {
    symptoms: (answers.symptoms || []).join("; ") +
      (answers.notes ? `; Additional details: ${answers.notes}` : ""),
    duration: answers.duration || "",
    ageRange: answers.ageRange || "",
    periodPattern: answers.periodPattern || "",
    language: "en"
  };

  // Temporary demo behavior: show what will be submitted.
  // We'll replace this with fetch() to the Node.js backend next.
  container.replaceChildren();

  const title = document.createElement("h2");
  title.className = "result-title";
  title.textContent = "Your answers are ready";

  const message = document.createElement("p");
  message.className = "result-copy";
  message.textContent =
    "Your quiz is complete. Backend connection is the next step; " +
    "this demo has not analysed your symptoms.";

  const summary = document.createElement("pre");
  summary.style.cssText =
    "white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px;";
  summary.textContent = JSON.stringify(result, null, 2);

  container.append(title, message, summary);
  backBtn.hidden = true;
  nextBtn.hidden = true;
  errorMessage.textContent = "";
}

backBtn.addEventListener("click", () => {
  if (currentStep === questions.length - 1 &&
      nextBtn.textContent.startsWith("Submit")) {
    renderQuestion();
    return;
  }

  if (currentStep > 0) {
    currentStep--;
    renderQuestion();
  }
});

renderQuestion();

async function submitAssessment(event) {
  event.preventDefault();

  const result = {
    symptoms: [
      ...(answers.symptoms || []),
      ...(answers.notes ? [`Additional details: ${answers.notes}`] : [])
    ].join("; "),
    duration: answers.duration || "",
    ageRange: answers.ageRange || "",
    periodPattern: answers.periodPattern || "",
    language: "en"
  };

  container.replaceChildren();
  errorMessage.textContent = "";

  const loading = document.createElement("p");
  loading.className = "result-copy";
  loading.textContent = "Preparing your explanation... Please wait.";
  container.append(loading);

  nextBtn.disabled = true;
  backBtn.disabled = true;
  nextBtn.textContent = "Analysing...";

  try {
    const response = await fetch(
      "http://localhost:3000/api/assessment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(result)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to complete the assessment."
      );
    }

    renderAssessment(data.assessment);
  } catch (error) {
    container.replaceChildren();

    const title = document.createElement("h2");
    title.className = "result-title";
    title.textContent = "We couldn't complete your assessment";

    const message = document.createElement("p");
    message.className = "result-copy";
    message.textContent =
      "Please check your connection and try again. " +
      "If the problem continues, you can seek guidance from a healthcare professional.";

    container.append(title, message);
    console.error("Assessment request failed:", error.message);
  } finally {
    nextBtn.disabled = false;
    backBtn.disabled = false;
    nextBtn.textContent = "Submit assessment →";
  }
}

function renderAssessment(assessment) {
  container.replaceChildren();

  const title = document.createElement("h2");
  title.className = "result-title";
  title.textContent = "Your health overview";

  const summary = document.createElement("p");
  summary.className = "result-copy";
  summary.textContent = assessment.summary || "";

  container.append(title, summary);

  function addSection(headingText, items) {
    if (!Array.isArray(items) || items.length === 0) return;

    const heading = document.createElement("h3");
    heading.textContent = headingText;
    heading.style.color = "#50317d";
    container.append(heading);

    const list = document.createElement("ul");
    list.style.lineHeight = "1.8";

    items.forEach(item => {
      const li = document.createElement("li");
      li.textContent = String(item);
      list.append(li);
    });

    container.append(list);
  }

  addSection(
    "Possible explanations",
    assessment.possibleExplanations
  );

  addSection("Suggested next steps", assessment.nextSteps);

  addSection(
    "Questions to consider",
    assessment.followUpQuestions
  );

  if (assessment.disclaimer) {
    const disclaimer = document.createElement("p");
    disclaimer.className = "disclaimer";
    disclaimer.textContent = assessment.disclaimer;
    container.append(disclaimer);
  }

  const reminder = document.createElement("p");
  reminder.className = "result-copy";
  reminder.textContent =
    "This information is educational, not a diagnosis. " +
    "It cannot rule out an urgent health problem.";

  container.append(reminder);

  nextBtn.hidden = true;
  backBtn.hidden = true;
}