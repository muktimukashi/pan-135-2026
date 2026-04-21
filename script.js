const popup = document.getElementById("popup");
const popupBox = document.getElementById("popupBox");
const introVideo = document.getElementById("introVideo");
const playIntroBtn = document.getElementById("playIntroBtn");
const skipMusicBtn = document.getElementById("skipMusicBtn");
const introStatus = document.getElementById("introStatus");
const videoCaption = document.getElementById("videoCaption");
const mainContent = document.getElementById("mainContent");
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

const fadeElements = document.querySelectorAll(".scroll-fade");

const captionStartTime = 8;
const contentStartTime = 10;
const introFadeDuration = 2200;

let introPlayed = false;
let musicPlaying = false;
let captionShown = false;
let introFinished = false;

function updateMusicButton() {
  if (!musicToggle) return;
  musicToggle.textContent = musicPlaying ? "🔊 Music On" : "🔇 Music Off";
}

async function playMusic() {
  try {
    await bgMusic.play();
    musicPlaying = true;
  } catch (error) {
    console.log("Music gagal diputar:", error);
    musicPlaying = false;
  }
  updateMusicButton();
}

function pauseMusic() {
  bgMusic.pause();
  musicPlaying = false;
  updateMusicButton();
}

function showMainContent() {
  mainContent.classList.remove("hidden");
  mainContent.classList.add("intro-reveal");
  window.scrollTo(0, 0);

  setTimeout(() => {
    mainContent.classList.add("show");
  }, 80);
}

function finishIntro() {
  if (introFinished) return;
  introFinished = true;

  showMainContent();
  popup.classList.add("fade-out");

  setTimeout(() => {
    if (introVideo) introVideo.pause();
    popup.style.display = "none";
  }, introFadeDuration);
}

function showVideoCaption() {
  if (!videoCaption || captionShown) return;
  captionShown = true;
  videoCaption.classList.remove("hidden");
  setTimeout(() => {
    videoCaption.classList.add("show");
  }, 80);
}

async function enterSite(withMusic) {
  if (introPlayed) return;
  introPlayed = true;

  popupBox.classList.add("hide");
  if (videoCaption) videoCaption.classList.remove("show");
  introStatus.classList.add("hidden");
  playIntroBtn.disabled = true;
  if (skipMusicBtn) skipMusicBtn.disabled = true;

  if (withMusic) {
    await playMusic();
  } else {
    pauseMusic();
  }

  try {
    introVideo.currentTime = 0;
    await introVideo.play();
  } catch (error) {
    console.log("Video gagal play:", error);
    finishIntro();
  }
}

playIntroBtn.addEventListener("click", () => enterSite(true));

if (skipMusicBtn) {
  skipMusicBtn.addEventListener("click", () => enterSite(false));
}

if (introVideo) {
  introVideo.addEventListener("timeupdate", () => {
    if (introVideo.currentTime >= captionStartTime) {
      showVideoCaption();
    }

    if (introVideo.currentTime >= contentStartTime) {
      finishIntro();
    }
  });
  introVideo.addEventListener("ended", finishIntro);
  introVideo.addEventListener("error", finishIntro);
}

if (musicToggle) {
  musicToggle.addEventListener("click", async () => {
    if (musicPlaying) {
      pauseMusic();
    } else {
      await playMusic();
    }
  });
}

function handleScrollFade() {
  fadeElements.forEach((element) => {
    element.style.opacity = 1;
    element.style.transform = "none";
  });
}

window.addEventListener("scroll", handleScrollFade);
window.addEventListener("resize", handleScrollFade);
window.addEventListener("load", () => {
  updateMusicButton();
  handleScrollFade();
});
