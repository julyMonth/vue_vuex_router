 <template>
   <div class="indexHeader">
        <div class="headerTop">
          <div class="headerTopLeft"></div>
          <div class="headerTopRight"></div>
        </div>
        <div class="headerMenu">
          <li class="menuItem">
              <div class="menuItem-l"></div>
              <span>首页</span>
              <div class="menuItem-r"></div>
          </li>
          <li class="menuItem" v-for="(item,index) in currentMenu" :key="index" @click="showPage(item.URl)">
              <div class="menuItem-l"></div>
              <span>{{item.name}}</span>
              <div class="menuItem-r"></div>
              <i class="closePage" @click.stop="closePage(item.URl,index)">x</i>
          </li>

        </div>
   </div>
</template>
<script>
export default {
  name: 'IndexHeader',
  created () {
    if (this.$store.state.token) {
      this.$store.commit('delToken', '')
    }
  },
  data () {
    return {
      msg: '',
      title: '登录',
      username: '',
      password: '',
      currentMenu: [{name: '页面1', URl: '/#/helloWorld.html'}, {name: '网页', URl: 'https://www.baidu.com'}]
    }
  },
  methods: {
    showPage (url) {
      debugger
      this.$store.commit('switchPage', url)
    },
    closePage (url, $index) {
      let $url = ''
      if ($index !== 0) {
        $url = this.currentMenu[$index - 1].URl
      } else if (this.currentMenu.length !== 1) {
        $url = this.currentMenu[1].URl
      } else {
        $url = ''
      }
      let string = JSON.stringify(this.currentMenu.splice($index, 1))
      this.currentMenu = JSON.parse(string)
      this.$store.commit('switchPage', $url)
    }
  }
}
</script>
<style scoped>
.indexHeader {
  position: relative;
  height: 68px;
  width: 100%;
  background: #8585ff;
}
.headerTop {
  width: 100%;
  height: 40px;
  background: #38d3ee;
  padding: 0 32px;
}
.headerTopLeft{
  width: 28px;
  height: 28px;
  float: left;
}
.headerTopRight{
  width: calc(100% - 28px);
  height: 38px;
  float: left;
}
.headerMenu{
  width: 100%;
  height: 28px;
  padding: 0 32px;
}
.menuItem{
  width: 140px;
  height: 28px;
  /* background: #4780eb; */
  position: relative;
  float: left;
  cursor: pointer;
}
.menuItem>span{
  width: 110px;
  position: absolute;
  left: 15px;
  top: 0;
  color: #fff;
  font-size: 14px;
  text-align: center;
  line-height: 28px;
  height: 100%;
  background: #8bb9f0;
  float: left;

}
.menuItem-l{
  content: '';
  width: 0;
  height: 0;
  position: absolute; /*1d75de*/
  top: 0;
  bottom: 0;
  border-top: none;
  border-bottom: 28px solid #8bb9f0;
  border-left: 16px solid transparent;
  border-right: none;
  left: -1px;
  z-index: 1;
}
.menuItem-r{
  content: '';
  width: 0;
  height: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  border-top: none;
  border-bottom: 28px solid #8bb9f0;
  border-right: 16px solid transparent;
  border-left: none;
  right: -1px;
  z-index: 1;
}
.closePage{
  position: absolute;
  right: 16px;
  top: 2px;
  font-style: normal;
  color: #777;
  font-size: 16px;
}
/* .menuItem-l::before,.menuItem-r::before{
  border-left: 12px solid transparent;
  border-right: none;
  left: -1px;
  z-index: 1;
} */
h2 {
  font-size: 30px;
  padding: 10px 45px 30px 45px;
  text-align: center;
}
.name,
.password,
.landBox-con {
  width: 400px;
  padding-bottom: 20px;
  overflow: hidden;
  margin: 0 auto;
}
.landBox-con {
  padding-left: 106px;
}
.sub {
  height: 50px;
  font-size: 20px;
  cursor: pointer;
  background-color: rgb(5, 160, 95);
  color: #fff;
}
.sub:hover {
  background-color: rgba(5, 160, 95, 0.8);
}
.name span,
.password span {
  float: left;
  width: 24px;
  height: 24px;
  padding: 16px 8px 0 0;
  margin-right: 20px;
}
.name span {
  /* background:url(../../assets/log1.png) no-repeat center center; */
  background-size: 85%;
}
.password span {
  /* background:url(../../assets/log2.png) no-repeat center center; */
  background-size: 85%;
}
#name,
#password {
  text-indent: 16px;
}
input {
  width: 320px;
  height: 34px;
  float: left;
  border-radius: 4px;
  font-size: 14px;
  border: 1px solid #ddd;
  outline: none;
  opacity: 0.7;
  color: rgb(5, 160, 95);
}
.remenber {
  height: 18px;
  width: 280px;
  font-size: 10px;
  line-height: 16px;
  color: rgb(26, 25, 25);
  overflow: hidden;
  padding: 1px 0 0 3px;
  margin: 0 auto;
}
.remenber input {
  height: 18px;
  width: 13px;
  box-sizing: border-box;
  float: left;
}
.remenber label {
  height: 13px;
  line-height: 19px;
  float: left;
}
.remenber span {
  padding: 0 6px 0 18px;
}
.toRegist {
  position: absolute;
  right: 130px;
  top: -2px;
  padding-left: 4px;
  color: #2c3e50;
  font-size: 14px;
  cursor: pointer;
}
.check {
  position: relative;
}
.admin {
  float: right;
  color: #335dff;
  font-size: 14px;
}
.login_fal {
  text-align: right;
  font-size: 13px;
  width: 147px;
  height: 16px;
  position: absolute;
  right: 16px;
  top: 7px;
  color: red;
}
</style>
