<template>
  <div class="flex flex-col w-full">
    <ClientOnly>
      <div
        v-if="isReady"
        class="flex flex-col w-full min-h-[48px] justify-center mb-[24px] space-y-1"
      >
        <div class="text-2xl font-semibold leading-tight max-w-full">
          {{ title }}
        </div>
        <div class="flex flex-row justify-between">
          <div v-if="duration">
            {{ duration }}
          </div>
          <div
            v-if="best"
            class="text-end mr-10"
          >
            Best: {{ best }}
          </div>
        </div>
      </div>
      <div
        v-if="data.length == 0"
        class="skeleton flex items-center justify-center h-[270px] w-full"
      >
        <div class="text-2xl">
          Loading...
        </div>
      </div>
      <div
        v-if="data.length > 0 && isReady"
        class="w-full h-[270px]"
      >
        <Line
          :data="chartData"
          :options="chartOptions"
        />
      </div>
      <div v-if="!isReady">
        <div class="flex flex-col w-full ml-8">
          <div class="text-2xl font-semibold leading-tight max-w-full">
            {{ title }}
          </div>
          <div class="flex flex-row justify-between">
            <div v-if="duration">
              Loading...
            </div>
            <div
              v-if="best"
              class="text-end mr-10"
            >
              Best: Loading...
            </div>
          </div>
        </div>
        <div class="skeleton min-h-[292px] w-full" />
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import type {
  ChartData,
  ChartDataset,
  ChartOptions,
  TooltipItem,
} from 'chart.js'
import type { GlucoseRecord } from '~/types/glucoseRecord'

const isReady = ref(false)

const props = defineProps<{
  data: GlucoseRecord[]
  title: string
  duration?: string | undefined
  low?: number | undefined
  high?: number | undefined
  best?: string | undefined
}>()

const { useMmol, unit } = useDisplaySettings()

const getCleanDate = (d: Date) => {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })
}

const chartData: Ref<ChartData<'line', { x: number, y: number }[], number>> = computed(() => {
  const mainData = props.data.map(d => ({ x: new Date(d.created).getTime(), y: d.value }))
  const datasets: ChartDataset<'line', { x: number, y: number }[]>[] = [
    {
      label: props.title,
      data: mainData,
      borderColor: '#33F581',
      backgroundColor: '#33F581',
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 0,
      borderWidth: 2,
      fill: {
        target: 'origin',
        above: 'rgba(51, 245, 129, 0.1)',
      },
      parsing: false,
    },
  ]
  if (props.low !== undefined) {
    datasets.push({
      label: 'Low',
      data: props.data.map(d => ({ x: new Date(d.created).getTime(), y: props.low as number })),
      borderColor: 'red',
      backgroundColor: 'red',
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 0,
      borderWidth: 2,
      fill: false,
      parsing: false,
    })
  }
  if (props.high !== undefined) {
    datasets.push({
      label: 'High',
      data: props.data.map(d => ({ x: new Date(d.created).getTime(), y: props.high as number })),
      borderColor: '#FFBE00',
      backgroundColor: '#FFBE00',
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 0,
      borderWidth: 2,
      fill: false,
      parsing: false,
    })
  }
  return {
    datasets,
  }
})

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      intersect: false,
      callbacks: {
        label: (context: TooltipItem<'line'>) => {
          if (context.dataset.label === props.title) {
            return `${context.parsed.y.toFixed(2)} ${unit.value}`
          }
          return `${context.dataset.label}: ${context.parsed.y}`
        },
        title: (items: TooltipItem<'line'>[]) => items[0]?.parsed.x ? getCleanDate(new Date(items[0].parsed.x)) : '',
      },
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      type: 'time',
      time: {
        tooltipFormat: 'MMM d, yyyy, h:mm a',
        displayFormats: {
          minute: 'MMM d, h:mm a',
          hour: 'MMM d, h a',
          day: 'MMM d',
        },
      },
      grid: {
        color: '#333847',
        tickColor: '#333847',
        drawTicks: true,
      },
      ticks: {
        includeBounds: true,
        autoSkip: true,
        maxRotation: 0,
        autoSkipPadding: 20,
      },
    },
    y: {
      min: 0,
      max: useMmol.value ? 23 : 400,
      grid: {
        display: false,
      },
      ticks: {
        stepSize: useMmol.value ? 5 : 100,
      },
    },
  },
}))

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      isReady.value = true
    }, 10)
  })
})
</script>
