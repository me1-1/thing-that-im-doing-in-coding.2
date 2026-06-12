const starterPeople = [
  {
    id: "alex",
    name: "Person 1",
    income: 2800,
    needs: 1580,
    debt: 240,
    fun: 760,
    savingsGoal: 250,
    lessons: [],
    subscriptions: [
      "Netflix", "Hulu", "Disney+", "Max", "Paramount+", "Peacock", "Apple TV+", "Prime Video",
      "Spotify", "Apple Music", "YouTube Premium", "Twitch Turbo", "Discord Nitro", "Xbox Game Pass",
      "PlayStation Plus", "Nintendo Online", "EA Play", "Ubisoft+", "Crunchyroll", "Audible",
      "Kindle Unlimited", "Medium", "Canva", "Adobe Photo", "Grammarly", "Dropbox", "iCloud+",
      "Google One", "Notion AI", "Duolingo", "Calm", "Headspace", "MyFitnessPal", "Strava",
      "Planet Fitness", "ClassPass", "DoorDash DashPass", "Uber One", "Instacart+", "Walmart+",
      "Patreon One", "Patreon Two"
    ].map((name, index) => ({
      id: crypto.randomUUID(),
      name,
      cost: [15.49, 17.99, 13.99, 19.99, 11.99, 7.99, 9.99, 14.99, 10.99, 10.99, 13.99, 11.99, 9.99, 16.99][index % 14],
      cancel: index > 5
    }))
  },
  {
    id: "bri",
    name: "Person 2",
    income: 3400,
    needs: 1960,
    debt: 180,
    fun: 680,
    savingsGoal: 400,
    lessons: [],
    subscriptions: [
      { name: "Spotify", cost: 10.99, cancel: false },
      { name: "Canva", cost: 14.99, cancel: true },
      { name: "Hulu", cost: 17.99, cancel: false },
      { name: "Uber One", cost: 9.99, cancel: true }
    ]
  },
  {
    id: "cam",
    name: "Person 3",
    income: 2200,
    needs: 1320,
    debt: 360,
    fun: 430,
    savingsGoal: 150,
    lessons: [],
    subscriptions: [
      { name: "Game Pass", cost: 16.99, cancel: false },
      { name: "Crunchyroll", cost: 11.99, cancel: false },
      { name: "DoorDash DashPass", cost: 9.99, cancel: true },
      { name: "iCloud+", cost: 2.99, cancel: false },
      { name: "Random editing app", cost: 7.99, cancel: true }
    ]
  },
  {
    id: "drew",
    name: "Person 4",
    income: 4100,
    needs: 2300,
    debt: 520,
    fun: 900,
    savingsGoal: 500,
    lessons: [],
    subscriptions: [
      { name: "Netflix", cost: 15.49, cancel: false },
      { name: "Adobe", cost: 22.99, cancel: false },
      { name: "Gym", cost: 29.99, cancel: false },
      { name: "Old dating app", cost: 19.99, cancel: true },
      { name: "Cloud storage", cost: 9.99, cancel: false },
      { name: "News app", cost: 6.99, cancel: true }
    ]
  }
];

const lessons = [
  {
    id: "job",
    title: "Give money jobs",
    text: "Before spending, split income into needs, savings, debt, and fun. Unassigned money disappears fast."
  },
  {
    id: "subs",
    title: "Audit subscriptions",
    text: "Cancel anything unused in the last 30 days. A small charge is still real money every month."
  },
  {
    id: "wait",
    title: "Use the 24-hour pause",
    text: "For non-essential buys, wait one day. If it still fits the plan tomorrow, it is a choice instead of a reflex."
  },
  {
    id: "save",
    title: "Save first",
    text: "Move savings when income arrives. Waiting until the end of the month usually means saving leftovers that never exist."
  },
  {
    id: "debt",
    title: "Attack expensive debt",
    text: "Pay minimums, then aim extra money at the highest-interest balance first."
  },
  {
    id: "cash",
    title: "Check weekly",
    text: "One 10-minute weekly check prevents a month of guessing and panic."
  }
];

const colors = {
  needs: "#2b6f9f",
  subscriptions: "#b97812",
  debt: "#ba4239",
  fun: "#7a4fb0",
  savings: "#277a4c"
};

