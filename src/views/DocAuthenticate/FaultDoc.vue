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
                    <el-select v-model="filters.dicDetail_id" clearable placeholder="请选择档案状态">
                        <el-option
                                v-for="item in dicDetails"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getFaultDocs">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleFault">丢失损坏登记</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <!--列表-->
        <el-table :data="faultDocs" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60" label="#">
            </el-table-column>
            <el-table-column prop="docInfo.docSn" label="档案编号" width="120" sortable>
            </el-table-column>
            <el-table-column prop="user.username" label="操作用户" width="120" sortable>
            </el-table-column>
            <el-table-column prop="faultDate" :formatter="dateFormat" label="事故日期" width="100" sortable>
            </el-table-column>
            <el-table-column prop="dicDetail.name" label="事故类型" width="100" sortable>
            </el-table-column>
            <el-table-column prop="des" label="备注" width="100"  sortable>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <!--登记界面-->
        <el-dialog title="档案损坏与丢失登记" width="25%" :visible.sync="faultFormVisible" >
            <el-form :model="faultForm" label-width="80px" ref="faultForm">
                <el-form-item label="登记档案" prop="docInfo.docSn">
                    <el-select v-model="faultForm.docInfo_id" clearable placeholder="请选择要登记的档案">
                        <el-option
                                v-for="item in docs"
                                :key="item.id"
                                :label="item.docSn"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="事故类型" prop="reason">
                    <el-select v-model="faultForm.dicDetail_id" clearable placeholder="请选择要销毁的档案">
                        <el-option
                                v-for="item in options"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注" prop="des">
                    <el-input v-model="faultForm.des" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="faultFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="submit" >提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    export default {
        name: "FaultDoc",
        data() {
            return {
                dicDetails:[],
                options:[{
                    value: 27,
                    label: '档案丢失'
                },{
                    value: 25,
                    label: '档案损坏'
                }],
                filters:{
                    startDate:'',
                    endDate:'',
                    dicDetail_id:''
                },
                docs:[],
                FaultDocs: [],
                //分页
                total: 0,
                pageNum: 1,
                pageSize:2,
                listLoading: false,
                faultFormVisible: false,
                faultForm:{
                    docInfo_id:'',
                    dicDetail_id:'',
                    des:''
                }

            }
        },
        methods: {
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getFaultDocs();
            },
            submit(){
                this.$refs.faultForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            //this.addLoading = true;
                            let para = Object.assign({}, this.faultForm);
                            para.user_id = JSON.parse(sessionStorage.getItem("user")).id;
                            this.$http.post("/faultDoc",para).then(res=>{
                                let {success,message} = res.data;
                                if(success){
                                    this.$message({
                                        message: message,
                                        type: 'success'
                                    });
                                    this.faultFormVisible = false;
                                    this.getFaultDocs();
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
            getDocs(){
                this.$http.get("/docinfo/docs").then(res=>{
                    this.docs=res.data;
                })
            },
            getDicDetails(){
                this.$http.get("/dicdetail/fault").then(res=>{
                    this.dicDetails=res.data;
                })
            },
            handleFault(){

                this.getDocs();
                this.faultFormVisible=true;
                this.faultForm=[]
            },
            dateFormat(row,column){
                var t=new Date(row.faultDate);
                return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate();
            },
            getFaultDocs(){
                this.listLoading = true;
                let para = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    startDate:this.filters.startDate,
                    endDate:this.filters.endDate,
                    dicDetail_id: this.filters.dicDetail_id
                };
                //加载数据
                this.$http.post("/faultDoc/page",para).then(res =>{
                    this.listLoading = false;
                    let {total,rows} = res.data;
                    this.total = total;
                    this.faultDocs = rows;
                });
            }
        },
        mounted() {
            this.getFaultDocs();
            this.getDicDetails();
        }
    }
</script>

<style scoped>

</style>