const febHolidays = [
    "Dear Baby,",
    "First of all, I love you❤️",
    "You're my everything",
    "You are my soulmate",
    "And of course...",
    "My future wife🤭",
    "I will always be there for you",
    "No matter how far we are🥰",
    "You're the prettiest, cutest, funniest,",
    "sweetest girl alive.",
    "In one word, you're just perfect.😍",
    "I'm the happiest man alive🥰",
    "I'm so grateful I met you❤️",
    "I'll always do my best to keep you happy🥺",
    "You are the most special person in my life🥰",
    "I don't want to lose you",
    "And trust me I dont want anyone else",
    "There's no one better than you❤️",
    "You're the best baby!!",
    "Or should I say, mo gro coco d'amour que j'adore a la folie XD",
    "Wow!! Time flies, we've already been together for 3 years",
    "There's some hardships,",
    "but we overcame most of them",
    "and it made me realised how important you are in my life❤️",
    "You're the love of my life,",
    "I Love You So much❤️",
    "Happy Birthday to the love of my life! 🌟",
    "Every day with you is a beautiful adventure. 🎉",
    "You make my heart smile. 😘",
    "To the one who lights up my world, happy birthday! 🎂",
    "I feel so blessed to have you in my life. 💕",
  ];
  const ulEl = document.querySelector("ul");
const d = new Date();
let daynumber = d.getMonth() == 1 ? d.getDate() - 1 : 0;
let activeIndex = daynumber;
const rotate = -360 / febHolidays.length;
let startY, moveY;

init();

function init() {
  febHolidays.forEach((holiday, idx) => {
    const liEl = document.createElement("li");
    liEl.style.setProperty("--day_idx", idx);
    liEl.innerHTML = `<time datetime="2022-02-${idx + 1}">${
      idx + 1
    }</time><span>${holiday}</span>`;
    ulEl.append(liEl);
  });
  ulEl.style.setProperty("--rotateDegrees", rotate);
  adjustDay(0);

  // Add touch event listeners
  ulEl.addEventListener("touchstart", handleTouchStart, false);
  ulEl.addEventListener("touchmove", handleTouchMove, false);
}

function adjustDay(nr) {
  daynumber += nr;
  ulEl.style.setProperty("--currentDay", daynumber);
  const activeEl = document.querySelector("li.active");
  if (activeEl) activeEl.classList.remove("active");
  activeIndex = (activeIndex + nr + febHolidays.length) % febHolidays.length;
  const newActiveEl = document.querySelector(
    `li:nth-child(${activeIndex + 1})`
  );
  document.body.style.backgroundColor = window.getComputedStyle(
    newActiveEl
  ).backgroundColor;
  newActiveEl.classList.add("active");
}

function handleTouchStart(e) {
  const firstTouch = e.touches[0];
  startY = firstTouch.clientY;
}

function handleTouchMove(e) {
  if (!startY) {
    return;
  }

  moveY = e.touches[0].clientY;

  const diffY = startY - moveY;

  if (diffY > 0) {
    adjustDay(1); // Swipe up
  } else {
    adjustDay(-1); // Swipe down
  }

  startY = null; // Reset startY to prevent continuous scrolling
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      adjustDay(-1);
      break;
    case "ArrowDown":
      adjustDay(1);
      break;
    default:
      return;
  }
});