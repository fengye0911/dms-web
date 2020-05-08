<template>
    <el-dialog
        destroy-on-close
        :width="440 * widthGap + 'px'"
        :visible="visible"
        :title="
            type === 'add'
                ? $t('unitManageDepartAdd')
                : type === 'edit'
                ? $t('unitManageDepartEdit')
                : $t('unitManageDepartView')
        "
        @close="$emit('close')"
        custom-class="back-ucenter-unitManage-departmentBox-operateDepartment"
    >
        <template v-if="!getLoading">
            <div :class="`back-ucenter-operate-depart  ${type === 'view' ? 'back-ucenter-operate-depart-view' : ''}`">
                <el-form ref="form" :rules="rules" :model="form" label-width="90px">
                    <el-form-item
                        class="back-ucenter-operate-depart-form"
                        :key="item.key"
                        :prop="item.key"
                        v-for="item in formList"
                        :label="item.label + '：'"
                    >
                        <el-input
                            :placeholder="type === 'view' ? '' : item.placeholder"
                            :type="item.params.type || 'text'"
                            v-model.trim="form[item.key]"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </template>
        <template v-else>
            <div v-loading="getLoading" style="height: 200px;"></div>
        </template>
        <div v-if="type !== 'view'" class="back-operate-bottom" slot="footer">
            <el-button @click="$emit('close')">{{ $t('cancel') }}</el-button>
            <el-button :loading="saveLoading" @click="save" type="primary">{{ $t('save') }}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import formConfig from './form.config.js';

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
            type: Object,
            default: () => ({})
        },
        orgInfo: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        const formList = formConfig.call(this, {});
        const { initValue, rules } = this.initForm(formList);

        return {
            saveLoading: false,
            getLoading: false,
            formList: formList,
            form: initValue,
            rules
        };
    },
    watch: {
        visible(val) {
            if (!val) {
                const { initValue } = this.initForm(this.formList);
                return this.$set(this.$data, 'form', initValue);
            }
            const baseForm = {
                roleIds: []
            };
            this.formList.forEach(item => {
                if (item.hasOwnProperty('defaultValue')) baseForm[item.key] = item.defaultValue;
            });
            if (this.type === 'add') {
                this.getLoading = false;
                // 新增
                const addForm = {
                    ...baseForm
                };
                this.$set(this.$data, 'form', addForm);
            } else if (this.type === 'edit') {
                // 编辑
                this.getLoading = true;
                (async () => {
                    const res = await this.getDepartInfo();
                    if (!res) return this.$emit('close');

                    const editForm = {
                        ...baseForm,
                        ...res
                    };
                    // if (editForm.brithday) editForm.brithday = new Date(editForm.brithday);
                    // if (editForm.pictureUrl) editForm.imageUrl = editForm.pictureUrl;
                    this.$set(this.$data, 'form', editForm);
                })();
            }
        }
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
        // 保存
        save() {
            if (!this.orgInfo.orgId) return;
            this.$refs.form.validate(res => {
                if (!res) return;
                const params = Object.assign(
                    {
                        orgId: this.orgInfo.orgId
                    },
                    this.form
                );
                this.saveLoading = true;
                this.$util.post(this, {
                    url: this.baseUrl + 'manage/depart/' + (this.type === 'edit' ? 'update' : 'add'),
                    params,
                    success: res => {
                        if (res.code !== '00000000') return;
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
        },
        // 获取部门数据
        getDepartInfo() {
            return new Promise((reslove, reject) => {
                this.$util.post(this, {
                    url: this.baseUrl + 'manage/depart/get',
                    params: {
                        departId: this.data.departId
                    },
                    success: res => {
                        if (res.code !== '00000000') return reject(false);
                        reslove(res.data);
                    },
                    complete: () => {
                        this.getLoading = false;
                    }
                });
            });
        }
    }
};
</script>
