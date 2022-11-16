// on nomme cart la variable qui contient soit le contenu dans local storage converti du JSON en objet js soi un tableau vide
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// on va chercher l'id où il faudra integrer les articles
const panier = document.getElementById("cart__items");
// on declare la variable panierHTML qui sera modifié par le nombre d'article
let panierHTML = "";
// on utilise forEach pour appliquer la meme chose à chaque produit du pannier
cart.forEach((elt) => {
  const cartId = elt.id;
  const cartColor = elt.couleurSelection;

  panierHTML += `
  <article class="cart__item" data-id="${cartId}" data-color="${cartColor}">
                  <div class="cart__item__img">
                    <img src="" alt="">
                  </div>
                  <div class="cart__item__content">
                    <div class="cart__item__content__description">
                      <h2></h2>
                      <p></p>
                      <p>€</p>
                    </div>
                    <div class="cart__item__content__settings">
                      <div class="cart__item__content__settings__quantity">
                        <p>Qte : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100">
                      </div>
                      <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                      </div>
                    </div>
                  </div>
                </article>
  
  `;

  panier.innerHTML = panierHTML;
});

const cartItem = document.querySelectorAll(".cart__item");
const cartItemImg = document.querySelectorAll(".cart__item__img");
const cartItemDesc = document.querySelectorAll(
  ".cart__item__content__description"
);

for (i = 0; i < cartItem.length; i++) {
  const productId = cartItem[i].dataset.id;
  const productColor = cartItem[i].dataset.color;
  const cartItemImgM = cartItemImg[i];
  const cartItemDescM = cartItemDesc[i];

  let imgHTML = "";
  let titrePCHTML = "";
  fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function (res) {
      // on retourne en reponse.json
      return res.json();
    })
    .then(function (couch) {
      imgHTML += `
        <img src="${couch.imageUrl}" alt="${couch.altTxt}">
        `;
      titrePCHTML += `
        <h2>${couch.name}</h2>
        <p>${productColor}</p>
        <p>${couch.price}€</p>
        `;
      cartItemImgM.innerHTML = imgHTML;
      cartItemDescM.innerHTML = titrePCHTML;
    });
}

// on selectionne tous les buttons des articles
let buttonDelete = document.querySelectorAll(".deleteItem");
for (i = 0; i < buttonDelete.length; i++) {
  // on déclare idCart et colorSelectedCart qui renvoie aux id et couleur selectionnés des objets
  let idCart = cart[i].id;
  let colorSelectedCart = cart[i].couleurSelection;
  // on ajoute un evenement à tous les buttons des articles
  buttonDelete[i].addEventListener("click", () => {
    // on modifie cart en utilisant cart.filter pour supprimer de cart ce qui a été selectionné
    cart = cart.filter(
      (el) => el.id !== idCart || el.couleurSelection !== colorSelectedCart
    );
    // on utilise localStorage.setItem pour modifier ces donnés directement dans le localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    //on charge la page pour faire supprimer l'article de la page
    location.reload(true);
  });
}

// on declare les variables du prix et de la quantité total affiché avec une valeur null au début
let totalQuantityHTML = 0;
let totalPriceHTML = 0;

// on selectionne tous les inputs des produits
let inputValue = document.querySelectorAll(".itemQuantity");
// on selectionne les compartiments où sont affiché le prix et la quantité total
const totalPrice = document.getElementById("totalPrice");
const totalQuantity = document.getElementById("totalQuantity");

// Afficher nombre d'articles + prix total
for (i = 0; i < inputValue.length; i++) {
  const cartId = cart[i].id;
  const cartNombre = cart[i].nombre;

  // On affiche la quantité de chaque article
  inputValue[i].value = cart[i].nombre;
  // += pour ajouter à la suite le nombre de chaque objet, parseint car c'est une chaine de caractère
  totalQuantityHTML += parseInt(cart[i].nombre);
  totalQuantity.innerHTML = totalQuantityHTML;
  // on additione les prix totaux de chaque article
  fetch(`http://localhost:3000/api/products/${cartId}`)
    .then(function (res) {
      // on retourne en reponse.json
      return res.json();
    })
    .then(function (couch) {
      totalPriceHTML += couch.price * cartNombre;
      totalPrice.innerHTML = totalPriceHTML;
    });
}

