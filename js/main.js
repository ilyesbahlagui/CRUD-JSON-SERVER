



// variable gloabal
let iNbInput = 0;
let aRecette = [];
let idRecette;

// declenche au chargement de la page
window.addEventListener('load', () => {
    getRecette();
});

// Fonction dynamique qui appel le serveur selon les requetes qu'on veut faire
function callServeur(url, objet, method) {
    const requestOptions = {
        "method": method,
        "headers": { 'Content-Type': 'application/json' },
        "body": JSON.stringify(objet)
    };
    fetch(url, requestOptions)
        .then(response => response.json())
}


// Appel Fetch pour recuperer les données json
function getRecette() {
    fetch("http://localhost:3000/receipes")
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error('URL inaccessible');
        }
        )
        .then(data => generateRecette(data))
        .catch(e => {
            let affichage = document.querySelector("#result");
            affichage.innerHTML = "<h2>Impossible de récupérer les résultats</h2> : " + e;
        });
}

// Genere l'affichage
function generateRecette(json) {
    aRecette = json;
    console.log(json);
    for (let i = 0; i < json.length; i++) {
        let sHtml = `<div class="col-6"><h2>${json[i].name}</h2><p>${json[i].description}</p><p>Pour ${json[i].nb_part} personne(s)</p><p><a href="${json[i].link}">Lien de la video </a></p>`;
        sHtml += '<table class="mb-2"><tr><th>Ingrédient</th><th>Quantitée</th></tr>';
        for (let j = 0; j < json[i].ingredients.length; j++) {
            sHtml += `<tr> <td>${json[i].ingredients[j].name}</td><td>${json[i].ingredients[j].quantity}${json[i].ingredients[j].unit}</td></tr>`;
        }
        sHtml += `</table><button onclick="getValueRecette(${i})" class="btn btn-primary me-2 "><i class="fa-solid fa-pen-to-square me-2"></i>Modifier</button><button onclick="getIdDelete(${i})" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="fa-solid fa-trash me-2"></i>Supprimer</button></div>`;
        document.getElementById("recette").innerHTML += sHtml;

    }

}

// Recupere les valeurs
function getValueRecette(id) {
    idRecette = id;
    document.getElementById("add_ingredient").innerHTML = "";
    document.getElementById("nom_recette").value = aRecette[id].name;
    document.getElementById("nb_part").value = aRecette[id].nb_part;
    document.getElementById("lien").value = aRecette[id].link;
    document.getElementById("description").value = aRecette[id].description;
    document.getElementById("btn-add-input").classList.add("hide");
    document.getElementById("btn-add").classList.add("hide");
    document.getElementById("btn-add-modif").classList.remove("hide");
    document.getElementById("btn-annule").classList.remove("hide");
    iNbInput = 0;
    for (let j = 0; j < aRecette[id].ingredients.length; j++) {
    let sHtml = `<div class="mb-3 "><label for="nom_ingredient${iNbInput}" class="form-label">Nom </label><input type="text" class="form-control" id="nom_ingredient${iNbInput}"></div><div class="mb-3"<label for="quantite${iNbInput}" class="form-label">Quantitée</label><input type="text" class="form-control" id="quantite${iNbInput}"></div><div class="mb-3"<label for="unitee${iNbInput}" class="form-label">Unitée</label><input type="text" class="form-control" id="unitee${iNbInput}"></div>`;
       
        // let sHtml = `<div class="mb-3 "><label for="nom_ingredient${iNbInput}" class="form-label">Nom </label><input type="text" class="form-control" id="nom_ingredient${iNbInput}"></div><div class="mb-3"<label for="quantite${iNbInput}" class="form-label">Quantitée</label><input type="text" class="form-control" id="quantite${iNbInput}"></div>`;
        console.log(sHtml);
        console.log(iNbInput);
        document.getElementById("add_ingredient").innerHTML += sHtml;
        iNbInput++;
    }
    for (let i = 0; i < aRecette[id].ingredients.length; i++) {
        document.getElementById("nom_ingredient" + i).value = aRecette[id].ingredients[i].name;
        document.getElementById("quantite" + i).value = aRecette[id].ingredients[i].quantity ;
        document.getElementById("unitee" + i).value = aRecette[id].ingredients[i].unit;
    }

    iNbInput = 0;

}
// vide les champs et remet tout comme avant
function Empty() {
     document.getElementById("nom_recette").value = "";
    document.getElementById("nb_part").value = "";
     document.getElementById("lien").value = "";
    document.getElementById("description").value = "";
    document.getElementById("add_ingredient").innerHTML = '<div class="mb-3 me-2"><label for="nom_ingredient" class="form-label">Nom </label><input type="text" class="form-control" id="nom_ingredient"></div><div class="mb-3"> <label for="quantite" class="form-label">Quantitée</label><input type="text" class="form-control" id="quantite"></div> <div class="mb-3"> <label for="unitee" class="form-label">Unitée</label><input type="text" class="form-control" id="unitee"></div>';
    document.getElementById("btn-add-input").classList.remove("hide");
    document.getElementById("btn-add").classList.remove("hide");
    document.getElementById("btn-add-modif").classList.add("hide");
    document.getElementById("btn-annule").classList.add("hide");

}
// modifie une recette
function modifRecette() {
    let id = idRecette;
    let nom = document.getElementById("nom_recette").value;
    let nb_part = document.getElementById("nb_part").value;
    let lien = document.getElementById("lien").value;
    let descritpion = document.getElementById("description").value;
    let ingredients = [];
    for (let i = 0; i < iNbInput; i++) {
        ingredients[i] = {};
        ingredients[i]["name"] = document.getElementById("nom_ingredient" + i).value;
        ingredients[i]["quantity"] = document.getElementById("quantite" + i).value;
        ingredients[i]["unit"] = document.getElementById("unitee" + i).value

    }
    console.log(ingredients);
    let objet = {
        "id": id,
        "name": nom,
        "nb_part": nb_part,
        "description": descritpion,
        "link": lien,
        "ingredients": ingredients
    }
    callServeur('http://localhost:3000/receipes/' + id, objet, 'PUT');
}
// ajoute une recette

