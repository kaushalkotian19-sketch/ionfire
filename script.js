const CONTRACT = "YOUR_ION_CONTRACT";
const BURN = "0x000000000000000000000000000000000000dEaD";
const API_KEY = "YOUR_BSCSCAN_API_KEY";

async function fetchBurns() {
  const url = `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=${CONTRACT}&address=${BURN}&sort=desc&apikey=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  let burns = {};

  data.result.forEach(tx => {
    const from = tx.from;
    const amount = tx.value / 1e18;

    if (!burns[from]) burns[from] = 0;
    burns[from] += amount;
  });

  let total = 0;
  Object.values(burns).forEach(v => total += v);

  document.getElementById("total").innerText = total.toFixed(2);

  let sorted = Object.entries(burns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  let list = document.getElementById("leaderboard");
  list.innerHTML = "";

  sorted.forEach(([wallet, amt]) => {
    let li = document.createElement("li");
    li.innerText = wallet.slice(0,6) + "..." + " - " + amt.toFixed(2);
    list.appendChild(li);
  });
}

fetchBurns();
