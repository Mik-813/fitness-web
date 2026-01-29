<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'
  
const series = [
  {
    name: 'Calories eaten',
    data: [
      {
        x: '2025-01-01',
        y: 90,
        extra: {
          errors: 1,
          raw: 95, 
        }, 
      },
      {
        x: '2025-01-02',
        y: 95,
        extra: {
          errors: 0,
          raw: 98, 
        }, 
      },
      {
        x: '2025-01-03',
        y: 92,
        extra: {
          errors: 0,
          raw: 96, 
        }, 
      },
      {
        x: '2025-01-04',
        y: 99,
        extra: {
          errors: 0,
          raw: 99, 
        }, 
      },
    ],
  },
]
  
const options = {
  chart: {
    type: 'line',
    toolbar: false,
    animations: { enabled: true },
  },
  stroke: {
    curve: 'smooth',
    width: 4,
  },
  markers: {
    size: 6,
    hover: { size: 8 },
  },
  xaxis: {
    type: 'datetime',
    labels: { format: 'dd MMM' },
  },
  tooltip: {
    shared: false,
    custom: ({ dataPointIndex, w }: {
      dataPointIndex: number
      w: any 
    }) => {
      const point = w.config.series[0].data[dataPointIndex]
      return `
          <div class="p-3">
            <b>${point.x}</b><br>
            kg: ${point.y}<br>
            reps: ${point.extra.raw}<br>
            time: ${point.extra.errors}
          </div>
        `
    },
  },
}
</script>
  
<template>
  <VueApexCharts
    width="100%"
    height="300"
    :options="options"
    :series="series"
  />
</template>
