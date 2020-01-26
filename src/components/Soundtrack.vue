<template>
    <div>
        <b-card id="visualizer" bg-variant="light" class="text-center">
            <canvas v-bind:id="'canvas'+playerNr" width="1100" height="40"></canvas>
        </b-card>
    </div>
</template>

<script>
import { EventBus } from '../main';

export default {
    name: 'Soundtrack',

    props: {
        playerNr: Number,
    },

    data() {
        return {
            data: null,
        }
    },

    created() {
        EventBus.$on('SongData', (data) => {
            if (this.playerNr==data.playerNr){   
            this.data = data.buffer;
            this.drawAudio(this.data);
            }
        });
    },

    methods: {
        /**
         * One function call for all the methods below (draw, normalizeData, filterData) 
         */
        drawAudio(buffer){
            this.draw(this.normalizeData(this.filterData(buffer)));
        },
/*
    Filtern des Buffers auf einen Channel und Genauigkeit der Visualisierung einstellen indem man in Samples teilt. 
*/
        filterData(audioBuffer) {
            const rawData = audioBuffer.getChannelData(0);
            const samples = 10000; 
            const blockSize = Math.floor(rawData.length / samples);
            const filteredData = [];
            for (let i = 0; i < samples; i++) {
                let blockStart = blockSize * i;
                let sum = 0;
                for (let j = 0; j < blockSize; j++) {
                sum = sum + Math.abs(rawData[blockStart + j]); 
                }
                filteredData.push(sum / blockSize);
            }
            return filteredData;
        },

        /**
         * Normalizes the filtered data
         */
        normalizeData(filteredData) {
            const multiplier = Math.pow(Math.max(...filteredData), -1);
            return filteredData.map(n => n * multiplier);
        },

        /**
         * Configures the canvas element
         */
        draw(normalizedData) {
            const canvas = document.getElementById("canvas" + this.playerNr);    
            const padding = 20;
            canvas.width = canvas.offsetWidth ;
            canvas.height = (canvas.offsetHeight );
            const ctx = canvas.getContext("2d");
            ctx.scale(0.7,1);
            ctx.translate(0, canvas.offsetHeight / 2); 
            const width = canvas.offsetWidth / normalizedData.length;
            for (let i = 0; i < normalizedData.length; i++) {
                const x = width * i;
                let height = normalizedData[i] * canvas.offsetHeight - padding;
                if (height < 0) {
                    height = 0;
                } else if (height > canvas.offsetHeight / 2) {
                    height = height > canvas.offsetHeight / 2;
                }
                this.drawLineSegment(ctx, x, height, width, (i + 1) % 2);
            }
        },

        /*
         *  Draws one line
         */
        drawLineSegment(ctx, x, height, width, isEven) {
            ctx.lineWidth = 1; 
            if(this.playerNr==1)
            ctx.strokeStyle = "PINK"; 
            else
            ctx.strokeStyle = "turquoise";
            ctx.beginPath();
            height = isEven ? height : -height;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
            ctx.lineTo(x + width, 0);
            ctx.stroke();
        },

    },
}
</script>

<style scoped>

#visualizer {
    border-radius: 20px
}

</style>