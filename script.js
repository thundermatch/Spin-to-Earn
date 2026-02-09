// Initialize Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();

// Canvas setup
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const resultText = document.getElementById("result");

// Wheel segments
const segments = [
  { label: "10 Points", color: "#ffbe0b" },
  { label: "50 Coins", color: "#fb5607" },
  { label: "No Reward", color: "#ff006e" },
  { label: "100 Bonus", color: "#3a86ff" }
];

let currentAngle = 0;
let spinning = false;

// Draw the wheel
function drawWheel() {
  const radius = canvas.width / 2;
  const anglePerSegment = (2 * Math.PI) / segments.length;

  segments.forEach((segment, index) => {
    const startAngle = index * anglePerSegment;

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(
      radius,
      radius,
      radius,
      startAngle,
      startAngle + anglePerSegment
    );
    ctx.fillStyle = segment.color;
    ctx.fill();

    // Draw text
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(startAngle + anglePerSegment / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Arial";
    ctx.fillText(segment.label, radius - 10, 5);
    ctx.restore();
  });
}

drawWheel();

// Monetag ad trigger (SAFE PLACEHOLDER)
function showAdThenSpin(callback) {
  /*
    IMPORTANT:
    Replace this with your Monetag rewarded / onclick ad logic.
    Ads MUST be triggered only after user interaction.
  */

  // Simulated ad delay
  setTimeout(() => {
    callback();
  }, 800);
}

// Button click
spinBtn.addEventListener("click", () => {
  if (spinning) return;

  spinning = true;
  spinBtn.disabled = true;
  resultText.innerText = "";

  showAdThenSpin(startSpin);
});

// Spin animation
function startSpin() {
  const anglePerSegment = 360 / segments.length;
  const randomIndex = Math.floor(Math.random() * segments.length);

  const stopAngle =
    360 * 5 +
    (360 - randomIndex * anglePerSegment - anglePerSegment / 2);

  const start = currentAngle;
  const end = start + stopAngle;
  const duration = 3000;
  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    let progress = (timestamp - startTime) / duration;
    if (progress > 1) progress = 1;

    const easeOut = 1 - Math.pow(1 - progress, 3);
    currentAngle = start + (end - start) * easeOut;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((currentAngle * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawWheel();
    ctx.restore();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      finishSpin(randomIndex);
    }
  }

  requestAnimationFrame(animate);
}

// End result
function finishSpin(index) {
  resultText.innerText = "🎉 You won: " + segments[index].label;
  spinning = false;
  spinBtn.disabled = false;
}
