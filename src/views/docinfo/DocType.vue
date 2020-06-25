<template>
    <el-table :data="menus"

              max-height="600"
              ref="table">
<!--        <el-table-column prop="id" label="id" type="selection" fixed></el-table-column>-->
        <el-table-tree-column fixed :expandKey="'System'" :remote="remote" file-icon="icon icon-file"
                              folder-icon="icon icon-folder" prop="label" label="title" width="320" class-name="123"
                              header-align="center">
        </el-table-tree-column>
        <el-table-column prop="description" label="Description" :show-overflow-tooltip="true" width="180">
        </el-table-column>
        <el-table-column label="option" v-if="treeType === 'normal'" width="250">
            <template scope="scope">
                <button type="button" class="el-button el-button--default el-button--small">
                    <router-link
                            :to="{ path: requestUrl + 'edit', query: {id: scope.row.Oid} }"
                            tag="span">
                        编辑
                    </router-link>
                </button>
                <el-button
                        size="small"
                        type="danger"
                        @click="handleDelete()">
                    删除
                </el-button>
                <button type="button" class="el-button el-button--success el-button--small">
                    <router-link :to="{ path: requestUrl, query: {parentId: scope.row.parentOId} }"
                                 tag="span">
                        新增
                    </router-link>
                </button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
    import './data.js'
    export default {
        name: "DocType",
        props:{
            treeType: {
                type: String,
                default: function () {
                    return 'normal'
                }
            }
        },
        data(){
            return{
                menus: flatTree.filter(f => f['parent_id'] == null)
            }
        },
        methods: {
            handleDelete () {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            remote(row, callback) {
                callback(flatTree.filter(f => f['parent_id'] == row['id']))
            },
            formatter(row, column) {
                return ' ---  ' + row.label;
            },
            cl() {
                this.$refs.table.$emit("clearTreeCloumn")
            }
        }

    }
</script>

<style scoped>
    body p {
        background-color: #f5f5f5;
        border-left: 4px solid #ccc;
        line-height: 40px;
        padding-left: 10px;
    }
    .icon-file {
        padding-right: 7px;
        padding-left: 18px
    }

    .icon-folder,
    .icon-folder-open {
        padding-left: 7px;
        padding-right: 7px
    }

    @font-face {font-family: "icon";
        src: url('//at.alicdn.com/t/font_a9e0jr8sy2hme7b9.eot?t=1489551916034'); /* IE9*/
        src: url('//at.alicdn.com/t/font_a9e0jr8sy2hme7b9.eot?t=1489551916034#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('//at.alicdn.com/t/font_a9e0jr8sy2hme7b9.woff?t=1489551916034') format('woff'), /* chrome, firefox */
        url('//at.alicdn.com/t/font_a9e0jr8sy2hme7b9.ttf?t=1489551916034') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
        url('//at.alicdn.com/t/font_a9e0jr8sy2hme7b9.svg?t=1489551916034#icon') format('svg'); /* iOS 4.1- */
    }

    .icon {
        font-family:"icon" !important;
        font-size:16px;
        font-style:normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .icon-folder:before { content: "\e616"; }

    .icon-folder-open:before { content: "\e8af"; }

    .icon-file:before { content: "\e77d"; }
    .hljs{display:block;overflow-x:auto;padding:0.5em;background:#F0F0F0}
    .hljs,.hljs-subst{color:#444}
    .hljs-comment{color:#888888}
    .hljs-keyword,.hljs-attribute,.hljs-selector-tag,.hljs-meta-keyword,.hljs-doctag,.hljs-name{font-weight:bold}.hljs-type,.hljs-string,.hljs-number,.hljs-selector-id,.hljs-selector-class,.hljs-quote,.hljs-template-tag,.hljs-deletion{color:#880000}.hljs-title,.hljs-section{color:#880000;font-weight:bold}.hljs-regexp,.hljs-symbol,.hljs-variable,.hljs-template-variable,.hljs-link,.hljs-selector-attr,.hljs-selector-pseudo{color:#BC6060}.hljs-literal{color:#78A960}.hljs-built_in,.hljs-bullet,.hljs-code,.hljs-addition{color:#397300}.hljs-meta{color:#1f7199}.hljs-meta-string{color:#4d99bf}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:bold}
</style>
