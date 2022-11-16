// on declare la constante productID qui est l'id du produit présent dans l'URL
const productId = window.location.search.split("?").join("");
// verifier url search params
// on fetch le produit en particulier en se servant de son id
fetch(`http://localhost:3000/api/products/${productId}`)
  .then(function (res) {
    return res.json();
  })
  .then(function (product) {
    // on declare les constantes qui permettront d'afficher les différentes infos du produit
    const image = `
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              `;
    const titre = product.name;
    const prix = product.price;
    const des = product.description;
    let HTMLColors = `
              <option value="">--SVP, choisissez une couleur --</option>`;
    // on utilise forEach pour afficher les differentes couleur dans le tableau déroulant
    product.colors.forEach((color) => {
      HTMLColors += `
                <option value="${color}">${color}</>
                `;
    });

    // on integre les differentes constante dans les balises souhaités
    document.querySelector(".item__img").innerHTML = image;
    document.getElementById("title").innerHTML = titre;
    document.getElementById("price").innerHTML = prix;
    document.getElementById("description").innerHTML = des;
    document.getElementById("colors").innerHTML = HTMLColors;

    // on declare quantity et color pour récuperer les donnés entrées par l'utilisateur
    let quantity = document.getElementById("quantity");
    let color = document.getElementById("colors");

    // on declare addCart l'element button
    const addCart = document.getElementById("addToCart");

    // on declare cart la constante dont le contenu est envoyé dans le local storage converti en format JSON
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // on declare la variable productCart qui stockera les nouvelles informations à envoyer dans cart

    // ne pas utiliser object assign + utiliser fetch dans l'autre fichier js
    // on declare la function addToCart qui tri les données selectionnées par l'utilisateur et les ajoute dans cart
    function filterCart() {
      // on declare la const produitCart qui contient les valeurs à collecter pour la variable productCart
      const productCart = {
        couleurSelection: color.value,
        nombre: quantity.value,
        id: product._id,
      };
      // on met les conditions d'affichage d'alert
      if (color.value == 0 && quantity.value == 0) {
        alert(
          "Veuillez choisir une couleur\rVeuillez choisir un nombre d'article compris entre 1 & 100"
        );
      } else if (color.value == 0 && quantity.value !== 0) {
        alert("Veuillez choisir une couleur");
      } else if (color.value !== 0 && quantity.value == 0) {
        alert("Veuillez choisir un nombre d'article compris entre 1 & 100");
      } else {
        alert(
          `Le canapé ${product.name} ${color.value} a été ajouté en ${quantity.value} exemplaire à votre panier`
        );
        // on verifie que le produit n'est pas deja présent dans cart
        for (i = 0; i < cart.length; i++) {
          if (
            cart[i]._id == productCart._id &&
            cart[i].couleurSelection == productCart.couleurSelection
          ) {
            // si c'est le cas alors on se contente d'additionner les quantités
            return (
              (nombreP = parseInt(cart[i].nombre)),
              (nombreS = parseInt(productCart.nombre)),
              (cart[i].nombre = nombreP += nombreS)
            );
          }
        }
        // après avoir verifié ces conditions on integre productCart dans cart via la function declaré plus bas
        addToCart(productCart);
      }
    }

    // on déclare la fonction addToCart qui permet d'envoyer la commande dans le tableau cart
    function addToCart(a) {
      cart.push(a);
    }

    // on declare click qui reprend addToCart pour ensuite envoyer le contenu dans le localStorage
    function click() {
      filterCart();
      // on integre le contenu de cart dans le local storage
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    // on ajoute l'evenement click avec la function click
    addCart.addEventListener("click", click);
  });
