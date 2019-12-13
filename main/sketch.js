let user, token, Rappr, autorizzato = false, emailAutorizzate = [], classi;
let sondaggi, numScelta, voti = [], voto;

// ELEMENTI DOM
let btnAzione, contOpzioni, sond, preview, face2,
  oggetto, domanda, opzioni = [], invia;

function preload() {
  btnAzione = selectAll(".btnAzione");
  sond = select(".sond");
  preview = select(".preview");
  face2 = select(".fade2");
}

function setup() {
  noCanvas();

  firebaseInit();
  let database = firebase.database();
  console.clear();

  // DOWNLOAD DI TUTTE LE EMAIL AUTORIZZATE
  database.ref("Email").once("value", (DataEmail) => {
    let datEmail = DataEmail.val(); // TUTTE LE EMAIL
    let emailClassi = datEmail.RappresentantiClasse; // EMAIL RAPPR CLASSI
    classi = Object.keys(datEmail["RappresentantiClasse"]); // CLASSI

    for (let i = 0; i < classi.length; i++) {
      emailAutorizzate.push(emailClassi[classi[i]]);
    }

    let emailIstituto = datEmail.RappresentantiIstituto; // EMAIL RAPPR ISTITUTO
    // PUSH DELLE EMAIL DEI RAPPR ISTITUTO
    emailAutorizzate.push(emailIstituto["Cannalire"]);
    emailAutorizzate.push(emailIstituto["Longo"]);
    emailAutorizzate.push(emailIstituto["Micelli"]);
    emailAutorizzate.push(emailIstituto["Pacciolla"]);

  }, () => { console.log("errEmail"); });

  // DOWNLOAD DEI SONDAGGI
  database.ref("Sondaggi").once("value", (DataSondaggi) => {
    sondaggi = DataSondaggi.val();

    for (let i = 0; i < sondaggi.Voti.length; i++) {
      voti.push(sondaggi.Voti[i]);
      voti[i] = voti[i].split(";");
      voti[i].pop();
      console.log(sondaggi.Opzioni[i] + " : " + voti[i].length);
    }
    console.log(voti);

    // VISUALIZZARE INFO DI ACCESSO A SONDAGGIO
    if (sondaggi.LivAutorizzazione === 0) {
      preview.html("✬ Sondaggio " + sondaggi.Data + "</br>Accesso: Tutti");
    }
    else
      if (sondaggi.LivAutorizzazione === 1) {
        preview.html("✬ Sondaggio " + sondaggi.Data + "</br>Accesso: Rappresentanti di classe");
      }
      else
        if (sondaggi.LivAutorizzazione === 2) {
          preview.html("✬ Sondaggio " + sondaggi.Data + "</br>Accesso: Rappresentanti di istituto e professori");
        }

    oggetto = createElement("h2", sondaggi.Oggetto).parent(sond);
    domanda = createElement("p", sondaggi.Domanda).parent(sond);

    contOpzioni = createElement("div").addClass("contOpzioni").parent(sond);

    for (let i = 0; i < sondaggi.Opzioni.length; i++) {
      opzioni.push(createElement("a", sondaggi.Opzioni[i]).parent(contOpzioni));
      opzioni[i].attribute("href", "javascript:void(0)");
      opzioni[i].addClass("unSel");

      opzioni[i].mouseClicked(() => {
        for (let j = 0; j < opzioni.length; j++) {
          opzioni[j].addClass("unSel");
          opzioni[j].removeClass("selOpz");
        }
        opzioni[i].removeClass("unSel");
        opzioni[i].addClass("selOpz");
        numScelta = i;
      });

    }

    invia = createElement("a", "INVIA").parent(sond);
    invia.attribute("href", "javascript:void(0)");
    invia.addClass("invia");



    invia.mouseClicked(() => {
      database.ref(`Sondaggi/Voti/${numScelta}`).set(sondaggi.Voti[numScelta] + Rappr + ";");
      location.reload();
    });

  }, () => { console.log("errSondaggi"); });

  let provider = new firebase.auth.GoogleAuthProvider();
  // CLICK DEL BTN LOGIN E POPUP
  btnAzione[1].mouseClicked(() => {
    if (user === undefined) {
      firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        token = result.credential.accessToken;
        // The signed-in user info.
        user = result.user;
        btnAzione[1].html(user.displayName);
        btnAzione[1].attribute("title", "LOGOUT");

        if (sondaggi.LivAutorizzazione === 0) {
          Rappr = user.displayName;
          if (!(checkInserimento(Rappr)))
            face2.addClass("open");
          else
            preview.html("✬ Sondaggio " + sondaggi.Data + "</br>Il tuo voto: " + voto);
        } else if (sondaggi.LivAutorizzazione === 1) {
          checkUserAutorizzato1(user);
          if (autorizzato === true) {
            if (!(checkInserimento(Rappr)))
              face2.addClass("open");
            else
              preview.html("✬ Sondaggio " + sondaggi.Data + "</br>Il tuo voto: " + voto);
          }
        } else if (sondaggi.LivAutorizzazione === 2) {
          checkUserAutorizzato2(user);
          if (autorizzato === true) {
            if (!(checkInserimento(Rappr)))
              face2.addClass("open");
            else
              preview.html("✬ Sondaggio " + sondaggi.Data + "</br>Il tuo voto: " + voto);
          }
        }
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(errorCode);
        console.log(errorMessage);
        console.log(email);
        console.log(credential);
        // ...
      });
    } else {
      location.reload();
    }
  });
}

function firebaseInit() {
  // Your web app's Firebase configuration
  let firebaseConfig = {
    apiKey: "AIzaSyCXHp1gsr4WnPRT1NqM-3W0WhDu9vZLwK8",
    authDomain: "sondaggiconsiglioistituto.firebaseapp.com",
    databaseURL: "https://sondaggiconsiglioistituto.firebaseio.com",
    projectId: "sondaggiconsiglioistituto",
    storageBucket: "sondaggiconsiglioistituto.appspot.com",
    messagingSenderId: "1070621130329",
    appId: "1:1070621130329:web:c9d380bd31c85038d53b48",
    measurementId: "G-FVCF0DS35E"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}
function checkUserAutorizzato1(user) {
  for (let i = 0; i < emailAutorizzate.length - 4; i++) {
    if (user.email === emailAutorizzate[i]) {
      autorizzato = true;
      Rappr = classi[i];
    }
  }
}
function checkUserAutorizzato2(user) {
  for (let i = emailAutorizzate.length; i > 50; i--) {
    if (user.email === emailAutorizzate[i]) {
      autorizzato = true;
      if (i === 51) { Rappr = "R.I. Cannalire"; }
      else if (i === 52) { Rappr = "R.I. Longo"; }
      else if (i === 53) { Rappr = "R.I. Micelli"; }
      else if (i === 54) { Rappr = "R.I. Pacciolla"; }
    }
  }
}
function checkInserimento(rapp) {
  for (let i = 0; i < voti.length; i++) {
    for (let j = 0; j < voti[i].length; j++) {
      if (rapp === voti[i][j]) {
        voto = sondaggi.Opzioni[i];
        return true;
      }
    }
  }
}