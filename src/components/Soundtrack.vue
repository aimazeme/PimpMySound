<template>
    <div>
        <b-card id="visualizer" bg-variant="light" class="text-center">
            <canvas v-bind:id="'canvas'+playerNr" width="1100" height="40" ></canvas>
        </b-card>
    </div>
</template>

<script>

        // <Soundtrack v-bind:playerNr="playerNr"/>
    // EventBus.$on('loadRight', data => {
    //     if (this.playerNr == 2) {
    //       this.file = data.source;
    //       this.drawAudio(this.file);
    //     }

    //       drawAudio(response) {
    //     this.source = this.audioContext.createBufferSource();
    //     window.console.log(response); 
    //     response.arrayBuffer()
    //     .then(audioData => {this.audioContext.decodeAudioData(audioData)
    //       .then(buffer => {
    //           EventBus.$emit("SongData", {buffer: buffer, playerNr: this.playerNr});
    //         this.source.buffer = buffer;
    //       });
    //     });
    //   },
import { EventBus } from '../main';

export default {
    name: 'Soundtrack',

    props: {
        playerNr: Number,
    },
    date(){
        return{
            data: null
        }
    },

    created(){

    //  loadAudio(response) {
    //     this.source = this.audioContext.createBufferSource();
    //     window.console.log(response); 
    //     // EventBus.$emit("leftSongData", source);
    //     response.arrayBuffer()
    //     .then(audioData => {this.audioContext.decodeAudioData(audioData)
    //     .then(buffer => {
    //       EventBus.$emit("leftSongData", buffer);
    //       this.source.buffer = buffer;
    //       });});
    //   },

        EventBus.$on('SongData', (data) => {
            if (this.playerNr==data.playerNr){   
            this.data = data.buffer;
            this.drawAudio(this.data);
            }
        });
    },
     
    mounted () {
       
    },


    methods: {
        // drawAudio(url){
        //     fetch(url)
        //     .then(response => response.arrayBuffer())
        //     .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
        //     .then(audioBuffer => this.draw(this.normalizeData(this.filterData(audioBuffer))));
        // },
       drawAudio(buffer){
           window.console.log("drawaudio");
            this.draw(this.normalizeData(this.filterData(buffer)));
        },

        filterData(audioBuffer) {
            const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
            const samples = 10000; // Number of samples we want to have in our final data set
            const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
            const filteredData = [];
            for (let i = 0; i < samples; i++) {
                let blockStart = blockSize * i; // the location of the first sample in the block
                let sum = 0;
                for (let j = 0; j < blockSize; j++) {
                sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
                }
                filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
            }
            return filteredData;
        },

        normalizeData(filteredData) {
            const multiplier = Math.pow(Math.max(...filteredData), -1);
            return filteredData.map(n => n * multiplier);
        },

        draw(normalizedData) {
            // set up the canvas
            const canvas = document.getElementById("canvas" + this.playerNr);    //querySelector("canvas");
            // const dpr = window.devicePixelRatio || 1;
            const padding = 20;
            canvas.width = canvas.offsetWidth ;
            canvas.height = (canvas.offsetHeight );
            const ctx = canvas.getContext("2d");
            ctx.scale(0.7,1);
            ctx.translate(0, canvas.offsetHeight / 2); // set Y = 0 to be in the middle of the canvas
            // draw the line segments
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

        drawLineSegment(ctx, x, height, width, isEven) {
            ctx.lineWidth = 1; // how thick the line is
            if(this.playerNr==1)
            ctx.strokeStyle = "PINK"; // what color our line is
            else
            ctx.strokeStyle = "turquoise"; // what color our line is
            ctx.beginPath();
            height = isEven ? height : -height;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.arc(x + width / 2, height, width / 2, Math.PI, 0, isEven);
            ctx.lineTo(x + width, 0);
            ctx.stroke();
        },

    }

}
</script>

<style scoped>

#visualizer {
    border-radius: 20px
}

</style>