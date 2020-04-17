<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" ref="docform" class="docform">
                <el-form-item>
                    <el-input v-model="filters.keyword" style="width: 150px;" size="medium" placeholder="档案名称检索" class="formWidth"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-select v-model="filters.doctypeId" size="medium" style="width: 150px;" clearable placeholder="请选择档案类型" class="formWidth"  >
                        <el-option
                                v-for="item in doctypes"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                            v-model="filters.beginTime"
                            type="date"
                            style="width: 150px;"
                            placeholder="选择开始日期" size="medium" class="formWidth">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>—</el-form-item>
                <el-form-item>
                    <el-date-picker
                            style="width: 150px;"
                            v-model="filters.endTime"
                            type="date"
                            placeholder="选择截至日期" size="medium" class="formWidth">
                    </el-date-picker>
                </el-form-item>
                <el-form-item  prop="status"  >
                    <!--<el-input v-model="addForm.state" auto-complete="off"></el-input>-->
                    <el-select v-model="filters.status" style="width: 150px;" clearable placeholder="请选择档案状态" size="medium" class="formWidth">
                        <el-option
                                v-for="item in statues"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" plain v-on:click="getdocs">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button   @click="exportExcel" type="primary"  style="width:70px">导出</el-button>

                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table id="docinfo" :data="docs" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column type="index" width="60" label="#">
            </el-table-column>
            <el-table-column prop="docSn" label="档案编号" width="150" sortable>
            </el-table-column>
            <el-table-column prop="docTitle" label="档案名称" width="330"  sortable>
            </el-table-column>
            <!--<el-table-column prop="hireDate" :formatter="dateFormat" label="入职日期" width="120" sortable>
            </el-table-column>-->
            <el-table-column prop="doctype.name" label="档案分类" width="150" sortable>
            </el-table-column>
            <el-table-column prop="createDate" label="档案日期" :formatter="dateFormat" width="170"  sortable>
            </el-table-column>
            <el-table-column prop="status" label="状态"   width="90" sortable>
                <template scope="scope">
                    <span style="color: green" v-if="scope.row.status==0">在使用</span>
                    <span style="color: #b71614" v-else-if="scope.row.status==-1">已删除</span>
                    <span style="color: #c7c7c7" v-else-if="scope.row.status==-2">已销毁</span>
                    <span style="color: #a3447f" v-else-if="scope.row.status==-3">已损坏</span>
                    <span style="color: #626362" v-else-if="scope.row.status==-4">已丢失</span>
                    <span style="color: #0e4163" v-else-if="scope.row.status==-5">已过期</span>
                    <span style="color: #631b48" v-else-if="scope.row.status==-6">已找回</span>
                    <span style="color: #dcdb32" v-else>已过期</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="160">
                <template scope="scope">
                    <el-button type="primary" plain round @click="showBorrow(scope.$index, scope.row)" :disabled="scope.row.status != 0">借阅</el-button>
                    <el-button type="danger" plain round  @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="showBorrow2" :disabled="this.selections.length===0">批量借阅</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>


    </section>

</template>

