<template>
  <InputField
    :helper-text="helperText"
    :is-disabled="isDisabled"
    :is-focused="isFocused"
    :is-invalid="isInvalid"
    class="InputPercentage"
    :class="{'green_border': inputValue > 1}"
  >
    <div
      slot-scope="{ inputClass }"
      :class="inputClass"
      class="flex flex-row pt-0"
    >
      <input
        ref="input"
        v-model="model"
        :disabled="isDisabled"
        autocomplete="off"
        class="percent bg-transparent text-theme-page-text vgt-right-align"
        type="text"
        @blur="onBlur"
        @focus="onFocus"
      >
    </div>
  </InputField>
</template>

<script>
import InputField from "./InputField";

/**
 * This component uses a String value internally to avoid several problems, such
 * as showing the exponential notation, although it emits a Number always.
 * It also support a `raw` event, that can be used by other components to receive
 * the internal String value.
 */
export default {
    name: "InputPercentage",

    components: {
        InputField
    },

    model: {
        prop: "value",
        event: "input"
    },

    props: {
        isDisabled: {
            type: Boolean,
            required: false,
            default: false
        },
        value: {
            type: [Number, String],
            required: true
        },
        helperText: {
            type: [Number, String],
            required: false,
            default: ""
        }
    },

    data () {
        return {
            inputValue: 0,
            isFocused: false
        };
    },

    computed: {

        isInvalid () {
            return this.inputValue < 0 || this.inputValue > 10000;
        },

        model: {
            get () {
                const inputString = this.inputValue.toString();
                let integer = inputString.slice(0, -2);
                if (integer === "") integer = "0";
                let decimal = inputString.slice(-2);
                if (decimal.length === 1) decimal = "0" + decimal;
                else if (decimal.length === 0) decimal = "00";
                return integer + "." + decimal;
            },
            set (value) {
                this.inputValue = -1;
                const inputString = value.replace(/\D/g, "").slice(0, 5);
                this.emitInput(+inputString);
                this.inputValue = +inputString;
            }
        }
    },

    watch: {
        value: {
            handler (val) {
                if (this.inputValue !== val) {
                    this.model = val.toString();
                }
            },
            immediate: true
        }
    },

    methods: {
        /**
     * Emits the raw input value (`raw`), as String, and the Number value (`input`)
     */
        emitInput (value) {
            this.$emit("percent-input", value);
        },
        focus () {
            this.$refs.input.focus();
        },
        onBlur () {
            this.isFocused = false;
            this.$emit("blur");
        },
        onFocus () {
            this.isFocused = true;
            this.$emit("focus");
        },

        reset () {
            this.model = 0;
        }
    }
};
</script>

<style>

.green_border div {
  border-color: var(--theme-success);
}

.InputPercentage div {
    padding-top: 0;
}

.InputPercentage .h-10, .InputPercentage .h-12 {
    height: initial !important;
}

.InputPercentage .mb-1 {
    margin-bottom: initial !important;
}

.InputPercentage .w-full {
    width: auto !important;
}

.InputPercentage .inline-flex {
    display: inline-block !important;
}

.InputPercentage input {
    width: 60px;
    margin-bottom: 3px;
}

.InputPercentage .break-words {
    white-space: nowrap;
}

.InputPercentage .InputField__helper {
    font-size: 100%;
}
</style>
