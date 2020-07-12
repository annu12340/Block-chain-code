App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",

  initWeb3: function () {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON("Todo.json", function (Counter) {
      App.contracts.Counter = TruffleContract(Counter);
      App.contracts.Counter.setProvider(App.web3Provider);
      return App.render();
    });
  },

  render: function () {
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on("click", ".add", App.add);
    $(document).on("click", ".sub", App.sub);
    $(document).on("click", ".mul", App.mul);
    $(document).on("click", ".div", App.div);
  },

  add: function (event) {
    var CounterInstance;
    event.preventDefault();
    var a = parseInt($("#a").val(), 10);
    var b = parseInt($("#b").val(), 10);
    console.log("values are", a, b);
    App.contracts.Counter.deployed()
      .then(function (instance) {
        CounterInstance = instance;
        CounterInstance.add(a, b);
        return CounterInstance.show({ from: App.account });
      })
      .then(function (result) {
        $("#data").html("Your content: " + result);
      });
  },

  subtract: function (event) {
    var CounterInstance;
    event.preventDefault();
    App.contracts.Counter.deployed()
      .then(function (instance) {
        CounterInstance = instance;
        CounterInstance.subtract();
        return CounterInstance.viewData({ from: App.account });
      })
      .then(function (result) {
        $("#data").html("Your content: " + result);
      });
  },
};

$(function () {
  $(window).load(function () {
    App.initWeb3();
  });
});
