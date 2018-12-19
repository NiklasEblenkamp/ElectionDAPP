var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "cable abstract acquire episode family crash egg diet speak scrap include doll"; // 12 word mnemonic
var provider = new HDWalletProvider(mnemonic, "http://203.154.59.5:8545");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "203.154.59.5",
      port: 8545,
      network_id: "*", // Match any network id
      from: '0x7a5e98f0637A03b38B3cD08598114F53Eb11cb46'
    },
  live: {
    provider: () => provider,
    network_id: "*",        // Ethereum public network
    // optional config values:
    // gas
    // gasPrice
    // from - default address to use for any transaction Truffle makes during migrations
    // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
    //          - function that returns a web3 provider instance (see below.)
    //          - if specified, host and port are ignored.
  }
}
};