let people = loadPeople();
let activeId = people[0].id;
let activeSectionId = "dashboard";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function normalizeSubscriptions(person) {
  person.name = String(person.name || "Person").trim() || "Person";
  person.income = Number(person.income) || 0;
  person.needs = Number(person.needs) || 0;
  person.debt = Number(person.debt) || 0;
  person.fun = Number(person.fun) || 0;
  person.savingsGoal = Number(person.savingsGoal) || 0;
  person.lessons = Array.isArray(person.lessons) ? person.lessons : [];
  person.subscriptions = Array.isArray(person.subscriptions) ? person.subscriptions : [];
  person.subscriptions = person.subscriptions.map((sub) => ({
    id: sub.id || crypto.randomUUID(),
    name: String(sub.name || "Subscription"),
    cost: Number(sub.cost),
    cancel: Boolean(sub.cancel)
  }));
  return person;
}

function loadPeople() {
  const saved = localStorage.getItem("cashCoachPeople");
  if (saved) {
    try {
      const loaded = JSON.parse(saved).map(normalizeSubscriptions);
      return replaceOldDemoNames(loaded);
    } catch {
      localStorage.removeItem("cashCoachPeople");
    }
  }
  return structuredClone(starterPeople).map(normalizeSubscriptions);
}

function savePeople() {
  localStorage.setItem("cashCoachPeople", JSON.stringify(people));
  localStorage.setItem("cashCoachPeopleVersion", "2");
}

function activePerson() {
  return people.find((person) => person.id === activeId);
}

