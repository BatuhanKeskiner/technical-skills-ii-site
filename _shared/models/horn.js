/* ============================================================
   Math Time — week 3.

   His Keynote of 14-09-2026, slide 21: "Add a big red button to
   play this sound." And of 16-09-2026, slide 21: "No title, no
   text, just this button, no 'play' on it. On white. Only make
   this sound available in my admin version, you will add another
   sound to the student version."

   TWO SOUNDS, CHOSEN BY WHICH COPY OF THE PAGE IS OPEN. Settled
   the same day: "öğrenci sürümüne bu sesi koyacaksın", the link
   being the wah wah.
     his working copy - the one with the editor in it - keeps the
       air horn of 14-09:
       https://www.youtube.com/watch?v=UaUa_0qPPgc
       (DJ Airhorn Sound Effect 001 · Troy Pippen, 5 s)
     the built copy - what a student opens - plays:
       https://www.youtube.com/watch?v=1fcZLyshLso
       (Fail Sound Effect, wah wah wah wah · Play Sounds, 5 s)
   The build strips the editor from the page's loader list
   (make-site.py strip_authoring), so "the loader still names
   edit.js" is exactly "this is his copy".

   The film is not copied onto the site. The button loads the
   YouTube player out of sight on the first press and plays it
   from the start on every press. If the player cannot be
   reached (offline, blocked), the button opens the film itself.
   ============================================================ */

const HORN_ADMIN = 'UaUa_0qPPgc';
const HORN_STUDENT = '1fcZLyshLso';

function hornIsAdmin() {
  return [...document.scripts].some((s) => !s.src && /edit\.js/.test(s.textContent || ''));
}

function modelHorn(fig) {
  const HORN_ID = hornIsAdmin() ? HORN_ADMIN : HORN_STUDENT;
  const stage = el('div', 'stage wide');
  fig.prepend(stage);
  /* no word on it: the button is the whole page */
  const btn = el('button', 'horn-btn', '');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Play the sound');
  stage.append(btn);

  /* the player lives off the page's edge: it has to exist to make sound,
     and it has nothing to show */
  const holder = el('div', 'horn-player');
  holder.style.cssText = 'position:fixed;left:-9999px;top:0;width:200px;height:200px;';
  const slot = el('div');
  holder.append(slot);
  document.body.append(holder);

  let player = null, ready = false, wanted = false;

  function api(cb) {
    if (window.YT && window.YT.Player) { cb(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (prev) prev(); cb(); };
    if (!document.querySelector('script[data-yt-api]')) {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.setAttribute('data-yt-api', '');
      s.onerror = fallback;
      document.head.append(s);
    }
  }
  function fallback() {
    window.open('https://www.youtube.com/watch?v=' + HORN_ID, '_blank', 'noopener');
  }
  function build() {
    player = new window.YT.Player(slot, {
      videoId: HORN_ID, width: 200, height: 200,
      host: 'https://www.youtube-nocookie.com',
      playerVars: { controls: 0, disablekb: 1, playsinline: 1, rel: 0 },
      events: {
        onReady: () => { ready = true; if (wanted) play(); },
        onError: fallback,
      },
    });
  }
  function play() {
    wanted = false;
    player.seekTo(0, true);
    player.unMute();
    player.setVolume(100);
    player.playVideo();
  }
  btn.addEventListener('click', () => {
    if (ready) { play(); return; }
    wanted = true;
    if (!player) api(build);
  });

  return { render: () => {} };
}

window.modelHorn = modelHorn;
