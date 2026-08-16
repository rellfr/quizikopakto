let wybranyCzas = 0;

let aktualnaPiosenka = null;

let audio = null;

let wynik = 0;

let odpowiedzSprawdzona = false;


/*
    LISTA PIOSENEK

    WAŻNE:
    Nazwy plików muszą być dokładnie takie,
    jak tutaj.
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
    }

];


/*
    ELEMENTY STRONY
*/

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

function rozpocznijPiosenke() {

    /*
        Zatrzymujemy poprzednią piosenkę
    */

    if (audio) {

        audio.pause();

        audio.currentTime = 0;

    }


    /*
        Losujemy piosenkę
    */

    const numer =
        Math.floor(
            Math.random() * piosenki.length
        );


    aktualnaPiosenka =
        piosenki[numer];


    /*
        Nowa runda
    */

    odpowiedzSprawdzona = false;


    poleOdpowiedzi.value = "";

    wynikTekst.textContent = "";


    /*
        Tworzymy audio
    */

    audio =
        new Audio(
            aktualnaPiosenka.plik
        );


    /*
        Odtwarzamy
    */

    audio.play().catch(error => {

        console.error(error);

        alert(
            "Nie udało się odtworzyć piosenki. Sprawdź nazwy plików MP3."
        );

    });


    /*
        Zatrzymanie po wybranym czasie
    */

    setTimeout(() => {

        if (audio) {

            audio.pause();

            audio.currentTime = 0;

        }

    }, wybranyCzas * 1000);


    /*
        Ustawienie kursora
    */

    poleOdpowiedzi.focus();

}


/*
    START GRY
*/

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


/*
    SPRAWDZANIE ODPOWIEDZI
*/

przyciskZgaduj.addEventListener("click", () => {

    if (!aktualnaPiosenka) {

        return;

    }


    /*
        Nie można zdobyć dwóch punktów
        za tę samą piosenkę
    */

    if (odpowiedzSprawdzona) {

        wynikTekst.textContent =
            "Najpierw kliknij „Kolejna piosenka”.";

        return;

    }


    /*
        Pobieramy odpowiedź
    */

    const odpowiedz =
        poleOdpowiedzi.value
            .trim()
            .toLowerCase();


    if (odpowiedz === "") {

        wynikTekst.textContent =
            "Wpisz tytuł piosenki!";

        return;

    }


    /*
        Poprawna odpowiedź
    */

    const poprawnaOdpowiedz =
        aktualnaPiosenka.tytul
            .toLowerCase();


    /*
        SPRAWDZENIE
    */

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


    rozpocznijPiosenke();

});


/*
    COFNIJ
    Wracamy do wyboru czasu
*/

backButton.addEventListener("click", () => {

    /*
        Zatrzymujemy muzykę
    */

    if (audio) {

        audio.pause();

        audio.currentTime = 0;

    }


    /*
        Zmieniamy ekran
    */

    gameScreen.style.display = "none";

    startScreen.style.display = "block";


    /*
        Czyścimy bieżącą rundę
    */

    aktualnaPiosenka = null;

    odpowiedzSprawdzona = false;

    poleOdpowiedzi.value = "";

    wynikTekst.textContent = "";

});