<template>
	<section>
		<el-form :model="news" label-width="80px" ref="addForm">
			<el-row>
				<el-col :xs="24" :md="12">
					<el-form-item label="文章标题:">
						<el-input v-model="news.title" auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :md="12">
					<el-form-item label="文章来源:">
						<el-input v-model="news.source" auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :md="12">
					<el-form-item label="文章作者:">
						<el-input v-model="news.author" auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :md="12">
					<el-form-item label="发布时间:">
						<el-date-picker v-model="news.updateTime" type="datetime" placeholder="发布时间"></el-date-picker>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :md="12">
					<el-form-item label="是否显示:">
						<!-- <el-radio-group v-model="news.disabled"> -->
							<el-radio v-model="news.disabled"  label="1">是</el-radio>
  							<el-radio v-model="news.disabled"  label="0">否</el-radio>
						<!-- </el-radio-group> -->
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :md="12">
					<el-form-item label="排序:">
						<el-input v-model="news.sortIndex" type='number' auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :md="12">
					<el-form-item label="内容简介:">
						<el-input type="textarea" :rows="4" v-model="news.description" auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :xs="24" :md="24">
					<el-form-item label="内容:">
						<div id="editor-container">
					        <div id="editor-trigger">
					        </div>
					    </div>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<div style="text-align: center">
			<el-button @click='upArticle'  type="primary">发布文章</el-button>
		</div>
	</section>
</template>

<script>
	export default {
	}

</script>

