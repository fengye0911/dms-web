export default function() {
    return [
        {
            type: 'input',
            key: 'departCname',
            label: this.$t('DepartmentName'),
            params: {},
            placeholder: this.$t('placeholderText'),
            required: true
        },
        {
            type: 'input',
            key: 'departCode',
            label: this.$t('DepartmentNumber'),
            params: {},
            placeholder: this.$t('placeholderText'),
            required: true
        },
        {
            type: 'input',
            key: 'remark',
            label: this.$t('Remarks'),
            params: {},
            placeholder: this.$t('placeholderText')
        }
    ];
}
