
let wybranyCzas = 0;
let aktualnaPiosenka = null;
let wynik = 0;
let odpowiedzSprawdzona = false;
let timerOdtwarzania = null;

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

const audio = document.getElementById("audio-player");
const przyciskiCzasu = document.querySelectorAll(".time-button");
const startButton = document.getElementById("start-button");
const startScreen = document.querySelector(".start-screen");
const gameScreen = document.querySelector(".game-screen");
const poleOdpowiedzi = document.getElementById("answer");
const przyciskZgaduj = document.getElementById("guess-button");
const wynikTekst = document.getElementById("result");
const wynikPunkty = document.getElementById("score");
const nextButton = document.getElementById("next-button");
const backButton = document.getElementById("back-button");

// WYBÓR CZASU

przyciskiCzasu.forEach(przycisk => {
    przycisk.addEventListener("click", () => {
        przyciskiCzasu.forEach(p => p.classList.remove("selected"));
        przycisk.classList.add("selected");
        wybranyCzas = Number(przycisk.dataset.time);
    });
});

// ZATRZYMYWANIE AUDIO

function zatrzymajAudio() {
    if (timerOdtwarzania !== null) {
        clearTimeout(timerOdtwarzania);
        timerOdtwarzania = null;
    }

    audio.onloadedmetadata = null;
    audio.oncanplay = null;
    audio.pause();

    try {
        audio.currentTime = 0;
    } catch (error) {}
}

// LOSOWANIE PIOSENKI

function wylosujPiosenke() {
    const numer = Math.floor(Math.random() * piosenki.length);
    aktualnaPiosenka = piosenki[numer];
}

// ODTWARZANIE FRAGMENTU

async function odtworzFragment() {
    if (!aktualnaPiosenka) return;

    zatrzymajAudio();

    audio.src = aktualnaPiosenka.plik;
    audio.preload = "auto";
    audio.volume = 1;

    try {
        audio.load();

        await new Promise((resolve, reject) => {
            if (audio.readyState >= 1) {
                resolve();
                return;
            }

            const timeout = setTimeout(() => {
                reject(new Error("Nie udało się załadować audio."));
            }, 10000);

            audio.addEventListener("loadedmetadata", () => {
                clearTimeout(timeout);
                resolve();
            }, { once: true });

            audio.addEventListener("error", () => {
                clearTimeout(timeout);
                reject(new Error("Błąd ładowania audio."));
            }, { once: true });
        });

        const dlugosc = audio.duration;
        let maksymalnyStart = dlugosc - wybranyCzas;

        if (!Number.isFinite(maksymalnyStart) || maksymalnyStart < 0) {
            maksymalnyStart = 0;
        }

        const losowyStart = Math.random() * maksymalnyStart;
        audio.currentTime = losowyStart;

        await new Promise((resolve, reject) => {
            if (audio.readyState >= 3) {
                resolve();
                return;
            }

            const timeout = setTimeout(() => {
                reject(new Error("Audio nie jest gotowe."));
            }, 10000);

            audio.addEventListener("canplay", () => {
                clearTimeout(timeout);
                resolve();
            }, { once: true });

            audio.addEventListener("error", () => {
                clearTimeout(timeout);
                reject(new Error("Błąd przygotowania audio."));
            }, { once: true });
        });

        await audio.play();

        timerOdtwarzania = setTimeout(() => {
            audio.pause();

            try {
                audio.currentTime = 0;
            } catch (error) {}

            timerOdtwarzania = null;
        }, wybranyCzas * 1000);

    } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Błąd odtwarzania:", error);
        wynikTekst.textContent = "⚠️ Nie udało się odtworzyć muzyki.";
    }
}

// NOWA RUNDA

function rozpocznijRunde() {
    zatrzymajAudio();

    odpowiedzSprawdzona = false;
    poleOdpowiedzi.value = "";
    wynikTekst.textContent = "";

    wylosujPiosenke();
    odtworzFragment();

    poleOdpowiedzi.focus();
}

// START

startButton.addEventListener("click", () => {
    if (wybranyCzas === 0) {
        alert("Najpierw wybierz 1, 5 albo 10 sekund!");
        return;
    }

    startScreen.style.display = "none";
    gameScreen.style.display = "block";

    rozpocznijRunde();
});

// SPRAWDZANIE ODPOWIEDZI

przyciskZgaduj.addEventListener("click", () => {
    if (!aktualnaPiosenka) return;

    if (odpowiedzSprawdzona) {
        wynikTekst.textContent =
            "Najpierw kliknij „Kolejna piosenka”.";
        return;
    }

    const odpowiedz = poleOdpowiedzi.value
        .trim()
        .toLowerCase();

    if (odpowiedz === "") {
        wynikTekst.textContent = "Wpisz tytuł piosenki!";
        return;
    }

    const poprawnaOdpowiedz =
        aktualnaPiosenka.tytul.toLowerCase();

    if (odpowiedz === poprawnaOdpowiedz) {
        wynik++;

        wynikPunkty.textContent = wynik;
        wynikTekst.textContent = "🎉 DOBRZE! +1 punkt";

    } else {
        // MAGICZNY RESET PUNKTÓW

        wynik = 0;
        wynikPunkty.textContent = 0;

        wynikTekst.textContent =
            "✨ TWOJE PUNKTY ZNIKNĘŁY JAK MAGIK! ✨ " +
            "Poprawna odpowiedź: " +
            aktualnaPiosenka.tytul;
    }

    odpowiedzSprawdzona = true;
});

// ENTER = ZGADUJ

poleOdpowiedzi.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        przyciskZgaduj.click();
    }
});

// KOLEJNA PIOSENKA

nextButton.addEventListener("click", () => {
    if (wybranyCzas === 0) return;

    rozpocznijRunde();
});

// COFNIJ

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
});
