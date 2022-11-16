const obj = JSON.parse(localStorage.getItem("obj")) || [];

// on declare promise la constante de la requete POST
const promise = fetch("http://localhost:3000/api/products/order", {
  method: "POST",
  body: JSON.stringify(obj),
  headers: {
    "Content-Type": "application/json",
  },
});
// on recup la reponse
promise.then(async (response) => {
  const orderId = await response.json();
  document.getElementById("orderId").innerHTML = orderId.orderId;
});
// on vide le localStorage
localStorage.removeItem("cart");
localStorage.removeItem("obj");
