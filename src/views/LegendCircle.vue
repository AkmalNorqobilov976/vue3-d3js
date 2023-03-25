<template>
    <div class="tooltip" ref="tooltipRef"></div>
    <div ref="svgRef">

    </div>
</template>

<script lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { json, select, scaleLinear, max, scaleBand, axisBottom, axisLeft, transition } from 'd3'
import dataJson from '@/assets/json/generated.json';
export default {
    setup() {
        const svgRef = ref<HTMLElement>()!;
        const tooltipRef = ref<HTMLElement>()!;
        const margin = reactive({
            top: 10,
            left: 90,
            right: 10,
            bottom: 90
        });
        const fullHeight = ref(600);
        const fullWidth = ref(1000);
        const heightRect = computed(() => fullHeight.value - margin.top - margin.bottom);
        const widthRect = computed(() => fullWidth.value - margin.left - margin.right);

        const yAxis = computed(() => {
            return scaleLinear()
                .domain([0, max(dataJson, (itm: any) => {
                    return itm.height
                })])
                .range([heightRect.value, 0])
        })


        const xAxis = computed(() => {
            return scaleBand()
                .domain(dataJson.map((item: any): any => item?.name))
                .range([0, widthRect.value])
                .paddingInner(.5)
        })

        onMounted(() => {
            const div = select((svgRef?.value as HTMLElement))
            const svgs = div.append('svg')
                .attr('width', fullWidth.value)
                .attr('height', fullHeight.value)


            const xG = svgs.append('g')
                .attr('class', 'rect-g-class')
                .attr('transform', `translate(${margin.left}, ${heightRect.value})`)

                .call(xAxisCall.value);


                xG.selectAll('text')
                .attr('text-anchor', 'end')
                .attr('transform', 'rotate(-40)')

                xG.append('text')
                        .attr('y', margin.bottom)
                        .attr('x', (widthRect.value / 2))
                        .attr('font-size', '25px')
                        // .attr('text-anchor', 'center')
                    .attr('fill', 'black')
                    .text('Names')

                const yG = svgs.append('g')
                .attr('class', 'y-axis-call')
                .attr('transform', `translate(${margin.left}, 0)`)
                .call(yAxisCall.value);

                yG.append('text')
                .attr('y', -60)
                .attr('x', -heightRect.value / 2)
                .attr('transform', `translate(0, ${fullHeight.value/2})`)
                .attr('transform', `rotate(-90)`)
                .attr('font-size', '25px')
                .attr('fill', 'black')
                .text('Height')
            svgs.append('g')
                .attr('class', 'rect-class')
                .attr('transform', `translate(${margin.left}, 0)`)
                .selectAll('circle')
                .data(dataJson)
                .enter()
                .append('circle')
                .attr('cy', heightRect.value)
                .attr('cx', 0)
                .attr('r', 4)
                .attr('class', 'circle-class')
                .attr('data-name', (d) => {
                    return d.name
                })
                .attr('fill', () => {
                    return `#${Math.round(Math.random()*1_000_000)}`
                })
                .on('mouseover', (e: MouseEvent, d) => {
                    (tooltipRef.value as HTMLElement).style.left = `${e.clientX}px` as string;
                    (tooltipRef.value as HTMLElement).style.top = `${e.clientY}px` as string;
                    (tooltipRef.value as HTMLElement).style.opacity = '1';
                    (tooltipRef.value as HTMLElement).innerText = `${d.name} ${d.height}`;
                })
                .on('mouseout', () => {
                    (tooltipRef.value as HTMLElement).style.opacity = '0';
                })
                .transition(transition().duration(1000))
                .attr('cx', function (d: any): any {
                    return xAxis.value(d.name) as number > 0 ? xAxis.value(d.name) : 0;
                })
                .attr('cy', function(d: any) {
                    return yAxis.value(d.height);
                })
                .attr('height', (d: any, i): any => {
                    return heightRect.value - yAxis.value(d.height);
                })

        });


        const xAxisCall = computed(() => {
            return axisBottom(xAxis.value)
        })

        const yAxisCall = computed(() => {
            return axisLeft(yAxis.value)
                .tickSize(5)
                .ticks(20)
        })

        return {
            svgRef,
            tooltipRef
        }
    }
}
</script>

<style lang="scss" scoped>
$tooltip-background-color: #b0c4de;
body {
    position: relative;
}
.circle-class {
    position: relative;
}
.tooltip {
  background: $tooltip-background-color;
  border: 0;
  border-radius: 8px;
  font-size: 12px;
  font-weight: bold;
  height: 20px;
  padding: 2px;
  pointer-events: none;
  position: absolute;
  text-align: center;
  width: 120px;
  opacity: 0;
  z-index: 10;
  line-height: 150%;
}
</style>