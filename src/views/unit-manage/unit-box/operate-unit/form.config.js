export default function() {
    return [
        {
            type: 'input',
            key: 'orgCname',
            label: this.$t('UnitName'),
            params: {},
            placeholder: this.$t('placeholderText'),
            required: true
        },
        {
            type: 'input',
            key: 'orgCode',
            label: this.$t('UnitNumber'),
            params: {},
            rule: [
                // {
                //     type: 'string',
                //     // pattern: /^(?=.*[a-z])(?=.*[A-Z]).{8,64}$/,
                //     pattern: /^(?![^a-zA-Z]+$)(?!\D+$)(?![a-zA-Z0-9]+$).{8,64}$/,
                //     message: this.$t('passwordValide')
                // }
            ],
            placeholder: this.$t('placeholderText'),
            required: true
        },
        {
            type: 'input',
            key: 'address',
            label: this.$t('address'),
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
