<template>
    <div class="back-ucenter-unitManage-box">
        <div class="back-unitManage-content" :style="`height: ${height}px`">
            <!-- 单位管理 -->
            <unit-box @department="toggleDepartment" @checkorg="checkOrg" />
            <el-divider class="divider" v-if="department" direction="vertical"></el-divider>
            <!-- 部门管理 -->
            <department-box :orgInfo="orgInfo" :visible="department" :height="height" />
        </div>
    </div>
</template>
<script>
import unitBox from './unit-box';
import departmentBox from './department-box';

export default {
    name: 'unitManage',
    components: {
        unitBox,
        departmentBox
    },
    data() {
        return {
            // 容器高度
            height: 0,
            // 是否展示部门管理
            department: true,
            // 部门管理的单位父集信息
            orgInfo: {}
        };
    },
    created() {
        const { height, width } = this.$util.getWindowInfo();
        this.height = height - 89 * (width / 1920);
    },
    methods: {
        toggleDepartment() {
            this.department = !this.department;
        },
        checkOrg(data) {
            this.orgInfo = data;
        }
    }
};
</script>
<style lang="less">
.back-ucenter-unitManage-box {
    display: flex;
    justify-content: center;
    .back-unitManage-content {
        width: 100%;
        display: flex;
        .divider {
            background: none;
        }
        .tab-filter {
            background: #142650;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
        }
        .tab-wrap {
            height: 38/192rem;
            background: @b-commonfilterTable-title-bg;
            border-radius: @border-radius-medium @border-radius-medium 0 0;
            padding: 0 16/192rem;
            border-bottom: 2px solid transparent;
            .item {
                display: inline-block;
                vertical-align: top;
                line-height: 40/192rem;
                padding: 0 20/192rem;
                position: relative;
                font-size: @font-size-medium;
                color: @b-commonfilterTable-title-color-disabled;
                cursor: pointer;
                &::after {
                    content: ' ';
                    display: block;
                    left: 16px;
                    position: absolute;
                    transition: background-color 0.2s ease-out;
                    width: calc(~'100% - 32px');
                    height: 2px;
                    bottom: 0;
                }
            }
            .active {
                font-weight: bold;
                color: #b4d7f0;
                &::after {
                    background: #3fafff;
                }
            }
        }
        .unit-manage-operate {
            height: 84/192rem;
            line-height: 84/192rem;
            padding: 0 20/192rem;
        }
    }
    .back-unitmanage-filter {
        padding: 4px 0;
        text-align: right;
    }
}
</style>
