<template>
    <div style="margin-top: 15px;">
        <el-input placeholder="请输入借阅编号, 如B1" v-model="borrowSn" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" class="search" @click="handleSearch"></el-button>
        </el-input>
        <el-table :data="borrows" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column prop="sn" width="100" label="借阅编号" sortable>
            </el-table-column>
            <el-table-column prop="status" label="借阅状态" width="100" sortable>
                <template scope="scope">
                    <h4 style="color: #11b95c" v-if="scope.row.status==0">未归还</h4>
                    <span style="color: #011107" v-else>已还</span>
                </template>
            </el-table-column>
            <el-table-column prop="docs" label="档案名" width="250"  sortable>
                <template scope="scope">
                    <span v-for="value in scope.row.docs">《{{value.docTitle}}》</span>
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="借阅人姓名" width="150" sortable>
            </el-table-column>
            <el-table-column prop="borrowTime" :formatter="dateFormat" label="借出时间" width="150" sortable>
            </el-table-column>
            <el-table-column prop="returnTime" :formatter="dateFormat2" label="应还时间" width="150" sortable>
            </el-table-column>
            <el-table-column prop="decs" label="备注信息" width="200" sortable>
            </el-table-column>

            <el-table-column label="操作" min-width="100">
                <template scope="scope">
                    <el-button type="primary" plain round  @click="showReturn(scope.$index, scope.row)">确认归还</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--归还的模态框-->
        <el-dialog title="归还信息填写"  :visible.sync="returnFormVisible" :close-on-click-modal="false">
            <el-form :model="returnForm" label-width="130px" ref="returnForm">
                <el-form-item label="退还档案">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="checkedDocs" @change="handleCheckedDocsChange">
                        <el-checkbox v-for="doc in docs" :label="doc.id" :key="doc.id">《{{doc.docTitle}}》</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="备注" >
                    <el-input class="inputTag" placeholder="如封面破损,若无请忽略" v-model="returnForm.decs" auto-complete="off" resize="vertical"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="returnFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="returnSubmit" :loading="returnLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                docs:[], // 所有档案
                checkedDocs:[],  // 已选档案
                checkAll:false,  // 全选选择与否
                isIndeterminate:false,  // 全选样式
                returnLoading:false,
                returnFormVisible:false,
                borrowSn:'',
                borrows:[],
                pageSize:10,
                pageNum:1,
                total:0,
                selections:[],
                countId:1,
                borrowId:'',
                operationId:JSON.parse(sessionStorage.getItem("user")).id,
                returnForm:{
                    decs:''
                }
            }
        },
        methods:{
            //处理档案多选框
            handleCheckAllChange(val){
                let ids = [];
                for(let i=0;i<this.docs.length;i++){
                    ids.push(this.docs[i].id);
                }
                this.checkedDocs = val ? ids : [];
                this.isIndeterminate = false;
            },
            handleCheckedDocsChange(value){

                let checkedCount = value.length;
                this.checkAll = checkedCount === this.docs.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.docs.length;
            },
            getDocs(row){
                for(let i=0;i<row.docs.length;i++){
                    this.docs.push(row.docs[i])
                }
            },
            // 点击显示归还模态框
            showReturn(index,row){
                this.borrowId = row.id;
                this.checkAll =false;
                this.isIndeterminate = false;
                this.docs = [];
                this.getDocs(row);
                this.returnFormVisible = true;
            },

            // 日期类型处理
            dateFormat(row,column){
                var t=new Date(row.borrowTime);//row 表示一行数据
                return t.getFullYear()+"年"+(t.getMonth()+1)+"月"+t.getDate()+"日";
            },
            dateFormat2(row,column){
                var t=new Date(row.returnTime);//row 表示一行数据
                return t.getFullYear()+"年"+(t.getMonth()+1)+"月"+t.getDate()+"日";
            },

            handleCurrentChange(val){
              this.pageNum = val;
              this.handleSearch();
            },
            // 查询所有档案编号
            handleSearch(){
                let params = {
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
                    sn:this.borrowSn
                };
                this.$http.post("/borrow/pageBorrow",params)
                    .then(res=>{
                        let{ total,rows } = res.data;
                        this.total = total;
                        this.borrows = rows;
                    });
            },

            // 处理 归还
            returnSubmit(){
                let para = Object.assign({}, this.returnForm);
                para.docIds = this.checkedDocs.toString();
                para.id = this.borrowId;
                para.sn = "R"+Math.floor(Math.random()*100000);
                para.operationId = this.operationId;
                this.$http.post("/borrow/returnExcel",para)
                .then(res => {
                    let{success,msg} = res.data;
                    if(success){
                        this.$message({
                            message: msg,
                            type: 'success'
                        });
                        this.returnFormVisible = false;
                        this.handleSearch();
                    }else{
                        this.$message({
                            message: msg,
                            type: 'error'
                        });
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消归还'
                    });
                });

            }
        }
    }
</script>

<style scoped>
    .search{
        width: 150px;
    }
</style>