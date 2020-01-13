let sondaggi, container, scelte = [], par = [];

function preload() {
  container = select("#container");
}

function setup() {
  noCanvas();

  firebaseInit();
  let database = firebase.database();

  database.ref("Sondaggi").once("value", (DataSondaggi) => {
    sondaggi = DataSondaggi.val();

    if (sondaggi.Attivo) {
      for (let i = 0; i < sondaggi.Opzioni.length; i++) {
        scelte.push(createElement("h2", sondaggi.Opzioni[i]).parent(container));
        scelte[i].addClass("scelte");

        scelte[i].html(`${scelte[i].html()} : ${Object.values(sondaggi.VotiPush[i]).length}`);

        par.push(createElement("p", "").parent(scelte[i]).addClass("hide"));

        let voti = Object.values(sondaggi.VotiPush[i]);
        for (let j = 0; j < Object.values(sondaggi.VotiPush[i]).length; j++) {
          // SCRIVE I VOTANTI
          par[i].html(`${par[i].html()}${voti[j]}<br>`);

          // AGGIUNGE L'EVENT LISTENER DELLA VIEW VOTANTI
          scelte[i].mouseClicked(() => {
            par[i].toggleClass("hide");
          });
        }
      }
    } else {
      createElement("h2", "⊘ Nessun sondaggio attivo.").parent(container).addClass("scelte");
    }
  }, () => { console.log("errSondaggi"); });
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
