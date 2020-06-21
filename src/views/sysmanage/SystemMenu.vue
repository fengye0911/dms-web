<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
                </el-form-item>


                <el-form-item>
                    <el-button type="success" plain round v-on:click="getMenuData">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" plain round @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table stripe border :data="menudata" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">

            <el-table-column type="index" width="60" label="#">
            </el-table-column>
            <el-table-column prop="name" label="菜单名称" width="130" sortable>
            </el-table-column>
            <el-table-column prop="url" label="路径" width="130"  sortable>
            </el-table-column>
            <el-table-column prop="icon" label="图标" width="120" sortable>
            </el-table-column>
            <el-table-column prop="parent_id" label="上级菜单" width="110" sortable>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="80" sortable>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80" sortable >
                <template scope="scope">
                    <span style="color: blue;" v-if="scope.row.status==0">启用</span>
                    <span style="color: crimson" v-else>禁用</span>
                </template>
            </el-table-column>
            <el-table-column prop="component" label="组件路径" width="170" sortable>
            </el-table-column>


            <el-table-column label="操作" min-width="160">
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
        <el-dialog width="25%" title="编辑" :visible.sync="editFormVisible" >
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">

                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="url">
                    <el-input v-model="editForm.url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="icon">
                    <el-input v-model="editForm.icon" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="上级菜单" prop="parent_id">
                    <el-input v-model="editForm.parent_id" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="备注" prop="remark">
                    <el-input v-model="editForm.remark" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-input v-model="editForm.status" auto-complete="off"></el-input>
                </el-form-item>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--编辑界面完-->

        <!--新增界面-->
        <el-dialog title="新增" @click="addFormVisible=true" width="25%" :visible.sync="addFormVisible" >
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">

                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="路径" prop="url">
                    <el-input v-model="addForm.url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="icon">
                    <el-input v-model="addForm.icon" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="上级菜单" prop="parent_id">
                    <el-input v-model="addForm.parent_id" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="备注" prop="remark">
                    <el-input v-model="addForm.remark" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-input v-model="addForm.status" auto-complete="off"></el-input>
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
    import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
    import Department from "./Department";

    export default {
        data() {
            return {
                //高级查询
                filters: {
                    keyword: ''
                },
                menudata:[],
                //分页
                total: 0,
                pageSize:10,
                pageNum:1,
                listLoading: false,
                // sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                //表单验证
                editFormRules: {
                    companyName: [
                        { required: true, message: '请输入公司名称', trigger: 'blur' }
                    ],
                    systemName: [
                        { required: true, message: '请输入系统名称', trigger: 'blur' }
                    ],
                    companyTel:[
                        {required: true,pattern:/^1[3-9]{1}[0-9]{9}$/,message:'请输入正确的联系方式',trigger: 'blur'}
                    ],

                },
                //编辑界面数据
                editForm: {
                    id:'',
                    name: '',
                    url: '',
                    icon: '',
                    parent_id:'',
                    remark:'',
                    status: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {

                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    companyTel:[
                        {required: true,pattern:/^1[3-9]{1}[0-9]{9}$/,message:'请输入正确的联系方式',trigger: 'blur'}
                    ],



                },
                //新增界面数据
                addForm: {
                    id:'',
                    name: '',
                    url: '',
                    icon: '',
                    parent_id:'',
                    remark:'',
                    status: ''
                }

            }
        },
        methods: {
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getMenuData();
            },

            //获取用户列表
            getMenuData() {
                this.listLoading = true;
                let para = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    keyword:this.filters.keyword
                };
                //转圈圈
                //加载数据
                this.$http.post("/menu/list",para).then(res =>{
                    this.listLoading = false;
                    let {success,msg,resobj} = res.data;
                    this.menudata = resobj.rows;
                    this.total = resobj.total;
                    console.debug("this.menudata",res);
                });
            },
            //删除
            handleDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    this.$http.delete("/menu/delete?id="+row.id).then(res=>{
                        this.listLoading = false;
                        let {success,msg} = res.data;
                        if(success){
                            this.$message({
                                message: msg,
                                type: 'success'
                            });
                            this.getMenuDatar();
                        }else{
                            this.$message({
                                message: msg,
                                type: 'error'
                            });
                        }
                    })

                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit(index, row) {
                console.debug(row);
                this.editForm = Object.assign({}, row);
                this.editFormVisible = true;
            },
            //显示新增界面
            handleAdd() {
                this.addFormVisible = true;
                this.addForm = []
            },
            //编辑提交
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            this.$http.post("/menu/update",para).then(res=>{
                                this.listLoading = false;
                                let {success,msg} = res.data;
                                if(success){
                                    this.$message({
                                        message: msg,
                                        type: 'success'
                                    });
                                    this.editFormVisible = false;
                                    this.editLoading = false;
                                    this.getMenuData();
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
            //新增
            addSubmit() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            this.$http.post("/menu/insert",para).then(res=>{
                                this.listLoading = false;
                                let {success,msg} = res.data;
                                if(success){
                                    this.$message({
                                        message: msg,
                                        type: 'success'
                                    });
                                    this.addFormVisible = false;
                                    this.getMenuData();
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
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
        },
        mounted() {
            this.getMenuData();

        }
    }
</script>

<style scoped>

</style>
