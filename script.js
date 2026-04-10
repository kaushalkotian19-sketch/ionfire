let userAddress = null;
const CONTRACT = "YOUR_ION_CONTRACT";
const BURN = "0x000000000000000000000000000000000000dEaD";
const API_KEY = "YOUR_BSCSCAN_API_KEY";

async function fetchBurns() {
  try {
    const url = `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${CONTRACT}&address=${BURN}&sort=desc&apikey=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    let burns = {};

    data.result.forEach(tx => {
      const from = tx.from;
      const amount = tx.value / 1e18;

      if (from.toLowerCase() === userAddress?.toLowerCase()) {
  userTotal += amount;
      }
      if (!burns[from]) burns[from] = 0;
      burns[from] += amount;
    });
    if (userAddress) {
  let p = document.createElement("p");
  p.innerText = "🔥 You burned: " + userTotal.toFixed(2) + " ION";
  document.body.appendChild(p);
    }

    let total = 0;
    Object.values(burns).forEach(v => total += v);

    document.getElementById("total").innerText = total.toFixed(2) + " ION";

    let sorted = Object.entries(burns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    let list = document.getElementById("leaderboard");
    list.innerHTML = "";

    sorted.forEach(([wallet, amt], index) => {
      let li = document.createElement("li");
      li.innerText = `#${index+1} ${wallet.slice(0,6)}... - ${amt.toFixed(2)} ION`;
      list.appendChild(li);
    });

  } catch (err) {
    document.getElementById("total").innerText = "Error loading data";
  }
}

fetchBurns();
let userTotal = 0;
async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });

      userAddress = accounts[0];

      document.getElementById("wallet").innerText =
        "Connected: " + userAddress.slice(0,6) + "...";

    } catch (err) {
      alert("Connection failed");
    }
  } else {
    alert("Install MetaMask / Trust Wallet");
  }
}

document.getElementById("connectBtn")
  .addEventListener("click", connectWallet);
