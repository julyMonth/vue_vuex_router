<template>
    <div :style="styleObj" class="ip-input">
        <el-input :validateEvent="validateEvent" :class="['ip-input__verse-'+ i, 'input']" :maxlength="3" v-for="i in 4" :key="i" v-model="ipArr[i-1]" :ref="'input_' + i" @change="updateValue($event, i)" @keydown.native="onInputKeydown($event, i)" @paste.native.prevent="onPaste($event, i)" :disabled="disabled"></el-input>
    </div>
</template>
<script>
export default {
    name: "IpInput",
    props: {
        value: {
            type: String,
            default: ""
        },
        width: {
            type: String,
            default: "100%"
        },
        disabled: {
            type: Boolean,
            default: false
        },
        validateEvent: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        styleObj() {
            return {
                width: this.width
            };
        }
    },
    data() {
        return {
            ipArr: this.value.split(".")
        };
    },
    watch: {
        value(val) {
            this.ipArr = val.split(".");
        }
    },
    methods: {
        // 获取当前输入框的焦点位置
        getRange(el) {
            let ret = {};
            if (el.setSelectionRange) {
                ret.begin = el.selectionStart;
                ret.end = el.selectionEnd;
                ret.result = el.value.substring(ret.begin, ret.end);
            }
            el.focus();
            return ret;
        },
        updateValue(val, index) {
            this.$nextTick(_ => {
                if (!/^\d*$/.test(val)) {
                    // 去除非数字的字符
                    this.ipArr.splice(index - 1, 1, val.replace(/[^\d]/g, ""));
                } else {
                    // 超过255默认显示255
                    this.ipArr.splice(index - 1, 1, val > 255 ? 255 : val);
                }

                // 自动获取下一个焦点
                if (val.length === 3 && index < 4) {
                    this.$el.getElementsByTagName("input")[index].focus();
                }

                // 如果ip都为空，则返回空字符串，如果ip不为空，则返回ip字符串
                this.$emit(
                    "input",
                    this.ipArr.every(ip => ip === "")
                        ? ""
                        : this.ipArr.join(".")
                );
            });
        },
        onInputKeydown(event, index) {
            const keyCode = event.keyCode || event.which;
            const value = event.target.value;
            const arrayIndex = index - 1; // 值在数组中的顺序 即从0开始
            // 处理键盘监听 8为退格键 37为left箭头 39为right箭头 110为小数点
            if (keyCode === 8 || keyCode === 37) {
                if (
                    (value.length === 0 || this.getRange(event.target).end === 0) &&
                    arrayIndex > 0
                ) {
                    const inputEl = this.$el.getElementsByTagName("input")[
                        arrayIndex - 1
                    ];
                    const length = inputEl.value.length;
                    // 聚焦前一个input
                    inputEl.focus();
                    // 选中input中的最后一位
                    if (inputEl.setSelectionRange) {
                        inputEl.setSelectionRange(length, length);
                    }
                }
            } else if (keyCode === 39 || keyCode === 110 || keyCode === 190) {
                if (
                    this.getRange(event.target).end === value.length &&
                    arrayIndex < 3
                ) {
                    this.$el
                        .getElementsByTagName("input")
                        [arrayIndex + 1].focus();
                }
            }
        },
        onPaste(event, index) {
            const arrayIndex = index - 1;
            // `ie`和`chrome`兼容
            const pasteText = event.clipboardData
                ? event.clipboardData.getData("text/plain").trim()
                : window.clipboardData.getData("text").trim();
            if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(pasteText)) {
                const segments = pasteText.split(".");
                segments.forEach((segment, i) => {
                    const value = Number(segment);
                    if (
                        arrayIndex + i < 4 &&
                        !isNaN(value) &&
                        value >= 0 &&
                        value <= 255
                    ) {
                        this.ipArr.splice(arrayIndex + i, 1, value);
                        this.$emit("input", this.ipArr.join("."));
                    }
                });
                this.$emit(
                    "input",
                    this.ipArr.every(ip => ip === "")
                        ? ""
                        : this.ipArr.join(".")
                );
            }
        }
    }
};
</script>
<style lang="less">
.ip-input {
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 2px;
    line-height: 32px;
    font-size: 14px;
    &:hover {
        border-color: #1d75de;
    }
    .input {
        width: 25%;
        input {
            border: none !important;
            border-radius: 0px;
            text-align: center;
        }
    }
    .ip-input__verse-1 {
        margin-left: 0;
        input {
            border-right: 0;
        }
        &:after {
            position: absolute;
            content: "·";
            float: right;
            top: 0;
            z-index: 2;
        }
    }

    .ip-input__verse-2 {
        input {
            border-left: 0;
            border-right: 0;
        }
        &:after {
            position: absolute;
            content: "·";
            float: right;
            top: 0;
            z-index: 2;
        }
    }

    .ip-input__verse-3 {
        input {
            border-right: 0;
            border-left: 0;
        }
        &:after {
            position: absolute;
            content: "·";
            float: right;
            top: 0;
            z-index: 2;
        }
    }

    .ip-input__verse-4 {
        input {
            border-left: 0;
        }
    }
}
.el-form-item.is-error .ip-input:focus,
.el-form-item.is-error .ip-input:hover {
    border-color: #ff5353;
}
</style>
