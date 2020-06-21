<template>
    <section>
        <el-form :model="addForm"   label-width="100px" :rules="addFormRules" ref="addForm">
            <el-row>
                <el-col :span="8"  :offset="1" >
                    <el-form-item label="档案类型" prop="docType_id" size="small"   >
                        <el-select v-model="addForm.docType_id"  clearable placeholder="请选择档案类型" class="formWidth"  >
                            <el-option
                                    v-for="item in doctypes"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                    <el-form-item label="档案编号" size="small">
                        <el-input v-model="addForm.docSn" @focus="chickvalue" placeholder="请点击生成档案编号"  auto-complete="off" :readonly="true"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item label="档案标题"  prop="docTitle"  size="small">
                        <el-input v-model="addForm.docTitle" autocomplete="off" placeholder="请输入档案标题" clearable></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                    <el-form-item label="存档点" prop="docAddress_id"  size="small">
                        <el-select v-model="addForm.docAddress_id"  clearable placeholder="请选择档案存档点" filterable class="formWidth" >
                            <el-option
                                    v-for="item in docAddresses"
                                    :key="item.id"
                                    :label="item.address"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item label="建档用户"  size="small">
                        <el-input v-model="username" value="createuser" :readonly="true" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                    <el-form-item label="建档日期" prop="createDate" size="small" >
                        <el-date-picker
                                v-model="addForm.createDate"
                                type="datetime"
                                placeholder="选择日期时间" class="formWidth">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item label="修改用户"  size="small">
                        <el-input v-model="addForm.editUser_id" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                    <el-form-item label="修改日期"  size="small">
                        <el-date-picker
                                v-model="addForm.editDate"
                                type="datetime"
                                 class="formWidth">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item label="借阅状态"  size="small" >
                        <el-radio v-model="addForm.borrowStatus_id" label="7" value="7">可借阅</el-radio>
                        <el-radio v-model="addForm.borrowStatus_id" label="8" value="8">不可借阅</el-radio>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                    <el-form-item label="过期时间" prop="outDate"  size="small">
                        <el-date-picker
                                v-model="addForm.outDate"
                                align="right"
                                type="date"
                                placeholder="请选择档案过期日期" class="formWidth">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item label="过期提醒"  size="small">
                        <el-radio v-model="addForm.notice" label="1" value="1">是</el-radio>
                        <el-radio v-model="addForm.notice" label="0" value="0">否</el-radio>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                    <el-form-item label="提前天数" size="small">
                        <!--<el-input v-model="addForm.noticeDay" auto-complete="off"></el-input>-->
                            <el-select v-model="addForm.noticeDay"  clearable placeholder="请选择过期提前通知天数"  class="formWidth">
                                <el-option
                                        v-for="item in noticedays"
                                        :key="item.noticeDay"
                                        :label="item.label"
                                        :value="item.noticeDay">
                                </el-option>
                            </el-select>

                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>


                <el-col :span="8" :offset="1">
                    <el-form-item label="是否常用"  size="small">
                        <el-radio v-model="addForm.isUsed" value="1" label="1">常用</el-radio>
                        <el-radio v-model="addForm.isUsed" value="0" label="0">不常用</el-radio>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                    <el-form-item label="文件编号" prop="docnum"  size="small">
                        <el-input v-model="addForm.docnum" auto-complete="off"  placeholder="请输入文件编号"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item label="来文部门" prop="sendDept_id"  size="small">
                        <!--<el-input v-model="addForm.sendDept_id" auto-complete="off"></el-input>-->
                        <el-select v-model="addForm.sendDept_id"  clearable placeholder="请选择来文部门" filterable class="formWidth">
                            <el-option
                                    v-for="item in sendDepts"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                    <el-form-item label="发文单位" prop="sendUnit_id"  size="small">
                        <!--<el-input v-model="addForm.sendUnit_id" auto-complete="off"></el-input>-->
                        <el-select v-model="addForm.sendUnit_id"  clearable placeholder="请选择发文单位" filterable class="formWidth" >
                            <el-option
                                    v-for="item in sendUnits"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item label="发文人" prop="sendUser"  size="small">
                        <el-input v-model="addForm.sendUser" auto-complete="off" placeholder="请输入发文人"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                <el-form-item label="批准时间"  size="small">
                    <el-date-picker
                            v-model="addForm.piDate"
                            type="datetime"
                            placeholder="请选择批准时间" class="formWidth">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item label="鉴定时间"  size="small">
                        <!--<el-input v-model="addForm.state" auto-complete="off"></el-input>-->
                        <el-date-picker
                                v-model="addForm.jianDate"
                                type="datetime"
                                placeholder="请选择鉴定时间" class="formWidth">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                    <el-form-item label="产品批号"  size="small">
                        <el-input v-model="addForm.productSn" auto-complete="off" placeholder="请输入产品批号"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item label="原料批号"  size="small">
                        <el-input v-model="addForm.mateSn" auto-complete="off" placeholder="请输入原料批号"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                    <el-form-item label="数量"  size="small">
                        <el-input v-model="addForm.proNum" auto-complete="off"  placeholder="请输入文件数量"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item label="页数" size="small">
                        <el-input v-model="addForm.pageCount" auto-complete="off" placeholder="请输入文件总页数"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                    <el-form-item label="专利号"  size="small">
                        <el-input v-model="addForm.patentNum" auto-complete="off" placeholder="请输入产品专利号"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item label="年检负责人" label-width="100px" size="small">
                        <el-input v-model="addForm.inspectUser_id" auto-complete="off" placeholder="请选择年检负责人"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                    <el-form-item label="状态" prop="status"  size="small">
                        <!--<el-input v-model="addForm.state" auto-complete="off"></el-input>-->
                        <el-select v-model="addForm.status" clearable placeholder="请选择档案状态" class="formWidth">
                            <el-option
                                    v-for="item in statues"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8" :offset="1">
                    <el-form-item label="档案内容"  size="small">
                        <!--<el-input v-model="addForm.docContent" auto-complete="off"></el-input>-->
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入档案内容"
                                v-model="addForm.docContent">
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8" :offset="3">
                    <el-form-item label="档案简介"  size="small">
                        <el-input v-model="addForm.contentIntro" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: right;margin-right: 50px">
            <el-button @click.native="addFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>


    </section>
