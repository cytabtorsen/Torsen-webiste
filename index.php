<?php
declare(strict_types=1);
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$csrf = htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Torsen — Your AI Data Is Worth More Than Nothing</title>
  <meta name="description" content="52 million people run AI locally. They generate the richest training data in existence — and all of it vanishes. Torsen captures it, anonymizes it on-device, and lets you earn from it." />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
</head>
<body>

<canvas id="canvas"></canvas>
<div class="hero-glow" aria-hidden="true"></div>

<div class="page">

  <header>
    <nav class="nav" aria-label="Main navigation">
      <a href="#" class="logo" aria-label="Torsen home">
        <svg class="logo-mark" viewBox="0 0 80 92" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 0 Q0 0 0 12 V14 Q0 0.1 12 6 H34 V38 C34 50 26 52 26 62 V80 Q26 92 14 92 Q2 92 2 80 V16 Q2 4 12 0 Z" fill="#C9A55A"/>
          <path d="M42 0 H64 Q80 0 80 16 V20 Q80 36 64 36 H54 C42 36 42 52 42 66 V0 Z" fill="#C9A55A"/>
        </svg>
        <span class="logo-name">torsen</span>
      </a>
    </nav>
  </header>

  <section class="hero" aria-labelledby="hero-headline">

    <div class="badge" role="status">
      <span class="badge-dot" aria-hidden="true"></span>
      Launching Soon
    </div>

    <h1 class="hero-headline" id="hero-headline">
      Your AI data is worth<br /><em>more than nothing</em>
    </h1>

    <p class="hero-sub">
      52 million people run AI locally. They generate the richest
      training data in existence — and all of it vanishes. Torsen
      captures it, anonymizes it on-device, and lets you earn from it.
    </p>

    <div class="stats" aria-label="Key statistics">
      <div class="stat">
        <div class="stat-value">52M</div>
        <div class="stat-label">Local AI users</div>
      </div>
      <div class="stat-sep" aria-hidden="true"></div>
      <div class="stat">
        <div class="stat-value">0%</div>
        <div class="stat-label">of data captured</div>
      </div>
      <div class="stat-sep" aria-hidden="true"></div>
      <div class="stat">
        <div class="stat-value">$4.2B</div>
        <div class="stat-label">Training data market</div>
      </div>
    </div>

    <div class="scroll-cue" aria-hidden="true">
      <span>Scroll</span>
      <div class="scroll-arrow"></div>
    </div>

  </section>

  <section class="section" id="how-it-works" aria-labelledby="how-title">
    <div class="section-inner">
      <p class="section-label">How it works</p>
      <h2 class="section-title" id="how-title">Simple by design.</h2>

      <div class="steps-grid">
        <article class="step-card" aria-label="Step 1">
          <div class="step-num">01</div>
          <h3 class="step-title">You run AI locally</h3>
          <p class="step-desc">Ollama, LM Studio, Claude Code — Torsen works silently alongside every local AI tool you already use. Nothing changes in your workflow.</p>
        </article>
        <article class="step-card" aria-label="Step 2">
          <div class="step-num">02</div>
          <h3 class="step-title">Torsen captures &amp; anonymizes</h3>
          <p class="step-desc">Every prompt and response is captured and anonymized on-device before it ever leaves your machine. Torsen never sees your raw data.</p>
        </article>
        <article class="step-card" aria-label="Step 3">
          <div class="step-num">03</div>
          <h3 class="step-title">You earn from your expertise</h3>
          <p class="step-desc">Your anonymized data is sold to AI labs, research teams, and enterprises. You set the price. You keep 95%. Paid monthly.</p>
        </article>
      </div>
    </div>
  </section>

  <div class="divider" id="divider" role="separator" aria-hidden="true"></div>

  <section class="contact-section" id="contact" aria-labelledby="contact-title">
    <p class="section-label">Get in touch</p>
    <h2 class="section-title" id="contact-title">Interested? Let us know.</h2>

    <div class="contact-card">
      <form class="contact-form" id="contact-form" novalidate aria-label="Contact form">
        <input type="hidden" name="csrf_token" value="<?= $csrf ?>" />
        <input type="text" name="website" value="" autocomplete="off" tabindex="-1" aria-hidden="true" style="display:none;position:absolute;left:-9999px;" />

        <div class="field">
          <label class="field-label" for="c-email">Email</label>
          <input class="field-input" type="email" id="c-email" name="email" placeholder="you@email.com" required autocomplete="email" />
        </div>

        <div class="field">
          <label class="field-label" for="c-message">Message <span class="opt">— optional</span></label>
          <textarea class="field-textarea" id="c-message" name="message" placeholder="Tell us what you're thinking…" maxlength="2000"></textarea>
        </div>

        <button class="btn-submit" type="submit">Send message</button>
        <p class="form-error" id="contact-error" role="alert" aria-live="assertive"></p>
      </form>

      <div class="form-success-msg" id="contact-success" role="status" aria-live="polite">
        Message received.<br />We'll get back to you at <strong id="reply-addr"></strong>.
      </div>
    </div>
  </section>

  <footer class="footer">
    &copy; 2026 Torsen AI, Inc. &nbsp;&middot;&nbsp; torsen.ai
  </footer>

