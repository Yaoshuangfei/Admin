<template>
	<el-row :gutter="20" class="topbtn">
		<el-col :xs="10" :sm="10" :md="10" :lg="10">
			<el-form  :model="form" :rules="rules" label-width="100px">
			  <el-form-item label="旧密码" prop="oldpassword">
			    <el-input type="password" v-model="form.oldpassword" auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="新密码" prop="password">
			    <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="确认新密码" prop="checkpassword">
			    <el-input type="password" v-model="form.checkpassword" auto-complete="off"></el-input>
			  </el-form-item>
			  <el-form-item>
			    <el-button style="margin-left:40%" type="primary" @click="onSubmit">确认</el-button>
			  </el-form-item>
			</el-form>
    </el-col>
	</el-row>
</template>
<script>
export default {
  data() {
  	var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.password !== '') {
            // this.$refs.form.validateField('password');
          }
          callback();
        }
      };
      var checkpass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var oldpass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'));
        } else if (value !== "1111") {
          callback(new Error('密码错误'));
        } else {
          callback();
        }
      };
    return {
      input: '',
      form:{
      	oldpassword:'',
      	password:'',
      	checkpassword:''
      },
      rules: {
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkpassword: [
            { validator: checkpass, trigger: 'blur' }
          ],
          oldpassword:  [
            { validator: oldpass, trigger: 'blur' }
          ]
        }
    }
  },
  methods: {
      onSubmit() {
      	let _this = this
		const params = {
            accountId:"1",
            accessToken:"1",
            oldpassword:_this.form.oldpassword,
            password:_this.form.password,
            checkpassword:_this.form.checkpassword
        }
        console.log(_this.form);
        this.$confirm('确认删除该记录吗?', '提示', {
				type: 'warning'
			}).then(() => {
				$.post("http://192.168.10.18:8080/shangfu-admin-web/backstage/resources/update",
	             { param: JSON.stringify(params) },
	             function(data){
	             	const info = eval('(' + data + ')');
	                const response = JSON.parse(info);
	                console.log(response)
	             	if(response.res === 1000000){
						_this.$message({
							message: '修改成功',
							type: 'success'
						});
	             	}else{
						_this.$message({
							message: '修改失败',
							type: 'success'
						});
	             	}
	              }
	         	)
			}).catch(() => {

			});
      }
    }
}
</script>