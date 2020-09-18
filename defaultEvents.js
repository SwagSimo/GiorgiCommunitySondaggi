const btnNav = document.querySelector(".btnN");
const poligonoN = document.querySelector(".polNav");
let checkS = [];

document.addEventListener("click", () => {
  containerN.classList.remove("containerNopen");
  contSondaggi.forEach((contSondaggio, i) => {
    if (checkS[i] === false) {
      contSondaggiA[i].classList.remove("afterSopen");
      contSondaggiB[i].classList.remove("beforeSopen");
      preSondaggi[i].style.top = "50%";
      preSondaggi[i].style.transition = "all 0.3s 500ms ease-out";
      contSondaggio.style.cursor = "pointer";
    }
  });
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

function toggleSond() {
  contSondaggi.forEach((contSondaggio, i) => {
    checkS.push("false");

    contSondaggio.addEventListener("mouseover", () => {
      checkS[i] = true;
    });
    contSondaggio.addEventListener("mouseleave", () => {
      checkS[i] = false;
    });

    contSondaggio.addEventListener("click", () => {
      contSondaggiA[i].classList.add("afterSopen");
      contSondaggiB[i].classList.add("beforeSopen");
      preSondaggi[i].style.top = "150%";
      preSondaggi[i].style.transition = "all 0.3s ease-out";
      contSondaggio.style.cursor = "auto";
    });
  });
}

function btnSelecting(objArray) {
  for (let i = 0; i < objArray.length; i++) {
    objArray[i].addEventListener("click", () => {
      objArray.forEach((pulsante) => {
        pulsante.classList.remove("btnSelected");
      });
      objArray[i].classList.add("btnSelected");
    });
  }
}