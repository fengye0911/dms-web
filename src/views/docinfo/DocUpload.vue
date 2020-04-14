<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" ref="docform" class="docform">
                <el-form-item>
                    <label style="font-style:oblique">【搜索】请输入要上传扫描件的档案编号：</label><el-input v-model="filters.keyword" size="medium" placeholder="档案编号检索" style="width: 400px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" plain v-on:click="getdocs">查询</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <!--列表-->
        <el-table id="docinfo" :data="docs" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column type="index" width="60" label="#">
            </el-table-column>
            <el-table-column prop="docSn" label="档案编号" width="150" sortable>
            </el-table-column>
            <el-table-column prop="docTitle" label="档案名称" width="250"  sortable>
            </el-table-column>
            <el-table-column prop="doctype.name" label="档案分类" width="150" sortable>
            </el-table-column>
            <el-table-column prop="docaddress.address" label="存档点" width="150" sortable>
            </el-table-column>
            <el-table-column label="上传操作" min-width="160">
                <!--
                name="multipartfiles" //后台接收文件流的参数名
                            ref="upload"
                            :limit="limit"  //限制文件数量
                            :action="imageAction" //上传图片的访问的服务器路径
                            :data="uploadData" //需要携带的其他参数
                            :on-preview="handlePreview" //点击时触发的事件
                            :on-remove="handleRemove" //点击移除文件时触发的事件
                            :file-list="fileList" //已上传的文件list
                            :beforeUpload="beforeAVatarUpload" //上传之前触发的事件，我在这里做了上传文件的类型控制
                            :on-exceed = "onExceed" //和limit一起用 当文件数量超出限制时触发
                            :onError="uploadError" //上传失败时触发
                            :onSuccess="uploadSuccess" //上传成功时触发
                            :auto-upload="true"> //是否自动上传
                -->
                <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="http://localhost/"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="showBorrow" :disabled="this.selections.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>


    </section>

</template>

<script>
    import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
    //文件导出
    /* import fileSaver from 'file-saver';
     import xlsx from 'xlsx';*/

    export default {
        data() {
            return {
                //高级查询
                filters: {
                    keyword: ''
                },
                doctypes:[],
                docaddresses:[],
                docs: [],
                //分页
                total: 0,
                page: 1,
                pageSize:5,
                listLoading: false,
                selections:[], // 列表选中列
                ids:'',
                id:'',
                url:'',
                fileList: []
                /*imageAction: this.$http.adornUrl(`/docinfo/upload?token=${this.$cookie.get('token')}`),
                limit: 1,
                fileList: []*/
            }
        },
        methods: {
            submitUpload() {
                this.$refs.upload.submit();
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                /*status: "ready"
                name: "FLAMING MOUNTAIN.JPG"
                size: 3662715
                percentage: 0
                uid: 1576419186639
                * */
                this.$http.post("/docinfo/upload",file).then({


                });


                console.log(file);
            },
            // 当设置了取消自动上传的时候，调用此方法开始上传
            // submitUpload () {
            //   this.$refs.upload.submit()
            // },
            /*handleRemove (file, fileList) {
                if (file.status === 'success') {
                    this.$http({
                        url: this.$http.adornUrl('/file/file/delete'),
                        method: 'post',
                        data: this.$http.adornData([file.uid], false)
                    }).then(({data}) => {
                        this.$message.success('删除图片成功！')
                    })
                }
            },
            handlePreview (file) {
                if (file.status === 'success') {
                    this.imageVisiable = true
                    this.$nextTick(() => {
                        this.$refs.showImage.init(file.url)
                    })
                }
            },
            onExceed (files, fileList) {
                this.$message.error('提示：只能上传一张图片！')
            },
            // 图片上传
            beforeAVatarUpload (file) {
                if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
                    this.$message.error('只支持jpg、png、gif格式的图片！')
                    return false
                }
            },
            uploadSuccess (response, file, fileList) {
                this.fileIds = response.fileIds
                console.log('上传图片成功')
            },
            uploadError (response, file, fileList) {
                this.$message.error('上传图片失败！')
            },*/


            getdoctypes(){
                this.$http.get("/doctype/list").then(res=>{
                    this.doctypes = res.data;
                })
            },
            getdocaddress(){
                this.$http.get("/docaddress/list").then(res=>{
                    this.docaddresses = res.data;
                })
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getdocs();
            },
            //时间格式化
            dateFormat(row,column){
                var t=new Date(row.createDate);//row 表示一行数据, updateTime 表示要格式化的字段名称
                return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate();//+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()+"."+t.getMilliseconds()
            },
            //获取档案列表
            getdocs() {
                this.listLoading = true;
                let para = {
                    pageNum: this.page,
                    pageSize: this.pageSize,
                    keyword:this.filters.keyword
                };
                //加载数据
                this.$http.post("/docinfo/docSn",para).then(res =>{
                    this.listLoading = false;
                    let {total,rows} = res.data;
                    this.total = total;
                    this.docs = rows;
                });
            }



        },
        mounted() {

            this.getdoctypes();
            this.getdocaddress();


        }
    }
</script>

<style scoped>
    .formWidth{
        width: 180px;
    }

</style>