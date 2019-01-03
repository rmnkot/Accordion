"use strict";

// getting height of content wrapper
const wrapperHeight = el => {
  return el.firstElementChild.getBoundingClientRect().height;
}

function func(open, container) {
  if (open) {
    container.style.height = `${wrapperHeight(container)}px`;
  }

  flag = false;

  if (document.querySelector(".acc").getBoundingClientRect().top < -300) {
    smoothScroll(".acc");
  }
}

// resizing of opened block
window.addEventListener("resize", () => {
  const expanded = document.querySelector(".acc__expandable[aria-hidden='false']");

  if (expanded) {
    expanded.style.height = `${wrapperHeight(expanded)}px`;
  }
})

// flag for transition end testing
let flag = false;

// toggling of expandable accordion block on click
document.querySelector(".acc").addEventListener("click", e => {

  if (!flag) {
    const btns = document.querySelectorAll("[class*='acc__btn']");
    const btn = e.target;
    const container = btn.nextElementSibling;

    flag = true;

    if (btn.hasAttribute("aria-controls")) {

      if (btn.getAttribute("aria-expanded") === "false") {

        btns.forEach(item => {
          item.setAttribute("aria-expanded", "false");
          item.nextElementSibling.setAttribute("aria-hidden", "true");
          item.nextElementSibling.style.height = "0";
        })

        btn.setAttribute("aria-expanded", "true");
        container.setAttribute("aria-hidden", "false");
        container.style.height = `${wrapperHeight(container)}px`;

        /* if vertiacal scrollbar appeares it recalculates the height and returns falsy flag value when animation is finished */
        container.addEventListener("transitionend", f);

        function f() {
          func(true, container);
          container.removeEventListener("transitionend", f);
        }
      } else {
        btn.setAttribute("aria-expanded", "false");
        container.setAttribute("aria-hidden", "true");
        container.style.height = "0";

        /* returns falsy flag value when animation is finished */
        container.addEventListener("transitionend", f);

        function f() {
          func(false, container);
          container.removeEventListener("transitionend", f);
        }
      }
    }
  }
})

// Smooth animation
function smoothScroll(id) {
  const target = document.querySelector(id);
  const targetPosition = target.getBoundingClientRect().top;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - 0;

  let duration;
  if (Math.abs(distance) < 1500) {
    duration = 700;
  } else if (1500 < Math.abs(distance) && Math.abs(distance) < 3500) {
    duration = 1000;
  } else if (Math.abs(distance) > 3500) {
    duration = 1400;
  }
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) {
      startTime = currentTime;
    }
    const timeElapsed = currentTime - startTime;
    const run = ease(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) {
      return c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
  requestAnimationFrame(animation);
}