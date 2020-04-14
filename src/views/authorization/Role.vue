<template >
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true">
                <el-form-item>
                    <el-button size="small" icon="el-icon-plus" type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="roles" highlight-current-row v-loading="listLoading"
                  style="width: 100%;">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column type="index" width="40" label="#">
            </el-table-column>
            <el-table-column prop="sn" label="标识" width="200" sortable>
            </el-table-column>
            <el-table-column prop="name" label="名称" width="200" sortable>
            </el-table-column>
            <el-table-column label="角色关联的权限" min-width="200" sortable>
                <template scope="scope">
                    <span v-for="(p,index) in scope.row.permission">
                        {{p.name}}
                        <span v-if="index < scope.row.permission.length-1">
                            ,
                        </span>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button size="small" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button icon="el-icon-delete" type="danger" size="small"
                               @click="handleDel(scope.$index, scope.row)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize"
                           :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <!--<el-dialog title="编辑" :visible.sync="editFormVisible">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="角色编号" prop="sn">
                    <el-input v-model="editForm.sn" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="相关权限">
                    <el-input v-model="editForm.permission"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>-->

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible">
            <el-form :model="addForm" label-width="80px" ref="addForm">
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="角色编号" prop="sn">
                            <el-input size="small" v-model="addForm.sn" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="角色名称" prop="name">
                            <el-input size="small" v-model="addForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col span="24">
                        <el-transfer style="text-align: left; display: inline-block"
                                     v-model="value" :data="data"
                                     :filterable="true"
                                     :left-default-checked="[]"
                                     :right-default-checked="[]"
                                     :titles="['全部权限', '已选权限']"
                                     :button-texts="['不选权限', '已选权限']"
                                     @change="handleChange"
                                     @right-check-change="pass">
                            <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span>
                        </el-transfer>
                    </el-col>
                </el-row>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    import {getUserListPage, removeUser, batchRemoveUser, editUser, addUser} from '../../api/api';

    export default {
        data() {
            return {
                value: [],
                data: [],
                roles: [],
                total: 0,
                page: 1,
                pageSize: 10,
                listLoading: false,
                sels: [],//列表选中列
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入角色名', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {
                    sn: '',
                    name: '',
                    permission: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入角色名', trigger: 'blur'}
                    ]
                },
                //新增界面数据
                addForm: {
                    sn: '',
                    name: '',
                }

            }
        },
        methods: {
            permissionList() {
                this.$http.get("/permission/list")
                    .then(res => {
                        this.data = res.data;
                    })
            },
            //获取分页数据
            handleCurrentChange(val) {
                this.page = val;
                this.getroles();
            },
            //获取员工列表
            getroles() {
                let para = {
                    pageNum: this.page,
                    pageSize: this.pageSize,
                };
                this.listLoading = true;
                this.$http.post("/role/page", para)
                    .then(res => {
                        this.listLoading = false;
                        let {total, rows} = res.data;
                        this.total = total;
                        this.roles = rows;
                    });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.value = [];
                this.editForm = Object.assign({}, row);
                for (let i = 0; i < row.permission.length; i++) {
                    this.value.push(row.permission[i].id);
                }
                this.editForm = {
                    sn: '',
                    name: '',
                    permission: ''
                };
                this.huixian();
            },
            //显示新增界面
            handleAdd() {
                this.addForm = {
                    sn: '',
                    name: '',
                };
                this.permissionList();
                this.addFormVisible = true;
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = false;
                    this.$http.delete("/role/" + row.id)
                        .then(res => {
                            this.listLoading = false;
                            let {success, message} = res.data;
                            if (success) {
                                this.$message({
                                    message: msg,
                                    type: 'success'
                                });
                                this.handleChange();
                                this.getroles();
                            } else {
                                this.$message({
                                    message: msg,
                                    type: 'error'
                                });
                            }
                        })
                }).catch(() => {
                });
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            this.editLoading = false;
                            let para = Object.assign({}, this.editForm);
                            this.$http.post("/role", para)
                                .then(res => {
                                    this.listLoading = false;
                                    let {success, message} = res.data;
                                    if (success) {
                                        this.$message({
                                            message: message,
                                            type: 'success'
                                        });
                                        this.editFormVisible = false;
                                        this.getroles();
                                    } else {
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
            addSubmit: function () {
                this.$confirm('确认保存吗？', '提示', {}).then(() => {
                    this.addLoading = false;
                    let param = Object.assign({}, this.addForm);
                    param.permissionIds = this.value.join(",");
                    this.$http.post("/role", param)
                        .then(res => {
                            this.listLoading = false;
                            let {success, message} = res.data;
                            if (success) {
                                this.$message({
                                    message: message,
                                    type: 'success'
                                });
                                this.addFormVisible= false;
                                this.getroles();
                            } else {
                                this.$message({
                                    message: message,
                                    type: 'error'
                                });
                            }
                        })
                });
            },
            //右侧列表元素变化时触发
            handleChange: function () {
                const generateData = _ => {
                    const data = [];
                    let para = Object.assign({}, this.addForm);
                    this.$http.post("/role", para).then((res) => {
                        for (let i = 0; i <= res.data.length; i++) {
                            data.push({
                                key: res.data[i].id,
                                label: res.data[i].name,
                            });
                        }
                    })
                    this.data = data;
                    return this.data;
                }
            },
            //右侧列表元素被用户选中 / 取消选中时触发
            pass(value) {
                this.addForm.pid = value
            },
            //回显
            huixian(rows) {
                var permission = [];
                for (var i = 0; i < rows.permission.length; i++) {
                    permission.push(rows.permission[i].id);
                }
                this.pid = permission
                return this.pid
            },
        },
        //显示数据
        mounted() {
            this.handleChange();
            this.getroles();
        }
    }
</script>

<style scoped>

</style>