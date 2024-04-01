<template>
  <div class="hello">
    <div
      v-if="!walletAddress"
      class="flex flex-col items-center justify-center h-full"
    >
      <h1 class="mb-8 text-2xl font-bold">Welcome to Plena Connect</h1>
      <a-button type="primary" @click="showModel" class="text-sm font-bold">
        Connect
      </a-button>
      <PlenaModal
        :config="config"
        :dataURLs.sync="dataURL"
        :spinner.sync="spinnerOn"
        :isVisible.sync="isModalVisible"
        @close="isModalVisible = false"
      />
    </div>

    <template v-if="walletAddress">
      <div class="h-100 flex justify-center items-center">
        <div
          class="h-4/5 w-72 border-2 border-solid border-[#985AFF] rounded-2xl"
        >
          <div class="mt-5 flex ml-4">
            <h2 className="text-black mt-6 font-extrabold">
              Wallet Address :
              {{
                walletAddress.slice(0, 5) +
                "..." +
                walletAddress.slice(
                  walletAddress.length - 5,
                  walletAddress.length
                )
              }}
            </h2>
          </div>

          <div class="flex flex-col items-center justify-center">
            <h1 class="mb-8 text-2xl font-bold mt-20">Methods</h1>
            <div class="flex flex-col h-auto">
              <button
                type="primary"
                @click="testSignTransaction(walletAddress, sendTransaction)"
                class="text-sm mx-2 bg-[#985AFF] text-white px-20 py-3 flex justify-center items-center"
              >
                Personal Sign
              </button>
              <button
                type="primary"
                @click="testSendTransaction(walletAddress, sendTransaction)"
                class="text-sm mx-2 mt-5 bg-[#985AFF] text-white px-10 py-3 flex justify-center items-center"
              >
                Send Transaction
              </button>
              <button
                type="primary"
                @click="closeConnection"
                class="text-sm mx-2 font-bold bg-white hover:bg-985AFF text-[#985AFF] border-2 border-solid border-[#985AFF] mt-40 mb-4 px-10 py-2 flex justify-center items-center"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <SignModal
          :visible="visible"
          :address="walletAddress"
          :signature="signature"
          :pending="pending"
          :closeSignModal="closeSignModal"
        />
        <TxnModal
          :txvisible="txvisible"
          :txpending="txpending"
          :address="walletAddress"
          :txHash="txHash"
          :closeTxModal="closeTxModal"
        />
      </div>
    </template>
  </div>
</template>

<script>
import Vue, { ref } from "vue";
import Component from "vue-class-component";
import SignModal from "../modals/SignModal.vue";
import TxnModal from "@/modals/TxnModal.vue";

import { ethers } from "ethers";
import { createToggleMixin } from "plena-vue-sdk";

// Vue.use(PlenaModalPlugin)

const config = {
  dappToken:
    "269a0d4e4b338001c220588534ae809bfc6b1a322415f2561e93e08d5446bb352b08d5a2d85b9fac75ad15d72a087c9a95857e4e265ce0e368440733e9a130b9",
  dappId: "clotfuhlkqlqs7on7o0g",
  bridgeUrl: "connect.plena.finance",
};
const ToggleMixin = createToggleMixin(config);

const visible = ref(false);
const signature = ref("");
const pending = ref(false);

const txvisible = ref(false);
const txHash = ref("");
const txpending = ref(false);

const openSignModal = () => {
  visible.value = true;
  txvisible.value = false;
};

const openTxModal = () => {
  txvisible.value = true;
  visible.value = false;
};

const closeSignModal = () => {
  visible.value = false;
  signature.value = "";
  pending.value = true;
};

const closeTxModal = () => {
  txvisible.value = false;
  txHash.value = "";
  txpending.value = true;
};

const testSendTransaction = async (walletAddress, sendTransaction) => {
  txpending.value = true;
  openTxModal();
  const AAVE_V3_POOL_POLYGON = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
  const USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
  const amount = "1000000";

  const aaveABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "asset",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "onBehalfOf",
          type: "address",
        },
        {
          internalType: "uint16",
          name: "referralCode",
          type: "uint16",
        },
      ],
      name: "supply",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const erc20ABI = [
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const approveContract = new ethers.utils.Interface(erc20ABI);

  //Create data for approving token for lending pool
  const approveData = approveContract.encodeFunctionData("approve", [
    AAVE_V3_POOL_POLYGON,
    amount,
  ]);

  const lendContract = new ethers.utils.Interface(aaveABI);

  //Create data for lending on Aave
  const lendData = lendContract.encodeFunctionData("supply", [
    USDT,
    amount,
    walletAddress,
    "0",
  ]);

  // Draft transaction
  const tx = {
    from: walletAddress, //Plena Wallet Address
    data: [approveData, lendData], //Encoded data for all transactions in order of execution
    to: [USDT, AAVE_V3_POOL_POLYGON], //Smart Contract Addresses On which the transactions has to made
    tokens: ["", ""], // Feature to be launched (Leave empty for now). The Array should be of same length as the above attributes
    amounts: ["0x0", "0x0"], //Native Token Amounts required in transaction
  };

  try {
    const res = await sendTransaction({
      chain: 137,
      method: "send_transaction",
      payload: {
        transaction: tx,
      },
    });

    console.log(res);
    txHash.value = res?.content?.transactionHash;
  } catch (error) {
    txHash.value = "";
  } finally {
    txpending.value = false;
  }
};

const testSignTransaction = async (walletAddress, sendTransaction) => {
  pending.value = true;
  openSignModal();
  const message = `My email is john@doe.com - ${new Date().toUTCString()}`;
  const hexMsg = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message));
  const msgParams = [hexMsg, walletAddress];

  try {
    const res = await sendTransaction({
      chain: 137,
      method: "personal_sign",
      payload: {
        msgParams,
      },
    });

    signature.value = res?.content?.signature;

    console.log(signature);
  } catch (error) {
    signature.value = "";
  } finally {
    pending.value = false;
  }
};

@Component({
  components: {
    SignModal,
    TxnModal,
  },
  mixins: [ToggleMixin],

  props: {
    msg: String,
  },
  data() {
    return {
      config,
      testSignTransaction,
      testSendTransaction,
      visible,
      signature,
      pending,
      closeSignModal,
      txHash,
      txpending,
      txvisible,
      closeTxModal,
    };
  },
})
export default class PlenaWallet extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
