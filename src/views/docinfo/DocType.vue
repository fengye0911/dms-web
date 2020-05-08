<template>
    <div>
        <div class="container">
            <el-table
                    @row-click="handleRowclick"
                    :data="tableData"
                    style="width: 100%">
                <el-table-column label="name" width="200">
                    <template slot-scope="{row,$index}">
                        <span :style="{marginLeft: (row.id.split('.').length-1) * 23 + 'px'}">&ensp;</span>
                        <i v-if="row.state=='closed'"
                           :data-level="row.showChildren" :class="{'el-icon-arrow-right': !row.showChildren,
                         'el-icon-arrow-down': row.showChildren}"
                           @click="onExpand(row,$index)"></i>
                        <i v-else :class="{'el-icon-tickets':true}" ></i>
                        <span :data-level="row.id" :style="{marginLeft: 4 + 'px'}">{{row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="Title"
                        label="Title">
                </el-table-column>
                <el-table-column
                        prop="StatusIcon"
                        label="StatusIcon"
                        width="100">
                </el-table-column>
                <el-table-column
                        label="link"
                        width="100">
                    <template slot-scope="{row,$index}">
                        <span v-html="row.link" :data-level="$index"></span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="count"
                        label="count"
                        width="100">
                </el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>

    import axios from 'axios';
    export default {
        name: 'treegrid',
        data: function() {
            return {
                tableData: [
                    {"id":"1","name":"Contact","Title":"","StatusIcon":"","link":"","count":"2","unid":"","state": "closed"},
                    {"id":"2","name":"Customer","Title":"","StatusIcon":"","link":"","count":"8","unid":"","state": "closed"},
                    {"id":"3","name":"Employee","Title":"","StatusIcon":"","link":"","count":"3","unid":"","state": "closed"},
                    {"id":"4","name":"Event","Title":"","StatusIcon":"","link":"","count":"4","unid":"","state": "closed"},
                    {"id":"5","name":"Partner","Title":"","StatusIcon":"","link":"","count":"17","unid":"","state": "closed"}
                ]
            }
        },

        created:function(){
            axios.get('/treegr?key='+Math.random())
                .then((response)=>{
                    console.log(response.data);
                    this.tableData=response.data;
                })
                .catch((error)=>{
                    console.log(error);
                });
        },

        methods:{
            handleRowclick(val) {
                if(val.state=="open"){
                    this.$notify({ title: '信息提示',
                        dangerouslyUseHTMLString: true,
                        message: '<span>单击文档ID:<br/>'+val.unid+'</span>',
                        type: 'success'
                    });
                }

            },

            onExpand(row,index){
                //从关闭到展开
                //这里的id为子父同一个字段，字与父ID同多一个. 如1的子id为 1.1 1.2 1.3, 而1.1的子id为1.1.1 1.1.2  .....类推。
                if(row.state=='closed' && !row.showChildren){
                    axios.get('/treegr?id='+row.id+'&key='+Math.random())
                        .then((response)=>{
                            row.showChildren=true;
                            for(var i=0;i<response.data.length;i++){
                                this.tableData.splice(index+1,0,response.data[i]);//插入一条记录
                            }
                        })
                        .catch((error)=>{
                            console.log(error);
                        });
                }

                //从展开到关闭
                if(row.state=='closed' && row.showChildren){
                    row.showChildren=false;
                    for(var i=0;i<this.tableData.length;i++){
                        if(this.tableData[i].id.indexOf(row.id+'.')==0){
                            this.tableData.splice(i,1);//删除一条记录
                            i--;
                        }
                    }
                }
            },

            handleSelectionVules(val){
                //获取所有选择的值
                this.multipleSelection = val;
            },

            load_tale:function(){
                var _self=this;
                this.$options.methods.LoadView(_self);//动态加载每页
            },

            getUrlKey: function (name) {
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
            }


        }

    }

</script>

<style scoped>

</style>

