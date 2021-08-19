// Récupération des url 
const urlMaxImdb = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
const urlFantasy = "http://localhost:8000/api/v1/titles/?genre=fantasy&sort_by=-imdb_score";
const urlAnimation = "http://localhost:8000/api/v1/titles/?genre=animation&sort_by=-imdb_score";
const urlAction = "http://localhost:8000/api/v1/titles/?genre=action&sort_by=-imdb_score";

// film au plus haut score imdb
let title = document.getElementsByClassName('title-best-film')[0];
let abstract = document.getElementsByClassName('abstract')[0];
let img = document.getElementsByClassName('img-best')[0];
let button = document.getElementsByClassName("button")[0];

// Les fenêtres modales
var modal = document.getElementById("modal");
var backgroundModal = document.getElementsByClassName("background-modal")[0];
var body = document.getElementsByTagName("body")[0];

// Croix fermeture fenêtre modale
let closeModal = document.getElementsByClassName("close")[0];
closeModal.onclick = function(){
    modal.style.display = "none";
    backgroundModal.style.display = "none";
    body.style.overflow = "scroll"
}

// Info modal 
let imgModal = document.getElementsByClassName("img-modal")[0]
let textModal = document.getElementsByClassName("modal-txt")[0]

// Fonction pour la durée des films
function timeH(time){
    if (time > 60){
        let hour = Math.floor(time/60);
        let minute = time % 60;
        return hour+"h "+ minute+"min"
    }
    if (time <60){
        return time+"min"
    }
}

// Fonction récupérant 7 films à la suite
function sevenFetch (urltest, className, number=7, deleteFirst= false){
    fetch(urltest)
        .then(function (res){
            if (res.ok){
                return res.json();
            }
        })
        .then(function(value){
            let next = value["next"]
            let nbResults = value["results"].length 
            if (nbResults > 1){
                for(i= 0; i<nbResults; i++ ){
                    if (deleteFirst){
                        deleteFirst=false
                        continue
                    }
                    let img_url = value["results"][i]["image_url"];
                    let section = document.getElementsByClassName(className)[0];
                    newImage = document.createElement("img");
                    newImage.setAttribute("class", "img-film")
                    newImage.setAttribute("src", img_url);
                    newImage.setAttribute("onclick",infoFilm(newImage, value, i))
                    section.appendChild(newImage);
                    number--
                    if (number==0){
                        break
                    }
                }
            }
            if(number>0){
                return sevenFetch(next, className, number)
            }
        })
        .catch(function(err){})
}

// Récupération info meilleurs films selon imdb (film affiche+ 7 suivants)
fetch(urlMaxImdb)
    .then(function (res){
        if (res.ok){
            return res.json();
        }
    })
    .then(function(value){
        let info = value["results"]
        var urlinfo = info[0]["url"];
        img.setAttribute("onclick",infoFilm(img, value, 0))
        button.onclick = infoFilm(button, value, 0)
        fetch(urlinfo)
            .then(function(res){
                if(res.ok){
                    return res.json()
                }
            })
            .then(function(value){
                title.innerHTML = value["title"]
                abstract.innerHTML = value["long_description"]
                img.setAttribute("src", value["image_url"])
            })
            .catch(function(err){})
    })
    .catch(function(err){})

// Récupération des info pour les mieux notés et les genres fantasy, animation et action
sevenFetch(urlMaxImdb,className="sevenBest", number=7, deleteFirst= true)
sevenFetch(urlFantasy, className="fantasy")
sevenFetch(urlAnimation, className="animation")
sevenFetch(urlAction, className="action")

// Fonction pour récupérer les info des films
function infoFilm (element, value, index){
    element.addEventListener("click",function(event){
        modal.style.display = "block"
        backgroundModal.style.display = "block"
        body.style.overflow = "hidden"
        let urlinfo = value["results"][index]["url"]
        fetch(urlinfo)
            .then(function(res){
                if(res.ok){
                    return res.json()
                }
            })
            .then(function(value){
                imgModal.setAttribute("src", value["image_url"])
                textModal.innerHTML ="<em>Titre : </em></br>&emsp;" + value["title"] 
                + "</br><em>Genre(s) : </em></br>&emsp;" + value["genres"]
                +"</br><em>Date de sortie : </em></br>&emsp;" + value["date_published"]
                +"</br><em>Note : </em></br>&emsp;" + value["rated"]
                +"</br><em>Score imdb : </em></br>&emsp;" + value["imdb_score"]
                +"</br><em>Réalisateur : </em></br>&emsp;" + value["directors"]
                +"</br><em>Acteurs : </em></br>&emsp;" + value["actors"]
                +"</br><em>Durée : </em></br>&emsp;" + timeH(value["duration"])
                +"</br><em>Pays d'origine : </em></br>&emsp;" + value["countries"]
                +"</br><em>Score au Box-Office : </em></br>&emsp;" + value["worldwide_gross_income"]
                +"</br><em>Description : </em></br>&emsp;" + value["long_description"]
            })
            .catch(function(err){})
    })
}

// Fonction pour éviter la propagation du clic pour les flèches
let cursorsLeft = document.getElementsByClassName("cursor-left");
for (cursorLeft of cursorsLeft){
    cursorLeft.addEventListener("click", function(event){
        event.stopPropagation();
    })
}
let cursorsRight = document.getElementsByClassName("cursor-right");
for (cursorRight of cursorsRight){
    cursorRight.addEventListener("click", function(event){
        event.stopPropagation();
    })
}

// Fonction pour le défilement latéral(fleches)
let zoneAction = document.getElementsByClassName("action")[0];
let zoneAnimation = document.getElementsByClassName("animation")[0];
let zoneFantasy = document.getElementsByClassName("fantasy")[0];
let bestFilms = document.getElementsByClassName("sevenBest")[0];
function goLeft(zone){
    zone.scrollBy({
        left : -200,
        behavior : "smooth"
    }    
    )  
}
function goRight(zone){
    zone.scrollBy({
        left : 200,
        behavior : "smooth"
    }    
    )  
}
