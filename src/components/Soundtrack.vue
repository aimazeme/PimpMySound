<template>
    <div>
        <script src="https://unpkg.com/wavesurfer.js"></script> 
        
        <section id="waveform-box" style="width: 700px; background-color: rgba(0, 0, 0, 1)">
            <div id="waveform"></div>
        </section>            

    </div>
</template>

<script>
export default {
    name: 'Soundtrack',
    
    mounted () {
        var wavesurfer = WaveSurfer.create({
        container: '#waveform', 
        containerWidth: '200',
        waveColor: 'yellow',
        progressColor: 'blue',
        scrollParent: true,
        hideScrollbar: true,
        barHeight: "1",
        barWidth: "1",
        fillParent: true,
        minPxPerSec: 200
        });

        wavesurfer.load('./src/assets/music.wav')
    }
}
</script>

<style scoped>

</style>