<template>
    <div ref="svgRef">

    </div>
</template>

<script lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { json, select, scaleLinear, max, scaleBand, scaleLog, axisBottom, axisLeft, transition } from 'd3'
import dataJson from '@/assets/json/generated.json';
export default {
    setup() {
        const svgRef = ref<HTMLElement>()!;
        const arr = [12, 22, 223, 434, 5434, 566, 76];
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
                .attr('fill', '#0005')
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
            svgRef
        }
    }
}
</script>