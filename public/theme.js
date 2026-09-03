const themeSelect = document.getElementById("theme-select");

if (themeSelect) {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    themeSelect.value = savedTheme;
  }

  themeSelect.addEventListener("change", () => {
    const theme = themeSelect.value;
    console.log("changed")
    console.log(theme)

    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);

    //stuff for the musicplayer iframe
    const musicPlayer = document.getElementById("music-player");

    if (musicPlayer) {
        musicPlayer.contentDocument.documentElement.dataset.theme = theme;
    }
  });
}