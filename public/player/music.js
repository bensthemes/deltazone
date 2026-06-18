const nodes = {
    playButton: document.getElementById("music-toggle"),
    previousButton: document.getElementById("music-prev"),
    nextButton: document.getElementById("music-next"),
    logoImg: document.getElementById("music-logo"),
    /*logoDisplay: document.getElementById("music-display"),*/
    titleText: document.getElementById("song-name"),
    authorText: document.getElementById("song-uploader"),
    playbackBar: document.getElementById("playback-bar"),
    playbackFill: document.getElementById("playback-fill"),
    volumeArea: document.getElementById("volume-area"),
    volumeIcon: document.getElementById("volume-icon"),
    volumeBar: document.getElementById("volume-bar"),
    volumeFill: document.getElementById("volume-fill"),
    timeText: document.getElementById("playtime")
};

const PLAYLIST_ID = "PLNPMDBGQbEI1rQWhgrTnJjRD1WYWSsXcn";
const params = new URLSearchParams(window.location.search);

const overrideStyle = params.get("style");
// const params = new URLSearchParams(window.location.search);
// const list = params.get("list");
// const overrideStyle = params.get("style");

if(overrideStyle) {
  let style = document.createElement('link');

  style.rel = "stylesheet";
  style.href = overrideStyle;
  
  document.head.appendChild(style);
}

const updateVisibility = () => {
  nodes.volumeArea.style.display = "flex";
  nodes.timeText.style.display = "initial";

  const documentWidth = document.body.getBoundingClientRect().width;
  if(documentWidth < 360) {
    nodes.volumeArea.style.display = "none";
  }

  if(documentWidth < 300) {
    nodes.timeText.style.display = "none";
  }
};

window.addEventListener("load", (event) => {
  updateVisibility();
});
window.addEventListener("resize", (event) => {
  updateVisibility();
});

const imgUrlPlay = {
  play: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_play.png",
  pause: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_pause.png",
  loading: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_load.gif"
};

const imgUrlVolume = {
  normal: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_volume_100.png",
  low: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_volume_50.png",
  lowest: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_volume_20.png",
  mute: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_volume_mute.png"
};

function formatTime(seconds) {
  if(seconds >= 60*60)
    return new Date(seconds * 1000).toISOString().slice(11, 19);
  else
    return new Date(seconds * 1000).toISOString().slice(14, 19);
}

let cachedIcon = imgUrlVolume.normal;

nodes.volumeIcon.addEventListener("click", () => {
  if(player) {
    if(player.isMuted()) {
      player.unMute();

      const volume = player.getVolume();

      if(volume >= 50)
        nodes.volumeIcon.textContent = "🔊";
      else if(volume >= 20)
        nodes.volumeIcon.textContent = "🔉";
      else
        nodes.volumeIcon.textContent = "🔈";

    } else {
      player.mute();
      nodes.volumeIcon.textContent = "🔇";
    }
  }
});

let seeking = false;
nodes.playbackBar.addEventListener("mousedown", (e) => {
  setPlaybackFromMouse(nodes.playbackBar, nodes.playbackFill, e.clientX, false);
  seeking = true;
  clearInterval(videoAutoUpdater);

  const move = (e) => {
    setPlaybackFromMouse(nodes.playbackBar, nodes.playbackFill, e.clientX, false);
  };
  const endMove = (e) => {
    document.documentElement.removeEventListener('mousemove', move, false);
    document.documentElement.removeEventListener('mouseup', endMove, false);
    seeking = false;
    setPlaybackFromMouse(nodes.playbackBar, nodes.playbackFill, e.clientX, true);
  };

  document.documentElement.addEventListener('mousemove', move, false);
  document.documentElement.addEventListener('mouseup', endMove, false);
});

function setPlaybackFromMouse(bar, fill, pointerX, allowSeekAhead) {
  if(!player)
    return;

  var rect = bar.getBoundingClientRect();
  let ratio = (pointerX - rect.left) / rect.width;
  ratio = Math.min(Math.max(ratio, 0), 1);
  let newTime = ratio * player.getDuration();
  
  fill.style.width = (ratio * 100) + "%";
  player.seekTo(newTime, allowSeekAhead);
  nodes.timeText.innerText = formatTime(Math.floor(newTime)) + " / " + formatTime(Math.floor(player.getDuration()));
}

nodes.volumeBar.addEventListener("mousedown", (e) => {
  setVolumeFromMouse(nodes.volumeBar, nodes.volumeFill, e.clientX);

  const move = (e) => {
    setVolumeFromMouse(nodes.volumeBar, nodes.volumeFill, e.clientX);
  };
  const endMove = (e) => {
    document.documentElement.removeEventListener('mousemove', move, false);
    document.documentElement.removeEventListener('mouseup', endMove, false);
  };

  document.documentElement.addEventListener('mousemove', move, false);
  document.documentElement.addEventListener('mouseup', endMove, false);
});

