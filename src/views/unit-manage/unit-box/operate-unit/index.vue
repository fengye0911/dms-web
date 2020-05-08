<template>
    <el-dialog
        destroy-on-close
        :visible="visible"
        :width="(hasMapSelect ? 800 : 440) * widthGap + 'px'"
        :title="
            type === 'add'
                ? $t('unitManageUnitAdd')
                : type === 'edit'
                ? $t('unitManageUnitEdit')
                : $t('unitManageUnitView')
        "
        @close="$emit('close')"
        class="back-ucenter-unitManage-unitBox-operateUnit"
    >
        <div
            :class="
                `back-ucenter-operate-unit  ${type === 'view' ? 'back-ucenter-operate-unit-view' : ''} ${
                    hasMapSelect ? 'back-ucenter-operate-unit-map-select' : ''
                }`
            "
        >
            <el-form ref="form" :rules="rules" :model="form" label-width="90/192rem" v-if="visible">
                <el-form-item :key="item.key" :prop="item.key" v-for="item in formList" :label="item.label + '：'">
                    <el-input
                        :placeholder="type === 'view' ? '' : item.placeholder"
                        :type="item.params.type || 'text'"
                        v-model.trim="form[item.key]"
                    ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="map-area" v-if="hasMapSelect">
            <map-area
                style="width:100%;height:300/192rem;"
                ref="mapSelectArea"
                :visible="mapAreaVisible"
                :disabled="type === 'view'"
                :defaultPoint="form.regionaData"
                @area="getAreaPoint"
            ></map-area>
        </div>
        <div v-if="type !== 'view'" slot="footer">
            <el-button @click="$emit('close')">{{ $t('cancel') }}</el-button>
            <el-button :loading="saveLoading" @click="save" type="primary">{{ $t('save') }}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import formConfig from './form.config.js';
import mapArea from '@/components/back/map-area-select.vue';

export default {
    props: {
        visible: {
            type: Boolean
        },
        // edit/view/add
        type: {
            type: String
        },
        data: {
            type: Object
        }
    },
    components: {
        mapArea
    },
    computed: {
        hasMapSelect() {
            return this.data._root || this.data.level2;
        }
    },
    watch: {
        visible(val) {
            if (val) {
                // 初始化
                this.$set(this.$data, 'form', this.type === 'add' ? {} : this.data);
                this.$nextTick(() => {
                    this.mapAreaVisible = true;
                });
            } else {
                this.mapAreaVisible = false;
                this.regionalData = [];
            }
        }
    },
    data() {
        const formList = formConfig.call(this, {});
        const { initValue, rules } = this.initForm(formList);

        return {
            // 绘制点位数据
            regionalData: [],
            mapAreaVisible: false,
            saveLoading: false,
            formList: formList,
            form: initValue,
            rules
        };
    },
    methods: {
        // 初始化表单数据
        initForm(formList) {
            const initValue = {};
            const rules = {};
            formList.forEach(item => {
                if (item.required) rules[item.key] = [{ required: true, message: item.placeholder + item.label }];
                if (item.rule) {
                    if (item.key in rules) {
                        rules[item.key] = rules[item.key].concat(item.rule);
                    } else {
                        rules[item.key] = [...item.rule];
                    }
                }
                if (item.hasOwnProperty('defaultValue')) initValue[item.key] = item.defaultValue;
            });
            return { initValue, rules };
        },
        // 获取保存的点位
        getAreaPoint(points) {
            let regionalData = [];
            if (points.length) {
                this.regionalData = points[0].map(item => {
                    return {
                        lat: parseFloat(parseFloat(item.lat).toFixed(6)),
                        lng: parseFloat(parseFloat(item.lng).toFixed(6))
                    };
                });
            } else {
                this.regionalData = [];
            }
        },
        // 保存
        save() {
            if (!this.data.orgId) return;
            this.$refs.form.validate(res => {
                if (!res) return;
                const params = Object.assign(
                    {
                        parentId: this.data.orgId
                    },
                    this.form
                );
                params.regionalData = JSON.stringify(this.regionalData);
                this.saveLoading = true;
                this.$util.post(this, {
                    url: this.baseUrl + 'manage/org/' + (this.type === 'edit' ? 'update' : 'add'),
                    params,
                    success: res => {
                        if (res.code !== '00000000') return this.$message.error(res.message);
                        this.$message.success(res.message);
                        this.$emit('refresh');
                    },
                    error: res => {
                        this.$message.error(res.message);
                        // this.form.orgCname = this.form.label;
                    },
                    complete: () => {
                        this.saveLoading = false;
                    }
                });
            });
        }
    }
};
</script>
<style lang="less">
.back-ucenter-unitManage-unitBox-operateUnit {
    .map-area {
        height: 300 / 192rem;
    }
    .back-ucenter-operate-unit-map-select {
        .el-form-item {
            display: inline-block;
            width: 50%;
        }
    }
}
</style>
