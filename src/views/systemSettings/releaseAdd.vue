<template>
    <section>
        <div  style="text-align: right;margin: 20px 0;">
            <el-button type="primary" @click="addAtcuie">确认添加</el-button>
            <router-link :to="{ path: '/SystemPush'}"   style="margin: 0 10px;">
                <el-button  type="primary">取消</el-button>
            </router-link>
        </div>
        <el-col :span="24">
            <el-col :span="1" style="margin-left: 10px;margin-top: -5px"><h1>标题</h1></el-col><el-col :span="6"><el-input v-model="name"></el-input></el-col>
            <el-col :span="24">
                <div id = 'editor-trigger' style="height: 1000px"></div>
            </el-col>
        </el-col>
    </section>
</template>

<script>
    import { state } from '../../vuex/state'
    import util from '../../common/js/util'
    import {baseUrl} from '../../api/api';
    import wangEditor from 'wangEditor'

    export default {
        components: {
            wangEditor
        },
        data() {
            return {
                name:'',
                value:''
            }
        },
        methods: {
            initEditor(data) {
                const _this = this
                const editor = new wangEditor('editor-trigger')
                editor.config.uploadImgUrl = baseUrl+'/api/attachment/upload'
                editor.config.uploadHeaders = {
                    'contentType' : 'application/json;charset=utf-8'
                }

                editor.config.menus = [
                    'source',
                    '|',
                    'bold',
                    'underline',
                    'italic',
                    'strikethrough',
                    'eraser',
                    'forecolor',
                    'bgcolor',
                    '|',
                    'quote',
                    'fontfamily',
                    'fontsize',
                    'head',
                    'unorderlist',
                    'orderlist',
                    'alignleft',
                    'aligncenter',
                    'alignright',
                    '|',
                    'link',
                    'unlink',
                    'table',
                    // 'emotion',
                    '|',
                    'img',
                    '|',
                    'undo',
                    'redo',
                    'fullscreen'
                ]
                editor.onchange = function () {
                    // 编辑区域内容变化时，实时打印出当前内容
                    _this.value = this.$txt.html()
                    console.log(_this.value);
                }
                editor.create()
            },
            addAtcuie: function() {
                console.log(this.value)
                const params={
                    noticeImage:'http://121.43.178.109:8080/ser/ATTACHMENT/ATTACHMENT/d6a8d4a9-6b27-428b-972f-ddf71f2ca2c1.jpg',
                    noticeTitle:this.name,
                    noticeContent:this.value,
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
        },
        mounted() {
            this.initEditor()
        }
    }

</script>

<style>
    .el-dialog--small {
        width: 25%;
        border-radius: 10px
    }
</style>