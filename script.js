fetch("./lyrics2.lrc")
  .then((res) => res.text())
  .then((data) => {
    lyricsHandler(data);
  });

const lines = [];
const timing = [];
const audio = document.querySelector("audio");
const container = document.querySelector("h2");

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

  lineIndex = timing.findIndex((el) => {
    return el > audio.currentTime * 1000;
  });

  if (
    Math.floor(audio.currentTime * 1000) == Math.floor(audio.duration * 1000)
  ) {
    lineIndex = 0;
    delay = 0;
    played = false;
  };

  container.textContent = lines[lineIndex];

  if (played)
    delay = audio.currentTime * 1000;

  for (let i = lineIndex + 1; i < timing.length; i++) {
    timeOutId.push(
      window.setTimeout(() => {
        container.textContent = lines[i];
      }, timing[i]+200 - delay)
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
