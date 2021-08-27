var walletType = "BSC";
var dataType = "balance";

// For toggle navbar
let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
  arrow[i].addEventListener("click", (e) => {
    let arrowParent = e.target.parentElement.parentElement; //selecting main parent of arrow
    arrowParent.classList.toggle("showMenu");
  });
}
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
sidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

// let width = window.innerWidth;
// if (width <= 990) {
//   document.getElementById("sidebar").classList.add("close");
// }

// For My wallet type
const getPlaceholder = () => {
  if (localStorage.getItem("walletType") === null) {
    localStorage.setItem("walletType", "BSC");
  }

  let type = localStorage.getItem("walletType");
  if (type === "BSC") {
    walletType = "BSC";
    return "Enter BEP-20 address here to check its porfolio";
  } else if (type === "ETH") {
    walletType = "ETH";
    return "Enter ERC-20 address here to check its porfolio";
  } else if (type === "MATIC") {
    walletType = "MATIC";
    return "Enter MATIC address here to check its porfolio";
  }
};

if (window.location.pathname === "/") {
  let input = document.getElementById("address");
  input.placeholder = getPlaceholder();
}

const myWallet = (walletType) => {
  localStorage.setItem("walletType", walletType);
  window.location.assign(window.location.origin);
};

// Geting wallet address from input
if (window.location.pathname === "/") {
  let input = document.getElementById("address");
  let button = document.getElementById("btn");

  button.addEventListener("click", () => {
    let address = input.value.split(" ").join("");
    if (address != "") {
      window.location = `/address?address=${address}&type=${walletType}`;
    }
  });
}

//Getting wallet address and wallet type form URL
const getWallerAddressAndType = () => {
  let string = window.location.search.replace(/^.*?\=/, "").split("&type=");
  let contract = string[1].split("&contract=");
  string[1] = contract[0];
  string[2] = contract[1];
  return string;
};

//Getting chain id
const getChainId = (type) => {
  if (type === "BSC") {
    return 56;
  } else if (type === "ETH") {
    return 1;
  } else if (type === "MATIC") {
    return 137;
  }
};

//Fuction for getting transaction data
const getTransaction = (contract) => {
  let [address, type] = getWallerAddressAndType();
  window.location = `/transaction?address=${address}&type=${walletType}&contract=${contract}`;
};

//copy
const showCopy = (text) => {
  let divCopy = document.createElement("div");
  let html = `copied:${text}`;
  divCopy.classList.add("show-copy");
  divCopy.innerHTML = html;
  document.body.appendChild(divCopy);
  setTimeout(() => {
    divCopy.parentNode.removeChild(divCopy);
  }, 2000);
};

const copy = (text) => {
  let input = document.createElement("input");
  input.setAttribute("value", text);
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.parentNode.removeChild(input);
  showCopy(text);
};

//Adding data to balance table
const addBalanceTable = (name, symbol, contract, balance, value) => {
  let tableRow = document.createElement("tr");
  let html = `
  <td>${name}</td>
  <td>${symbol}</td>
  <td onclick="copy('${contract}')" class="address"><span>${contract}</span></td>
  <td>${balance}</td>
  <td>$${value}</td>
  <td><button class="btn" onclick="getTransaction('${contract}')">Get Tx</button></td>
  `;
  tableRow.innerHTML = html;
  document.getElementById("table-body").appendChild(tableRow);
};

//Adding data to transaction table
const addTransactionTable = (time, txHash, from, transferType, to, value) => {
  let tableRow = document.createElement("tr");
  let html = `
  <td >${time}</td>
  <td onclick="copy('${txHash}')" class="address">${txHash}</td>
  <td onclick="copy('${from}')" class="address">${from}</td>
  <td >${transferType}</td>
  <td onclick="copy('${to}')" class="address">${to}</td>
  <td>${value}</td>
  `;
  tableRow.innerHTML = html;
  document.getElementById("table-body").appendChild(tableRow);
};

//do something after getting data
const processData = (data) => {
  if (dataType === "balance") {
    document.getElementById("table-body").innerHTML = "";
    data.forEach((element) => {
      let name = element.contract_name;
      let symbol = element.contract_ticker_symbol;
      let contract = element.contract_address;
      let decimal = element.contract_decimals;
      let balance = parseFloat(element.balance);
      balance = balance / parseFloat(`1e${decimal}`);
      balance = balance.toFixed(2);
      let value = parseFloat(element.quote);
      value = value.toFixed(2);
      addBalanceTable(name, symbol, contract, balance, value);
    });
  } else if (dataType === "transaction") {
    document.getElementById("table-body").innerHTML = "";
    data.forEach((element) => {
      let time = new Date(element.block_signed_at);
      time = time.toLocaleString("en-US");
      let txHash = element.transfers[0].tx_hash;
      let from = element.transfers[0].from_address;
      let transferType = element.transfers[0].transfer_type;
      let to = element.transfers[0].to_address;
      let value = parseFloat(element.transfers[0].delta);
      value = value / parseFloat(`1e${element.transfers[0].contract_decimals}`);
      value = value.toFixed(2);
      addTransactionTable(time, txHash, from, transferType, to, value);
    });
  }
};

