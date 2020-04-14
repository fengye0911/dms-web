<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">

                <el-form-item>
                    <el-button type="primary" @click="handleRetrieve">档案找回</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="retrieveDocs" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <!-- <el-table-column type="selection" width="55">
             </el-table-column>-->
            <el-table-column type="index" width="60" label="#">
            </el-table-column>
            <el-table-column prop="docInfo.docSn" label="档案编号" width="150" sortable>
            </el-table-column>
            <el-table-column prop="user.username" label="操作用户" width="150"  sortable>
            </el-table-column>
            <el-table-column prop="retrieveDate" :formatter="dateFormat" label="找回日期" width="120" sortable>
            </el-table-column>
            <el-table-column prop="des" label="备注" min-width="100" sortable>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--档案找回界面-->
        <el-dialog width="25%" title="档案找回" :visible.sync="retrieveFormVisible" >
            <el-form :model="retrieveForm" label-width="80px" ref="retrieveForm">
                <el-form-item label="找回档案" prop="docInfo.docSn">
                    <el-select v-model="retrieveForm.docInfo_id" clearable placeholder="请选择要找回的档案">
                        <el-option
                                v-for="item in docs"
                                :key="item.id"
                                :label="item.docSn"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="realName">
                    <el-input v-model="retrieveForm.des" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="retrieveFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="Submit">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    export default {
        name: "RetrieveDoc",
        data(){
            return{
                filters:{
                    keyword:''
                },
                retrieveDocs:[],
                docs:[],
                total: 0,
                pageNum: 1,
                pageSize:10,
                listLoading: false,
                retrieveFormVisible: false,
                retrieveForm:{
                    docInfo_id:'',
                    des:''
                }
            }
        },
        methods:{
            handleRetrieve(){
                this.retrieveFormVisible = true;
                this.retrieveForm=[]
            },
            Submit(){
                this.$refs.retrieveForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            //this.addLoading = true;
                            let para = Object.assign({}, this.retrieveForm);
                            para.user_id = JSON.parse(sessionStorage.getItem("user")).id;
                            this.$http.post("/retrieveDoc",para).then(res=>{
                                //this.listLoading = false;
                                let {success,message} = res.data;
                                if(success){
                                    this.$message({
                                        message: message,
                                        type: 'success'
                                    });
                                    this.retrieveFormVisible = false;
                                    this.getRetrieveDocs();
                                }else{
                                    this.$message({
                                        message: message,
                                        type: 'error'
                                    });
                                }
                            })
                        });
                    }
                });
            },
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getRetrieveDocs();
            },
            getDocs(){
                this.$http.get("/docinfo/missed").then(res=>{
                    this.docs=res.data;
                })
            },
            dateFormat(row,column){
                var t=new Date(row.retrieveDate);
                return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate();
            },
            getRetrieveDocs(){
                this.listLoading = true;
                let para = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    keyword:this.filters.keyword
                };
                //加载数据
                this.$http.post("/retrieveDoc/page",para).then(res =>{
                    this.listLoading = false;
                    let {total,rows} = res.data;
                    this.total = total;
                    this.retrieveDocs = rows;
                });
            }
        },
        mounted() {
            this.getRetrieveDocs();
            this.getDocs();
        }
    }
</script>

<style scoped>

</style>