<script>
	import { state } from '../../vuex/state'
	import util from '../../common/js/util'
	import wangEditor from 'wangEditor'
	import jquery from 'jquery'
	//import NProgress from 'nprogress'
	import { baseUrl , getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
	const cityOptions = ['嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司', '嘉兴分公司'];
	export default {
		data() {
			return {
				isEdit: false,
				news: {
					title: '',
					source: '',
					author: '',
					updateTime: '',
					disabled: '',
					sortIndex: '',
					description: ''
				},
				bearingWays: [{
		          value: '100',
		          label: '一次性到期还本付息'
		        }],
		        payWays: [{
		          value: '200',
		          label: '每月还息到期还本'
		        }],
		        dataInterface: {
                	editorUpImgUrl: 'https://beejc.com/imgs/7c6081a09ca44ba69747b11db5f8ee65/article/2017/4/21f733980a73a1dbc0f720a4f4134015aa.png'
                	// 编辑器插入的图片上传地址
            	},
		        /**
		         *上传图片至图片服务器的方法，返回图片地址 = resP.value[0]
		        */
		        uploadUrl: '',
		        callback: '',
		        uploading: '',
		        beforeSend: '',
		        filelist_value: null,
		        image: [],
		        files_list: [],
		        file: '',
		        activity_image: '',
		        activity_images: []
		    }
		},
		methods: {
			upArticle(){
				const _this = this
				this.initEditor()
				var time = _this.news.updateTime
				var editor = new wangEditor('editor-trigger');
    			editor.create();
				var html = editor.$txt.html();

		        // 获取编辑器纯文本内容
		        var text = editor.$txt.text();

		        // 获取格式化后的纯文本
		        var formatText = editor.$txt.formatText();

		        console.log(formatText)
				console.log(_this.news)
				const params = {
		            accountId:"1",
		            accessToken:"1",
		            resourceType:'',
		            articleEntity:{
		            	title:_this.news.title,
		            	body:formatText,
		            	source:_this.news.source,
		            	author:_this.news.author,
		            	articleTypeId:_this.$route.params.id ,
		            	createTime:time.getTime(),
		            	sortIndex:_this.news.sortIndex,
		            	description:_this.news.description,
		            	disabled:_this.news.disabled,
		            }
				}
				console.log(params)
				$.post(baseUrl+"/admin/article/insertArticle",
		             { param: JSON.stringify(params) },
		             function(data){
		             	const info = eval('(' + data + ')');
		                const response = JSON.parse(info);
		                console.log(response)
		              }
		         );
			},
			//新增
			addSubmit: function () {

			},
            buildup_arguments(params) {
                params.app_id = '7c6081a09ca44ba69747b11db5f8ee65'
                const params_json = JSON.stringify(params)
                const a_params = this.base64(encodeURIComponent(params_json))
                const newDate = new Date()
                const date = newDate.toLocaleDateString()
                const time = newDate.toLocaleTimeString()
                const a_time = date.split('-').concat(time.split(':')).join('')
                const a_sign = this.md5(this.md5(a_params + a_time) + 'sdkfjiuyfssd6f77367826746734')
                const argument = {
                    params: a_params,
                    time: a_time,
                    sign: a_sign
                }
                return argument
            },
            sfdaiUpload(option) {
                this.uploadUrl = option.uploadUrl
                this.callback = option.callback
                this.uploading = option.uploading
                this.beforeSend = option.beforeSend
                this.uploadPic()
            },
            clickUp() {
                this.sfdaiUpload({
                    id: 'myUpload-input',
                    uploadUrl: 'http://image.sfdai.com/api/image',
                    beforeSend: (file) => {
                        console.log(file)
                        this.post_success = 1
                    },
                    callback: (res) => {
                        console.log(res)
                        const resP = JSON.parse(res)
                        this.activity_image = resP.value[0]
                        this.activity_images.push(this.activity_image)
                        this.alert('上传成功')
                        this.post_success = 0
                    },
                    uploading: (res) => {
                        console.log(res)
                    }
                })
            },
            createImage(file) {
                const activity_image = new Image()
                const reader = new FileReader()
                const vm = this
                reader.onload = (e) => {
                    console.log(e)
                    vm.activity_image = e.target.result
                    console.log(this.activity_image)
                }
                reader.readAsDataURL(file)
                this.clickUp()
            },
            inputChange(e) {
                this.activity_image = ''
                let files = e.target.files || e.dataTransfer.files
                this.files_list = files
                // files = this.files_list
                if (!this.files_list.length) {
                    this.activity_image = ''
                } else {
                    this.createImage(this.files_list[0])
                }
                // for (let x = 0; x < this.files_list.length; x++) {
                // }
                this.file = this.files_list
            },
            uploadPic() {
                for (let x = 0; x < this.file.length; x++) {
                    const file = this.file[0]
                    const xhr = new XMLHttpRequest()
                    const fd = new FormData()
                    if (this.beforeSend instanceof Function) {
                        if (this.beforeSend(file) === false) {
                            return false
                        }
                    }
                    const up_time = new Date()
                    const up_time_date = up_time.toLocaleDateString()
                    console.log(up_time_date)
                    const source_params = {
                        method: 'upload',
                        custom_url: 'https://beejc.com/imgs',
                        path: '/article/' + up_time_date
                    }
                    const params = this.buildup_arguments(source_params)
                    fd.append('file', file)
                    fd.append('params', params.params)
                    fd.append('sign', params.sign)
                    fd.append('time', params.time)
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            if (this.callback instanceof Function) {
                                this.callback(xhr.responseText)
                            }
                        }
                    }
                    xhr.upload.onprogress = (evt) => {
                        const loaded = evt.loaded
                        const tot = evt.total
                        const per = Math.floor(100 * loaded / tot)
                       // 已经上传的百分比
                        if (this.uploading instanceof Function) {
                            this.uploading(per)
                        }
                    }
                    xhr.open('post', this.uploadUrl)
                    xhr.send(fd)
                }
                return true
            },
        	uploadInit () {
        		console.log(1)
            	const editor = this;
         //     	const btnId = this.editor.customUploadBtnId;
         //        const containerId = this.editor.customUploadContainerId;
         //     	console.log(btnId)
         //     	console.log(containerId)
	        //       //实例化一个上传对象
	        //     var uploader = new plupload.Uploader({
	        //         browse_button: btnId,
	        //         url: '/upload',
	        //         flash_swf_url: 'lib/plupload/plupload/Moxie.swf',
	        //         sliverlight_xap_url: 'lib/plupload/plupload/Moxie.xap',
	        //         filters: {
	        //             mime_types: [
	        //                 //只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
	        //                 { title: "图片文件", extensions: "jpg,gif,png,bmp" }
	        //             ]
	        //         }
	        //     });

	            //  //存储所有图片的url地址
	            // var urls = [];

	            //  //初始化
	            // uploader.init();

	            //  //绑定文件添加到队列的事件
	            // uploader.bind('FilesAdded', function (uploader, files) {
	            //      //显示添加进来的文件名
	            //     $.each(files, function(key, value){
	            //        printLog('添加文件' + value.name);
	            //     });

	            //      // 文件添加之后，开始执行上传
	            //     uploader.start();
	            // });

	            //  //单个文件上传之后
	            // uploader.bind('FileUploaded', function (uploader, file, responseObject) {
	            //      //注意，要从服务器返回图片的url地址，否则上传的图片无法显示在编辑器中
	            //     var url = responseObject.response;
	            //      //先将url地址存储来，待所有图片都上传完了，再统一处理
	            //     urls.push(url);

	            //     printLog('一个图片上传完成，返回的url是' + url);
	            // });

	            //  //全部文件上传时候
	            // uploader.bind('UploadComplete', function (uploader, files) {
	            //     printLog('所有图片上传完成');

	            //      // 用 try catch 兼容IE低版本的异常情况
	            //     try {
	            //          //打印出所有图片的url地址
	            //         $.each(urls, function (key, value) {
	            //             printLog('即将插入图片' + value);

	            //              // 插入到编辑器中
	            //             editor.command(null, 'insertHtml', '<img src="' + value + '" style="max-width:100%;"/>');
	            //         });
	            //     } catch (ex) {
	            //          // 此处可不写代码
	            //     } finally {
	            //          //清空url数组
	            //         urls = [];
	            //          // 隐藏进度条
	            //         editor.hideUploadProgress();
	            //     }
	            // });
	            //  // 上传进度条
	            // uploader.bind('UploadProgress', function (uploader, file) {
	            //      // 显示进度条
	            //     editor.showUploadProgress(file.percent);
	            // });
	        },
			initEditor(data) {
			    const that = this
			    const editor = new wangEditor('editor-trigger')
			    const params={
			    		id:1
			    	}
			    editor.config.hideLinkImg = true//网络图片隐藏
			    editor.config.uploadImgUrl = 'http://192.168.10.18:8080/shangfu-admin-web-artAct/admin/article/insertArticle'
			     // 自定义参数
			    editor.config.uploadParams = {
			    	 param: '1111111'
			    };
			    // 设置 headers（举例）
			    editor.config.uploadHeaders = {
			        'Accept' : 'text/x-json'
			    };
			    // const up_time = new Date()
       //          const up_time_date = up_time.toLocaleDateString()
       //          console.log(up_time_date)
       //          const source_params = {
       //              method: 'upload',
       //              custom_url: 'https://beejc.com/imgs',
       //              path: '/article/' + up_time_date
       //          }
       //          const params = this.buildup_arguments(source_params)


			    // editor.config.menus = [
			    //     'source',
			    //     '|',
			    //     'bold',
			    //     'underline',
			    //     'italic',
			    //     'strikethrough',
			    //     'eraser',
			    //     'forecolor',
			    //     'bgcolor',
			    //     '|',
			    //     'quote',
			    //     'fontfamily',
			    //     'fontsize',
			    //     'head',
			    //     'unorderlist',
			    //     'orderlist',
			    //     'alignleft',
			    //     'aligncenter',
			    //     'alignright',
			    //     '|',
			    //     'link',
			    //     'unlink',
			    //     'table',
			    //     'emotion',
			    //     '|',
			    //     'img',
			    //     '|',
			    //     'undo',
			    //     'redo',
			    //     'fullscreen'
			    // ]
			    // editor.config.customUpload = false;  // 配置自定义上传
			    editor.create()
			    // editor.config.customUploadInit = this.uploadInit();  // 配置上传事件
			}
		},
		mounted() {
			this.initEditor()
			if (this.$route.params.id) {
                console.log(this.$route.params.id)
                this.isEdit = true
            }
		},
		components: {
            wangEditor,
            jquery
        }
	}

</script>

<style lang="scss" scoped>
	#editor-trigger{
        min-height: 450px;
	}
</style>

</style>