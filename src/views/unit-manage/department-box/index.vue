<template>
    <div
        :class="`back-ucenter-unitManage-departmentBox ${visible ? 'back-ucenter-unitManage-departmentBox-show' : ''}`"
    >
        <div class="tab-filter">
            <ul class="tab-wrap">
                <li class="item active">{{ $t('unitManageDepartList') }}</li>
            </ul>
            <div class="unit-manage-operate">
                <el-input :placeholder="$t('filterDepartKeyword')" v-model="keyWords"> </el-input>
                <div style="float: right;">
                    <el-button type="primary" @click="filter('keyWords')">
                        {{ $t('Search') }}
                    </el-button>
                    <el-button @click="filter('reset')">
                        {{ $t('Reset') }}
                    </el-button>
                </div>
            </div>
        </div>
        <div class="back-unitmanage-departmentbox-list">
            <!-- 新增按钮 -->
            <el-button
                plain
                @click="operateDepart({}, 'add')"
                v-if="$util.btnShow('unitManageDepartAdd')"
                :disabled="orgInfo.orgId ? false : true"
                >{{ orgInfo.orgId ? $t('unitManageDepartAdd') : $t('unitManageDepartAddTips') }}</el-button
            >
            <el-table :data="data" :max-height="height - 230">
                <template v-for="item in head">
                    <el-table-column
                        v-if="item.prop === 'operation'"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width || 'auto'"
                    >
                        <template slot-scope="scope">
                            <!-- 编辑 -->
                            <el-button
                                v-if="$util.btnShow('unitManageDepartUpdate')"
                                size="mini"
                                type="text"
                                @click="operateDepart(scope.row, 'edit')"
                            >
                                {{ $t('Edit') }}
                            </el-button>
                            <el-divider direction="vertical" />
                            <!-- 删除 -->
                            <el-button
                                v-if="$util.btnShow('unitManageDepartDelete')"
                                size="mini"
                                type="text"
                                @click="deleteItem(scope.row)"
                            >
                                {{ $t('Delete') }}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-else
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width || 'auto'"
                    >
                        <template slot-scope="scope">
                            <span class="text-overflow" :title="scope.row[item.prop]">
                                {{ scope.row[item.prop] || $t('null') }}
                            </span>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </div>
        <!-- 操作部门 新增、修改 -->
        <operate-department
            :visible="operateVisible"
            :type="operateType"
            :data="operateData"
            :orgInfo="orgInfo"
            @refresh="getDepartData(orgInfo.orgId)"
            @close="operateVisible = false"
        />
        <!-- 删除确认 -->
        <!-- <delete-modal
            :visible="deleteDepartVisible"
            :content="$t('unitManageDeleteDepart')"
            :title="$t('mapBattleWarning')"
            :loading="deleteLoading"
            @close="deleteDepartVisible = false"
            @sure="deleteDepart"
        /> -->
        <!-- 确认删除 -->
        <delete-modal ref="deleteModal" @clickDel="deleteDepart" @refresh="() => {}"></delete-modal>
    </div>
</template>
<script>
import operateDepartment from './operate-department';
// import deleteModal from '../delete-modal.vue';
import deleteModal from '@/components/delete-modal.vue';

export default {
    props: {
        visible: {
            type: Boolean
        },
        orgInfo: {
            type: Object,
            default: () => ({})
        },
        height: {
            type: Number,
            default: 0
        }
    },
    components: {
        operateDepartment,
        deleteModal
    },
    watch: {
        'orgInfo.orgId'(id) {
            this.getDepartData(id);
        }
    },
    data() {
        return {
            // 删除部门
            deleteDepartVisible: false,
            // 操作部门modal
            operateVisible: false,
            // 操作部门的类型 view/add/edit
            operateType: 'add',
            // 操作部门的数据
            operateData: {},
            // 筛选关键字
            keyWords: '',
            // 表头
            head: [
                {
                    label: this.$t('unitManageDepartIdx'),
                    prop: 'idx',
                    width: 80
                },
                {
                    label: this.$t('DepartmentNumber'),
                    prop: 'departCode'
                    // width: 100
                },
                {
                    label: this.$t('DepartmentName'),
                    prop: 'departCname'
                    // width: 100
                },
                {
                    label: this.$t('Remarks'),
                    prop: 'remark'
                    // width: 120
                },
                {
                    label: this.$t('operation'),
                    prop: 'operation'
                }
            ],
            // 数据
            data: [],
            // 获取数据的loading
            loading: false,
            // 删除loading
            deleteLoading: false
        };
    },
    methods: {
        filter(type = 'reset') {
            if (type === 'reset') {
                this.keyWords = '';
            }
            this.getDepartData(this.orgInfo.orgId);
        },
        operateDepart(data, type) {
            this.operateData = data;
            this.operateType = type;
            this.operateVisible = true;
        },
        deleteItem(data) {
            // this.deleteDepartVisible = true;
            this.$refs.deleteModal.show();
            this.operateData = data;
        },
        // 删除请求
        deleteDepart() {
            this.deleteLoading = true;
            this.$util.post(this, {
                url: this.baseUrl + 'manage/depart/delete',
                params: {
                    departIds: [this.operateData.departId]
                },
                success: res => {
                    if (res.code !== '00000000') return;
                    this.$message.success(res.message);
                    this.deleteDepartVisible = false;
                    this.getDepartData(this.orgInfo.orgId);
                },
                complete: () => {
                    this.deleteLoading = false;
                }
            });
        },
        // 获取部门列表数据
        getDepartData(id) {
            this.operateVisible = false;
            if (!id) return;
            this.loading = true;
            this.data = [];
            const params = {
                orgIds: [id]
            };
            if (this.keyWords) {
                params.departCname = this.keyWords;
            }
            this.$util.post(this, {
                url: this.baseUrl + 'manage/depart/list',
                params,
                success: res => {
                    this.data = (res.data || []).map((item, idx) => ({
                        ...item,
                        idx: idx + 1
                    }));
                },
                complete: () => {
                    this.loading = false;
                }
            });
        }
    }
};
</script>
<style lang="less">
.back-ucenter-unitManage-departmentBox {
    width: 0px;
    overflow: hidden;
    transition: all 0.2s ease-out;
    display: flex;
    flex-direction: column;
    .back-unitmanage-departmentbox-list {
        padding: 16px;
        margin-top: 24px;
        flex: 1;
        background: #142650;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        .is-plain {
            margin-bottom: 16/192rem;
        }
        // .el-table__row > td:last-child .el-button:not(:last-child) span:after {
        //     content: '';
        //     margin: 0 4px 0 6px;
        //     border-right: 1px solid @b-commonfilterTable-table-btn-line;
        // }
    }
}
.back-ucenter-unitManage-departmentBox-show {
    flex: 1;
    width: auto;
}
</style>
