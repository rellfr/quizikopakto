let wybranyCzas = 0;
let aktualnaPiosenka = null;
let audio = null;
let wynik = 0;
let odpowiedzSprawdzona = false;

const piosenki = [
    {
        plik: "piosenki/piosenka1.mp3",
        tytul: "Aż Strach Pomyśleć"
    },
    {
        plik: "piosenki/piosenka2.mp3",
        tytul: "Chwile Ulotne"
    },
    {
        plik: "piosenki/piosenka3.mp3",
        tytul: "Ja to Ja"
    },
    {
        plik: "piosenki/piosenka4.mp3",
        tytul: "Jestem Bogiem"
    },
    {
        plik: "piosenki/piosenka5.mp3",
        tytul: "Nowiny"
    },
    {
        plik: "piosenki/piosenka6.mp3",
        tytul: "Priorytety"
    },
    {
        plik: "piosenki/piosenka7.mp3",
        tytul: "Rób Co Chcesz"
    },
    {
        plik: "piosenki/piosenka8.mp3",
        tytul: "Play + Rec"
    },
    {
        plik: "piosenki/piosenka9.mp3",
        tytul: "C.D. Kinematografii"
    },
    {
        plik: "piosenki/piosenka10.mp3",
        tytul: "Dla Pewnego Swego"
    },
    {
        plik: "piosenki/piosenka11.mp3",
        tytul: "Mechaniczna Pomarańcza"
    }
];

const przyciskiCzasu =
    document.querySelectorAll(".time-button");

const startButton =
    document.getElementById("start-button");

const startScreen =
    document.querySelector(".start-screen");

const gameScreen =
    document.querySelector(".game-screen");

const poleOdpowiedzi =
    document.getElementById("answer");

const przyciskZgaduj =
    document.getElementById("guess-button");

const wynikTekst =
    document.getElementById("result");

const wynikPunkty =
    document.getElementById("score");

const nextButton =
    document.getElementById("next-button");

const backButton =
    document.getElementById("back-button");


przyciskiCzasu.forEach(przycisk => {

    przycisk.addEventListener("click", () => {

        przyciskiCzasu.forEach(p => {
            p.classList.remove("selected");
        });

        przycisk.classList.add("selected");

        wybranyCzas =
            Number(przycisk.dataset.time);
    });

});


function rozpocznijPiosenke() {

    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    const numer =
        Math.floor(Math.random() * piosenki.length);

    aktualnaPiosenka =
        piosenki[numer];

    odpowiedzSprawdzona = false;

    poleOdpowiedzi.value = "";
    wynikTekst.textContent = "";

    audio =
        new Audio(aktualnaPiosenka.plik);

    audio.play().catch(error => {

        console.error(error);

        alert(
            "Nie udało się odtworzyć piosenki. Sprawdź nazwę pliku."
        );

    });

    setTimeout(() => {

        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }

    }, wybranyCzas * 1000);

    poleOdpowiedzi.focus();
}


startButton.addEventListener("click", () => {

    if (wybranyCzas === 0) {

        alert(
            "Najpierw wybierz 1, 5 albo 10 sekund!"
        );

        return;
    }

    startScreen.style.display = "none";
    gameScreen.style.display = "block";

    rozpocznijPiosenke();
});


przyciskZgaduj.addEventListener("click", () => {

    if (!aktualnaPiosenka) {
        return;
    }

    if (odpowiedzSprawdzona) {

        wynikTekst.textContent =
            "Najpierw kliknij „Kolejna piosenka”.";

        return;
    }

    const odpowiedz =
        poleOdpowiedzi.value
            .trim()
            .toLowerCase();

    if (odpowiedz === "") {

        wynikTekst.textContent =
            "Wpisz tytuł piosenki!";

        return;
    }

    const poprawnaOdpowiedz =
        aktualnaPiosenka.tytul
            .toLowerCase();

    if (odpowiedz === poprawnaOdpowiedz) {

        wynik++;

        wynikPunkty.textContent =
            wynik;

        wynikTekst.textContent =
            "🎉 DOBRZE! +1 punkt";

    } else {

        wynikTekst.textContent =
            "❌ ŹLE! Poprawna odpowiedź: " +
            aktualnaPiosenka.tytul;
    }

    odpowiedzSprawdzona = true;
});


poleOdpowiedzi.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            przyciskZgaduj.click();
        }

    }
);


nextButton.addEventListener("click", () => {

    if (wybranyCzas === 0) {
        return;
    }

    rozpocznijPiosenke();
});


backButton.addEventListener("click", () => {

    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }

    gameScreen.style.display = "none";
    startScreen.style.display = "block";

    aktualnaPiosenka = null;
    odpowiedzSprawdzona = false;

    poleOdpowiedzi.value = "";
    wynikTekst.textContent = "";
});
