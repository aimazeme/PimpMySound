<template>
    <div>
    <canvas id="canvas" width="600" height="50"></canvas>
    </div>
</template>

<script>
import { EventBus } from '../main';
import { AudioCtx } from '../main';
// import { AudioCtx2} from '../main';

export default {
    name: 'Soundtrack',

    props: {

    },
    date(){
        return{
            audioContext: new AudioContext(),
            data: null
        }
    },

    created(){
        // window.AudioContext = window.AudioContext || window.webkitAudioContext,
        // this.audioContext = new AudioContext()

    //           loadAudio(response) {
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

        EventBus.$on('leftSongData', (buffer) => {  

            // if (data.playerNr === this.playerNr) {
            this.audioContext=AudioCtx;
            // window.console.log(data.file); 
            this.data = buffer;
            this.drawAudio(this.data);
            // }
        });
        // EventBus.$on('rightSongData', (data) => {     

        // });
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
            const canvas = document.getElementById("canvas");    //querySelector("canvas");
            // const dpr = window.devicePixelRatio || 1;
            const padding = 20;
            canvas.width = canvas.offsetWidth ;
            canvas.height = (canvas.offsetHeight );
            const ctx = canvas.getContext("2d");
            ctx.scale(0.7,1);
            ctx.translate(0, canvas.offsetHeight / 2); // set Y = 0 to be in the middle of the canvas
            // draw the line segments
            const width = canvas.offsetWidth / normalizedData.length;
            window.console.log("drawww");
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
            ctx.strokeStyle = "#fff"; // what color our line is
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

</style>