let sondaggi, container, scelte = [], voti = [], par = [];

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
      for (let i = 0; i < sondaggi.Voti.length; i++) {
        scelte.push(createElement("h2", sondaggi.Opzioni[i]).parent(container));
        scelte[i].addClass("scelte");

        voti.push(sondaggi.Voti[i]);
        voti[i] = voti[i].split(";");
        voti[i].pop();

        scelte[i].html(`${scelte[i].html()} : ${voti[i].length}`);

        par.push(createElement("p", "").parent(scelte[i]).addClass("hide"));

        for (let j = 0; j < voti[i].length; j++) {
          par[i].html(`${par[i].html()}${voti[i][j]}<br>`);

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