function setVolumeFromMouse(bar, fill, pointerX) {
  var rect = bar.getBoundingClientRect();
  let newVolume = (pointerX - rect.left) / rect.width * 100;
  newVolume = Math.min(Math.max(newVolume, 0), 100);

  fill.style.width = newVolume + "%";

  if(player) {
    player.unMute();
    player.setVolume(newVolume);
  }

  if(newVolume >= 50) {
    nodes.volumeIcon.textContent = "🔊";
  } else if(newVolume >= 20) {
    nodes.volumeIcon.textContent = "🔉";
  } else if(newVolume > 0) {
    nodes.volumeIcon.textContent = "🔈";
  } else {
    nodes.volumeIcon.textContent = "🔇";
  }
  //volumeIcon
}

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '200',
    width: '200',
    playerVars: {
      'playsinline': 1,
      'disablekb': 1,
      'controls': 0,
      'list': PLAYLIST_ID,
      'index': params.has("index") ? params.get("index") : 0,
      'autoplay': params.has("autoplay") ? params.get("autoplay") : 0,
      'loop': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

let shufflePlayPrevent = false;

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.setVolume(10);
  event.target.setLoop(true);

  nodes.volumeFill.style.width = "10%";
  nodes.volumeIcon.src = imgUrlVolume.lowest;
  
  if(params.has("shuffle") ? params.get("shuffle") : 0) {
    player.setShuffle(true);
    player.playVideoAt(0);
    if((params.has("autoplay") ? params.get("autoplay") : 0) == 0) {
      shufflePlayPrevent = true;
      //player.pauseVideo();
      //setTimeout(() => player.pauseVideo(), 1);
    }
  } else {
    updateVideoInfo(event.target.getVideoData());
  }
  
  nodes.playButton.addEventListener('click', function(){
      togglePlay();
  });
  nodes.previousButton.addEventListener('click', function(){
      player.previousVideo();
  });
  nodes.nextButton.addEventListener('click', function(){
      player.nextVideo();
  });

  window.top.postMessage({type:'setWebcamState',animation:'banger',force:true,close:false,focus:false}, location.origin);
  //window.top.postMessage({type:'musicStarted'}, location.origin);
}

let videoAutoUpdater = () => {
  updateTime();
};
// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {

  updateGraphics(event.data);
  if(event.data == YT.PlayerState.PLAYING) {
    setInterval(videoAutoUpdater, 500);
  } else {
    clearInterval(videoAutoUpdater);
  }
  
  if(shufflePlayPrevent && event.data == YT.PlayerState.PLAYING) {
    shufflePlayPrevent = false;
    player.pauseVideo();
  }
}

function togglePlay() {
  if (player.getPlayerState() == YT.PlayerState.PAUSED || player.getPlayerState() == YT.PlayerState.BUFFERING || player.getPlayerState() == YT.PlayerState.CUED) {
    player.playVideo();
  } else if (player.getPlayerState() == YT.PlayerState.PLAYING || player.getPlayerState() == YT.PlayerState.ENDED || player.getPlayerState() == YT.PlayerState.BUFFERING) {
    player.pauseVideo();
  }
};

function updateGraphics(state) {
  if(player.getVideoData().title != undefined)
    updateVideoInfo(player.getVideoData());

  updateTime();

  if(state == YT.PlayerState.PLAYING)
    nodes.playButton.textContent = "⏸";

  if(state == YT.PlayerState.PAUSED)
    nodes.playButton.textContent = "▶";

  if(state == YT.PlayerState.BUFFERING || state == YT.PlayerState.CUED)
    nodes.playButton.textContent = "⋯";
}

function updateTime() {
  if(player && !seeking) {
    nodes.playbackFill.style.width = (player.getCurrentTime() / player.getDuration() * 100) + "%";
    nodes.timeText.innerText = formatTime(Math.floor(player.getCurrentTime())) + " / " + formatTime(Math.floor(player.getDuration()));
  }
}

function updateVideoInfo(info) {
  nodes.titleText.innerText = info.title;
  nodes.authorText.innerText = "Uploaded by " + info.author;
  nodes.logoImg.src = "http://img.youtube.com/vi/" + info.video_id + "/mqdefault.jpg";
  nodes.logoImg.parentNode.href = player.getVideoUrl();
}

window.addEventListener("message", (e) => {
  
  switch (e.data.type) {
    case "style":
      var css = e.data.css,
      head = document.head,
      style = document.createElement('style');
    
      head.appendChild(style);
    
      style.type = 'text/css';
      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
      break;
  }
});