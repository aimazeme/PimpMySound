<template>
  <div class="PimpMySound">
   <h1 class="display-4">PIMP MY SOUND</h1>
  </div>
</template>

<script>
export default {
  name: 'PimpMySound',
  props: {
    msg: String
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  margin: 40px 40px 40px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
