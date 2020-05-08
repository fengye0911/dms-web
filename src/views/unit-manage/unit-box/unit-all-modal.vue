<template>
    <el-dialog
        fullscreen
        v-if="visible"
        destroy-on-close
        :visible="visible"
        :title="$t('Details')"
        @close="$emit('close')"
        style="width: 100%!important;"
        class="back-ucenter-unitManage-unitBox-unitAllModal"
    >
        <div class="container">
            <div class="filter">
                <div class="select-input">
                    <el-input v-model="filterData.value" :placeholder="$t('placeholderText')">
                        <el-select v-model="filterData.type" :placeholder="$t('PlaceHolderSelect')" slot="prepend">
                            <el-option
                                :key="item.value"
                                v-for="item in filterList"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-input>
                </div>

                <el-button type="primary" @click="filter('keyWords')">{{ $t('Search') }}</el-button>
                <el-button @click="filter('reset')">{{ $t('Reset') }}</el-button>
            </div>
            <div class="content">
                <el-table
                    :data="tree"
                    style="width: 100%;"
                    row-key="orgId"
                    :height="tableHeight"
                    class="unit-all-tree-table"
                    default-expand-all
                    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                >
                    <template v-for="item in tableColumns">
                        <el-table-column
                            :key="item.prop"
                            :prop="item.prop"
                            :label="item.label"
                            :width="item.width || 'auto'"
                        >
                            <template slot-scope="scope">
                                <span
                                    v-if="item.width"
                                    :title="
                                        item.prop.indexOf('Time') > -1
                                            ? translateTime(scope.row[item.prop])
                                            : scope.row[item.prop] || $t('null')
                                    "
                                    class="text-overflow"
                                    :style="item.width ? `width: ${item.width}px` : ''"
                                    >{{
                                        item.prop.indexOf('Time') > -1
                                            ? translateTime(scope.row[item.prop])
                                            : scope.row[item.prop] || $t('null')
                                    }}</span
                                >
                                <span v-else>{{ scope.row[item.prop] || $t('null') }}</span>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </div>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props: {
        visible: {
            type: Boolean
        },
        data: {
            type: Array,
            default: () => []
        },
        createTree: {
            type: Function,
            default: data => data
        }
    },
    watch: {
        visible(val) {
            if (val) this.filter('keyWords');
        }
    },
    data() {
        return {
            tableHeight: document.body.clientHeight - 200,
            filterData: {
                type: 'orgCname',
                value: ''
            },
            filterList: [
                {
                    label: this.$t('UnitName'),
                    value: 'orgCname'
                },
                {
                    label: this.$t('address'),
                    value: 'address'
                },
                {
                    label: this.$t('Number'),
                    value: 'orgCode'
                }
            ],
            tableColumns: [
                {
                    label: this.$t('UnitName'),
                    prop: 'orgCname',
                    width: 300
                },
                {
                    label: this.$t('UnitNumber'),
                    prop: 'orgCode'
                },
                {
                    label: this.$t('address'),
                    prop: 'address'
                },
                {
                    label: this.$t('Remarks'),
                    prop: 'remark'
                },
                {
                    label: this.$t('CreateAccount'),
                    prop: 'createdUserid'
                },
                {
                    label: this.$t('createdTime'),
                    prop: 'createdTime',
                    width: 150
                },
                {
                    label: this.$t('LastAccount'),
                    prop: 'updatedUserid'
                },
                {
                    label: this.$t('LastTime'),
                    prop: 'updatedTime',
                    width: 150
                }
            ],
            tree: []
        };
    },
    methods: {
        translateTime(str) {
            if (!str) return this.$t('null');
            this.$util.dateFormat(str);
            return this.$util.dateFormat(str);
        },
        substr(str) {
            return str.substr(0, 16);
        },
        filter(type = 'reset') {
            if (type !== 'keyWords') {
                this.filterData.type = 'orgCname';
                this.filterData.value = '';
            }
            const tree = this.createTree(
                this.data.filter(
                    item => !this.filterData.value || item[this.filterData.type].indexOf(this.filterData.value) > -1
                )
            );
            this.$set(this.$data, 'tree', tree);
        }
    }
};
</script>
<style lang="less">
.back-ucenter-unitManage-unitBox-unitAllModal {
    height: 95%;
    top: 5%;
    .el-dialog {
        width: 100% !important;
    }
    .is-fullscreen {
        display: flex;
        height: 100%;
        flex-direction: column;
        .el-dialog__body {
            flex: 1;
            padding-top: 0;
            display: flex;
            max-height: 100%;
            .container {
                width: 100%;
                flex: 1;
                padding-bottom: 30px;
                display: flex;
                flex-direction: column;
                .filter {
                    padding: 16/192rem 0;
                    width: 100%;
                    text-align: right;
                    > div:first-child {
                        margin-right: 20px;
                    }
                }
            }
            .bottom {
                flex-shrink: 0;
                text-align: right;
            }
        }
    }
}
</style>
