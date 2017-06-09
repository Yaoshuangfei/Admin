<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item >
      <el-col :span='8' prop="yanzm">
        <el-input v-model="ruleForm2.code" auto-complete="off" placeholder="验证码"></el-input>
      </el-col>
      <el-col :span='12'><img :src='imgsrc' @click="getuid"></el-col>
    </el-form-item>
    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <el-button @click.native.prevent="logi">测试</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin ,loginID } from '../api/api';
  import { state } from '../vuex/state'
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        uuid: '',
        imgsrc: '',
        logining: false,
        ruleForm2: {
          username: 'sa',
          password: 'p',
          code:''
        },
        rules2: {
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ],
          yanzm: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    methods: {
      getuid() {
        const _this = this
        $.get("http://192.168.10.18:8080/shangfu-admin-web/verifyCode/loginCode  ",
            function(data){
                const info = eval('(' + data + ')');
                console.log(info)
                _this.uuid = info
                _this.cli(info)
              }
         );
      },
       cli(uid){
        this.imgsrc='http://192.168.10.10:8080/shangfu-admin-web/verifyCode/getImage?uuid='+uid+'&random='+Math.random()
      },
      logi() {
          // const account = this.ruleForm2.account;
          const password = this.md5(this.ruleForm2.password);
          // console.log(checkPass);
          // const KEYDATA = account+'_sf_'+checkPass+'_sf_'+this.ruleForm2.yanzm;
          // const Tm_num = new Date().getTime();
          const params = {
              code: this.ruleForm2.code,
              username: this.ruleForm2.username ,
              md5Pwd: password,
              uuid: this.uuid
          }
          const _this = this
          const key = false
          console.log(params);
           $.post("http://192.168.10.18:8080/shangfu-admin-web/system_login",
             { param: JSON.stringify(params) },function(data){
                const info = eval('(' + data + ')');
                const response = JSON.parse(info)
                console.log(response)
                if(response.res === 1000000){
                  state.loginID = true
                  // window.location.href='/subjectCheckPending';
                  console.log(state.loginID)
                }else if(info.res === 1000001){
                  console.log(info.resMsg)
                }
              }
         );
          // console.log(param.KEYDATA);
          // this.$http.post('http://192.168.10.18:8080/shangfu-admin-web/system_login', {KEYDATA:'sa_sfq2eqw_sfa'})
          //   .then(response => {
          //     console.log(response)
          //     if (response.status === 200) {
          //         if (response.code === 200) {
          //             console.log(response.data)
          //         }
          //         console.log(response.data)
          //         alert(response.data)
          //       } else if (response.status === 400) {
          //           alert(response.resMsg)
          //       }
          //   }, response => {
          //     let ret = eval(response)
          //       console.log(ret.data)
          //       alert(ret.resMsg)
          //   })
      },
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },
      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = { username: this.ruleForm2.username, password: this.ruleForm2.password };
            requestLogin(loginParams).then(data => {
              this.logining = false;
              //NProgress.done();
              let { msg, code, user } = data;
              if (code !== 200) {
                this.$message({
                  message: msg,
                  type: 'error'
                });
              } else {
                sessionStorage.setItem('user', JSON.stringify(user));
                this.$router.push({ path: '/main' });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    mounted() {
        this.getuid()
        // this.cli()
    },
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
    img{
      cursor:pointer;
    }
  }
</style>