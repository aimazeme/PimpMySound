<template>
    <div id="xd">
            <canvas width="400" height="100" id='test'></canvas>
    </div>
</template>

<script>
import {EventBus} from '../main.js';
import { AudioCtx } from '../main';

export default {

        data() {
        return {
            waveGradient: [[0, "255,255,255"], [0.7, "255,255,255"], [0.701, "229,229,229"], [1, "229,229,229"]],
            // data: AudioBufferSourceNode,
            config: { 
				maxVal: 36000,
				linePercent: 0.7,
				barWidth: 2,
				gapWidth: 1
            },
            cvs: document.getElementById('test'),
            analyser: AudioCtx.createAnalyser(),
        }     
    },

    created(){
        EventBus.$on('leftSongData', (data) => {          
            // this.data.buffer = data;
            window.console.log(data);
            this.drawWaveform(this.data, this.config);
        }),
        EventBus.$on('rightSongData', (data) => {          
            this.data = data;
            this.drawWaveform(this.data, this.config);
        })
    },

    methods: {

        canvasLinearGradient(canvasCtx,colorStops){

			var l = canvasCtx.canvas.height; // Gradient Size
			
			var u = colorStops.map(function(stop){	
				var opacity = stop.length === 3? stop[2]:1; 

				return [stop[0],stop[1],opacity]
			})

			return u.reduce(function(e,stop){
				var sValue	= stop[0],
					color	= stop[1],
					opacity = stop[2],
					clr = "rgba("+color+","+opacity+")";

				return e.addColorStop(sValue,clr),e;

			},canvasCtx.createLinearGradient(0,0,0,l))
        },

        memoizeScale(max,data){
			var m = [];
			return function(v){
				var s = data[v];
				if(!m[s]){
					m[s] = (max - data[v])/max;
				}
				return m[s];
			}
        },
        
        drawWaveform(dataSamples,config){
            window.console.log(dataSamples);
            window.console.log(config);
            var canvas = document.getElementById('test')
			var c = canvas.getContext('2d');
			var w = 0;
			var	x = 0;
			var	d = canvas.width;
			var	g = this.config.linePercent * canvas.height;
			var	gw = this.config.barWidth;
			var	v = canvas.height - g;
			var	r = dataSamples.length;

			var scaledSamples = this.memoizeScale(config.maxVal,dataSamples);

			var increment = config.barWidth + config.gapWidth

			c.clearRect(0,0,canvas.width,canvas.height);
			c.save();
				c.beginPath();
				for(var k = 0;k < d;k+= increment ){

					var C = scaledSamples(((k / d) * r) | 0);
					var T = (C  * g) | 0;
					var S = ((1 - C ) * v + g) | 0;

					//Draw Bar
					c.rect( k,		// X
							T,		// Y
							gw,		// W
							S-T);	// H

					//Draw Gap
					var A = Math.max(T, w)
					c.fillStyle = "transparent"
					c.fillRect(
							k - config.gapWidth,	//X
							A,						//Y
							config.gapWidth,		//W
							Math.min(S,x) - A)		//H

					w = T
					x = S
				}
			
				c.fillStyle = this.canvasLinearGradient(c,this.waveGradient)
				c.fill()
				c.clearRect(0,g,d,1)
			c.restore()
        },
        
        drawOverlay(canvas,fill,from,to){
			var c = canvas.getContext('2d');
			from = canvas.width * from;
			to = canvas.width * to;
			c.save()
				c.fillStyle = fill;
				c.globalCompositeOperation = "source-atop"
				c.fillRect(from,0,Math.abs(from-to),canvas.height);
			c.restore();
        },
        
        
        
    },
}
</script>

<style scoped>
    #xd{
        background: linear-gradient(135deg, rgb(95, 107, 155) 0%, rgb(18, 19, 27) 100%) no-repeat;
    }
</style>