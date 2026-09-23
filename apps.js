/* =====================================================
   MO GYM PRO 2.0
   Workout Engine - Version 1
===================================================== */


/* ================= DATA ================= */

const defaultData = {
  profile: null,

  weightHistory: [],

  workouts: [],

  xp: 0,

  level: 1,

  streak: {
    current: 0,
    longest: 0,
    lastWorkoutDate: null
  },

  settings: {
    darkMode: false,
    restTimer: true,
    language: "ar"
  }
};


let appData =
  JSON.parse(localStorage.getItem("moGymProData")) ||
  structuredClone(defaultData);


/* ================= SAVE ================= */

function saveData() {
  localStorage.setItem(
    "moGymProData",
    JSON.stringify(appData)
  );
}


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {

  if (appData.profile) {
    showApp();
  } else {
    showOnboarding();
  }

  setupOnboarding();

  renderWorkoutSystems();
  updateHome();
  updateProfile();
  renderWeightHistory();

  if (appData.settings.darkMode) {
    document.body.classList.add("dark");
  }

});


/* ================= ONBOARDING ================= */

function showOnboarding() {

  document.getElementById("onboarding")
    .classList.remove("hidden");

  document.getElementById("app")
    .classList.add("hidden");

}


function showApp() {

  document.getElementById("onboarding")
    .classList.add("hidden");

  document.getElementById("app")
    .classList.remove("hidden");

}


function setupOnboarding() {

  const form =
    document.getElementById("onboardingForm");

  form.addEventListener("submit", function(e) {

    e.preventDefault();

    const gender =
      document.querySelector(
        'input[name="gender"]:checked'
      ).value;

    appData.profile = {

      name:
        document.getElementById("nameInput").value.trim(),

      age:
        Number(document.getElementById("ageInput").value),

      gender,

      height:
        Number(document.getElementById("heightInput").value),

      weight:
        Number(document.getElementById("weightInput").value),

      goal:
        document.getElementById("goalInput").value,

      activity:
        document.getElementById("activityInput").value,

      workoutDays:
        Number(document.getElementById("daysInput").value),

      lastWeightUpdate:
        getToday()

    };


    appData.weightHistory = [

      {
        date: getToday(),
        weight: appData.profile.weight
      }

    ];


    saveData();

    showApp();

    updateHome();

    updateProfile();

    renderWeightHistory();

  });

}


/* ================= NAVIGATION ================= */