for (i = 0; i < inputValue.length; i++) {
  const cartI = cart[i];
  const cartId = cart[i].id;
  let inputValueI = inputValue[i].value;
  // Integrer les nouvelles données que l'utilisateur va rentrer
  inputValue[i].addEventListener("change", (e) => {
    fetch(`http://localhost:3000/api/products/${cartId}`)
      .then(function (res) {
        // on retourne en reponse.json
        return res.json();
      })
      .then(function (couch) {
        // On définit quantityI qui est égale à la quantité que l'utilisateur rentre
        let quantityI = parseInt(e.srcElement.value);
        // On modifie le total en ajoutant quantity tout en retirant la valeur de base
        totalQuantityHTML += quantityI - inputValueI;
        totalQuantity.innerHTML = totalQuantityHTML;
        // On fait pareil pour le prix
        let couchPrice = parseInt(couch.price);
        totalPriceHTML += couchPrice * quantityI - couchPrice * inputValueI;
        totalPrice.innerHTML = totalPriceHTML;
        // On crée l'object productPannier qui copie l'objet tout en modifiant les valeurs à modifier
        const changeQuantity = Object.assign({}, cartI, {
          nombre: quantityI,
        });
        // on utilise Object assign pour modifier l'object voulu dans cart
        Object.assign(cartI, changeQuantity);
        return (
          (inputValueI = quantityI),
          // on utilise localStorage.setItem pour modifier ces donnés directement dans le localStorage
          localStorage.setItem("cart", JSON.stringify(cart))
        );
      });
    // on change la valeur de base en la quantité entrée
  });
}

// //
// //

// //
// //
// //

const commander = document.getElementById("order");
const getAction = document.querySelector(".cart__order__form");
const fn = document.getElementById("firstName");
const ln = document.getElementById("lastName");
const a = document.getElementById("address");
const c = document.getElementById("city");
const e = document.getElementById("email");

let masque1 = /[^a-zA-Z-\s,]/g;
let masque2 = /[a-zA-Z][@][a-zA-Z]+[.][a-zA-Z]/g;
let masque3 = /[^0-9a-zA-Z-\s,]/g;

fn.addEventListener("input", () => {
  if (fn.value.match(masque1) == null) {
    document.getElementById("firstNameErrorMsg").innerHTML = "";
  } else {
    document.getElementById("firstNameErrorMsg").innerHTML =
      "Entrez un prénom valide";
  }
});

ln.addEventListener("input", () => {
  if (ln.value.match(masque1) == null) {
    document.getElementById("lastNameErrorMsg").innerHTML = "";
  } else {
    document.getElementById("lastNameErrorMsg").innerHTML =
      "Entrez un nom valide";
  }
});

a.addEventListener("input", () => {
  if (a.value.match(masque3) == null) {
    document.getElementById("addressErrorMsg").innerHTML = "";
  } else {
    document.getElementById("addressErrorMsg").innerHTML =
      "Entrez une adresse valide";
  }
});

c.addEventListener("input", () => {
  if (c.value.match(masque1) == null) {
    document.getElementById("cityErrorMsg").innerHTML = "";
  } else {
    document.getElementById("cityErrorMsg").innerHTML =
      "Entrez un nom de ville valide";
  }
});

e.addEventListener("input", () => {
  if (e.value.match(masque2) == null) {
    document.getElementById("emailErrorMsg").innerHTML =
      "Entrez une adresse e-mail valide";
  } else {
    document.getElementById("emailErrorMsg").innerHTML = "";
  }
});

let elementForm = document.querySelector(".cart__order__form");
let elementFormP = elementForm.querySelectorAll("p");
console.log(elementFormP);
let elementFormInput = elementForm.querySelectorAll("input");
console.log(elementFormInput);
for (i = 0; i < elementFormInput.length; i++) {
  let elt = elementFormInput[i];
  let eltp = elementFormP[i];
  elt.addEventListener("input", () => {
    if (eltp.innerText != "") {
      getAction.setAttribute("onsubmit", "return false");
    } else if (
      elementFormP[0].innerText == "" &&
      elementFormP[1].innerText == "" &&
      elementFormP[2].innerText == "" &&
      elementFormP[3].innerText == "" &&
      elementFormP[4].innerText == ""
    ) {
      getAction.removeAttribute("onsubmit");
    }
  });
}

// if ()

// declarer tableau contenant iD
let idProduct = [];
// declarer sendObj variable contenant les données à renvoyé à l'API
let sendObj;
//pour chaque produit -> ajouter l'id dans oldProduct
for (i = 0; i < cart.length; i++) {
  (_id = cart[i].id), idProduct.push(_id);
}

// sendObject qui contient les données entrées par l'utilisateur
function sendObject() {
  sendObj = {
    contact: {
      firstName: fn.value,
      lastName: ln.value,
      address: a.value,
      city: c.value,
      email: e.value,
    },
    products: idProduct,
  };
}

// function getCommander() qui s'active au click qui envoie les infos à l'API
function getCommander() {
  // on appel la fonction qui contient les données entrées par l'utilisateur
  sendObject();
  localStorage.setItem("obj", JSON.stringify(sendObj));
}
// on integre getCommander dans l'evenement click dans le boutton commander
commander.addEventListener("click", getCommander);

getAction.setAttribute("action", "confirmation.html");

if (cart == 0) {
  getAction.style.display = "none";
}
