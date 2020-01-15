<template>
  <div id="app">
    <PimpMySound msg="Welcome to Pimp My Sound"/>
    <FileInput v-bind:playerNr="1"/>
    <FileInput v-bind:playerNr="2"/>
    <CrossFader/>   
    <VolumeSlider/>
    <FileList/>

  </div>
</template>

<script>
import PimpMySound from './components/PimpMySound.vue'
import FileInput from './components/FileInput.vue'
import CrossFader from './components/Crossfader.vue'
import VolumeSlider from './components/VolumeSlider.vue'
import FileList from './components/FileList.vue'

export default {
  name: 'app',
  components: {
    PimpMySound, FileInput, CrossFader, VolumeSlider, FileList
  }
}
</script>

<style>
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