//For chart
const getChart = (data) => {
  let series = new Array();
  let labels = new Array();
  data.forEach((element) => {
    series.push(element.quote);
    labels.push(element.contract_ticker_symbol);
  });

  let width;
  if (window.innerWidth >= 550) {
    width = 380;
  } else {
    width = 320;
  }

  let options = {
    series: series,
    chart: {
      width: width,
      type: "pie",
    },
    labels: labels,
    responsive: [
      {
        breakpoint: 310,
        options: {
          chart: {
            width: width,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  document.getElementById("chart").innerHTML = "";
  let chart = new ApexCharts(document.getElementById("chart"), options);
  chart.render();
};

const showBalance = (data) => {
  let balance = 0;
  let span = document.getElementById("balance");
  data.forEach((element) => {
    balance += element.quote;
  });
  balance = balance.toFixed(2);
  span.innerText = "";
  span.innerText = ` ${balance} $`;
};

//Getting data from covalenthq.com for balance
const getData = (address, contract) => {
  if (dataType === "balance") {
    fetch(
      `https://api.covalenthq.com/v1/${getChainId(
        walletType
      )}/address/${address}/balances_v2/?key=ckey_01f2b4e6820d4ca8b9ed11a55ee`
    )
      .then((response) => response.json())
      .then((data) => {
        processData(data.data.items);
        getChart(data.data.items);
        showBalance(data.data.items);
        document.getElementById("hideAll").style.display = "none";
      })
      .catch((err) => {
        console.log(err);
        getData(address, contract);
      });
  } else if (dataType === "transaction") {
    fetch(
      `https://api.covalenthq.com/v1/${getChainId(
        walletType
      )}/address/${address}/transfers_v2/?contract-address=${contract}&key=ckey_6bbe8075199349f694219f46c61`
    )
      .then((response) => response.json())
      .then((data) => {
        processData(data.data.items);
        document.getElementById("hideAll").style.display = "none";
      })
      .catch((err) => console.log(err));
  }
};

const detectURLs = (message) => {
  let urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return message.match(urlRegex);
};

//For showing airdrop message
const showAirdrop = (data) => {
  let airdropContainer = document.getElementById("airdrop-container");
  let airdrop = document.createElement("div");
  airdrop.classList.add("airdrop");

  if (data.img != undefined) {
    let img = document.createElement("img");
    img.src = data.img;
    airdrop.appendChild(img);
  }

  data.body.forEach((element) => {
    let p = document.createElement("p");
    if (detectURLs(element)) {
      let url = detectURLs(element);
      element = element.replace(
        url,
        `<a href="${url}" target="_blank">${url}</a>`
      );
    }
    p.innerHTML = element;
    airdrop.appendChild(p);
  });
  let date = document.createElement("p");
  date.classList.add("date");
  date.innerText = data.date;
  airdrop.appendChild(date);
  airdropContainer.appendChild(airdrop);
};

//For geting airdrop message
const getAirdrop = () => {
  fetch(`${window.origin}/data/airdrop`)
    .then((response) => response.json())
    .then((data) => {
      data = data.reverse();
      data.forEach((element) => {
        showAirdrop(element);
      });
      document.getElementById("hideAll").style.display = "none";
    })
    .catch((err) => console.log(err));
};

//For showing ads
const showAds = () => {
  let adsContainer = document.getElementById("ads-container");
  fetch(`${window.origin}/data/ads`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        let ads = document.createElement("a");
        ads.href = element.link;
        ads.target = "_blank";
        let img = document.createElement("img");
        img.src = element.img;
        ads.appendChild(img);
        adsContainer.appendChild(ads);
      });
    });
};

//For showing coins in table
const showCoin = (name, img, price, symbol) => {
  let tableRow = document.createElement("tr");
  let html = `
  <td ><div class="name"><img src="${img}"><span>${name}</span></div></td>
  <td >${symbol}</td>
  <td >$${price}</td>`;
  tableRow.innerHTML = html;
  document.getElementById("table-body").appendChild(tableRow);
};

//For getting coins
const getCoins = () => {
  fetch(`${window.origin}/data/coins`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        let name = element.name;
        let img = element.img;
        let price;
        let symbol;
        fetch(
          `https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/${element.chainId}/USD/${element.address}/?key=ckey_01f2b4e6820d4ca8b9ed11a55ee`
        )
          .then((response) => response.json())
          .then((data) => {
            price = data.data[0].prices[0].price;
            symbol = data.data[0].contract_ticker_symbol;
            showCoin(name, img, price, symbol);
          });
      });
      document.getElementById("hideAll").style.display = "none";
    });
};

if (window.location.pathname === "/address") {
  let span = document.getElementById("wallet-address");
  let [address, type, contract] = getWallerAddressAndType();
  walletType = type;
  dataType = "balance";
  setInterval(() => {
    getData(address);
  }, 30000);
  span.innerText = address;
  showAds();
} else if (window.location.pathname === "/transaction") {
  let [address, type, contract] = getWallerAddressAndType();
  walletType = type;
  dataType = "transaction";
  setInterval(() => {
    getData(address, contract);
  }, 30000);
  showAds();
} else if (window.location.pathname === "/airdrop") {
  getAirdrop();
} else if (window.location.pathname === "/") {
  getCoins();
}

//For hiding the discalimer
const hideDiscalimer = () => {
  document.getElementById("discalimer").style.display = "none";
};