</div>

<script>
/* Particle canvas */
(function () {
  var cvs = document.getElementById('canvas');
  var ctx = cvs.getContext('2d');
  var W, H, pts;
  var R = 201, G = 165, B = 90;

  function resize() { W = cvs.width = window.innerWidth; H = cvs.height = window.innerHeight; }

  function init() {
    var n = Math.floor((W * H) / 8800);
    pts = Array.from({ length: n }, function () {
      return {
        x: Math.random()*W, y: Math.random()*H,
        r: Math.random()*1.15+0.15, a: Math.random(),
        da: (Math.random()-0.5)*0.0025,
        vx: (Math.random()-0.5)*0.07, vy: (Math.random()-0.5)*0.07
      };
    });
  }

  function tick() {
    ctx.clearRect(0,0,W,H);
    for (var i=0; i<pts.length; i++) {
      var p=pts[i];
      p.x=(p.x+p.vx+W)%W; p.y=(p.y+p.vy+H)%H;
      p.a+=p.da;
      if(p.a<=0.04||p.a>=0.95)p.da*=-1;
      p.a=Math.max(0.04,Math.min(0.95,p.a));
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba('+R+','+G+','+B+','+(p.a*0.55).toFixed(3)+')';
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function(){resize();init();}, {passive:true});
  resize(); init(); tick();
})();

/* Scroll reveal */
(function () {
  var cards = document.querySelectorAll('.step-card');
  cards.forEach(function(c){c.style.opacity='0';c.style.transform='translateY(28px)';});

  var cardIO = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var i = [].indexOf.call(cards, entry.target);
      entry.target.style.transition = 'opacity 0.65s cubic-bezier(0.22,1,0.36,1) '+i*0.12+'s, transform 0.65s cubic-bezier(0.22,1,0.36,1) '+i*0.12+'s';
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      cardIO.unobserve(entry.target);
    });
  }, {threshold:0.12});
  cards.forEach(function(c){cardIO.observe(c);});

  var revealIO = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if(entry.isIntersecting){entry.target.classList.add('visible');revealIO.unobserve(entry.target);}
    });
  }, {threshold:0.08});
  document.querySelectorAll('.divider,.contact-section').forEach(function(el){revealIO.observe(el);});
})();

/* Contact form → contact.php */
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  var btn   = this.querySelector('.btn-submit');
  var errEl = document.getElementById('contact-error');
  var email = document.getElementById('c-email').value.trim();

  errEl.style.display='none'; errEl.textContent='';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errEl.textContent='Please enter a valid email address.';
    errEl.style.display='block';
    document.getElementById('c-email').focus();
    return;
  }

  var origText = btn.textContent;
  btn.textContent='Sending…'; btn.disabled=true;

  try {
    var res = await fetch('contact.php', {
      method:'POST',
      headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body: new URLSearchParams(new FormData(this)).toString()
    });
    var ct = res.headers.get('content-type')||'';
    if(!ct.includes('application/json')) throw new Error('Bad response');
    var data = await res.json();

    if(data.ok){
      this.style.display='none';
      document.getElementById('reply-addr').textContent=email;
      document.getElementById('contact-success').style.display='block';
    } else {
      errEl.textContent=data.message||'Something went wrong.';
      errEl.style.display='block';
      btn.textContent=origText; btn.disabled=false;
    }
  } catch(err) {
    errEl.textContent='Could not send — please try again or email us directly.';
    errEl.style.display='block';
    btn.textContent=origText; btn.disabled=false;
  }
});
</script>
</body>
</html>
