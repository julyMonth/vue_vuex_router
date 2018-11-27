<template>
  <div class="content">
    <index-header></index-header>
    <div class="indexPageContent">
      <iframe :src="pageUrl" frameborder="0" style="width: 100%; height: 100%;"></iframe>
    </div>
  </div>
</template>

<script>
import IndexHeader from './components/IndexHeader.vue'
export default {
  name: 'Index',
  components: {
    'index-header': IndexHeader
  },
  created () {
    if (this.$store.state.token) {

    } else {
      this.$router.push('../login.html')
    }
  },
  computed: {
    pageUrl () {
      debugger
      return this.$store.state.url || ''
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Index.vue'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.indexPageContent{
  height: calc(100% - 78px);
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
