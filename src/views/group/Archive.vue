<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select style="width: 150px" v-model="filters.state" clearable placeholder="--选择状态--">
                        <el-option
                                v-for="item in options"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="success" icon="el-icon-search" plain round v-on:click="getDocAddress">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="warning" icon="el-icon-plus" plain round @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table stripe border :data="docAddress" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">

            <el-table-column type="index" width="60" label="#">
            </el-table-column>
            <el-table-column prop="id" label="存档点编号" width="130" sortable>
            </el-table-column>
            <el-table-column prop="name" label="存档点名称" width="130"  sortable>
            </el-table-column>
            <el-table-column prop="tel" label=联系电话" width="130" sortable>
            </el-table-column>
            <el-table-column prop="address" label="存档点地址" width="150" sortable>
            </el-table-column>
            <el-table-column prop="fax" label="传真" width="130" sortable>
            </el-table-column>
            <el-table-column prop="contact" label="联系人" width="120"  sortable>
            </el-table-column>

            <el-table-column prop="decs" label="备注" width="110" sortable>
            </el-table-column>

            <el-table-column prop="state" label="状态" width="100" sortable>
                <template scope="scope">
                    <button style="color: green" v-if="scope.row.state==1">启用</button>
                    <button style="color: red" v-else>禁用</button>
                </template>
            </el-table-column>

            <el-table-column label="操作" min-width="160">
                <template scope="scope">
                    <el-button type="primary" plain round icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" plain round  icon="el-icon-delete" @click="handleDel(scope.$index, scope.row)">删除</el-button>
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

                <el-form-item label="存档名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contact">
                    <el-input v-model="editForm.contact" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系号码" prop="tel">
                    <el-input v-model="editForm.tel" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="传真" prop="fax">
                    <el-input v-model="editForm.fax" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="存档地址" prop="address">
                    <el-input v-model="editForm.address" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="备注" prop="decs">
                    <el-input v-model="editForm.decs" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="editForm.state" >
                        <el-option
                                v-for="item in options"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
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

                <el-form-item label="存档名称" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contact">
                    <el-input v-model="addForm.contact" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="联系号码" prop="tel">
                    <el-input v-model="addForm.tel" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="传真" prop="fax">
                    <el-input v-model="addForm.fax" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="存档地址" prop="address">
                    <el-input v-model="addForm.address" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="备注" prop="decs">
                    <el-input v-model="addForm.decs" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="addForm.state" >
                        <el-option
                                v-for="item in options"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
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
                docAddress:[],
                users:[],
                options:[{
                    value: 1,
                    label: '启用'
                },{
                    value: -1,
                    label: '禁用'
                }],
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
                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    phoneNum:[
                        {required: true,pattern:/^1[3-9]{1}[0-9]{9}$/,message:'请输入正确的联系方式',trigger: 'blur'}
                    ],

                },

                //编辑界面数据
                editForm: {
                    id:'',
                    fax: '',
                    name: '',
                    tel: '',
                    contact:'',
                    address:'',
                    decs: '',
                    state:''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {

                    name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    phoneNum:[
                        {required: true,pattern:/^1[3-9]{1}[0-9]{9}$/,message:'请输入正确的联系方式',trigger: 'blur'}
                    ],



                },
                //新增界面数据
                addForm: {
                    fax: '',
                    name: '',
                    tel: '',
                    contact:'',
                    address:'',
                    decs: '',
                    state:''
                }

            }
        },
        methods: {
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getDocAddress();
            },
            getUser(){
                this.$http.post("/users").then(res=>{
                    this.users=res.data;
                })
            },
            //获取用户列表
                getDocAddress() {
                this.listLoading = true;
                let para = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    keyword:this.filters.keyword
                };
                //转圈圈
                //加载数据
                this.$http.get("/docaddress/list").then(res =>{
                    this.listLoading = false;
                    this.docAddress = res.data;
                });
            },
            //删除
            handleDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    this.$http.delete("/docaddress/delete?id="+row.id).then(res=>{
                        this.listLoading = false;
                        let {success,msg} = res.data;
                        if(success){
                            this.$message({
                                message: msg,
                                type: 'success'
                            });
                            this.getDocAddress();
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
                            this.$http.post("/docaddress/update",para).then(res=>{
                                this.listLoading = false;
                                let {success,message} = res.data;
                                if(success){
                                    this.$message({
                                        message: message,
                                        type: 'success'
                                    });
                                    this.editFormVisible = false;
                                    this.editLoading = false;
                                    this.getDocAddress();
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
            //新增
            addSubmit() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            this.$http.post("/docaddress/insert",para).then(res=>{
                                this.listLoading = false;
                                let {success,message} = res.data;
                                if(success){
                                    this.$message({
                                        message: message,
                                        type: 'success'
                                    });
                                    this.addFormVisible = false;
                                    this.getDocAddress();
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
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
        },
        mounted() {
            this.getDocAddress();

        }
    }
</script>

<style scoped>

</style>