const params = new URLSearchParams(window.location.search);
const type = params.get("type");

const data = gameData[type];

if (!data) {
  document.body.innerHTML = "<h2 style='text-align:center;'>Invalid spinner type.</h2>";
  throw new Error("Invalid type in URL");
}

document.getElementById("category-title").textContent = data.title;

const labels = data.labels;
const descriptions = data.descriptions;

const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

const totalSegments = labels.length;
const segmentAngle = 360 / totalSegments;
const pieColors = Array.from({ length: totalSegments }, (_, i) =>
  i % 2 === 0 ? "#8b35bc" : "#b163da"
);

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

function spinWheel() {
  spinBtn.disabled = true;
  finalValue.textContent = "Spinning...";

  const fullRotations = 5;
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
  function easeOutCubic(t) {
  return (--t) * t * t + 1;
}


  requestAnimationFrame(animate);
}

spinBtn.addEventListener("click", spinWheel);
