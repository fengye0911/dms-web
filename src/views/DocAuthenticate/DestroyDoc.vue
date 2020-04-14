<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-date-picker
                            v-model="filters.startDate"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                            v-model="filters.endDate"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getDestroyDocs">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleDestroy">销毁</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="destroyDocs" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60" label="#">
            </el-table-column>
            <el-table-column prop="docInfo.docSn" label="档案编号" width="120" sortable>
            </el-table-column>
            <el-table-column prop="user.username" label="操作用户" width="120" sortable>
            </el-table-column>
            <el-table-column prop="destroyDate" :formatter="dateFormat" label="销毁日期" width="100" sortable>
            </el-table-column>
            <el-table-column prop="dicDetail.name" label="销毁原因" width="100" sortable>
            </el-table-column>
            <el-table-column prop="des" label="备注" width="100"  sortable>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <!--销毁界面-->
        <el-dialog title="档案销毁" width="25%" :visible.sync="destroyFormVisible" >
            <el-form :model="destroyForm" label-width="80px" ref="destroyForm">
                <el-form-item label="销毁档案" prop="docInfo.docSn">
                    <el-select v-model="destroyForm.docInfo_id" clearable placeholder="请选择要销毁的档案">
                        <el-option
                                v-for="item in docs"
                                :key="item.id"
                                :label="item.docSn"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="销毁原因" prop="dicDetail.name">
                    <el-select v-model="destroyForm.dicDetail_id" clearable placeholder="请选择要销毁的档案">
                        <el-option
                                v-for="item in options"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="des">
                    <el-input v-model="destroyForm.des" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="destroyFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="submit" >提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import user from "../nav1/user";

    export default {
        name: "DestroyDoc",
        data() {
            return {
                options:[{
                    value: 25,
                    label: '档案损坏',
                    value: 27,
                    label: '档案丢失'
                }],
                filters:{
                    startDate:'',
                    endDate:''
                },
                docs:[],
                destroyDocs: [],
                //分页
                total: 0,
                pageNum: 1,
                pageSize:3,
                listLoading: false,
                destroyFormVisible: false,
                destroyForm:{
                    docInfo_id:'',
                    dicDetail_id:'',
                    des:''
                }
            }
        },
        methods: {
            handleCurrentChange(val){
                this.pageNum = val;
                this.getDestroyDocs();
            },
            submit(){
                this.$refs.destroyForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let para = Object.assign({}, this.destroyForm);
                            para.user_id = JSON.parse(sessionStorage.getItem("user")).id;
                            this.$http.post("/destroyDoc",para).then(res=>{
                                let {success,message} = res.data;
                                if(success){
                                    let user = JSON.parse(sessionStorage.getItem(user));
                                    this.$message({
                                        message: message,
                                        type: 'success'
                                    });
                                    this.destroyFormVisible = false;
                                    this.getDestroyDocs();
                                }else{
                                    this.$message({
                                        message: message,
                                        type: 'error'
                                    });
                                }

                            })

                        });
                    }
                });},
            handleDestroy(){
                this.destroyFormVisible=true;
                this.destroyForm=[]
            },
            getDocs(){
                this.$http.get("/docinfo/list").then(res=>{
                    this.docs=res.data;
                })
            },
            //显示档案找回界面
            handleDestroy() {
                this.getDocs();
                this.destroyFormVisible = true;
                this.destroyForm = []
            },
            dateFormat(row,column){
                var t=new Date(row.destroyDate);
                return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate();
            },
            getDestroyDocs(){
                this.listLoading = true;
                let para = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    startDate:this.filters.startDate,
                    endDate:this.filters.endDate
                };
                //加载数据
                this.$http.post("/destroyDoc/page",para).then(res =>{
                    this.listLoading = false;
                    let {total,rows} = res.data;
                    this.total = total;
                    this.destroyDocs = rows;
                });
            }
        },
        mounted() {
            this.getDestroyDocs();
        }
    }
</script>

<style scoped>

</style>