<template>
    <section>
        <div  style="text-align: right;margin: 20px 0;">
            <el-button type="primary" @click="handleSavingContent">确认修改</el-button>
            <router-link :to="{ path: '/SystemPush'}"   style="margin: 0 10px;">
                <el-button  type="primary">取消</el-button>
            </router-link>
        </div>
        <vue-editor v-model="content"></vue-editor>
    </section>
</template>

<script>
    import { VueEditor } from 'vue2-editor'

    export default {

        components: {
            VueEditor
        },

        data() {
            return {
                content: ''
            }
        },
        methods: {
            handleSavingContent: function() {
                // You have the content to save
                console.log(this.content);
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