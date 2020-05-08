<template>
    <div class="back-ucenter-unitManage-unitBox">
        <div class="tab-filter">
            <ul class="tab-wrap">
                <div>
                    <li class="item active">
                        {{ $t('UnitList') }}
                    </li>
                </div>
                <el-button @click="toggleUnitModal" type="text" class="details"> {{ $t('Details') }}</el-button>
            </ul>
            <div class="unit-manage-operate">
                <el-input :placeholder="$t('filterUnitKeyword')" v-model="keyWords"> </el-input>
                <div class="fr">
                    <el-button type="primary" @click="filter('keyWords')" style="margin-left: 20px;">
                        {{ $t('Search') }}
                    </el-button>
                    <el-button @click="filter('reset')">
                        {{ $t('Reset') }}
                    </el-button>
                </div>
            </div>
        </div>
        <div class="back-unitmanage-unitbox-tree">
            <el-tree
                    :data="data"
                    node-key="id"
                    highlight-current
                    default-expand-all
                    @node-click="checkOrg"
                    :expand-on-click-node="false"
                    :render-content="renderContent"
            >
            </el-tree>
        </div>
        <!-- 单位详情 -->
        <unit-all-modal :visible="unitVisible" @close="unitVisible = false" :createTree="createTree" :data="oldData" />
        <!-- 操作单位、编辑、新增、查看 -->
        <operate-unit
                :visible="operateVisible"
                :type="operateType"
                :data="operateData"
                @refresh="loadingOrgTree"
                @close="operateVisible = false"
        />
        <!-- 确认删除 -->
        <delete-modal ref="deleteModal" @clickDel="deleteUnit" @refresh="() => {}"></delete-modal>
    </div>
</template>
<script>
    import unitAllModal from './unit-all-modal.vue';
    import operateUnit from './operate-unit';
    import deleteModal from '@/components/delete-modal.vue';

    export default {
        components: {
            unitAllModal,
            operateUnit,
            deleteModal
        },
        data() {
            return {
                // 拼装好的树
                data: [],
                // 请求回来的数据
                oldData: [],
                // 加载单位树
                loading: false,
                // 单位详情
                unitVisible: false,
                // 操作单位modal
                operateVisible: false,
                // 操作单位的类型 view/add/edit
                operateType: 'add',
                // 操作单位的数据
                operateData: {},
                // 删除的loading
                deleteLoading: false,
                keyWords: '',
                deleteUnitVisible: false
            };
        },
        mounted() {
            this.loadingOrgTree();
        },
        methods: {
            // 列表操作button渲染
            renderContent(h, { node, data, store }) {
                return (
                    <span class="operate-button-wrap">
                    <span>{node.label}</span>
                    <span>
                    {!this.$util.btnShow('unitManageAdd') || node.level > 5
                    ? null
                    : [
                    <el-button
                size="mini"
                type="text"
                onClick={() => this.operateUnit({ orgId: data.orgId, _root: data._root }, 'add')}>
                {this.$t('NewSubordinate')}
            </el-button>,
                <el-divider direction="vertical" />
            ]}
            <el-button size="mini" type="text" onClick={() => this.operateUnit(data, 'view')}>
                {this.$t('View')}
            </el-button>
                {data._root || !this.$util.btnShow('unitManageUpdate')
                    ? null
                    : [
                    <el-divider direction="vertical" />,
                <el-button size="mini" type="text" onClick={() => this.operateUnit(data, 'edit')}>
                    {this.$t('Edit')}
                </el-button>
                ]}
                {data._root || !this.$util.btnShow('unitManageDelete')
                    ? null
                    : [
                    <el-divider direction="vertical" />,
                <el-button
                    size="mini"
                    type="text"
                    onClick={() => {
                    // this.deleteUnitVisible = true;
                    this.operateData = data;
                    this.$refs.deleteModal.show();
                }}>
                    {this.$t('Delete')}
                </el-button>
                ]}
            </span>
                </span>
            );
            },
            // 加载单位树
            loadingOrgTree() {
                if (this.operateVisible) this.operateVisible = false;
                this.$util.post(this, {
                    url: this.baseUrl + 'manage/org/list',
                    params: {
                        dataType: 0
                    },
                    success: res => {
                        if (res && res.data) {
                            this.$set(this.$data, 'oldData', JSON.parse(JSON.stringify(res.data)));
                            const tree = this.createTree(res.data);
                            this.$set(this.$data, 'data', tree);
                        }
                    }
                });
            },
            // 创建树
            createTree(datas) {
                const data = JSON.parse(JSON.stringify(datas));
                const tree = [];
                const parentMap = {};
                const rootMap = {};
                data.forEach(item => {
                    parentMap[item.orgId] = true;
                    if (!item.parentId) rootMap[item.orgId] = true;
                });
                data.forEach(item => {
                    item.label = item.orgCname;
                    if (!item.parentId) {
                        item._root = true;
                        tree.push(item);
                    } else if (!parentMap[item.parentId]) {
                        tree.push(item);
                    }
                    data.forEach(each => {
                        each.label = each.orgCname;
                        if (each.parentId in rootMap) each.level2 = true;
                        if (each.orgId === item.orgId) return;
                        if (each.parentId === item.orgId) {
                            if (!item.children) return (item.children = [each]);
                            item.children.push(each);
                        }
                    });
                });
                return tree;
            },
            // 切换整个单位详情
            toggleUnitModal() {
                this.unitVisible = true;
            },
            // 操作单位
            operateUnit(data, type) {
                this.operateType = type;
                this.operateVisible = true;
                this.operateData = data;
                if (type === 'view') {
                    this.$emit('checkorg', data);
                }
            },
            // 删除单位
            deleteUnit() {
                this.deleteLoading = true;
                this.$util.post(this, {
                    url: this.baseUrl + 'manage/org/delete',
                    params: {
                        orgIds: this.operateData.orgId
                    },
                    success: res => {
                        this.$message.success(res.message);
                        this.deleteUnitVisible = false;
                        this.loadingOrgTree();
                        this.$emit('checkorg', {});
                    },
                    complete: () => {
                        this.deleteLoading = false;
                    }
                });
            },
            // 筛选
            filter(type = 'reset', key = 'orgCname') {
                if (type === 'reset') this.keyWords = '';
                const tree = this.createTree(this.oldData.filter(item => item[key].indexOf(this.keyWords) > -1));
                this.$set(this.$data, 'data', tree);
            },
            // 选中单位
            checkOrg(data) {
                this.$emit('checkorg', data);
            }
        }
    };
</script>
<style lang="less">
    .back-ucenter-unitManage-unitBox {
        flex: 1;
        display: flex;
        flex-direction: column;
        .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
            background: rgba(255, 255, 255, 0.1);
        }
        .details {
            line-height: 38/192rem;
            padding: 0;
        }
        &-tree {
            flex: 1;
            overflow: auto;
            padding: 20px 10px;
        }
        .tab-wrap {
            display: flex;
            > div {
                flex: 1;
            }
        }
        .operate-button-wrap {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: @font-size-base;
            padding-right: 8px;
        }
        .back-unitmanage-unitbox-tree {
            padding: 16px;
            margin-top: 24px;
            flex: 1;
            overflow: auto;
            background: #142650;
            border-top-left-radius: @border-radius-medium;
            border-top-right-radius: @border-radius-medium;
        }
        .el-tree-node__content {
            line-height: 50px;
            height: 50px;
            border-bottom: 1px dashed #253969;
        }
    }
</style>

