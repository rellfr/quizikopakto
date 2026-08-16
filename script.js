let wybranyCzas = 0;

let aktualnaPiosenka = null;

let wynik = 0;

let odpowiedzSprawdzona = false;


/*
    LISTA PIOSENEK
*/

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


/*
    ELEMENTY STRONY
*/

const audio =
    document.getElementById("audio-player");

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


/*
    WYBÓR CZASU
*/

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


/*
    LOSOWANIE PIOSENKI
*/

function wylosujPiosenke() {

    const numer =
        Math.floor(
            Math.random() * piosenki.length
        );

    aktualnaPiosenka =
        piosenki[numer];

}


/*
    ODTWARZANIE
*/

function odtworzFragment() {

    if (!aktualnaPiosenka) {
        return;
    }


    /*
        Zatrzymujemy poprzedni fragment
    */

    audio.pause();

    audio.currentTime = 0;


    /*
        Ustawiamy nową piosenkę
    */

    audio.src =
        aktualnaPiosenka.plik;


    audio.load();


    /*
        Włączamy dźwięk
    */

    audio.volume = 1;


    /*
        Odtwarzamy po załadowaniu
    */

    audio.oncanplay = () => {

        audio.currentTime = 0;

        const odtwarzanie =
            audio.play();


        if (odtwarzanie !== undefined) {

            odtwarzanie.catch(error => {

                console.error(
                    "Błąd odtwarzania:",
                    error
                );

                wynikTekst.textContent =
                    "⚠️ Przeglądarka nie uruchomiła muzyki.";

            });

        }

    };


    /*
        Zatrzymujemy po wybranym czasie
    */

    setTimeout(() => {

        audio.pause();

        audio.currentTime = 0;

    }, wybranyCzas * 1000);

}


/*
    NOWA RUNDA
*/

function rozpocznijRunde() {

    odpowiedzSprawdzona = false;

    poleOdpowiedzi.value = "";

    wynikTekst.textContent = "";


    wylosujPiosenke();


    odtworzFragment();


    poleOdpowiedzi.focus();

}


/*
    START
*/

startButton.addEventListener("click", () => {

    if (wybranyCzas === 0) {

        alert(
            "Najpierw wybierz 1, 5 albo 10 sekund!"
        );

        return;

    }


    startScreen.style.display =
        "none";

    gameScreen.style.display =
        "block";


    rozpocznijRunde();

});


/*
    SPRAWDZANIE ODPOWIEDZI
*/

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

    }

    else {

        wynikTekst.textContent =
            "❌ ŹLE! Poprawna odpowiedź: " +
            aktualnaPiosenka.tytul;

    }


    odpowiedzSprawdzona = true;

});


/*
    ENTER = ZGADUJ
*/

poleOdpowiedzi.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {

            przyciskZgaduj.click();

        }

    }
);


/*
    KOLEJNA PIOSENKA
*/

nextButton.addEventListener("click", () => {

    if (wybranyCzas === 0) {
        return;
    }


    rozpocznijRunde();

});


/*
    COFNIJ
*/

backButton.addEventListener("click", () => {

    audio.pause();

    audio.currentTime = 0;

    audio.removeAttribute("src");

    audio.load();


    aktualnaPiosenka = null;

    odpowiedzSprawdzona = false;


    poleOdpowiedzi.value = "";

    wynikTekst.textContent = "";


    gameScreen.style.display =
        "none";

    startScreen.style.display =
        "block";

});
