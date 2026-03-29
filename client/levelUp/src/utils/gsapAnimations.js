import gsap from "gsap";

/* MATCH INTRO: PLAYERS ENTER */
export function animatePlayersIn(leftRef, rightRef, vsRef, onComplete) {
  const tl = gsap.timeline({ onComplete });

  gsap.set([leftRef, rightRef, vsRef], { opacity: 0 });

  tl.fromTo(
    leftRef,
    { x: -200, opacity: 0, rotationY: -60, scale: 0.8 },
    {
      x: 0,
      opacity: 1,
      rotationY: 0,
      scale: 1,
      duration: 0.9,
      ease: "power4.out",
    },
  )

    .fromTo(
      rightRef,
      { x: 200, opacity: 0, rotationY: 60, scale: 0.8 },
      {
        x: 0,
        opacity: 1,
        rotationY: 0,
        scale: 1,
        duration: 0.9,
        ease: "power4.out",
      },
      "<",
    )

    .fromTo(
      vsRef,
      { scale: 0, opacity: 0, rotation: -180 },
      { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(2)" },
      "-=0.4",
    );

  return tl;
}

/* VS PULSE LOOP */
export function animateVSPulse(vsRef) {
  return gsap.to(vsRef, {
    scale: 1.12,
    repeat: -1,
    yoyo: true,
    duration: 0.8,
    ease: "sine.inOut",
  });
}

/* TIMER PULSE */
export function animateTimerPulse(ref) {
  gsap.fromTo(
    ref,
    { scale: 1.1 },
    {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    }
  );
}

/* TIMER WARNING SHAKE */
export function animateTimerWarning(ref) {
  gsap.timeline()
    .to(ref, { x: -5, duration: 0.05 })
    .to(ref, { x: 5, duration: 0.05, repeat: 5, yoyo: true })
    .to(ref, { x: 0, duration: 0.05 });
}
/* CORRECT SUBMISSION GLOW */
export function animateCorrectSubmission(editorWrapRef) {

  gsap.timeline()

    .to(editorWrapRef, {
      boxShadow: "0 0 0 3px #22c55e, 0 0 40px rgba(34,197,94,0.4)",
      duration: 0.3,
    })

    .to(editorWrapRef, {
      boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
      duration: 0.8,
      ease: "power2.out",
    });

}
/* ARENA SLIDE IN */
export function animateArenaIn(arenaRef) {
  return gsap.fromTo(
    arenaRef,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power3.out",
    }
  );
}
/* OPPONENT PROGRESS BAR */
export function animateProgressBar(barRef, toPercent) {

  gsap.to(barRef, {
    width: `${toPercent}%`,
    duration: 0.6,
    ease: "power1.out",
  });

}

/* OPPONENT PANEL SLIDE-IN */
export function animateOpponentIn(opponentRef) {
  return gsap.fromTo(
    opponentRef,
    { opacity: 0, x: 40 },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.5,
    }
  );
}

/* EDITOR PANEL FADE-IN */
export function animateEditorIn(editorRef) {
  return gsap.fromTo(
    editorRef,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.35,
    }
  );
}
/* PROBLEM PANEL SLIDE-IN */
export function animateProblemIn(ref) {
  return gsap.fromTo(
    ref,
    { opacity: 0, x: -40 },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: "power2.out",
    }
  );
}

/* SUBMIT CLICK */
export function animateSubmitClick(ref) {
  gsap.timeline()
    .to(ref, { scale: 0.9, duration: 0.1 })
    .to(ref, { scale: 1, duration: 0.3, ease: "elastic.out(1,0.5)" });
}

/* COUNTDOWN NUMBER ANIMATION */
export function animateCountdownNumber(ref, onComplete) {
  const tl = gsap.timeline({ onComplete });

  tl.fromTo(
    ref,
    { scale: 2.5, opacity: 0, filter: "blur(8px)" },
    {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.3,
      ease: "power3.out",
    },
  )

    .to(ref, {
      scale: 0.5,
      opacity: 0,
      duration: 0.45,
      delay: 0.5,
      ease: "power2.in",
    });

  return tl;
}

/* FIGHT BANNER ANIMATION */
export function animateFightBanner(ref, flashRef, onComplete) {
  const tl = gsap.timeline({ onComplete });

  tl.fromTo(
    ref,
    { scale: 4, opacity: 0, letterSpacing: "0.5em" },
    {
      scale: 1,
      opacity: 1,
      letterSpacing: "0.08em",
      duration: 0.4,
      ease: "power4.out",
    },
  )

    .fromTo(
      flashRef,
      { opacity: 0.6 },
      { opacity: 0, duration: 0.5, ease: "power2.out" },
      "<",
    )

    .to(ref, { opacity: 0, y: -30, duration: 0.4, delay: 0.6 });

  return tl;
}

/* STAT COUNT UP ANIMATION */
export function animateStatCountUp(el, endValue, suffix = "") {

  gsap.fromTo(
    { val: 0 },
    { val: endValue },
    {
      duration: 1.5,
      ease: "power2.out",
      onUpdate: function () {
        el.textContent =
          Math.round(this.targets()[0].val) + suffix;
      },
    }
  );

}

/* WINNER REVEAL ANIMATION */
export function animateWinnerReveal(cardRef, labelRef) {

  const tl = gsap.timeline();

  tl.fromTo(
    cardRef,
    {
      scale: 0.3,
      opacity: 0,
      rotation: -8,
    },
    {
      scale: 1,
      opacity: 1,
      rotation: 0,
      duration: 0.8,
      ease: "back.out(1.4)",
    }
  )

  .fromTo(
    labelRef,
    {
      y: 20,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration: 0.4,
    },
    "-=0.2"
  );

  return tl;
}