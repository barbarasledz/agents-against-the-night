<template>
  <div class="hello">
    <h1><span class="appname">Agents Against<br class="hide-on-desktop" /> the Night</span></h1>
    <h3>A fan-made character sheet tool for <a href="https://pelgranepress.com/product/nights-black-agents/">Night's Black Agents</a></h3>
    <br>
  </div>
</template>
  
<script>
export default {
  name: 'WelcomeMsg',
}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
    font-size: 2rem;
  }
ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

@media screen and (min-width:550px) {
  h1 {
    font-size: 3.5rem;
  }
}
</style>
  