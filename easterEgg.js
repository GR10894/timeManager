document.addEventListener("DOMContentLoaded", () => {
  const secretCode = [
    "arrowup", "arrowup",
    "arrowdown", "arrowdown",
    "arrowleft", "arrowright",
    "arrowleft", "arrowright",
    "b", "a"
  ];

  let input = [];

  document.addEventListener("keydown", (e) => {
    let key = e.key.toLowerCase();

    input.push(key);

    if (input.length > secretCode.length) {
      input.shift();
    }

    const match = input.every((val, i) => val === secretCode[i]);

    if (match && input.length === secretCode.length) {
      triggerEasterEgg();
      input = [];
    }
  });

  function triggerEasterEgg() {
    showToast();
    playSound();
    confetti();
  }

  function showToast() {
    const el = document.createElement("div");

    el.innerText = "🏆 Made by Rithwin Sudev";

    el.style.position = "fixed";
    el.style.bottom = "20px";
    el.style.right = "20px";
    el.style.padding = "14px 20px";
    el.style.borderRadius = "12px";
    el.style.background = "rgba(255,255,255,0.08)";
    el.style.backdropFilter = "blur(10px)";
    el.style.color = "white";
    el.style.fontFamily = "sans-serif";
    el.style.zIndex = "99999";
    el.style.transform = "translateY(20px)";
    el.style.opacity = "0";
    el.style.transition = "0.4s ease";

    document.body.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = "translateY(0)";
      el.style.opacity = "1";
    });

    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      setTimeout(() => el.remove(), 400);
    }, 3000);
  }

  function playSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const beep = (freq, start, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.2, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + start + duration
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    beep(600, 0, 0.15);
    beep(900, 0.12, 0.2);
  }

  function confetti() {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "99998";

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];

    for (let i = 0; i < 100; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20,
        r: Math.random() * 6 + 3,
        speed: Math.random() * 3 + 2,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }

    let frame = 0;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speed;
      });

      frame++;

      if (frame < 180) {
        requestAnimationFrame(draw);
      } else {
        canvas.remove();
      }
    }

    draw();
  }
});