<template>
  <div id="app">
    <div class="bg">
    <PimpMySound msg="Welcome to Pimp My Sound"/>
    <AudioPlayer v-bind:playerNr="1"/>  
    <AudioPlayer v-bind:playerNr="2"/>
    <CrossFader/>   
    <FileList/>    
    <InputManager/>
    </div>
  </div>
</template>

<script>
import PimpMySound from './components/PimpMySound.vue'
import AudioPlayer from './components/AudioPlayer.vue'
import CrossFader from './components/Crossfader.vue'
import FileList from './components/FileList.vue'
import InputManager from './components/InputManager.vue'

export default {
  name: 'app',
  components: {
    PimpMySound, AudioPlayer, CrossFader, FileList, InputManager
  },
};
</script>

<style>

html, body{
  height: 100%;
}
body { 
			background-image: url(./assets/background.jpg) ;
			background-position: center center;
			background-repeat:  no-repeat;
			background-attachment: fixed;
			background-size:  cover;
			background-color: #999;
}

div, body{
  margin: 0;
  padding: 0;
  font-family: exo, sans-serif;
}

.wrapper {
  height: 100%; 
  width: 100%; 
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
  margin-bottom: 40px;
}
</style>
