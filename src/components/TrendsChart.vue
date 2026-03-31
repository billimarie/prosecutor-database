<script setup>
import { onMounted, ref, watch } from "vue";
import * as d3 from "d3";

const props = defineProps({
  data: {
    type: Array, // Array of { year, jail, prison }
    required: true,
  },
  title: {
    type: String,
    default: "Incarceration Rate (per 100k)",
  },
});

const chartContainer = ref(null);

function renderChart() {
  if (!chartContainer.value || !props.data.length) return;

  // Clear previous chart
  d3.select(chartContainer.value).selectAll("*").remove();

  const margin = { top: 30, right: 120, bottom: 40, left: 60 };
  const width = chartContainer.value.clientWidth - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const svg = d3
    .select(chartContainer.value)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Scales
  const x = d3.scaleLinear()
    .domain(d3.extent(props.data, d => d.year))
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(props.data, d => Math.max(d.jail, d.prison)) * 1.1])
    .range([height, 0]);

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")))
    .attr("color", "#7a8099");

  svg.append("g")
    .call(d3.axisLeft(y).ticks(5))
    .attr("color", "#7a8099");

  // Gridlines
  svg.append("g")
    .attr("class", "grid")
    .attr("opacity", 0.1)
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(""));

  // Lines
  const lineJail = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.jail))
    .curve(d3.curveMonotoneX);

  const linePrison = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.prison))
    .curve(d3.curveMonotoneX);

  // Draw Jail Line
  svg.append("path")
    .datum(props.data)
    .attr("fill", "none")
    .attr("stroke", "#f0a500")
    .attr("stroke-width", 2.5)
    .attr("d", lineJail);

  // Draw Prison Line
  svg.append("path")
    .datum(props.data)
    .attr("fill", "none")
    .attr("stroke", "#3a7bd5")
    .attr("stroke-width", 2.5)
    .attr("d", linePrison);

  // Labels
  svg.append("text")
    .attr("x", width + 10)
    .attr("y", y(props.data[props.data.length - 1].jail))
    .attr("fill", "#f0a500")
    .style("font-size", "10px")
    .style("font-family", "Courier New")
    .text("LOCAL JAIL");

  svg.append("text")
    .attr("x", width + 10)
    .attr("y", y(props.data[props.data.length - 1].prison))
    .attr("fill", "#3a7bd5")
    .style("font-size", "10px")
    .style("font-family", "Courier New")
    .text("STATE PRISON");

  // Title
  svg.append("text")
    .attr("x", 0)
    .attr("y", -15)
    .attr("fill", "#e8eaf0")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .text(props.title);
}

onMounted(() => {
  renderChart();
  window.addEventListener("resize", renderChart);
});

watch(() => props.data, renderChart, { deep: true });
</script>

<template>
  <div class="trends-chart" ref="chartContainer">
    <!-- Chart will be injected here -->
  </div>
</template>

<style scoped>
.trends-chart {
  width: 100%;
  height: 300px;
  background: #181c25;
  border: 1px solid #2e3447;
  padding: 1rem 0;
  border-radius: 4px;
}
.trends-chart :deep(.tick text) {
  font-family: var(--font-mono, "Courier New", monospace);
}
</style>
