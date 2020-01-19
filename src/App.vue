<template>
  <div id="app">
    <div class="bg">
    <PimpMySound msg="Welcome to Pimp My Sound"/>
    <FileInput v-bind:playerNr="1"/>  
    <VolumeSlider v-bind:playerNr="1"/>
    <VolumeSlider v-bind:playerNr="2"/>
    <FileInput v-bind:playerNr="2"/>
    <Filter filterType="lowshelf" v-bind:playerNr="1"/>
    <CrossFader/>   
    <FileList/>    
    </div>
  </div>
</template>

<script>
import PimpMySound from './components/PimpMySound.vue'
import FileInput from './components/FileInput.vue'
import VolumeSlider from './components/VolumeSlider.vue'
import CrossFader from './components/Crossfader.vue'
import FileList from './components/FileList.vue'
import Filter from './components/Filter.vue'

export default {
  name: 'app',
  components: {
    PimpMySound, FileInput, VolumeSlider, CrossFader, FileList, Filter
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
