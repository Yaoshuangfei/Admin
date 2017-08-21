<template>
    <section>
        <div  style="text-align: right;margin: 20px 0;">
            <router-link :to="{ path: '/SystemPush'}"   style="margin: 0 10px;">
                <el-button  type="primary">返回</el-button>
            </router-link>
        </div>
        <el-form  label-width="80px">
            <el-form-item label="公告标题">
                <el-input style="width: 400px" v-model="constObj.noticeTitle"></el-input>
            </el-form-item>
            <el-form-item label="公告图标">
                <img style="margin-left: 20px;margin-bottom: 20px;width: 100px;" v-if="url !== '' " :src="url">
            </el-form-item>
            <el-form-item label="推送人群">
                <el-input style="width: 400px" v-model="type"></el-input>
            </el-form-item>
        </el-form>
        <el-col :span="24">
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
                options:[
                    {
                        value:0,
                        label:'全部'
                    },{
                        value:1,
                        label:'普通'
                    },{
                        value:2,
                        label:'创客'
                    },{
                        value:3,
                        label:'创客商'
                    },
                ],
                name:'',
                value:'',
                type:'',
                url:'',
                constObj:{},
                name:'',
                see_html:''
            }
        },
        methods: {
            getlist(){
                const _this = this
                const params = {
                    noticeId:this.$route.params.id
                }
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/notice/selectOne",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
                        _this.constObj = data.data
                        _this.see_html = data.data.noticeContent
                        _this.url = data.data.noticeImage
                        _this.type = data.data.targetName
                        _this.initEditor()
                        
                    }
                })
            },
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
                editor.create()
                editor.$txt.append(_this.see_html)
            }
        },
        mounted() {
            this.getlist()
        }
    }

</script>