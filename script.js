
/* =====================================
   PFK QUIZ
   KONFIGURACJA PIOSENEK
===================================== */

// DODAWANIE NOWYCH PIOSENEK:
// Wystarczy dopisać kolejną pozycję.

const piosenki = [
    { plik: "piosenki/piosenka1.mp3", tytul: "Aż Strach Pomyśleć" },
    { plik: "piosenki/piosenka2.mp3", tytul: "Chwile Ulotne" },
    { plik: "piosenki/piosenka3.mp3", tytul: "Ja to Ja" },
    { plik: "piosenki/piosenka4.mp3", tytul: "Jestem Bogiem" },
    { plik: "piosenki/piosenka5.mp3", tytul: "Nowiny" },
    { plik: "piosenki/piosenka6.mp3", tytul: "Priorytety" },
    { plik: "piosenki/piosenka7.mp3", tytul: "Rób Co Chcesz" },
    { plik: "piosenki/piosenka8.mp3", tytul: "Play + Rec" },
    { plik: "piosenki/piosenka9.mp3", tytul: "C.D. Kinematografii" },
    { plik: "piosenki/piosenka10.mp3", tytul: "Dla Pewnego Swego" },
    { plik: "piosenki/piosenka11.mp3", tytul: "Mechaniczna Pomarańcza" }
];


/* =====================================
   ZMIENNE
===================================== */

let wybranyCzas = 0;
let aktualnaPiosenka = null;

let poprzedniIndeks = -1;

let wynik = 0;
let odpowiedzSprawdzona = false;

let timerOdtwarzania = null;
let numerOdtwarzania = 0;


/* =====================================
   ELEMENTY HTML
===================================== */

const audio = document.getElementById("audio-player");

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


/* =====================================
   WYBÓR CZASU
===================================== */

przyciskiCzasu.forEach(przycisk => {

    przycisk.addEventListener("click", () => {

        przyciskiCzasu.forEach(p =>
            p.classList.remove("selected")
        );

        przycisk.classList.add("selected");

        wybranyCzas = Number(przycisk.dataset.time);

    });

});


/* =====================================
   ZATRZYMYWANIE AUDIO
===================================== */

function zatrzymajAudio() {

    numerOdtwarzania++;

    if (timerOdtwarzania !== null) {

        clearTimeout(timerOdtwarzania);

        timerOdtwarzania = null;

    }

    audio.pause();

    try {

        audio.currentTime = 0;

    } catch (error) {}

}


/* =====================================
   LOSOWANIE PIOSENKI
   BEZ POWTÓREK POD RZĄD
===================================== */

function wylosujPiosenke() {

    if (piosenki.length === 0) {

        aktualnaPiosenka = null;

        wynikTekst.textContent = "Brak piosenek w bazie!";

        return;

    }

    let dostepneIndeksy = piosenki.map(
        (piosenka, indeks) => indeks
    );

    // Usuwamy tylko poprzednią piosenkę.

    if (piosenki.length > 1) {

        dostepneIndeksy =
            dostepneIndeksy.filter(
                indeks => indeks !== poprzedniIndeks
            );

    }

    const losowyIndeks =
        dostepneIndeksy[
            Math.floor(
                Math.random() * dostepneIndeksy.length
            )
        ];

    aktualnaPiosenka = piosenki[losowyIndeks];

    poprzedniIndeks = losowyIndeks;

}


/* =====================================
   OCZEKIWANIE NA AUDIO
===================================== */

function czekajNaAudio(zdarzenie, limit = 10000) {

    return new Promise((resolve, reject) => {

        const timeout = setTimeout(() => {

            wyczysc();

            reject(new Error("Przekroczono czas ładowania audio."));

        }, limit);

        function zakoncz() {

            wyczysc();

            resolve();

        }

        function blad() {

            wyczysc();

            reject(new Error("Błąd ładowania pliku audio."));

        }

        function wyczysc() {

            clearTimeout(timeout);

            audio.removeEventListener(zdarzenie, zakoncz);

            audio.removeEventListener("error", blad);

        }

        audio.addEventListener(zdarzenie, zakoncz, {
            once: true
        });

        audio.addEventListener("error", blad, {
            once: true
        });

    });

}


/* =====================================
   LOSOWY FRAGMENT PIOSENKI
===================================== */

