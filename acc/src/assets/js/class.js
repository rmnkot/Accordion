"use strict";

class Accordion {
  constructor(id) {
    this.flag = false;
    this.id = id;
  };

  init() {
    this.cacheDom();
    this.bindEvents();
  };

  cacheDom(e) {
    if (!e) {
      this.acc = document.getElementById(this.id);
      this.btns = this.acc.children;

    } else if (typeof e === "string") {
      this.btn = document.getElementById(e);
      this.container = this.btn.nextElementSibling;

    } else {
      this.btn = e.target;
      this.container = this.btn.nextElementSibling;
    }
  };

  bindEvents(transitionEnd) {
    if (!transitionEnd) {
      this.acc.addEventListener("click", this.toggleSection.bind(this));
      window.addEventListener("resize", this.preserveHeight.bind(this));

    } else {
      this.container.addEventListener("transitionend", this.postEffect);
    }
  };

  render(action) {
    if (action == "open") {
      this.btn.setAttribute("aria-expanded", "true");
      this.container.setAttribute("aria-hidden", "false");
      this.container.style.height = `${this.wrapperHeight(this.container)}px`;

    } else if (action == "close") {
      this.btn.setAttribute("aria-expanded", "false");
      this.container.setAttribute("aria-hidden", "true");
      this.container.style.height = "0";
    }
  };

  toggleSection(e) {

    if (!this.flag) {
      this.cacheDom(e);
      this.flag = true;

      if (this.btn.hasAttribute("aria-controls")) {

        if (this.btn.getAttribute("aria-expanded") === "false") {

          for (let i = 0; i < this.btns.length; i++) {
            this.btns[i].firstElementChild.setAttribute("aria-expanded", "false");
            this.btns[i].firstElementChild.nextElementSibling.setAttribute("aria-hidden", "true");
            this.btns[i].firstElementChild.nextElementSibling.style.height = "0";
          }

          this.render("open");
          this.bindEvents("transitionEnd");
          this.postEffect(true);

        } else {
          this.render("close");
          this.bindEvents("transitionEnd")
          this.postEffect(false);
        }
      }
    }
  };

  preserveHeight() {
    const expanded = document.querySelector(`#${this.id} .acc__expandable[aria-hidden='false']`);

    if (expanded) {
      expanded.style.height = `${this.wrapperHeight(expanded)}px`;
    }
  };

  wrapperHeight(element) {
    return element.firstElementChild.getBoundingClientRect().height;
  };

  postEffect(bool) {
    if (bool == true) {
      this.func(true);
      this.container.removeEventListener("transitionend", this.postEffect);

    } else {
      this.func(false);
      this.container.removeEventListener("transitionend", this.postEffect);
    }
  };

  func(open) {
    if (open) {
      this.container.style.height = `${this.wrapperHeight(this.container)}px`;
    }

    this.flag = false;

    if (this.acc.getBoundingClientRect().top < -300) {
      smoothScroll(`#${this.id}`);
    }
  };
}

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


const myFirstAcc = new Accordion("first-acc");
myFirstAcc.init();

const mySecondAcc = new Accordion("second-acc");
mySecondAcc.init();

function test() {
  let el = "acc-control-1";
  myAcc.toggleSection(el);
};