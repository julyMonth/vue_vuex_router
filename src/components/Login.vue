 <template>
   <div class="content">
        <div class="logmsg" >
            <!-- <div>
               <h2>{{title}}</h2>
            </div>
            <div class="name">
                <span></span>
                <input type="text" id="name" placeholder="请输入用户名" v-model="username">
            </div>
            <div class="password">
                <span></span>
                <input type="text" id="password" placeholder="请输入密码" v-model="password" @keyup.enter="add($data)">
            </div>
            <div class="landBox-con check">
                <input type="submit" value="登 录" class="sub" @click="login" />
                <div class="login_fal" v-cloak>{{msg}}</div>
            </div> -->
            <el-date-picker
              v-model="startTime"
              type="date"
              placeholder="选择开始日期时间"
              align="right"
              :picker-options="startPickerOptions">
            </el-date-picker>

            <el-date-picker
              v-model="endTime"
              type="date"
              placeholder="选择结束日期时间"
              align="right"
              :picker-options="endPickerOptions">
            </el-date-picker>
         </div>
   </div>
</template>
<script>
export default {
  name: 'Login',
  created () {
    if (this.$store.state.token) {
      this.$store.commit('delToken', '')
    }
  },
  watch :{
      startTime(newV,oldV){
        let date = new Date(newV)
        let year = date.getFullYear() + '';
        let month = date.getMonth() + 1 + '';
       if(this.endTime){
        let end = new Date(this.endTime)
        let endYear = end.getFullYear() + ''
        let endMonth = end.getMonth() + 1 + '';
        if (year !== endYear) {
          this.endTime = ''
           this.maxDay = new Date(year,month,0);
        } else {
          if(month !== endMonth){
           this.maxDay = new Date(year,month,0);
          }
        }
       } else {
          this.maxDay = new Date(year,month,0);
       } 
      },
      endTime(newV,oldV){
        if(newV){
          let date = new Date(newV)
          let year = date.getFullYear() + '';
          let month = date.getMonth() + 1 + '';
          if(this.startTime){
            let start = new Date(this.startTime)
            let startYear = start.getFullYear() + ''
            let startMonth = start.getMonth() + 1 + '';
            if(month !== startMonth){
              this.maxDay = new Date(year,month,0);
            }
          } else {
              this.maxDay = new Date(year,month,0);
          } 
        }
      }
    },
  data () {
    return {
      // JXX ADD
// 时间不小于计划时间
       startPickerOptions: {//开始
            disabledDate: picked => {
                let to = picked.getTime()
                console.log(new Date().getTime() - 8.64e7)
                return to < new Date().getTime() - 8.64e7
            }
        },
        endPickerOptions: {//结束
          disabledDate: picked => {
              let to = picked.getTime();
              if (this.startTime) {
                  return (
                       to < (new Date(this.startTime)).getTime() ||
                       to > this.maxDay.getTime()
                  );
              } else {
                 return to < new Date()
              }
          }
        },
        startTime:'',
        endTime:'',
        maxDay : '',
      // 
      msg: '',
      title: '登录',
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      if (this.username === '' && this.password === '') {
        alert('请输入用户名和密码')
      } else {
        this.$http.get('/dtc/dictionary/list?key=SEX&_=1543299032475').then((res) => {
        //   this.$store.token = '123'
          this.$store.commit('setToken', '123')
          this.$router.push({ path: '../index.html' })
        })
      }
    }
  }
}
</script>
<style scoped>
.content {
  position: relative;
}
.logmsg {
  width: 550px;
  height: 400px;
  margin: 0 auto;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  padding-top: 100px;
  background-color: rgba(251, 251, 251, 0.03);
  box-shadow: 0px 0px 30px -6px #8585ff;
}
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
i {
  display: inline-block;
  width: 40px;
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
