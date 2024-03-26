<template>
  <a-modal
    v-model="txvisible"
    :destroyOnClose="true"
    :footer="null"
    :onCancel="closeTxModal"
  >
    <div class="flex flex-col items-center justify-center mt-4">
      <template v-if="txpending">
        <p class="font-bold text-xl text-black-500">Pending Request</p>
        <a-spin :indicator="indicator" />
        <p class="font-medium text-lg text-gray-500">
          Accept or Reject request using your wallet
        </p>
      </template>
      <template v-else-if="txHash !== '' && txHash !== undefined">
        <p class="font-bold text-xl text-black-500">Request Approved</p>
        <div class="w-full">
          <div class="flex items-center">
            <p class="text-base font-bold w-20">method:</p>
            <p class="text-md">send_transaction</p>
          </div>
          <div class="flex items-center">
            <p class="text-base font-bold w-20">txHash:</p>
            <p class="text-md">
              {{
                txHash?.slice(0, 8) +
                "..." +
                txHash?.slice(txHash.length - 5, txHash?.length)
              }}
            </p>
          </div>
          <div class="flex items-center">
            <p class="text-base font-bold w-20">From:</p>
            <p class="text-sm">{{ address }}</p>
          </div>
        </div>
      </template>
      <template v-else>
        <p class="font-bold text-3xl text-black-500">Request Rejected</p>
      </template>
    </div>
  </a-modal>
</template>

<script>
import Component from "vue-class-component";
import { LoadingOutlined } from "@ant-design/icons-vue";
import { h } from "vue";
const indicator = h(LoadingOutlined, {
  style: {
    fontSize: "24px",
  },
  spin: true,
});

@Component({
  props: {
    txvisible: Boolean,
    address: String,
    txHash: String,
    txpending: Boolean,
    closeTxModal: Function,
  },
  data() {
    return {
      indicator,
    };
  },
})
export default class TxnModal {}
</script>

<style scoped></style>