async function odtworzFragment() {

    if (!aktualnaPiosenka) return;

    zatrzymajAudio();

    const mojeOdtwarzanie = numerOdtwarzania;

    audio.src = aktualnaPiosenka.plik;

    audio.preload = "auto";

    audio.volume = 1;

    try {

        audio.load();

        // Czekamy na załadowanie informacji o utworze.

        if (audio.readyState < 1) {

            await czekajNaAudio("loadedmetadata");

        }

        if (mojeOdtwarzanie !== numerOdtwarzania) return;

        const dlugosc = audio.duration;

        // Losujemy moment rozpoczęcia fragmentu.

        let maksymalnyStart = dlugosc - wybranyCzas;

        if (
            !Number.isFinite(maksymalnyStart) ||
            maksymalnyStart < 0
        ) {

            maksymalnyStart = 0;

        }

        const losowyStart =
            Math.random() * maksymalnyStart;

        audio.currentTime = losowyStart;

        // Czekamy, aż fragment będzie gotowy do odtworzenia.

        if (audio.readyState < 3) {

            await czekajNaAudio("canplay");

        }

        if (mojeOdtwarzanie !== numerOdtwarzania) return;

        await audio.play();

        if (mojeOdtwarzanie !== numerOdtwarzania) return;

        // Zatrzymujemy po wybranym czasie.

        timerOdtwarzania = setTimeout(() => {

            if (mojeOdtwarzanie !== numerOdtwarzania) return;

            audio.pause();

            try {

                audio.currentTime = 0;

            } catch (error) {}

            timerOdtwarzania = null;

        }, wybranyCzas * 1000);

    } catch (error) {

        if (mojeOdtwarzanie !== numerOdtwarzania) return;

        if (error.name === "AbortError") return;

        console.error("Błąd odtwarzania:", error);

        wynikTekst.textContent =
            "⚠️ Nie udało się odtworzyć muzyki.";

    }

}


/* =====================================
   NORMALIZACJA ODPOWIEDZI
===================================== */

function normalizujTekst(tekst) {

    return tekst
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");

}


/* =====================================
   NOWA RUNDA
===================================== */

function rozpocznijRunde() {

    zatrzymajAudio();

    odpowiedzSprawdzona = false;

    poleOdpowiedzi.value = "";

    wynikTekst.textContent = "";

    wylosujPiosenke();

    if (!aktualnaPiosenka) return;

    odtworzFragment();

    poleOdpowiedzi.focus();

}


/* =====================================
   START
===================================== */

startButton.addEventListener("click", () => {

    if (wybranyCzas === 0) {

        alert("Najpierw wybierz 1, 5 albo 10 sekund!");

        return;

    }

    startScreen.style.display = "none";

    gameScreen.style.display = "block";

    rozpocznijRunde();

});


/* =====================================
   SPRAWDZANIE ODPOWIEDZI
===================================== */

przyciskZgaduj.addEventListener("click", () => {

    if (!aktualnaPiosenka) return;

    if (odpowiedzSprawdzona) {

        wynikTekst.textContent =
            "Najpierw kliknij „Kolejna piosenka”.";

        return;

    }

    const odpowiedz =
        normalizujTekst(poleOdpowiedzi.value);

    if (odpowiedz === "") {

        wynikTekst.textContent =
            "Wpisz tytuł piosenki!";

        return;

    }

    const poprawnaOdpowiedz =
        normalizujTekst(aktualnaPiosenka.tytul);

    if (odpowiedz === poprawnaOdpowiedz) {

        wynik++;

        wynikPunkty.textContent = wynik;

        wynikTekst.textContent =
            "🎉 DOBRZE! +1 punkt";

    } else {

        wynik = 0;

        wynikPunkty.textContent = 0;

        wynikTekst.textContent =
            "✨ TWOJE PUNKTY ZNIKNĘŁY JAK MAGIK! ✨ " +
            "Poprawna odpowiedź: " +
            aktualnaPiosenka.tytul;

    }

    odpowiedzSprawdzona = true;

});


/* =====================================
   ENTER = ZGADUJ
===================================== */

poleOdpowiedzi.addEventListener("keydown", event => {

    if (event.key === "Enter") {

        przyciskZgaduj.click();

    }

});


/* =====================================
   KOLEJNA PIOSENKA
===================================== */

nextButton.addEventListener("click", () => {

    if (wybranyCzas === 0) return;

    rozpocznijRunde();

});


/* =====================================
   COFNIJ DO WYBORU CZASU
===================================== */

backButton.addEventListener("click", () => {

    zatrzymajAudio();

    audio.removeAttribute("src");

    audio.load();

    aktualnaPiosenka = null;

    odpowiedzSprawdzona = false;

    poleOdpowiedzi.value = "";

    wynikTekst.textContent = "";

    gameScreen.style.display = "none";

    startScreen.style.display = "block";

    // Wynik pozostaje zachowany.
    // Poprzednia piosenka również pozostaje zapamiętana.

});


/* =====================================
   URUCHOMIENIE
===================================== */

console.log("PAKTO QUIZ uruchomiony poprawnie.");

console.log("Liczba piosenek:", piosenki.length);
