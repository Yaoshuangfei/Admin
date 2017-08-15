<template>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.username" auto-complete="off" @keyup.enter.native="keyLogin" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.password" auto-complete="off" @keyup.enter.native="keyLogin" placeholder="密码"></el-input>
    </el-form-item>
    <!-- <el-form-item >
      <el-col :span='8' prop="yanzm">
        <el-input v-model="ruleForm2.code" auto-complete="off" placeholder="验证码"></el-input>
      </el-col>
      <el-col :span='12'><img :src='imgsrc' @click="getuid"></el-col>
    </el-form-item> -->
    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="logi" :loading="logining">登录</el-button>
      <!-- <el-button @click.native.prevent="logi">测试</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin ,loginID ,baseUrl} from '../api/api';
  import { state } from '../vuex/state'
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        uuid: '',
        imgsrc: '',
        logining: false,
        ruleForm2: {
          username: '',
          password: '',
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
      keyLogin(ev){
       if (ev.keyCode==13){
           this.logi()
       }
      },
      logi() {
          const params = {
              userName: this.ruleForm2.username ,
              password: this.ruleForm2.password
          }
          const _this = this
          $.ajax({
                type:'POST',
                dataType:'json',
                url:baseUrl+"/api/core/adminLogin",
                data:JSON.stringify(params),
                contentType:'application/json;charset=utf-8',
                success:function(data){
                  console.log(data)
                  if(data.code !== 1){
                    alert(data.msg)
                  }
                  state.storeId = data.data.storeId
                  state.id = data.data.id
                  document.cookie="token="+data.data.token;
                  sessionStorage.setItem('user', JSON.stringify(_this.ruleForm2.username));
                  _this.$router.push({ path: '/main' });


                //   if(data.code === 1){
                //           _this.$message({
                //   message: '提交成功',
                //   type: 'success'
                // });
                //         }else{
                //           _this.$message({
                //   message: data.msg,
                //   type: 'error'
                // });
                //         }



                }
            });
      }
    },
    mounted() {
      
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
    margin: -15% auto 0;
    position: relative;
    top:50%;
    //transform: translateY(-50%);
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: rgba(255,255,255,.9);
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