</template>

<script>
    import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

    export default {
        data() {
            return {
                doctypes:"",
                docAddresses:"",
                sendDepts:"",
                sendUnits:"",
                username:"",
                disabled: false,
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
                sn:"",
                createuser:"",
                users: [],
                noticedays:[
                    {
                        noticeDay:1,
                        label:"一天"
                    },
                    {
                        noticeDay:3,
                        label:"三天"
                    },
                    {
                        noticeDay:5,
                        label:"五天"
                    },
                    {
                        noticeDay:7,
                        label:"一周"
                    }
                ],
                sels: [],//列表选中列
                addFormVisible: true,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    docType_id: [
                        { required: true, message: '请选择档案类型！', trigger: 'blur' }
                    ],
                    docAddress_id:[
                        { required: true, message: '请选择档案存档点！', trigger: 'blur' }
                    ],
                    docnum:[
                        { required: true, message: '请正确输入档案编号！', trigger: 'blur' }
                    ],
                    sendDept_id:[
                        { required: true, message: '请选择来文部门！', trigger: 'blur' }
                    ],
                    sendUnit_id:[
                        { required: true, message: '请选择发文单位！', trigger: 'blur' }
                    ],
                    sendUser:[
                        { required: true, message: '请正确输入发文人！', trigger: 'blur' }
                    ],
                    outDate:[
                        { required: true, message: '请选择过期时间！', trigger: 'blur' }
                    ],
                    status:[
                        { required: true, message: '请选择档案状态！', trigger: 'blur' }
                    ]


                },

                //新增界面数据
                addForm: {
                    docSn: '',
                    docType_id: [],
                    docAddress_id:[],
                    docTitle: '',
                    createUser_id: '',
                    createDate: '',
                    editUser_id: '',
                    editDate: '',
                    borrowStatus_id: "7",
                    outDate: '',
                    notice: "1",
                    noticeDay: [],
                    docContent: '',
                    contentIntro: '',
                    isUsed: "1",
                    docnum: '',
                    sendDept_id: [],
                    sendUnit_id: [],
                    sendUser: '',
                    piDate: '',
                    jianDate: '',
                    productSn: '',
                    mateSn: '',
                    proNum: '',
                    pageCount: '',
                    patentNum: '',
                    inspectUser_id: '',
                    status: ''
                }
            }
        },
        methods: {
            querySearch(queryString, cb) {
                var sendDeptList = this.sendDeptList;
                var results = queryString
                    ? sendDeptList.filter(this.createFilter(queryString))
                    : sendDeptList
                cb(results)
            },
            createFilter(queryString) {
                return sendDeptList => {
                    return (
                        sendDeptList.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
                    )
                }
            },
            getdoctypes(){
                this.$http.get("/doctype/list").then(res=>{
                    this.doctypes = res.data;

                })
            },
            getdocAddresses(){
                this.$http.post("/docaddress/list",{}).then(res=>{
                    console.debug(res.data)
                    this.docAddresses = res.data;
                })
            },
            mathRand(){
                let num="";
                for(var i=0;i<6;i++) {
                    num+=Math.floor(Math.random()*10);
                }
                return num;
            },
            chickvalue(){
                for(let i=0;i<this.doctypes.length;i++){
                    if(this.addForm.docType_id == this.doctypes[i].id){
                        this.sn = this.doctypes[i].sn;
                    }
                }
                    let mathRand2 = this.mathRand();
                    this.sn += ("_"+mathRand2);
                    this.addForm.docSn = this.sn;
            },
            isLogin(){
                if(sessionStorage.getItem('user')){
                    let user = JSON.parse(sessionStorage.getItem('user'));
                    this.addForm.createUser_id = user.id;
                    this.username = user.username;
                }
            },
            newDate(){
                this.addForm.createDate = new Date();
            },
            getsendDepts(){
                this.$http.get("/dicdetail/dept").then(res=>{
                    console.debug(res.data)
                    this.sendDepts = res.data;
                })
            },
            getsendUnits(){
                this.$http.get("/dicdetail/unit").then(res=>{
                    this.sendUnits = res.data;
                })
            },
            selectDate(){
                if(this.addForm.notice = '0')
                this.disabled = !this.disabled;
            },

            //新增提交
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let para = Object.assign({}, this.addForm);
                            //para.createUser_id = this.createUser_id;
                            console.log(para);
                            this.$http.post("/docinfo",para).then(res=>{
                                console.log(para);
                                let {success,msg} = res.data;
                                if(success){
                                    this.$message({
                                        message: msg,
                                        type: 'success'
                                    });
                                    //跳转页面到档案查询
                                    this.$router.push({path:'/docinfoQuery'});
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
            }

        },
        mounted() {
            this.getdoctypes();
            this.getdocAddresses();
            this.isLogin();
            this.newDate();
            this.getsendDepts();
            this.getsendUnits();

        }
    }
</script>

<style scoped>
    .formWidth{
        width: 336px;
    }



</style>