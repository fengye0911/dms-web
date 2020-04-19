<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.keyword" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" icon="el-icon-search" plain round v-on:click="getusers">查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="warning" icon="el-icon-plus" plain round @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table class="table" stripe border :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
           <!-- <el-table-column type="selection" width="55">
            </el-table-column>-->
            <el-table-column type="index" width="40" label="#">
            </el-table-column>

            <el-table-column prop="username" label="用户名" width="90" sortable>
            </el-table-column>

            <el-table-column prop="password" label="密码" width="85"  sortable>
            </el-table-column>

            <el-table-column prop="hireDate" :formatter="dateFormat" label="入职日期" width="110" sortable>
            </el-table-column>

            <el-table-column prop="idCard" label="身份证" width="100" sortable>
            </el-table-column>

            <el-table-column prop="realName" label="真实姓名" width="110" sortable>
            </el-table-column>

            <el-table-column prop="birthDate" label="出生日期" :formatter="birthFormat" width="120" sortable>
            </el-table-column>

            <el-table-column prop="phoneNum" label="电话号码" width="120"  sortable>
            </el-table-column>

            <el-table-column prop="department.name" label="所属部门" width="110" sortable>
            </el-table-column>

            <el-table-column prop="education.name" label="学历" width="100" sortable>
            </el-table-column>

            <el-table-column prop="address" label="现居地址" width="110" sortable>
            </el-table-column>

            <el-table-column prop="gender" label="性别"  width="100" sortable>
                <template scope="scope">
                    <span style="color: deepskyblue" v-if="scope.row.gender==1">男</span>
                    <span style="color: pink" v-else>女</span>
                </template>
            </el-table-column>

            <el-table-column prop="comment" label="备注" width="90" sortable>
            </el-table-column>

            <el-table-column prop="state" label="状态" width="85" sortable>
                <template scope="scope">
                    <button style="color: green" v-if="scope.row.state==1">在职</button>
                    <button style="color: red" v-else>离职</button>
                </template>
            </el-table-column>

            <el-table-column label="操作" min-width="140">
                <template scope="scope">
                    <el-button type="primary" plain round icon="el-icon-edit"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" plain round  @click="handleDel(scope.$index, scope.row)">删除</el-button>
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

                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="editForm.realName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="入职日期" prop="hireDate">
                    <el-date-picker
                            v-model="editForm.hireDate"
                            type="date"
                            placeholder="选择入职日期">
                    </el-date-picker>

                </el-form-item>
                <el-form-item label="身份证" prop="idCard">
                    <el-input v-model="editForm.idCard" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthDate">
                    <!--<el-input v-model="addForm.birthDate" auto-complete="off"></el-input>-->
                    <el-date-picker
                            v-model="editForm.birthDate"
                            type="date"
                            placeholder="选择出生日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item prop="gender" label="性别">
                        <el-radio-group v-model="editForm.gender">
                            <el-radio  :label="1">男</el-radio>
                            <el-radio  :label="2">女</el-radio>
                        </el-radio-group>
                </el-form-item>
                <el-form-item label="电话号码" prop="phoneNum">
                    <el-input v-model="editForm.phoneNum" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="所属部门" prop="department">
                    <!--  <el-input v-model="addForm.department" auto-complete="off"></el-input>-->
                    <el-select v-model="editForm.dept_id">
                        <el-option

                                v-for="item in departments"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="学历" prop="education">
                    <!--  <el-input v-model="addForm.education" auto-complete="off"></el-input>-->
                    <el-select v-model="editForm.education_id" clearable placeholder="请选择学历">
                        <el-option
                                v-for="item in educations"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="住址" prop="address">
                    <el-input v-model="editForm.address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="comment">
                    <el-input v-model="editForm.comment" auto-complete="off"></el-input>
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
        <el-dialog title="新增"  width="25%" :visible.sync="addFormVisible" >
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">

                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="addForm.realName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="入职日期" prop="hireDate">
                   <!-- <el-input v-model="addForm.hireDate" auto-complete="off"></el-input>-->
                    <el-date-picker
                            v-model="addForm.hireDate"
                            type="date"
                            placeholder="选择入职日期">
                    </el-date-picker>

                </el-form-item>
                <el-form-item label="身份证" prop="idCard">
                    <el-input v-model="addForm.idCard" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthDate">
                    <!--<el-input v-model="addForm.birthDate" auto-complete="off"></el-input>-->
                    <el-date-picker
                            v-model="addForm.birthDate"
                            type="date"
                            placeholder="选择出生日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item  prop="gender" label="性别">
                    <el-radio-group v-model="addForm.gender">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="电话号码" prop="phoneNum">
                    <el-input v-model="addForm.phoneNum" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="所属部门" prop="department.name">
                    <el-select v-model="addForm.dept_id" clearable placeholder="请选择部门">
                        <el-option
                                v-for="item in departments"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="学历" prop="education.name">
                  <!--  <el-input v-model="addForm.education" auto-complete="off"></el-input>-->
                    <el-select v-model="addForm.education_id"  clearable placeholder="请选择学历">
                        <el-option
                                v-for="item in educations"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="住址" prop="address">
                    <el-input v-model="addForm.address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="comment">
                    <el-input v-model="addForm.comment" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                     <el-select v-model="addForm.state" >
                        <el-option
                                v-for="item in options"
                                :key="item.value"
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
                    keyword: '',
                    state: '',
                    education_id: ''
                },
                departments:[],
                educations:[],
                users: [],
                options:[{
                    value: 1,
                    label: '在职'
                },{
                    value: -1,
                    label: '离职'
                }],
                //分页
                total: 1,
                pageSize:10,
                pageNum:1,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                //表单验证
                editFormRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    phoneNum:[
                        {required: true,pattern:/^1[3-9]{1}[0-9]{9}$/,message:'请输入正确的联系方式',trigger: 'blur'}
                    ],
                    hireDate:[
                        {required: true, message: '请选择入职日期', trigger: 'blur'}
                    ],
                    birthDate:[
                        {required: true, message: '请选出生日期', trigger: 'blur'}
                    ],
                    address:[
                        {required: true, message: '请输入地址', trigger: 'blur'}
                    ],
                    idCard:[
                        {required: true, message: '请输入证件号码', trigger: 'blur'}
                    ],

                    department:[
                        {required: true, message: '请选择部门', trigger: 'blur'}
                    ],

                    education:[
                        {required: true, message: '请选择学历', trigger: 'blur'}
                    ]


                },
                //编辑界面数据
                editForm: {
                    username:null,
                    password:'',
                    realName: '',
                    idCard: '',
                    hireDate:'',
                    gender:'',
                    birthDate: '',
                    dept_id:'',
                    education_id:'',
                    comment: '',
                    address: '',
                    phoneNum: '',
                    state:''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {

                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    phoneNum:[
                        {required: true,pattern:/^1[3-9]{1}[0-9]{9}$/,message:'请输入正确的联系方式',trigger: 'blur'}
                    ],
                    hireDate:[
                        {required: true, message: '请选择入职日期', trigger: 'blur'}
                    ],
                    birthDate:[
                        {required: true, message: '请选出生日期', trigger: 'blur'}
                    ],
                    address:[
                        {required: true, message: '请输入地址', trigger: 'blur'}
                    ],
                    idCard:[
                        {required: true, message: '请输入证件号码', trigger: 'blur'}
                    ],
                    realName:[
                        {required: true, message: '请输入真实姓名', trigger: 'blur'}
                    ],
                    department:[
                        {required: true, message: '请选择部门', trigger: 'blur'}
                    ],

                    education:[
                        {required: true, message: '请选择学历', trigger: 'blur'}
                    ]

                },
                //新增界面数据
                addForm: {
                    username: '',
                    realName: '',
                    idCard: '',
                    hireDate:'',
                    gender:'',
                    birthDate: '',
                    dept_id:'',
                    education_id:'',
                    comment: '',
                    address: '',
                    phoneNum: '',
                    state:''
                }

            }
        },
        methods: {
            handleCurrentChange(val) {
                this.pageNum = val;
                this.getusers();
            },
            getDepartment(){
                this.$http.post("/department/list").then(res=>{
                    this.departments=res.data;
                })
            },
            getEducation(){
                this.$http.post("/educations").then(res=>{
                    this.educations=res.data;
                })
            },
            //入职时间格式化
            dateFormat(row,column){
                var t=new Date(row.hireDate);//row 表示一行数据, updateTime 表示要格式化的字段名称
                return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate();//+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()+"."+t.getMilliseconds()
            },
            //生日格式化
            birthFormat(row,column){
                var t=new Date(row.birthDate);//row 表示一行数据, updateTime 表示要格式化的字段名称
                return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate();//+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()+"."+t.getMilliseconds()
            },
           /* formatSex(row, column) {
                return row.gender == 1 ? '男' : row.gender == 2 ? '女' : '未知';
            },*/
            //获取用户列表
            getusers() {
                this.listLoading = true;
                let para = {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    keyword:this.filters.keyword,
                    state:this.filters.state,
                    education_id:this.filters.education_id
                };
                //转圈圈
                //加载数据
                this.$http.post("/user/page",para).then(res =>{
                    console.log(para.state)
                    this.listLoading = false;
                    let {total,rows} = res.data;
                    this.total = total;
                    this.users = rows;
                });
            },
            //删除
            handleDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    this.$http.delete("/user/"+row.id).then(res=>{
                        this.listLoading = false;
                        let {success,msg} = res.data;
                        if(success){
                            this.$message({
                                message: msg,
                                type: 'success'
                            });
                            this.getusers();
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
                this.editForm.education_id =row.education.name;
                this.editForm.dept_id =row.department.name;
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
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            console.log(para)
                            this.$http.post("/user",para).then(res=>{
                                this.listLoading = false;
                                let {success,msg} = res.data;
                                if(success){
                                    this.$message({
                                        message: msg,
                                        type: 'success'
                                    });
                                    this.editFormVisible = false;
                                    this.editLoading = false;
                                    this.getusers();
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
                            this.$http.post("/user",para).then(res=>{
                                this.listLoading = false;
                                let {success,msg} = res.data;
                                if(success){
                                    this.$message({
                                        message: msg,
                                        type: 'success'
                                    });
                                    this.addFormVisible = false;
                                    this.getusers();
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
                        this.getusers();
                    });
                }).catch(() => {

                });
            }
        },
        submit(){

        },
        mounted() {
            this.getusers();
            this.getDepartment();
            this.getEducation();
        }
    }
</script>

<style scoped>

</style>