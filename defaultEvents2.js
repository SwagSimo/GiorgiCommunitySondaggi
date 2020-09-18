const btnNav = document.querySelector(".btnN");
const poligonoN = document.querySelector(".polNav");
const containerN = document.querySelector(".containerN");
const containerR = document.querySelector(".containerRis");

document.addEventListener("click", () => {
  containerN.classList.remove("containerNopen");
});
btnNav.addEventListener("click", () => {
  containerN.classList.toggle("containerNopen");
  event.preventDefault();
  event.stopPropagation();
});
poligonoN.addEventListener("click", () => {
  event.preventDefault();
  event.stopPropagation();
});

let db = firebase.database();

// Richiesta dati database e creazione Elementi
db.ref("Sondaggi").once("value").then((snap) => {
  snap.forEach((s) => {
    let sondaggio = s.val();

    const sondagg = document.createElement("div");
    sondagg.classList.add("sondaggioRis");
    containerR.appendChild(sondagg);

    sondagg.innerHTML = `<h2 class="titoloRis">${sondaggio.Titolo}</h2>`;

    const votiRis = document.createElement("div");
    votiRis.classList.add("votiRis");
    sondagg.appendChild(votiRis);

    sondaggio.Opzioni.forEach((opz, i) => {
      const tit = document.createElement("h2");
      tit.classList.add("tit");

      // Creazione Testo Opzioni + Numero Voti
      if(sondaggio.Voti != undefined && sondaggio.Voti[i] != undefined) {
        tit.innerText = opz + " ( " + Object.values(sondaggio.Voti[i]).length + " )";
      } else {
        tit.innerText = opz + " ( 0 )";
      }

      votiRis.appendChild(tit);

      const votanti = document.createElement("div");
      votanti.classList.add("votanti");
      votiRis.appendChild(votanti);
      
      if(sondaggio.Voti != undefined && sondaggio.Voti[i] != undefined) {
        let usersVote = Object.values(sondaggio.Voti[i]);
        usersVote.forEach((userVote) => {
          const vote = document.createElement("p");
          vote.classList.add("users");
          vote.innerText = userVote.Nome;
          votanti.appendChild(vote);
        });
      }

    });

  });

  const sondaggiRis = document.querySelectorAll(".titoloRis");
  const votiRis = document.querySelectorAll(".votiRis");
  const titoloVoti = document.querySelectorAll(".tit");
  const votanti = document.querySelectorAll(".votanti");


  let offset = [];
  sondaggiRis.forEach((sondaggioRis, i) => {
    offset.push(votiRis[i].offsetHeight);
    votiRis[i].style.height = "0px";

    sondaggioRis.addEventListener("click", () => {
      votiRis.forEach((ele, a) => {
        if(a != i) {
          chiudiSlide2();
          ele.style.height = "0px";
          ele.style.overflow = "hidden";
        }
      });
      if(votiRis[i].style.height != `${offset[i]}px`) {
      
        votiRis[i].style.height = `${offset[i]}px`;
        setTimeout(() => {
          if(votiRis[i].style.height != "0px")
            votiRis[i].style.overflow = "visible";
        }, 700);
      }
      else {
        votiRis[i].style.height = "0px";
        votiRis[i].style.overflow = "hidden";
      }
    });
  });

  titoloVoti.forEach((titoloVot, i) => {
    titoloVot.addEventListener("click", () => {

      chiudiSlide(i);

      if(!mobileAndTabletCheck()) {

        if(votanti[i].style.width != `350px`) {

          votanti[i].style.width = `350px`;
          setTimeout(() => {
            if(votanti[i].style.width != "0px") {
              votanti[i].style.overflow = "visible";
              votanti[i].style.transition = "all 0.7s 150ms cubic-bezier(0.77, 0, 0.175, 1)";
            }
          }, 700);

        } else {
          votanti[i].style.transition = "all 0.7s 150ms cubic-bezier(0.77, 0, 0.175, 1)";
          votanti[i].style.width = "0px";
          votanti[i].style.overflow = "hidden";
        }

      } else {

        if(votanti[i].style.width != `45vw`) {

          votanti[i].style.width = `45vw`;
          setTimeout(() => {
            if(votanti[i].style.width != "0px") {
              votanti[i].style.overflow = "visible";
              votanti[i].style.transition = "all 0.7s 150ms cubic-bezier(0.77, 0, 0.175, 1)";
            }
          }, 700);

        } else {
          votanti[i].style.transition = "all 0.7s 150ms cubic-bezier(0.77, 0, 0.175, 1)";
          votanti[i].style.width = "0px";
          votanti[i].style.overflow = "hidden";
        }

      }
    });
  });

  function chiudiSlide(i) {
    votanti.forEach((vot, e) => {
      if(vot.style.width != "0px" && vot.style.width != "" && e != i) {
          vot.style.width = "0px";
          vot.style.overflow = "hidden";
          votanti[i].style.transition = "all 0.7s 850ms cubic-bezier(0.77, 0, 0.175, 1)";
      }
    });
  }
  function chiudiSlide2() {
    votanti.forEach((vot) => {
      if(vot.style.width != "0px" && vot.style.width != "") {
          vot.style.width = "0px";
          vot.style.overflow = "hidden";
      }
    });
  }

});
// ######################################### //

window.mobileAndTabletCheck = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};