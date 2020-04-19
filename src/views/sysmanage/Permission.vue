<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">


                <el-form-item>
                    <el-button type="warning" plain round @click="handleAdd" >新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>



        <el-table stripe border :data="permissions" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <!-- <el-table-column type="selection" width="55">
             </el-table-column>-->
            <el-table-column type="index" width="40" label="#">
            </el-table-column>

            <el-table-column prop="name" label="权限名称" width="120" sortable>
            </el-table-column>

            <el-table-column prop="url" label="资源路径编号" width="145" sortable>
            </el-table-column>

            <el-table-column prop="descs" label="权限备注" width="120"  sortable>
            </el-table-column>

            <el-table-column prop="sn" label="权限标识" width="110" sortable>
            </el-table-column>

            <el-table-column prop="menuId" label="对应菜单" width="120" sortable>
            </el-table-column>

            <el-table-column prop="status" label="状态" width="100" sortable>
                <template scope="scope">
                    <label style="color: green" v-if="scope.row.state==0">正常</label>
                    <label style="color: red" v-else>禁用</label>
                </template>
            </el-table-column>

            <el-table-column label="操作" min-width="140">
                <template scope="scope">
                    <el-button type="primary" plain round  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" plain round  @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>
        <!--编辑界面-->
        <el-dialog width="35%" title="编辑" :visible.sync="editFormVisible">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">

                <el-form-item label="用户名" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="资源路径" prop="name">
                    <el-input v-model="addForm.url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="name">
                    <el-input v-model="addForm.descs" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="标识" prop="name">
                    <el-input v-model="addForm.sn" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" width="30%" :visible.sync="addFormVisible">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">

                <el-form-item label="用户名" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="资源路径" prop="name">
                    <el-input v-model="addForm.url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="name">
                    <el-input v-model="addForm.descs" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="标识" prop="name">
                    <el-input v-model="addForm.sn" auto-complete="off"></el-input>
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
            return {
                pageNum: 1,
                pagesize: 10,
                total: 0,
                listLoading: true,
                permissions: [],
                filters: {},

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                //表单验证
                editFormRules: {
                    name: [
                        {required: true, message: '请输入权限名称', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: '请输入资源路径编号', trigger: 'blur'}
                    ],
                    descs: [
                        {required: true, message: '请输入备注', trigger: 'blur'}
                    ],
                    sn: [
                        {required: true, message: '请输入标识', trigger: 'blur'}
                    ],
                    menu_id: [
                        {required: true, message: '请输入对应菜单', trigger: 'blur'}
                    ]
                },
                    //新增界面数据
                    editForm: {
                        name: '',
                        url: '',
                        sn: '',
                        menu_id: '',
                        status: ''
                    },

                    addFormVisible: false,//新增界面是否显示
                    addLoading: false,
                    addFormRules: {

                        name: [
                            {required: true, message: '请输入权限名称', trigger: 'blur'}
                        ],
                        url: [
                            {required: true, message: '请输入资源路径编号', trigger: 'blur'}
                        ],
                        descs: [
                            {required: true, message: '请输入备注', trigger: 'blur'}
                        ],
                        sn: [
                            {required: true, message: '请输入标识', trigger: 'blur'}
                        ],
                        menu_id: [
                            {required: true, message: '请输入对应菜单', trigger: 'blur'}
                        ],


                    },
                    //新增界面数据
                    addForm: {
                        name: '',
                        url: '',
                        sn: '',
                        menu_id: '',
                        status: ''
                    }
                }
            },
                methods: {
                    //获取数据
                    getpermissions() {
                        this.listLoading = false
                        let param = {
                            pageNum: this.pageNum,
                            pagesize: this.pagesize
                        }
                        this.$http.post("/permission/page", param)
                            .then(res => {
                                let {total, rows} = res.data;
                                this.total = total;
                                this.permissions = rows
                            });
                    },
                    //新增
                    handleAdd() {
                        this.addFormVisible = true;

                        this.addFormRules = []
                    },
                    //添加
                    addSubmit() {
                        this.$refs.addForm.validate((valid) => {
                            if (valid) {
                                this.$confirm('你确认提交吗？', '', {}).then(() => {
                                    this.addLoading = true;
                                    let para = Object.assign({}, this.addForm);
                                    this.$http.post("/permission/save", para).then(res => {
                                        this.listLoading = true;
                                        let {success, msg} = res.data;
                                        if (success) {
                                            this.$message({
                                                message: msg,
                                                type: 'success'
                                            });
                                            this.addFormVisible = false;
                                            this.getpermissions();
                                        } else {
                                            this.$message({
                                                message: msg,
                                                type: 'error'
                                            });
                                        }
                                    });
                                })
                            }
                        });
                    },
                    //显示编辑页面
                    handleEdit(index,row) {
                        this.addForm = Object.assign({},row);
                        this.addForm.menu_id = row.menu.name;
                        this.editFormVisible = true
                    },
                    editSubmit(){
                        this.$refs.editForm.validate((valid)=>{
                            if(valid){
                                this.$confirm('你确定要提交吗?','提示',{}).then(()=>{
                                    this.editLoading = true;
                                    let para = Object.assign({},this.editForm);
                                    this.$http.post("/permission/save",para).then(res=>{
                                        this.listLoading = false;
                                        let {success,msg} = res.data;
                                        if (success){
                                            this.message({
                                                message:msg,
                                                type:'success'
                                            });
                                            this.editFormVisible = false;
                                            this.editLoading = false;
                                            this.getpermissions()
                                        }else {
                                            this.message({
                                                message:msg,
                                                type:'error'
                                            });
                                        }
                                    })
                                });
                            }
                        });
                    },
                    //删除
                    handleDel(index, row) {
                        this.$confirm('你确认要删除吗？', '提示', {
                            type: 'warning'
                        }).then(() => {
                            this.listLoading = true;
                            this.$http.delete("/permission/delete" + row.id).then(res => {
                                this.listLoading = false;
                                let {success, msg} = res.data;
                                if (success) {
                                    this.$message({
                                        message: msg,
                                        type: 'success'
                                    });
                                    this.getpermissions();
                                } else {
                                    this.$message({
                                        message: msg,
                                        type: 'error'
                                    });
                                }
                            })
                        })
                    },
                    //选中某一页的时候
                    handleCurrentChange(value) {
                        this.pageNum = value;
                        this.getpermissions();
                    }

                },
                mounted() {
                    this.getpermissions();
                }
            }
</script>

<style scoped>

</style>