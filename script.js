const CONTRACT = "0xe1ab61f7b093435204df32f5b3a405de55445ea8";
const BURN = "0x000000000000000000000000000000000000dEaD";
const API_KEY = "YOUR_BSCSCAN_API_KEY";

let userAddress = null;

// 🔗 Connect Wallet
async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });

      userAddress = accounts[0];

      document.getElementById("wallet").innerText =
        "Connected: " + userAddress.slice(0, 6) + "...";

      fetchBurns(); // refresh after connect

    } catch (err) {
      alert("Connection failed");
    }
  } else {
    alert("Install MetaMask / Trust Wallet");
  }
}

document.getElementById("connectBtn")
  .addEventListener("click", connectWallet);


// 🔥 Fetch Burns
async function fetchBurns() {
  try {
    const url = `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${CONTRACT}&sort=desc&apikey=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.result || data.result.length === 0) {
      document.getElementById("total").innerText = "No burns yet 🔥";
      return;
    }

    let burns = {};
    let userTotal = 0;

    data.result.forEach(tx => {
      // 🔥 Only count burns
      if (tx.to.toLowerCase() !== BURN.toLowerCase()) return;

      const from = tx.from;
      const amount = tx.value / 1e18;

      if (!burns[from]) burns[from] = 0;
      burns[from] += amount;

      // 👤 User burn tracking
      if (userAddress && from.toLowerCase() === userAddress.toLowerCase()) {
        userTotal += amount;
      }
    });

    // 📊 Total burned
    let total = 0;
    Object.values(burns).forEach(v => total += v);

    document.getElementById("total").innerText =
      total.toFixed(2) + " ION";

    // 🏆 Leaderboard
    let sorted = Object.entries(burns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    let list = document.getElementById("leaderboard");
    list.innerHTML = "";

    sorted.forEach(([wallet, amt], index) => {
      let li = document.createElement("li");

      let crown = index === 0 ? "👑 " : "";

      li.innerText =
        `${crown}#${index + 1} ${wallet.slice(0, 6)}... - ${amt.toFixed(2)} ION`;

      list.appendChild(li);
    });

    // 👤 Show user stats
    if (userAddress) {
      let existing = document.getElementById("userBurn");

      if (!existing) {
        let p = document.createElement("p");
        p.id = "userBurn";
        document.body.appendChild(p);
      }

      document.getElementById("userBurn").innerText =
        "🔥 You burned: " + userTotal.toFixed(2) + " ION";
    }

  } catch (err) {
    document.getElementById("total").innerText = "Error loading data";
    console.error(err);
  }
}

// 🚀 Run on load
fetchBurns();
