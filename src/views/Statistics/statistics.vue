<template>
    <label class="mo-upload">
    	<input type="text" v-model='name' name="">
        <input type="file" @change="upload">
    </label>
</template>
<script>
    export default {
        data() {
        	return {
        		name:''
        	}
        },
        methods: {
            upload (event) {
                let file = event.target.files[0]
                console.log(file)
                const self = this
                const flag = this.flag
                if (file) {
                    // if (this.maxSize) {
                    // }
                    const formData = new FormData()
                    formData.append('file', file)
                    formData.append('name', this.name)
                    self.$http.post('http://192.168.10.18:8080/shangfu-admin-web-artAct/admin/banner/addBanner', formData, {
                            progress(event) {
                                //传递给父组件的progress方法
                                self.$emit('progress', parseFloat(event.loaded / event.total * 100), flag)
                            }
                        })
                        .then(response => {
                            const result = response.body
                            if (result.hash && result.key) {
                                //传递给父组件的complete方法
                                self.$emit('complete', 200 , result, flag)
                                //让当前target可以重新选择
                                event.target.value = null
                            } else {
                                self.$emit('complete', 500, result, flag)
                            }
                        }, error => self.$emit('complete', 500, error.message), flag)
                }
            }
        }
    }
</script>