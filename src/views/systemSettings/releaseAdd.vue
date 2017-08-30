<template>
    <section>
        <div  style="text-align: right;margin: 20px 0;">
            <el-button type="primary" @click="addAtcuie">确认添加</el-button>
            <router-link :to="{ path: '/SystemPush'}"   style="margin: 0 10px;">
                <el-button  type="primary">取消</el-button>
            </router-link>
        </div>
        <el-form  label-width="80px">
            <el-form-item label="公告标题">
                <el-input style="width: 400px" v-model="name"></el-input>
            </el-form-item>
            <el-form-item label="公告图标">
                <input type="file" style="position:absolute;opacity:0;width:70px;height:30px;margin-right:10px"  @change="upload" id="fileInput">
                <button type="button" class="el-button el-button--primary el-button--small">
                    <span>点击上传</span>
                </button>
                <!-- <button type="button" class="el-button el-button--primary el-button--small" id="btnClear" @click="clear">清空上传</button> -->
                <!-- <span style="display: block;font-size: 12px">{{ imageChange }}</span> -->
            </el-form-item>
            <img style="margin-left: 80px;margin-bottom: 20px;width: 100px;" v-if="url !== '' " :src="url">
            <el-form-item label="推送人群">
                <el-select v-model="type"  placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
              </el-select>
            </el-form-item>
        </el-form>
        <el-col :span="24">
            <!-- <el-col :span="1" style="margin-left: 10px;margin-top: -5px"><h1>标题</h1></el-col><el-col :span="6"><el-input v-model="name"></el-input></el-col> -->
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
                formData: new FormData(),
                name:'',
                value:'',
                type:'',
                url:''
            }
        },
        methods: {
            upload (event) {
                this.formData = new FormData()
                let file = event.target.files[0]
                // console.log(file)
                const self = this
                // const flag = this.flag
                if (file) {
                    console.log('存在file', file)
                    console.log(file.size)
                    this.formData.append('file', file)
                    this.addImg()
                } else {
                    this.fileImg = ''
                    console.log('不存在file', file)
                    this.formData = new FormData()
                }
            },
            addImg(){
                    const _this= this;
                    _this.$http.post(baseUrl+'/api/attachment/upload', _this.formData, {
                        progress(event) {
                        }
                    })
                        .then(response => {
                            const info = JSON.parse(response.bodyText);
                            // const info = response.body
                            _this.url = info.data[0].baseUri+info.data[0].uri;
                        }, error => _this.$emit('complete', 500, error.message))
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
                editor.onchange = function () {
                    // 编辑区域内容变化时，实时打印出当前内容
                    _this.value = this.$txt.html()
                }
                editor.create()
            },
            addAtcuie: function() {
                const _this = this
                const params={
                    noticeImage:this.url,
                    noticeTitle:this.name,
                    noticeContent:this.value,
                    type:this.type
                }
                console.log(params)
                $.ajax({
                    type:'POST',
                    dataType:'json',
                    url:baseUrl+"/api/notice/add",
                    data:JSON.stringify(params),
                    contentType:'application/json;charset=utf-8',
                    success:function(data){
                        console.log(data)
                        if(data.code === 1){
                            _this.$router.push({ path: '/SystemPush' });
                        }
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