<script>
    import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    //文件导出
   /* import fileSaver from 'file-saver';
    import xlsx from 'xlsx';*/

    export default {
        data() {
            return {
                //高级查询
                filters: {
                    keyword: '',
                    doctypeId:'',
                    status:null,
                    beginTime:'',
                    endTime:''

                },
                statues:[
                    {
                        value:0,
                        label:"在使用"
                    },{
                        value:-1,
                        label:"已删除"
                    },{
                        value:-2,
                        label:"已销毁"
                    },{
                        value:-3,
                        label:"损坏"
                    },{
                        value:-4,
                        label:"丢失"
                    },{
                        value:-5,
                        label:"已过期"
                    },{
                        value:-6,
                        label:"已找回"
                    }
                ],
                doctypes:[],
                docs: [],
                //分页
                total: 0,
                page: 1,
                pageSize:10,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },

                addLoading: false,

                selections:[], // 列表选中列
                ids:'',
                id:''
            }
        },
        methods: {
            // 更新索引

            // 显示 借阅的模态框
            showBorrow(index,row){
                this.id += row.id;
                sessionStorage.setItem("docIds",this.id)
                this.$router.push({path:"/borrow"});
            },
            // 获取多选框的 id值   -- 批量借阅  差一个批量按钮
            selsChange(val){
                this.selections = val;
                for(let i=0;i<this.selections.length;i++){
                    if(this.selections[i].status == 0){
                        this.ids += this.selections[i].id;
                        if(i<this.selections.length-1){
                            this.ids+=',';
                        }
                    }
                }
                this.id = this.ids;
                this.ids='';
            },
            showBorrow2(){
                sessionStorage.setItem("docIds",this.id)
                this.$router.push({path:"/borrow"});
            },
            getdoctypes(){
                this.$http.get("/doctype/list").then(res=>{
                    this.doctypes = res.data;

                })
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getdocs();
            },
            //入职时间格式化
            dateFormat(row,column){
                var t=new Date(row.createDate);//row 表示一行数据, updateTime 表示要格式化的字段名称
                return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate();//+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()+"."+t.getMilliseconds()
            },
            //获取档案列表
            getdocs() {
                //转圈圈
                this.listLoading = true;
                let para = {
                    pageNum: this.page,
                    pageSize: this.pageSize,
                    keyword:this.filters.keyword,
                    doctypeId:this.filters.doctypeId,
                    status:this.filters.status,
                    beginTime:this.filters.beginTime,
                    endTime:this.filters.endTime
                };
                //加载数据
                this.$http.post("/docinfo/page",para).then(res =>{
                    this.listLoading = false;
                    let {total,rows} = res.data;
                    this.total = total;
                    this.docs = rows;
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    this.$http.delete("/docinfo/"+row.id).then(res=>{
                        this.listLoading = false;
                        let {success,msg} = res.data;
                        if(success){
                            this.$message({
                                message: msg,
                                type: 'success'
                            });
                            this.getdocs();
                        }else{
                            this.$message({
                                message: msg,
                                type: 'error'
                            });
                        }
                    })

                    /*let para = { id: row.id };
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getdocs();
                    });*/
                }).catch(() => {

                });
            },
            //导出Excel
            onexport:function () {
                console.log(this.filters);
                this.$http.get("/docinfo/export?keyword="+this.filters.keyword).then(res=>{
                    if(res.data){
                        this.$message({
                            message: '导出成功',
                            type: 'success'
                        });
                    }
                });
            },
            exportExcel () {
                this.pageSize = 300;
                this.page=1;
                /* generate workbook object from table */
                var wb = XLSX.utils.table_to_book(document.querySelector('#docinfo'))
                /* get binary string as output */
                var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
                try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '档案列表.xlsx')
                } catch (e) {
                    if (typeof console !== 'undefined') console.log(e, wbout)
                }
                this.pageSize = 10;
                return wbout
            },

            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { ids: ids };
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getdocs();
                    });
                }).catch(() => {

                });
            }
            // 导出表格所用
            /*exportExcel() {
                // 设置当前日期
                let time = new Date();
                let year = time.getFullYear();
                let month = time.getMonth() + 1;
                let day = time.getDate();
                let name = year + "" + month + "" + day;
                /!* generate workbook object from table *!/
                //  .table要导出的是哪一个表格
                var wb = XLSX.utils.table_to_book(document.querySelector(".table"));
                /!* get binary string as output *!/
                var wbout = XLSX.write(wb, {
                    bookType: "xlsx",
                    bookSST: true,
                    type: "array"
                });
                try {
                    //  name+'.xlsx'表示导出的excel表格名字
                    FileSaver.saveAs(
                        new Blob([wbout], { type: "application/octet-stream" }),
                        name + ".xlsx"
                    );
                } catch (e) {
                    if (typeof console !== "undefined") console.log(e, wbout);
                }
                return wbout;
            }*/
        },
        mounted() {
            this.getdocs();
            this.getdoctypes();


        }
    }
</script>

<style scoped>
    .formWidth{
        width: 180px;
    }

</style>
