<template>
    <section>
        <div  style="text-align: right;margin: 20px 0;">
            <el-button type="primary" @click="handleSavingContent">确认添加</el-button>
            <router-link :to="{ path: '/SystemPush'}"   style="margin: 0 10px;">
                <el-button  type="primary">取消</el-button>
            </router-link>
        </div>
        <el-col :span="24">
            <el-col :span="1" style="margin-left: 10px;margin-top: -5px"><h1>标题</h1></el-col><el-col :span="6"><el-input v-model="name"></el-input></el-col>
        </el-col>
        <vue-editor v-model="content"></vue-editor>
    </section>
</template>

<script>
    import { VueEditor } from 'vue2-editor'
    import { state } from '../../vuex/state'
    import util from '../../common/js/util'
    import {baseUrl , editUser, addUser } from '../../api/api';

    export default {
        components: {
            VueEditor
        },

        data() {
            return {
                content: '',
                name:''
            }
        },
        methods: {
            handleSavingContent: function() {
                const _this = this
                const params={
                    noticeImage:'http://121.43.178.109:8080/ser/ATTACHMENT/ATTACHMENT/d6a8d4a9-6b27-428b-972f-ddf71f2ca2c1.jpg',
                    noticeTitle:this.name,
                    noticeContent:this.content,
                    type:3
                }
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/notice/add",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
                    }
                });
            }
        }
    }

</script>

<style>
    .el-dialog--small {
        width: 25%;
        border-radius: 10px
    }
</style>