function showPage(pageId) {

  document.querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove("active");

    });

  const page =
    document.getElementById(pageId);

  if (page) {
    page.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* ================= HOME ================= */

function updateHome() {

  if (!appData.profile) return;

  document.getElementById("homeGreeting")
    .textContent =
      `أهلاً ${appData.profile.name} 👋`;

  document.getElementById("homeWeight")
    .textContent =
      `${appData.profile.weight} kg`;

  document.getElementById("homeHeight")
    .textContent =
      `${appData.profile.height} cm`;

  document.getElementById("homeWorkouts")
    .textContent =
      appData.workouts.length;

  document.getElementById("homeStreak")
    .textContent =
      appData.streak.current;

  updateXP();

}


/* ================= XP ================= */

function updateXP() {

  const xp = appData.xp;

  const xpPerLevel = 100;

  const level =
    Math.floor(xp / xpPerLevel) + 1;

  appData.level = level;

  const currentLevelXP =
    xp % xpPerLevel;

  document.getElementById("levelValue")
    .textContent = level;

  document.getElementById("xpValue")
    .textContent = currentLevelXP;

  document.getElementById("xpProgress")
    .style.width =
      `${currentLevelXP}%`;

}


/* ================= PROFILE ================= */

function updateProfile() {

  if (!appData.profile) return;

  const p = appData.profile;

  document.getElementById("profileName")
    .textContent = p.name;

  document.getElementById("profileAge")
    .textContent = p.age;

  document.getElementById("profileGender")
    .textContent =
      p.gender === "male"
        ? "ذكر"
        : "أنثى";

  document.getElementById("profileHeight")
    .textContent =
      `${p.height} cm`;

  document.getElementById("profileWeight")
    .textContent =
      `${p.weight} kg`;

  const goals = {

    gain: "زيادة الوزن والعضلات",

    maintain: "المحافظة على الوزن",

    lose: "خسارة الدهون والوزن"

  };

  document.getElementById("profileGoal")
    .textContent =
      goals[p.goal] || p.goal;

}


/* ================= WEIGHT ================= */

function openWeightUpdate() {

  document.getElementById("weightModal")
    .classList.remove("hidden");

  document.getElementById("newWeightInput")
    .value =
      appData.profile.weight;

}


function closeWeightUpdate() {

  document.getElementById("weightModal")
    .classList.add("hidden");

}


function saveWeightUpdate() {

  const input =
    document.getElementById("newWeightInput");

  const newWeight =
    Number(input.value);

  if (!newWeight || newWeight <= 0) {

    alert("دخل وزن صحيح");

    return;

  }


  appData.profile.weight =
    newWeight;

  appData.profile.lastWeightUpdate =
    getToday();


  appData.weightHistory.push({

    date: getToday(),

    weight: newWeight

  });


  saveData();

  updateHome();

  updateProfile();

  renderWeightHistory();

  closeWeightUpdate();

}


function renderWeightHistory() {

  const container =
    document.getElementById(
      "weightHistoryList"
    );

  if (!container) return;

  if (!appData.weightHistory.length) {

    container.innerHTML =
      "<p>لا يوجد سجل أوزان حتى الآن.</p>";

    return;

  }


  const history =
    [...appData.weightHistory]
      .reverse();


  container.innerHTML = "";


  history.forEach((entry, index) => {

    const previous =
      history[index + 1];

    let changeText = "";

    if (previous) {

      const change =
        entry.weight - previous.weight;

      if (change > 0) {

        changeText =
          `<span>+${change.toFixed(1)} kg</span>`;

      } else if (change < 0) {

        changeText =
          `<span>${change.toFixed(1)} kg</span>`;

      } else {

        changeText =
          `<span>0 kg</span>`;

      }

    }


    const row =
      document.createElement("div");

    row.style.padding = "15px 0";

    row.style.borderBottom =
      "1px solid var(--border)";

    row.innerHTML = `

      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;
      ">

        <div>

          <strong>
            ${entry.weight} kg
          </strong>

          <small style="
            display:block;
            color:var(--muted);
            margin-top:4px;
          ">
            ${entry.date}
          </small>

        </div>

        <div>
          ${changeText}
        </div>

      </div>

    `;


    container.appendChild(row);

  });

}


/* =====================================================
   WORKOUT ENGINE
===================================================== */


/* ================= WORKOUT DATA ================= */

const workoutSystems = {

  PPLUL: {

    name: "PPLUL",

    icon: "🔥",

    description: "Push / Pull / Legs / Upper / Lower",

    days: [

      {
        name: "Push",
        muscles: "Chest • Shoulders • Triceps",
        exercises: [

          {
            name: "Barbell Bench Press",
            defaultSets: 3
          },

          {
            name: "Incline Dumbbell Press",
            defaultSets: 3
          },

          {
            name: "Cable Fly",
            defaultSets: 3
          },

          {
            name: "Dumbbell Shoulder Press",
            defaultSets: 3
          },

          {
            name: "Lateral Raise",
            defaultSets: 3
          },

          {
            name: "Triceps Pushdown",
            defaultSets: 3
          }

        ]
      },


      {
        name: "Pull",
        muscles: "Back • Rear Delts • Biceps",
        exercises: [

          {
            name: "Lat Pulldown",
            defaultSets: 3
          },

          {
            name: "Barbell Row",
            defaultSets: 3
          },

          {
            name: "Seated Cable Row",
            defaultSets: 3
          },

          {
            name: "Face Pull",
            defaultSets: 3
          },

          {
            name: "Dumbbell Curl",
            defaultSets: 3
          },

          {
            name: "Hammer Curl",
            defaultSets: 3
          }

        ]
      },


      {
        name: "Legs",
        muscles: "Quads • Hamstrings • Glutes • Calves",
        exercises: [

          {
            name: "Squat",
            defaultSets: 3
          },

          {
            name: "Leg Press",
            defaultSets: 3
          },

          {
            name: "Leg Curl",
            defaultSets: 3
          },

          {
            name: "Leg Extension",
            defaultSets: 3
          },

          {
            name: "Calf Raise",
            defaultSets: 3
          }

        ]
      },


      {
        name: "Upper",
        muscles: "Upper Body",
        exercises: [

          {
            name: "Bench Press",
            defaultSets: 3
          },

          {
            name: "Lat Pulldown",
            defaultSets: 3
          },

          {
            name: "Shoulder Press",
            defaultSets: 3
          },

          {
            name: "Seated Row",
            defaultSets: 3
          },

          {
            name: "Biceps Curl",
            defaultSets: 3
          },

          {
            name: "Triceps Pushdown",
            defaultSets: 3
          }

        ]
      },


      {
        name: "Lower",
        muscles: "Legs",
        exercises: [

          {
            name: "Squat",
            defaultSets: 3
          },

          {
            name: "Romanian Deadlift",
            defaultSets: 3
          },

          {
            name: "Leg Press",
            defaultSets: 3
          },

          {
            name: "Leg Curl",
            defaultSets: 3
          },

          {
            name: "Calf Raise",
            defaultSets: 3
          }

        ]
      }

    ]

  },


  PPL: {

    name: "PPL",

    icon: "💪",

    description: "Push / Pull / Legs",

    days: [

      {
        name: "Push",
        muscles: "Chest • Shoulders • Triceps",
        exercises: [

          { name: "Bench Press", defaultSets: 3 },

          { name: "Incline Dumbbell Press", defaultSets: 3 },

          { name: "Shoulder Press", defaultSets: 3 },

          { name: "Lateral Raise", defaultSets: 3 },

          { name: "Triceps Pushdown", defaultSets: 3 }

        ]
      },


      {
        name: "Pull",
        muscles: "Back • Biceps",
        exercises: [

          { name: "Lat Pulldown", defaultSets: 3 },

          { name: "Barbell Row", defaultSets: 3 },

          { name: "Seated Row", defaultSets: 3 },

          { name: "Dumbbell Curl", defaultSets: 3 },

          { name: "Hammer Curl", defaultSets: 3 }

        ]
      },


      {
        name: "Legs",
        muscles: "Quads • Hamstrings • Glutes",
        exercises: [

          { name: "Squat", defaultSets: 3 },

          { name: "Leg Press", defaultSets: 3 },

          { name: "Romanian Deadlift", defaultSets: 3 },

          { name: "Leg Curl", defaultSets: 3 },

          { name: "Calf Raise", defaultSets: 3 }

        ]
      }

    ]

  },


  ARNOLD: {

    name: "Arnold Split",

    icon: "🏆",

    description: "Chest/Back • Shoulders/Arms • Legs",

    days: [

      {
        name: "Chest + Back",
        muscles: "Chest • Back",
        exercises: [

          { name: "Bench Press", defaultSets: 3 },

          { name: "Incline Press", defaultSets: 3 },

          { name: "Lat Pulldown", defaultSets: 3 },

          { name: "Barbell Row", defaultSets: 3 },

          { name: "Cable Fly", defaultSets: 3 }

        ]
      },


      {
        name: "Shoulders + Arms",
        muscles: "Shoulders • Biceps • Triceps",
        exercises: [

          { name: "Shoulder Press", defaultSets: 3 },

          { name: "Lateral Raise", defaultSets: 3 },

          { name: "Biceps Curl", defaultSets: 3 },

          { name: "Hammer Curl", defaultSets: 3 },

          { name: "Triceps Pushdown", defaultSets: 3 }

        ]
      },


      {
        name: "Legs",
        muscles: "Legs",
        exercises: [

          { name: "Squat", defaultSets: 3 },

          { name: "Leg Press", defaultSets: 3 },

          { name: "Romanian Deadlift", defaultSets: 3 },

          { name: "Leg Curl", defaultSets: 3 },

          { name: "Calf Raise", defaultSets: 3 }

        ]
      }

    ]

  },


  TORSO_LIMBS: {

    name: "Torso / Limbs",

    icon: "⚡",

    description: "Torso / Arms & Legs",

    days: [

      {
        name: "Torso",
        muscles: "Chest • Back • Shoulders",
        exercises: [

          { name: "Bench Press", defaultSets: 3 },

          { name: "Lat Pulldown", defaultSets: 3 },

          { name: "Seated Row", defaultSets: 3 },

          { name: "Shoulder Press", defaultSets: 3 },

          { name: "Lateral Raise", defaultSets: 3 }

        ]
      },


      {
        name: "Limbs",
        muscles: "Arms • Legs",
        exercises: [

          { name: "Squat", defaultSets: 3 },

          { name: "Leg Curl", defaultSets: 3 },

          { name: "Biceps Curl", defaultSets: 3 },

          { name: "Hammer Curl", defaultSets: 3 },

          { name: "Triceps Pushdown", defaultSets: 3 }

        ]
      }

    ]

  },


  UPPER_LOWER: {

    name: "Upper / Lower",

    icon: "🔄",

    description: "Upper Body / Lower Body",

    days: [

      {
        name: "Upper",
        muscles: "Chest • Back • Shoulders • Arms",
        exercises: [

          { name: "Bench Press", defaultSets: 3 },

          { name: "Lat Pulldown", defaultSets: 3 },

          { name: "Shoulder Press", defaultSets: 3 },

          { name: "Seated Row", defaultSets: 3 },

          { name: "Biceps Curl", defaultSets: 3 },

          { name: "Triceps Pushdown", defaultSets: 3 }

        ]
      },


      {
        name: "Lower",
        muscles: "Legs",
        exercises: [

          { name: "Squat", defaultSets: 3 },

          { name: "Romanian Deadlift", defaultSets: 3 },

          { name: "Leg Press", defaultSets: 3 },

          { name: "Leg Curl", defaultSets: 3 },

          { name: "Calf Raise", defaultSets: 3 }

        ]
      }

    ]

  },


  FULL_BODY: {

    name: "Full Body",

    icon: "🧱",

    description: "الجسم كامل في الحصة",

    days: [

      {
        name: "Full Body",
        muscles: "Full Body",
        exercises: [

          { name: "Squat", defaultSets: 3 },

          { name: "Bench Press", defaultSets: 3 },

          { name: "Lat Pulldown", defaultSets: 3 },

          { name: "Shoulder Press", defaultSets: 3 },

          { name: "Biceps Curl", defaultSets: 2 },

          { name: "Triceps Pushdown", defaultSets: 2 }

        ]
      }

    ]

  },


  CUSTOM: {

    name: "Custom",

    icon: "⚙️",

    description: "نظامك الخاص",

    days: [

      {
        name: "Custom Workout",
        muscles: "اختيارك",
        exercises: [

          { name: "Bench Press", defaultSets: 3 },

          { name: "Lat Pulldown", defaultSets: 3 },

          { name: "Squat", defaultSets: 3 }

        ]
      }

    ]

  }

};


/* ================= WORKOUT STATE ================= */

let currentSystem = null;

let currentDay = null;


/* ================= RENDER SYSTEMS ================= */

function renderWorkoutSystems() {

  const container =
    document.getElementById(
      "workoutSystems"
    );

  if (!container) return;

  container.innerHTML = "";


  Object.entries(workoutSystems)
    .forEach(([key, system]) => {

      const card =
        document.createElement("button");

      card.className =
        "system-card";

      card.innerHTML = `

        <div class="system-icon">
          ${system.icon}
        </div>

        <h3>
          ${system.name}
        </h3>

        <p>
          ${system.description}
        </p>

      `;


      card.onclick = () =>
        selectWorkoutSystem(key);


      container.appendChild(card);

    });

}


/* ================= SELECT SYSTEM ================= */

function selectWorkoutSystem(key) {

  currentSystem = key;

  const system =
    workoutSystems[key];

  document
    .getElementById("workoutSystems")
    .classList.add("hidden");


  document
    .getElementById("workoutDaysSection")
    .classList.remove("hidden");


  document
    .getElementById("selectedSystemTitle")
    .textContent =
      system.name;


  renderWorkoutDays(system);

}


/* ================= DAYS ================= */

function renderWorkoutDays(system) {

  const container =
    document.getElementById(
      "workoutDays"
    );

  container.innerHTML = "";


  system.days.forEach((day, index) => {

    const card =
      document.createElement("button");

    card.className =
      "day-card";

    card.innerHTML = `

      <h3>
        ${day.name}
      </h3>

      <p>
        ${day.muscles}
      </p>

    `;


    card.onclick = () =>
      selectWorkoutDay(index);


    container.appendChild(card);

  });

}


/* ================= SELECT DAY ================= */

function selectWorkoutDay(index) {

  currentDay = index;

  const system =
    workoutSystems[currentSystem];

  const day =
    system.days[index];


  document
    .getElementById("workoutDaysSection")
    .classList.add("hidden");


  document
    .getElementById("exerciseSection")
    .classList.remove("hidden");


  document
    .getElementById("selectedDayTitle")
    .textContent =
      day.name;


  document
    .getElementById("selectedDaySubtitle")
    .textContent =
      day.muscles;


  renderExercises(day);

}


/* ================= EXERCISES ================= */

function renderExercises(day) {

  const container =
    document.getElementById(
      "exerciseList"
    );

  container.innerHTML = "";


  day.exercises.forEach(
    (exercise, exerciseIndex) => {

      const card =
        document.createElement("div");

      card.className =
        "exercise-card";


      card.dataset.exerciseIndex =
        exerciseIndex;


      let setsHTML = "";


      for (
        let i = 1;
        i <= exercise.defaultSets;
        i++
      ) {

        setsHTML += createSetHTML(i);

      }


      card.innerHTML = `

        <div class="exercise-header">

          <div>

            <h3>
              ${exercise.name}
            </h3>

            <small>
              ${exercise.defaultSets} Sets
            </small>

          </div>

        </div>

        <div class="sets-container">

          ${setsHTML}

        </div>

        <button
          class="add-set-btn"
          onclick="addSet(this)"
        >
          + إضافة مجموعة
        </button>

      `;


      container.appendChild(card);

    }
  );

}


/* ================= SET HTML ================= */

function createSetHTML(number) {

  return `

    <div class="set-row">

      <div class="set-number">
        ${number}
      </div>

      <input
        type="number"
        step="0.5"
        placeholder="kg"
        class="weight-input"
      >

      <input
        type="number"
        placeholder="Reps"
        class="reps-input"
      >

      <button
        class="set-complete"
        onclick="toggleSet(this)"
      >
        ✓
      </button>

    </div>

  `;

}


/* ================= TOGGLE SET ================= */

function toggleSet(button) {

  button.classList.toggle(
    "completed"
  );

}


/* ================= ADD SET ================= */

function addSet(button) {

  const exerciseCard =
    button.closest(".exercise-card");

  const container =
    exerciseCard.querySelector(
      ".sets-container"
    );


  const setCount =
    container.querySelectorAll(
      ".set-row"
    ).length + 1;


  container.insertAdjacentHTML(
    "beforeend",
    createSetHTML(setCount)
  );

}


/* ================= BACK ================= */

function backToSystems() {

  document
    .getElementById("workoutDaysSection")
    .classList.add("hidden");

  document
    .getElementById("exerciseSection")
    .classList.add("hidden");

  document
    .getElementById("workoutSystems")
    .classList.remove("hidden");

  currentSystem = null;

  currentDay = null;

}


function backToDays() {

  document
    .getElementById("exerciseSection")
    .classList.add("hidden");

  document
    .getElementById("workoutDaysSection")
    .classList.remove("hidden");

}


/* =====================================================
   FINISH WORKOUT
===================================================== */

document
  .getElementById("finishWorkoutBtn")
  .addEventListener(
    "click",
    finishWorkout
  );


function finishWorkout() {

  if (
    currentSystem === null ||
    currentDay === null
  ) {

    return;

  }


  const system =
    workoutSystems[currentSystem];

  const day =
    system.days[currentDay];


  const exerciseCards =
    document.querySelectorAll(
      ".exercise-card"
    );


  const exercises = [];


  exerciseCards.forEach(card => {

    const exerciseName =
      card.querySelector("h3")
        .textContent;


    const sets = [];


    card
      .querySelectorAll(".set-row")
      .forEach(row => {

        const weight =
          Number(
            row.querySelector(
              ".weight-input"
            ).value
          ) || 0;


        const reps =
          Number(
            row.querySelector(
              ".reps-input"
            ).value
          ) || 0;


        const completed =
          row
            .querySelector(
              ".set-complete"
            )
            .classList
            .contains("completed");


        sets.push({

          weight,

          reps,

          completed

        });

      });


    exercises.push({

      name: exerciseName,

      sets

    });

  });


  const workout = {

    id: Date.now(),

    date: getToday(),

    system:
      system.name,

    day:
      day.name,

    exercises

  };


  appData.workouts.push(
    workout
  );


  /*
     مؤقتًا هنضيف XP بسيط.
     هنطور نظام الـXP الحقيقي بعدين.
  */

  appData.xp += 100;


  updateStreak();


  saveData();


  updateHome();


  alert(
    "🔥 تمرين ممتاز! تم حفظ التمرين +100 XP"
  );


  backToSystems();

  showPage("homePage");

}


/* ================= STREAK ================= */

function updateStreak() {

  const today =
    getToday();

  const last =
    appData.streak.lastWorkoutDate;


  if (!last) {

    appData.streak.current = 1;

    appData.streak.longest = 1;

  }

  else if (last === today) {

    return;

  }

  else {

    const difference =
      dateDifference(
        last,
        today
      );


    if (difference === 1) {

      appData.streak.current++;

    }

    else {

      appData.streak.current = 1;

    }


    if (
      appData.streak.current >
      appData.streak.longest
    ) {

      appData.streak.longest =
        appData.streak.current;

    }

  }


  appData.streak.lastWorkoutDate =
    today;

}


/* ================= HELPERS ================= */

function getToday() {

  const date =
    new Date();

  return date
    .toISOString()
    .split("T")[0];

}


function dateDifference(
  firstDate,
  secondDate
) {

  const first =
    new Date(firstDate);

  const second =
    new Date(secondDate);


  const difference =
    second - first;


  return Math.round(
    difference /
    (1000 * 60 * 60 * 24)
  );

}