function addRecette() {
    let nom = document.getElementById("nom_recette").value;
    let nb_part = document.getElementById("nb_part").value;
    let lien = document.getElementById("lien").value;
    let descritpion = document.getElementById("description").value;
    let ingredients = [];
    if (iNbInput == 0) {
        ingredients[0] = {};
        ingredients[0]["name"] = document.getElementById("nom_ingredient").value;
        ingredients[0]["quantity"] = document.getElementById("quantite").value;
        ingredients[0]["unit"] = document.getElementById("unitee").value;
    } else {
        for (let i = 0; i < iNbInput; i++) {
            ingredients[i] = {};
            ingredients[i]["name"] = document.getElementById("nom_ingredient" + i).value;
            ingredients[i]["quantity"] = document.getElementById("quantite" + i).value;
            ingredients[i]["unit"] = document.getElementById("unitee" + i).value;

        }
    }

    console.log(ingredients);
    let objet = {
        "id": aRecette.length,
        "name": nom,
        "nb_part": nb_part,
        "description": descritpion,
        "link": lien,
        "ingredients": ingredients
    }
    callServeur('http://localhost:3000/receipes', objet, 'POST');
}
// recupere l'id a supprimer
function getIdDelete(id) {
    idRecette = id;
}
// Supprimer Recette
function deleteRecette() {
    for (array of aRecette) {
        if (array.id == idRecette) {

            callServeur('http://localhost:3000/receipes/' + idRecette, array, 'DELETE');

        }
    }
}
// input dynamique
function inputDynamique() {

    let sHtml = `<div class="mb-3 "><label for="nom_ingredient${iNbInput}" class="form-label">Nom </label><input type="text" class="form-control" id="nom_ingredient${iNbInput}"></div><div class="mb-3"<label for="quantite${iNbInput}" class="form-label">Quantitée</label><input type="text" class="form-control" id="quantite${iNbInput}"></div><div class="mb-3"<label for="unitee${iNbInput}" class="form-label">Unitée</label><input type="text" class="form-control" id="unitee${iNbInput}"></div>`;
    document.getElementById("add_ingredient").innerHTML += sHtml;
    iNbInput++;

    console.log(sHtml);
}
