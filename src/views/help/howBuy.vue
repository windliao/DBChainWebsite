<template>
  <div class="wrap1200 bg-box mb100">
    <div class="border-box">
      <h2>{{$t('help.title')}}</h2>
      <h3 v-if="this.$i18n.locale==='cn' || this.$i18n.locale==='CN'">
        {{$t('help.1')}}
        <a href="javascript:" @click="tradedbcHref">dbctrade</a>
      </h3>

      <h3>
        {{$t('help.2')}}，
        <a
          v-if="this.$i18n.locale==='cn' || this.$i18n.locale==='CN'"
          href="https://www.huobi.me/zh-cn/exchange/dbc_btc/"
          target="_blank"
        >https://www.huobi.me/zh-cn/</a>

        <a
          v-else
          href="https://www.huobi.me/en-us/exchange/dbc_btc/"
          target="_blank"
        >https://www.huobi.me/en-us/</a>
        .{{$t('help.reloadWallet')}}
      </h3>

      <h3>
        {{$t('help.3')}}，
        <a href="https://www.kucoin.io" target="_blank">https://www.kucoin.io</a>
        .{{$t('help.reloadWallet')}}
      </h3>

      <h3>
        {{$t('help.4')}}，
        <a href="https://www.gateio.la" target="_blank">https://www.gateio.la</a>
        .{{$t('help.reloadWallet')}}
      </h3>

      <h3>{{$t('help.5')}}</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: "howBuy",

  methods: {
    tradedbcHref() {
      window.open(
        "https://www.dbctrade.io/trade/buy_1?address_user=" +
          this.$route.query.address_user
      );
    }
  }
};
</script>

<style lang="scss" scoped>
a {
  color: #008bf3;
}
</style>
