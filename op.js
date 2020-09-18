let db = firebase.database();
const Container = document.querySelector("#Container");
const containerN = document.querySelector(".containerN");
let contSondaggi = [];
let contSondaggiB, contSondaggiA, preSondaggi, btnScelta, indexSondaggioInEsame = 0, btnInviaScelta;

document.cookie = 'domain=http://google.com/; samesite=none; secure';


db.ref("Sondaggi").once("value").then((snap) => {
  let sond, keys = [];
  snap.forEach((son) => {
    sond = son.val();
    keys.push(son.key);
    let sondaggio = document.createElement("div");
    sondaggio.classList.add("contSondaggio");
    contSondaggi.push(sondaggio);
    Container.appendChild(sondaggio);

    let opz = "";
    sond.Opzioni.forEach((o) => { opz += `<a class="btnOpzioni btnUnselected btnSond${indexSondaggioInEsame}" href="javascript:void(0)">${o}</a>` });

    sondaggio.innerHTML = `<div class="beforeS"></div><div class="preSondaggio"><h2 class="titolo&giorno">Sondaggio</br>~ ${sond.Data} ~</h2></div><div class="sondaggio"><h2 class="titSondaggio">${sond.Titolo}</h2><p class="infoSondaggio">${sond.Descrizione}</p><div class="contOpzioni">${opz}</div><div class="contInviaScelta"><a href="javascript:void(0)" class="inviaScelta">Invia</a><div class="bdr bdr1"></div><div class="bdr bdr2"></div><div class="bdr bdr3"></div><div class="bdr bdr4"></div></div></div><div class="afterS"></div>`;

    btnSelecting(document.querySelectorAll(`.btnSond${indexSondaggioInEsame}`));

    indexSondaggioInEsame++;
  });
  contSondaggiB = document.querySelectorAll(".beforeS");
  contSondaggiA = document.querySelectorAll(".afterS");
  preSondaggi = document.querySelectorAll(".preSondaggio");
  btnScelta = document.querySelectorAll(".btnOpzioni");
  btnInviaScelta = document.querySelectorAll(".contInviaScelta");
  toggleSond();



  firebase.auth().getRedirectResult().then(function (result) {
    let user = result.user;
    if (user == null) {
      btnInviaScelta.forEach((invio) => {
        invio.addEventListener("click", () => {
          alert("Per effettuare il sondaggio devi accedere \ncon l'account istituzionale! (@ittgiorgi.edu.it)");
        });
      });
    }
    if (result.credential) {
      // This gives you a Google Access Token.
      var token = result.credential.accessToken;
      btnLogin.innerHTML = "LogOut";
      btnLogin.setAttribute("href", "index.html");

      if (user != null) {
        if (user.email.split("@")[1] === "ittgiorgi.edu.it") {
          document.querySelector(".compIn").style.height = "0px";
          db.ref(`Users/${user.uid}`).update({
            Email: user.email,
            Nome: user.displayName,
            uid: user.uid,
            l: user.l,
            photoURL: user.photoURL
          });
        }
        let profilePhoto = document.createElement("img");
        profilePhoto.setAttribute("src", user.photoURL);
        profilePhoto.classList.add("accountImg");
        document.body.appendChild(profilePhoto);


        btnInviaScelta.forEach((invio, i) => {
          invio.addEventListener("click", () => {
            if (user.email.split("@")[1] === "ittgiorgi.edu.it") {
              let btnSceltaS = document.querySelectorAll(`.btnSond${i}`);
              db.ref(`Users/${user.uid}/SondaggiF/Sondaggio${i}`).once("value").then((eff) => {
                if (!eff.val()) {
                  btnSceltaS.forEach((btn, posScelta) => {
                    if (btn.classList.length === 4) {
                      db.ref(`Sondaggi/${keys[i]}/Voti/${posScelta}/${user.uid}`).set({
                        Email: user.email,
                        Nome: user.displayName
                      });
                      db.ref(`Users/${user.uid}/SondaggiF/Sondaggio${i}`).set(true);
                      invio.innerHTML = "Inviato!";
                      invio.classList.add("inviaScelta");
                    }
                  });
                }
                else { alert("Hai già votato a questo sondaggio!") }
              });
            }
            else { alert("Devi accedere \ncon l'account istituzionale! (@ittgiorgi.edu.it)") }
          });
        });

      }
    }
  });
});

const btnLogin = document.querySelector("#btnLogin");

let logged = undefined;
btnLogin.addEventListener("click", () => {
  // Start a sign in process for an unauthenticated user.
  if (logged == undefined) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(function () {
        var provider = new firebase.auth.OAuthProvider('google.com');

        provider.addScope('profile');
        provider.addScope('email');


        return firebase.auth().signInWithRedirect(provider);
      })
      .catch(function (error) {
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
      });
  }
});