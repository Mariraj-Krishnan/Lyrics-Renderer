const audio = document.querySelector("audio");

audio.onprogress = () => {
  audio.addEventListener("canplaythrough", () => {
    audio.classList.add("loaded");
    document.querySelector("h3").classList.add("loaded");
  });
};

fetch("./lyrics2.lrc")
  .then((res) => res.text())
  .then((data) => {
    lyricsHandler(data);
  });

const lines = [];
const timing = [];
const container = document.querySelector("h2");
const colors = ['deepskyblue', 'orange', 'tomato', 'palevioletred'];
  
function lyricsHandler(lyrics) {
  const match = lyrics.match(/\[[0-9][0-9]:[0-9][0-9].[0-9][0-9]\]/g);
  match.forEach((element, index) => {
    const time =
      Number(element.substr(1, 2)) * 60000 +
      Number(element.substr(4, 2)) * 1000 +
      Number(element.substr(7, 2)) * 10;
    timing.push(time);
    if (index === match.length - 1)
      lines.push(lyrics.substring(lyrics.indexOf(element) + 10, lyrics.length));
    else
      lines.push(
        lyrics.substring(
          lyrics.indexOf(element) + 10,
          lyrics.indexOf(match[index + 1])
        )
      );
  });
}

let lineIndex;
let timeOutId = [];
let played;
let delay;

audio.addEventListener("play", () => {
  timeOutId = [];
  delay = 0;
  lineIndex =
    timing.findIndex((el) => {
      return el > audio.currentTime * 1000;
    }) - 1;
  if (
    Math.floor(audio.currentTime * 1000) == Math.floor(audio.duration * 1000)
  ) {
    lineIndex = 0;
    delay = 0;
    played = false;
  }
  if (lineIndex < 0) container.textContent = "";
  else container.textContent = lines[lineIndex];
  if (played) {
    delay =
      timing[lineIndex + 1] -
      (timing[lineIndex + 1] - audio.currentTime * 1000);
  }
  for (let i = lineIndex + 1; i < timing.length; i++) {
    timeOutId.push(
      window.setTimeout(() => {
        document.body.style.backgroundColor = colors[Math.floor(Math.random()*5)];
        container.textContent = lines[i];
      }, timing[i] - delay)
    );
  }
  played = true;
});
audio.addEventListener("pause", () => {
  let id = window.setTimeout(() => {}, 0);
  while (id) {
    window.clearTimeout(id);
    id--;
  }
  timeOutId = [];
});
audio.addEventListener("seeking", () => {
  played = true;
});
