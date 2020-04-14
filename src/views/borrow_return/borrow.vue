<template>
    <section>

        <el-table :data="pages" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column prop="sn" width="120" label="编号" sortable>
            </el-table-column>
            <el-table-column prop="status" label="借阅状态" width="120" sortable>
                <template scope="scope">
                    <span v-if="scope.row.status==0" style="color: #09c910;"><h4>未归还</h4></span>
                    <span v-else style="color:#000;">已归还</span>
                </template>
            </el-table-column>
            <el-table-column label="档案名" width="250"  sortable>
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
            <el-table-column prop="decs" label="备注信息" min-width="200" sortable>
            </el-table-column>

        </el-table>
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <!-- 新增借阅信息 -->
        <el-dialog title="借阅信息填写"  :visible.sync="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="130px" :rules="addFormRules" ref="addForm">
                <el-form-item label="借阅人" prop="userName">
                    <el-input class="inputTag" v-model="addForm.userName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="借阅人证件号码" prop="idNumber">
                    <el-input class="inputTag input-with-select" v-model="addForm.idNumber" auto-complete="off">
                        <el-select class="select" v-model="addForm.dicdetail_id" slot="prepend" placeholder="请选择证件类型" style="width: 150px;">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-input>

                </el-form-item>

                <el-form-item label="借阅人联系方式" prop="tel">
                    <el-input class="inputTag" v-model="addForm.tel" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" >
                    <el-input class="inputTag" v-model="addForm.decs" auto-complete="off" resize="vertical"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    export default {
        data(){
            return{
                total:0,
                borrows:[],
                pageSize:10,
                pageNum:1,
                addFormVisible:false,
                addForm:{
                    userName:"",
                    decs:"",
                    tel:"",
                    idNumber:"",
                    dicdetail_id:""
                },
                addFormRules:{
                    userName:[
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    dicdetail_id:[
                        {required: true, message: '请输入证件类型', trigger: 'blur'}
                    ],
                    idNumber:[
                        {required: true, message: '请输入证件号码', trigger: 'blur'}
                    ],
                    tel:[
                        {required: true,pattern:/^1[3-9]{1}[0-9]{9}$/,message:'请输入正确的联系方式',trigger: 'blur'}
                    ]
                },
                options:[],
                selections:[],
                ids:'',
                countId:1,
                pages:[]

            }
        },
        methods:{
            handleCurrentChange(val){
                this.pageNum = val;
                this.handleChange();
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
            // 提交 借阅表
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {})
                            .then(() => {
                                this.addLoading = true;
                            // 获取登录用户
                            let loginUser  = sessionStorage.getItem("user");
                            let user = JSON.parse(loginUser);
                            let para = Object.assign({}, this.addForm);
                            para.user = user;

                            //获取档案id
                            para.ids = sessionStorage.getItem("docIds");
                            sessionStorage.removeItem("docIds")
                            // 设置 借阅编号
                            para.sn = "B"+Math.floor(Math.random()*100000);

                            this.$http.post("/borrow/addBorrow",para).then(res=>{
                                this.listLoading = false;
                                let {success,msg} = res.data;
                                if(success){
                                    this.$message({
                                        message: msg,
                                        type: 'success'
                                    });
                                    this.addFormVisible = false;
                                    // this.borrows = [];
                                    this.getBorrows();
                                }else{
                                    this.$message({
                                        message: msg,
                                        type: 'error'
                                    });
                                }

                            })
                        });
                    }
                });
            },
            // 证件类型下拉框
            dicDetail(){
                this.$http.post("/dicdetail/IDType")
                    .then(res=>{
                        let list = res.data;
                        var item ={};
                        var ops = [];
                        for(let i=0;i<list.length;i++) {
                            item.label = list[i].name;
                            item.value = list[i].id;
                            ops.push(item);
                            item={};

                        }
                        this.options = ops;
                    })
            },
            // 显示 借阅表
            showBorrow(){
                this.addForm={
                    userName:"",
                    decs:"",
                    tel:"",
                    idNumber:"",
                    dicdetail_id:""
                };
                this.dicDetail();
                this.addFormVisible = true;
            },

            //获取所有借阅表信息
            getBorrows(){
                let params = {pageNum:this.pageNum,pageSize:this.pageSize};
                this.$http.get("/borrow/selectAll")
                    .then(res=>{
                        let {total,rows} = res.data;
                        this.borrows = rows;
                        this.handleChange();
                    });
            },
            // 处理前台翻页
            handleChange(){
                for(let n = (this.pageNum-1)*this.pageSize;n<this.pageNum*this.pageSize;n++){
                    if(n == this.borrows.length){
                        return;
                    }
                    this.pages.push(this.borrows[n]);
                    this.pages[n].status = this.borrows[n].status;
                    this.pages[n].borrowTime = this.borrows[n].borrowTime;
                    this.pages[n].returnTime = this.borrows[n].returnTime;
                }
                this.total = this.pages.length;
            }
        },
        mounted(){
            this.dicDetail();
            let item = sessionStorage.getItem("docIds");
            if(item !=null && item != ''){
                this.addFormVisible = true;
            }else{
                this.getBorrows();
            }
        }
    }
</script>

<style scoped>
    .inputTag{
        width: 550px;
    }
    .input-with-select .select {
        background-color: #ebebeb;
    }
</style>