function replaceOldDemoNames(loadedPeople) {
  const legacyNames = ["Alex", "Bri", "Cam", "Drew"];
  const hasLegacyVersion = !localStorage.getItem("cashCoachPeopleVersion");
  const looksLikeOldDemo = loadedPeople.length === 4 && loadedPeople.every((person, index) => person.name === legacyNames[index]);
  if (!hasLegacyVersion || !looksLikeOldDemo) return loadedPeople;

  return loadedPeople.map((person, index) => ({
    ...person,
    name: `Person ${index + 1}`
  }));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sumSubscriptions(person, onlyCancel = false) {
  return person.subscriptions
    .filter((sub) => !onlyCancel || sub.cancel)
    .reduce((total, sub) => total + sub.cost, 0);
}

function calculateScore(person) {
  const subs = sumSubscriptions(person);
  const cancel = sumSubscriptions(person, true);
  const leftover = person.income - person.needs - person.debt - person.fun - subs;
  const savingsRatio = person.savingsGoal / Math.max(person.income, 1);
  const subRatio = subs / Math.max(person.income, 1);
  const lessonPoints = (person.lessons.length / lessons.length) * 20;
  const base = 52 + lessonPoints + Math.min(18, Math.max(0, leftover / person.income * 100)) + Math.min(10, savingsRatio * 120);
  const penalty = Math.min(38, subRatio * 160) - Math.min(12, cancel / Math.max(subs, 1) * 12);
  return Math.max(5, Math.min(100, Math.round(base - penalty)));
}

function render() {
  const person = activePerson();
  renderPeopleForm();
  renderTabs();
  renderStats(person);
  renderBars(person);
  renderSubscriptions(person);
  renderBudgetForm(person);
  renderLessons(person);
  renderGroup();
  savePeople();
}

function renderPeopleForm() {
  const form = document.querySelector("#peopleForm");
  form.innerHTML = people.map((person, index) => `
    <label>
      Person ${index + 1} name
      <input type="text" value="${escapeHtml(person.name)}" data-name="${person.id}" maxlength="32" placeholder="Enter a name">
    </label>
  `).join("");
}

function renderTabs() {
  const tabs = document.querySelector("#personTabs");
  tabs.innerHTML = people.map((person) => `
    <button class="person-tab ${person.id === activeId ? "active" : ""}" type="button" data-person="${person.id}" role="tab" aria-selected="${person.id === activeId}">
      ${escapeHtml(person.name)}
    </button>
  `).join("");
}

function renderStats(person) {
  const subs = sumSubscriptions(person);
  const cancel = sumSubscriptions(person, true);
  const score = calculateScore(person);
  const leftover = person.income - person.needs - person.debt - person.fun - subs;
  const risk = Math.min(100, Math.max(0, Math.round((subs / Math.max(person.income, 1)) * 100 + (leftover < 0 ? 35 : 0) + (person.fun / Math.max(person.income, 1)) * 22)));

  document.querySelector("#incomeStat").textContent = money.format(person.income);
  document.querySelector("#subscriptionStat").textContent = money.format(subs);
  document.querySelector("#possibleSavingsStat").textContent = money.format(cancel);
  document.querySelector("#riskStat").textContent = `${risk}/100`;
  document.querySelector("#activePersonName").textContent = `${person.name}'s money snapshot`;
  document.querySelector("#scoreBar").style.width = `${score}%`;
  document.querySelector("#scoreText").textContent = `Score: ${score} out of 100`;
  document.querySelector("#coachSummary").textContent = getCoachSummary(person, leftover, subs, cancel);
}

function getCoachSummary(person, leftover, subs, cancel) {
  if (subs > person.income * 0.12) {
    return `${person.name} is losing ${money.format(subs)} each month to subscriptions. Start by canceling the marked apps and redirect ${money.format(cancel)} to savings or debt.`;
  }
  if (leftover < 0) {
    return `${person.name} is spending ${money.format(Math.abs(leftover))} more than income after planned categories. Cut fun spending or subscriptions before adding anything new.`;
  }
  if (person.savingsGoal < person.income * 0.1) {
    return `${person.name} has room to improve. A useful next goal is saving at least 10% of income before fun spending starts.`;
  }
  return `${person.name} is close to a healthy plan. Keep checking weekly and make sure unused subscriptions do not creep back in.`;
}

function renderBars(person) {
  const subs = sumSubscriptions(person);
  const savings = Math.max(0, person.savingsGoal);
  const rows = [
    ["Needs", person.needs, colors.needs],
    ["Subs", subs, colors.subscriptions],
    ["Debt", person.debt, colors.debt],
    ["Fun", person.fun, colors.fun],
    ["Savings", savings, colors.savings]
  ];
  document.querySelector("#cashBars").innerHTML = rows.map(([label, value, color]) => {
    const width = Math.min(100, value / Math.max(person.income, 1) * 100);
    return `
      <div class="cash-row">
        <strong>${label}</strong>
        <span class="cash-track"><span class="cash-fill" style="width:${width}%;background:${color}"></span></span>
        <span>${money.format(value)}</span>
      </div>
    `;
  }).join("");
}

function renderSubscriptions(person) {
  document.querySelector("#cancelTotal").textContent = `${money.format(sumSubscriptions(person, true))}/mo`;
  document.querySelector("#subscriptionList").innerHTML = person.subscriptions.map((sub) => `
      <article class="subscription-item ${sub.cancel ? "cancel" : ""}">
      <span class="sub-title">${escapeHtml(sub.name)}</span>
      <span class="sub-cost">${money.format(sub.cost)}</span>
      <button class="toggle-btn" type="button" data-sub="${sub.id}">${sub.cancel ? "Cancel" : "Keep"}</button>
      <button class="delete-btn" type="button" data-delete="${sub.id}" aria-label="Delete ${escapeHtml(sub.name)}">x</button>
    </article>
  `).join("");
}

function renderBudgetForm(person) {
  document.querySelector("#incomeInput").value = person.income;
  document.querySelector("#needsInput").value = person.needs;
  document.querySelector("#debtInput").value = person.debt;
  document.querySelector("#funInput").value = person.fun;
  document.querySelector("#savingsGoalInput").value = person.savingsGoal;

  const subs = sumSubscriptions(person);
  const leftover = person.income - person.needs - person.debt - person.fun - subs - person.savingsGoal;
  const advice = [];

  if (person.needs > person.income * 0.55) advice.push("Needs are above 55% of income. Look for cheaper fixed bills before blaming small purchases.");
  if (subs > person.income * 0.08) advice.push("Subscriptions are too high. Aim under 8% of income and cancel anything you forgot you had.");
  if (person.fun > person.income * 0.2) advice.push("Fun spending is above 20% of income. Set a weekly limit so it does not drain the whole month.");
  if (person.savingsGoal < person.income * 0.1) advice.push("Savings should eventually reach at least 10% of income. Start smaller if needed, but make it automatic.");
  if (leftover < 0) advice.push(`This plan is short by ${money.format(Math.abs(leftover))}. Reduce a category before the month begins.`);
  if (!advice.length) advice.push("This plan is balanced. Keep the weekly check-in and protect the savings goal first.");

  document.querySelector("#budgetAdvice").innerHTML = advice.map((item) => `<li>${item}</li>`).join("");
}

function renderLessons(person) {
  document.querySelector("#lessonGrid").innerHTML = lessons.map((lesson) => {
    const checked = person.lessons.includes(lesson.id);
    return `
      <article class="lesson-card">
        <h3>${escapeHtml(lesson.title)}</h3>
        <p>${escapeHtml(lesson.text)}</p>
        <label>
          <input type="checkbox" data-lesson="${lesson.id}" ${checked ? "checked" : ""}>
          Practiced this
        </label>
      </article>
    `;
  }).join("");
}

function renderGroup() {
  document.querySelector("#groupGrid").innerHTML = people.map((person) => {
    const score = calculateScore(person);
    const cancel = sumSubscriptions(person, true);
    return `
      <article class="group-card">
        <h3>${escapeHtml(person.name)}</h3>
        <span class="group-score">${score}</span>
        <div class="meter"><span style="width:${score}%"></span></div>
        <p>${person.lessons.length}/${lessons.length} lessons practiced. ${money.format(cancel)} monthly waste marked for cancellation.</p>
      </article>
    `;
  }).join("");
}

document.addEventListener("click", (event) => {
  const navButton = event.target.closest("[data-jump]");
  if (navButton) {
    activeSectionId = navButton.dataset.jump;
    updateActiveNav();
    document.getElementById(activeSectionId)?.scrollIntoView({ behavior: "auto", block: "start" });
    return;
  }

  const personButton = event.target.closest("[data-person]");
  if (personButton) {
    activeId = personButton.dataset.person;
    render();
    return;
  }

  const toggleButton = event.target.closest("[data-sub]");
  if (toggleButton) {
    const person = activePerson();
    const sub = person.subscriptions.find((item) => item.id === toggleButton.dataset.sub);
    sub.cancel = !sub.cancel;
    render();
    return;
  }

  const deleteButton = event.target.closest("[data-delete]");
  if (deleteButton) {
    const person = activePerson();
    person.subscriptions = person.subscriptions.filter((item) => item.id !== deleteButton.dataset.delete);
    render();
  }
});

function updateActiveNav() {
  document.querySelectorAll("[data-jump]").forEach((button) => {
    const isActive = button.dataset.jump === activeSectionId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

document.querySelector("#peopleForm").addEventListener("input", (event) => {
  if (!event.target.matches("[data-name]")) return;
  const person = people.find((item) => item.id === event.target.dataset.name);
  if (!person) return;
  person.name = event.target.value.trim() || `Person ${people.indexOf(person) + 1}`;
  renderTabs();
  renderStats(activePerson());
  renderGroup();
  savePeople();
});

document.querySelector("#subForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const nameInput = document.querySelector("#subName");
  const costInput = document.querySelector("#subCost");
  const name = nameInput.value.trim();
  const cost = Number(costInput.value);
  if (!name || !Number.isFinite(cost) || cost <= 0) return;

  activePerson().subscriptions.push({
    id: crypto.randomUUID(),
    name,
    cost,
    cancel: true
  });
  nameInput.value = "";
  costInput.value = "";
  render();
});

document.querySelector("#budgetForm").addEventListener("input", (event) => {
  const person = activePerson();
  const fieldMap = {
    incomeInput: "income",
    needsInput: "needs",
    debtInput: "debt",
    funInput: "fun",
    savingsGoalInput: "savingsGoal"
  };
  const key = fieldMap[event.target.id];
  if (!key) return;
  person[key] = Math.max(0, Number(event.target.value) || 0);
  document.querySelector("#planStatus").textContent = "Saved just now";
  render();
});

document.querySelector("#lessonGrid").addEventListener("change", (event) => {
  if (!event.target.matches("[data-lesson]")) return;
  const person = activePerson();
  const lessonId = event.target.dataset.lesson;
  if (event.target.checked && !person.lessons.includes(lessonId)) {
    person.lessons.push(lessonId);
  } else {
    person.lessons = person.lessons.filter((id) => id !== lessonId);
  }
  render();
});

document.querySelector("#purchaseForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#purchaseName").value.trim() || "that purchase";
  const price = Number(document.querySelector("#purchasePrice").value);
  const hourly = Number(document.querySelector("#hourlyPay").value);
  const result = document.querySelector("#purchaseResult");
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(hourly) || hourly <= 0) return;

  const hours = price / hourly;
  const person = activePerson();
  const subs = sumSubscriptions(person);
  const leftover = person.income - person.needs - person.debt - person.fun - subs - person.savingsGoal;
  const verdict = price > leftover
    ? `Wait. This purchase costs more than this month's unassigned money.`
    : `Possible, but only after savings and bills are protected.`;

  result.style.display = "block";
  result.textContent = `${verdict} It costs about ${hours.toFixed(1)} work hours before taxes. Use the 24-hour pause before buying.`;
});

document.querySelector("#resetData").addEventListener("click", () => {
  localStorage.removeItem("cashCoachPeople");
  localStorage.removeItem("cashCoachPeopleVersion");
  people = structuredClone(starterPeople).map(normalizeSubscriptions);
  activeId = people[0].id;
  render();
});

render();
updateActiveNav();
