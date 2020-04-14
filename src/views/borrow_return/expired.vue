<template>
    <seaction>
        <el-col :span="24" style="padding-bottom: 0px;margin-top: 10px">
            <el-form :inline="true">
                <el-form-item>
                    <el-select v-model="expiredTime" clearable="true" placeholder="根据到期时间段查询">
                        <el-option
                                v-for="item in ranges"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" plain round v-on:click="getBorrows">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-table :data="borrows" highlight-current-row v-loading="listLoading" :row-class-name="tableRowClassName" style="width: 100%;">
            <el-table-column type="expand">
                <template scope="scope">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="档案简介">
                            <span v-for="value in scope.row.docs">{{ value.contentIntro }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column prop="docs" width="130px" label="档案编号" sortable>
                <template scope="scope">
                    <span v-for="value in scope.row.docs">{{value.docSn}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="docs" label="档案名称" width="250"  sortable>
                <template scope="scope">
                    <span v-for="value in scope.row.docs">《{{value.docTitle}}》</span>
                </template>
            </el-table-column>
            <el-table-column prop="docs" label="档案分类" width="130"  sortable>
                <template scope="scope">
                    <span v-for="value in scope.row.docs">{{value.doctypeName}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="userName" label="借阅人姓名" width="120" sortable>
            </el-table-column>
            <el-table-column  label="借阅状态" width="100px" sortable>
                <template scope="scope">
                    <span v-if="scope.row.returnTime < new Date().getTime() && scope.row.returnId == null" style="color: red">已逾期</span>
                    <span v-else-if="scope.row.returnTime - new Date().getTime() <= 259200000" style="color:#c0c000">即将到期</span>
                    <span v-else-if="scope.row.returnId != null">已归还</span>
                    <span v-else>未到期</span>
                </template>
            </el-table-column>
            <el-table-column prop="borrowTime" :formatter="dateFormat" label="借出时间" width="150" sortable>
            </el-table-column>
            <el-table-column prop="returnTime" :formatter="dateFormat2" label="截止日期" width="150" sortable>
            </el-table-column>
            <el-table-column label="操作" min-width="140">
                <template scope="scope">
                    <h4 v-if="scope.row.returnId" class="el-icon-circle-check" style="color: #13ce66">  已归还</h4>
                    <el-button type="primary" v-else plain round @click="showReturn(scope.$index, scope.row)">确认归还</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

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
    </seaction>
</template>

<script>
    export default {
        data(){
            return{
                ranges:[
                    {label:'最近一天',value:1},
                    {label:'最近三天',value:3},
                    {label:'最近一周',value:7},
                    {label:'最近两周',value:14},
                    {label:'最近一个月',value:31}
                ],
                expiredTime:'',
                borrows:[],
                pageNum:1,
                pageSize:10,
                total:0,
                pages:[],

                docs:[], // 所有档案
                checkedDocs:[],  // 已选档案
                checkAll:false,  // 全选选择与否
                isIndeterminate:false,  // 全选样式
                returnLoading:false,
                returnFormVisible:false,
                returnForm:{
                    decs:''
                },
                expireDocs:[]
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
            // 查询所有档案编号
            handleSearch(){
                let params = {
                    pageNum:this.pageNum,
                    pageSize:this.pageSize,
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
                            this.getBorrows();
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

            },
            handleCurrentChange(val){
                this.pageNum = val;
                this.getBorrows();
            },
            // 处理根据时间查询
            // search(){
            //
            // },

            // 处理过期等背景色
            tableRowClassName({row, rowIndex}){
                if(row.returnTime < new Date().getTime() && row.returnId == null){
                    return 'expired-row';
                }
            },
            // 日期类型处理
            dateFormat(row,column){
                var t=new Date(row.borrowTime);
                return t.getFullYear()+"年"+(t.getMonth()+1)+"月"+t.getDate()+"日";
            },
            dateFormat2(row,column){
                var t=new Date(row.returnTime);
                return t.getFullYear()+"年"+(t.getMonth()+1)+"月"+t.getDate()+"日";
            },
            getBorrows(){
                this.expireDocs = [];
                let para ={
                    pageNum: this.pageNum,
                    pageSize:this.pageSize,
                    expiredTime:this.expiredTime
                }
                this.$http.post("/search/selectForExpired",para)
                    .then(res=>{
                        let {total,rows} = res.data;
                        this.total = total;
                        this.borrows = rows;

                    });

                setTimeout(()=>{
                        for(let i=0;i<this.borrows.length;i++){
                            if(this.borrows[i].returnTime - new Date().getTime() <= 259200000){
                                this.expireDocs.push(this.borrows[i]);
                            }
                        }
                        if(this.expireDocs.length > 0){
                            this.$notify({
                                title: '温馨提示',
                                type:'warning',
                                message: "尊敬的用户，您有  "+this.expireDocs.length+"  份档案即将到期",
                                position: 'bottom-right'
                            });
                        }
                    }
                    ,1500);
            },
        },
        mounted(){
            this.getBorrows();
        }
    }
</script>

<style scoped>
    .el-table__body .column-expired{
        background: #e6f337;
    }
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #f7ffff;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>