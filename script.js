const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Your labels (can be replaced with game names)
const labels = [
  "Hot Potato",
  "Duck Duck Goose",
  "Musical Chairs",
  "Freeze Dance",
  "Simon Says",
  "Red Light Green Light",
  "Follow the Leader",
  "Obstacle Course",
  "Keep the Balloon Up",
  "Bean Bag Toss",
  "Hide and Seek",
  "Floor is Lava"
];

const descriptions = [
  "Pass the hot potato quickly to avoid being caught holding it.",
  "Classic game where one person chases another around a circle.",
  "Walk around chairs while music plays, grab a chair when it stops.",
  "Dance when music plays, freeze when it stops.",
  "Follow commands only if preceded by 'Simon says'.",
  "Stop and go game using red and green light commands.",
  "Imitate the leader's movements and actions.",
  "Navigate through a series of physical obstacles.",
  "Keep a balloon in the air without letting it touch the ground.",
  "Toss bean bags into a target to score points.",
  "Find the hidden players in a game of hide and seek.",
  "Avoid touching the floor by stepping only on safe spots."
];


const totalSegments = labels.length;
const segmentAngle = 360 / totalSegments;

// Colors for the segments (alternating)
const pieColors = Array.from({ length: totalSegments }, (_, i) =>
  i % 2 === 0 ? "#8b35bc" : "#b163da"
);

// Build the chart
let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: labels,
    datasets: [{
      backgroundColor: pieColors,
      data: Array(totalSegments).fill(1)
    }]
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: { display: false },
      datalabels: {
        color: "#fff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 14 }
      }
    },
    rotation: 0
  }
});

// Spinner function
function spinWheel() {
  spinBtn.disabled = true;
  finalValue.textContent = "Spinning...";

  const fullRotations = 5; // how many full spins
  const randomSegment = Math.floor(Math.random() * totalSegments);
  const endAngle = 360 * fullRotations + (360 - randomSegment * segmentAngle - segmentAngle / 2);
  const duration = 4000;
  const start = performance.now();

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const currentAngle = eased * endAngle;

    myChart.options.rotation = currentAngle % 360;
    myChart.update();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      const finalRotation = myChart.options.rotation;
      const normalizedAngle = 360 - (finalRotation % 360);
      const landedIndex = Math.floor(normalizedAngle / segmentAngle) % totalSegments;
      const landedLabel = labels[landedIndex];
      finalValue.innerHTML = `<p>🎉 ${landedLabel} 🎉</p>`;
      document.getElementById("game-description").textContent = descriptions[landedIndex];
      spinBtn.disabled = false;
    }
  }

  requestAnimationFrame(animate);
}

// Easing function
function easeOutCubic(t) {
  return (--t) * t * t + 1;
}

spinBtn.addEventListener("click", spinWheel);
