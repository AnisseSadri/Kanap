// on va recuperer les données de l'API
fetch("http://localhost:3000/api/products")
  .then(function (res) {
    // on retourne en reponse.json
    return res.json();
  })
  // on retourne en canape
  .then(function (couches) {
    // on integre les articles dans l'id selectionné
    const items = document.getElementById("items");
    // on utilise forEach pour appliquer la meme chose à chaque produit de l'API
    couches.forEach(function (couch) {
      const linkElement = document.createElement("a");
      linkElement.href = `./product.html?${couch._id}`;

      const articleElement = document.createElement("article");

      const imageElement = document.createElement("img");
      imageElement.src = couch.imageUrl;
      imageElement.alt = couch.altTxt;

      const nomElement = document.createElement("h3");
      nomElement.classList = "productName";
      nomElement.innerText = couch.name;

      const descriptionElement = document.createElement("p");
      descriptionElement.classList = "productDescription";
      descriptionElement.innerText = couch.description;

      items.appendChild(linkElement);

      linkElement.appendChild(articleElement);

      articleElement.appendChild(imageElement);
      articleElement.appendChild(nomElement);
      articleElement.appendChild(descriptionElement);
    });
  });
