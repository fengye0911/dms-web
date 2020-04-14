<template>
    <seaction>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true"  >
                <el-form-item>
                    <label style="font-style:oblique">【搜索】请选择到期时间段：</label>
                    <el-select v-model="expiredTime" clearable="true" placeholder="根据到期时间段查询">
                        <el-option
                                v-for="item in ranges"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                    <el-button type="primary" plain round v-on:click="search">查询</el-button>
                </el-form-item>

            </el-form>
        </el-col>
        <!--列表-->
        <el-table id="docinfo" :data="docs" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column type="index" width="60" label="#">
            </el-table-column>
            <el-table-column prop="docSn" label="档案编号" width="150" sortable>
            </el-table-column>
            <el-table-column prop="docTitle" label="档案名称" width="250"  sortable>
            </el-table-column>
            <el-table-column prop="doctype.name" label="档案分类" width="150" sortable>
            </el-table-column>
            <el-table-column prop="docaddress.address" label="存档点" width="150" sortable>
            </el-table-column>
            <el-table-column prop="createDate" label="档案日期" :formatter="createDateFormat" width="170"  sortable>
            </el-table-column>
            <el-table-column prop="outDate" label="过期日期" :formatter="outDateFormat"  width="170" sortable>
            </el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total" style="float:right;">
            </el-pagination>
        </el-col>


    </seaction>
</template>

<script>
    export default {
        data(){
            return{
                ranges:[
                    {label:'最近一天',value:86400},
                    {label:'最近三天',value:86400*3*1000},
                    {label:'最近一周',value:86400*7*1000},
                    {label:'最近两周',value:86400*14*1000},
                    {label:'最近一个月',value:86400*30*1000}
                ],
                expiredTime:'',
                docs:[],
                pageNum:1,
                pageSize:10,
                total:0
            }
        },
        methods:{
            //时间格式化
            createDateFormat(row,column){
                var t=new Date(row.createDate);//row 表示一行数据, updateTime 表示要格式化的字段名称
                return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate();//+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()+"."+t.getMilliseconds()
            },
            outDateFormat(row,column){
                var t=new Date(row.outDate);//row 表示一行数据, updateTime 表示要格式化的字段名称
                return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate();//+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()+"."+t.getMilliseconds()
            },

            getDocs(row){
                for(let i=0;i<row.docs.length;i++){
                    this.docs.push(row.docs[i])
                }
            },

            handleCurrentChange(val){
                this.pageNum = val;
                this.getdocs();
            },
            // 处理根据时间查询
            search(){
                this.getdocs();
            },

            getdocs(){
                let para ={
                    pageNum: this.pageNum,
                    pageSize:this.pageSize,
                    expiredTime:this.expiredTime
                }
                this.$http.post("/docinfo/expired",para)
                    .then(res=>{
                        let {total,rows} = res.data;
                        this.total = total;
                        this.docs= rows;
                    });
                setTimeout(()=>{
                        for(let i=0;i<this.total.length;i++){
                            if(this.total[i].outDate - new Date().getTime() <= 259200000){
                                this.docs.push(this.total[i]);
                            }
                        }
                        if(this.docs.length > 0){
                            this.$notify({
                                title: '温馨提示',
                                type:'warning',
                                message: "尊敬的用户，您有  "+this.docs.length+"  份档案即将到期",
                                position: 'bottom-right'
                            });
                        }
                    }
                    ,1500);

            }

        },
        mounted(){

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