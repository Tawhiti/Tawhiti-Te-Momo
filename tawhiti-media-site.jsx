import { useState, useEffect, useRef, useCallback } from "react";
import content from "./site-content.json";

/* ================================================================
   TAWHITI MEDIA — PORTFOLIO SITE
   ----------------------------------------------------------------
   ALL EDITABLE CONTENT LIVES IN site-content.json.
   Edit it with the visual editor: run `npm run cms` alongside
   `npm run dev`, then open http://localhost:5173/admin/
   (or edit the JSON directly — the site hot-reloads either way).
   ================================================================ */

const CONFIG = content;

/* ================================================================
   LAYOUT CODE BELOW — no colours, fonts or copy hard-coded here.
   ================================================================ */

const T = CONFIG.theme;

const css = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Archivo:wght@400;500;600;700&display=swap');

/* Display font — helvetica-black-regular.otf lives in /public/fonts;
   every title renders in Helvetica Black via --font-display: */
@font-face{
  font-family:'Helvetica Black';
  src:url('/fonts/helvetica-black-regular.otf') format('opentype');
  font-weight:900;
  font-display:swap;
}

:root{
  --bg:${T.bg}; --bg-deep:${T.bgDeep}; --text:${T.text}; --accent:${T.accent};
  --surface:${T.surface}; --surface-text:${T.surfaceText};
  --pill-bg:${T.pillBg}; --pill-text:${T.pillText};
  --font-display:${T.fontDisplay}; --font-body:${T.fontBody};
  --radius-card:${T.radiusCard}; --radius-pill:${T.radiusPill};
}
*{margin:0;padding:0;box-sizing:border-box}
img,video{max-width:100%}
html{scroll-behavior:smooth;scrollbar-width:none}
html::-webkit-scrollbar,body::-webkit-scrollbar{display:none}
body{background:var(--bg)}

/* ---------- minimal scroll indicator (native scrollbar is hidden) ---------- */
.scrollbar{position:fixed;top:10px;right:5px;bottom:10px;width:4px;z-index:80;opacity:0;transition:opacity .45s ease;pointer-events:none}
.scrollbar.show{opacity:1}
.scrollbar-thumb{width:100%;border-radius:999px;background:var(--accent)}
.site{background:var(--bg);color:var(--text);font-family:var(--font-body);overflow-x:hidden;min-height:100vh}
.wrap{width:min(1280px,100%);margin:0 auto;padding:0 clamp(16px,4vw,48px)}

/* ---------- reveal on scroll ---------- */
.rv{opacity:0;transform:translateY(34px);transition:opacity ${T.revealMs}ms ease,transform ${T.revealMs}ms cubic-bezier(.22,.9,.3,1)}
.rv.in{opacity:1;transform:none}
@media (prefers-reduced-motion: reduce){
  .rv{opacity:1;transform:none;transition:none}
  .marquee-track{animation:none !important}
}

/* ---------- hero + intro animation ---------- */
.hero{padding-top:clamp(28px,6vh,72px)}
.hero-name{font-family:var(--font-display);text-transform:uppercase;line-height:.9;letter-spacing:.01em;text-align:center;position:relative;z-index:20;will-change:transform,opacity;
  transition:transform ${T.introRise}ms cubic-bezier(.72,0,.18,1),opacity ${T.introFadeIn}ms ease}
.hero-pop{will-change:transform}
/* nowrap keeps each line whole — the name is always exactly 2 lines */
.hero-name span{display:block;font-size:clamp(54px,16.8vw,220px);letter-spacing:-.01em;white-space:nowrap}
/* intro phases: name pops in (springy scale), holds centred on screen at
   reduced scale, then rises + scales to its natural full-width position */
.hero-name.i-start{opacity:0;transform:translateY(calc(50vh - 50% - 10vh)) scale(.34)}
.hero-name.i-hold{opacity:1;transform:translateY(calc(50vh - 50% - 10vh)) scale(.34)}
.hero-name.i-done{opacity:1;transform:none}
@keyframes heroPop{0%{transform:scale(.1)}55%{transform:scale(1.14)}78%{transform:scale(.97)}100%{transform:scale(1)}}
.i-start .hero-pop{transform:scale(.1)}
.i-hold .hero-pop{animation:heroPop ${T.introFadeIn}ms cubic-bezier(.3,.8,.4,1) forwards}
.i-done .hero-pop{transform:none}
@media (prefers-reduced-motion: reduce){.i-hold .hero-pop{animation:none}}

/* everything below the name waits for the intro, then fades up */
.page-rest{opacity:0;transform:translateY(36px);transition:opacity .8s ease .1s,transform .9s cubic-bezier(.22,.9,.3,1) .1s}
.page-rest.show{opacity:1;transform:none}

/* ---------- marquee strip (smooth GPU auto-scroll) ---------- */
.marquee{overflow:hidden;padding:clamp(26px,5vh,54px) 0 clamp(40px,7vh,80px)}
.marquee.m-out{opacity:0}
.marquee.m-in{opacity:1;transition:opacity .8s ease .15s}
.marquee-track{display:flex;gap:14px;width:max-content;animation:scroll ${T.marqueeSeconds}s linear infinite;will-change:transform}
.marquee:hover .marquee-track{animation-play-state:paused}
@keyframes scroll{to{transform:translateX(-50%)}}
.tile{width:clamp(225px,33vw,405px);aspect-ratio:3/4;border-radius:calc(var(--radius-card) - 8px);overflow:hidden;flex-shrink:0;position:relative}
.tile img{width:100%;height:100%;object-fit:cover;display:block}

/* placeholder tiles */
.ph{width:100%;height:100%;display:flex;align-items:flex-end;padding:12px;color:var(--text);font-weight:700;font-size:12px;letter-spacing:.06em;text-transform:uppercase;background:
  linear-gradient(160deg, rgba(255,255,255,.16), rgba(255,255,255,0) 45%),
  radial-gradient(120% 90% at 80% 10%, var(--bg-deep), transparent),
  var(--bg-deep)}
.ph::after{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.14) 1px, transparent 1.4px);background-size:14px 14px;opacity:.4}
.ph.alt{background:linear-gradient(200deg, rgba(255,255,255,.22), rgba(255,255,255,0) 50%), var(--bg-deep)}
.ph .phn{position:relative;z-index:1;opacity:.9}

/* ---------- section labels ---------- */
.sec-head{display:flex;justify-content:space-between;align-items:baseline;padding:clamp(28px,5vh,56px) 0 18px;border-top:2px solid var(--accent)}
.sec-title{font-weight:700;font-size:clamp(15px,2vw,19px)}
.sec-hint{color:var(--accent);font-size:13px}

/* ---------- featured work list ---------- */
.worklist{position:relative;padding-bottom:clamp(40px,7vh,90px)}
.work-item{display:block;width:100%;background:none;border:none;color:var(--text);font-family:var(--font-display);text-transform:uppercase;font-size:clamp(34px,7.4vw,92px);line-height:1.06;text-align:center;cursor:pointer;transition:color .25s ease,letter-spacing .3s ease;letter-spacing:.01em;padding:2px 0}
.work-item:hover,.work-item.active{color:var(--accent);letter-spacing:.03em}
.work-preview{position:fixed;z-index:5;width:min(300px,60vw);aspect-ratio:3/4;border-radius:18px;overflow:hidden;pointer-events:none;box-shadow:0 30px 60px rgba(0,0,0,.35);opacity:0;transform:scale(.92);transition:opacity .25s ease,transform .3s ease}
.work-preview.show{opacity:1;transform:scale(1)}
.work-preview-mobile{margin:14px auto 6px;position:static;width:min(320px,80vw);opacity:1;transform:none;pointer-events:auto;box-shadow:0 20px 40px rgba(0,0,0,.3);border-radius:18px;overflow:hidden;aspect-ratio:3/4}
.work-open{display:block;margin:8px auto 18px;background:var(--surface);color:var(--surface-text);border:none;border-radius:var(--radius-pill);padding:12px 26px;font-weight:700;font-family:var(--font-body);font-size:15px;cursor:pointer}

/* ---------- about ---------- */
.about{padding-bottom:clamp(30px,5vh,60px)}
.about-p{font-size:clamp(19px,3vw,30px);font-weight:600;line-height:1.35;max-width:56ch;padding-top:6px}
.strip{display:flex;gap:12px;overflow-x:auto;padding:clamp(24px,4vh,40px) 0 10px;-webkit-overflow-scrolling:touch}
.strip .tile{width:clamp(130px,18vw,220px)}
.strip .tile:only-child{width:100%;aspect-ratio:16/9}
.strip-cap{color:var(--accent);font-size:13px;max-width:52ch;padding-bottom:clamp(28px,5vh,56px)}

/* ---------- partners ---------- */
.partner-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;padding:clamp(20px,4vh,40px) 0 clamp(40px,7vh,80px)}
.partner-cell{background:var(--bg-deep);border-radius:calc(var(--radius-card) - 10px);aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;padding:clamp(14px,3vw,30px)}
/* logo files are pre-normalised to equal visual area on 16:9 canvases */
.partner-cell img{width:100%;height:100%;object-fit:contain}
.partner-ph{color:var(--accent);font-weight:700;font-size:13px;letter-spacing:.06em;text-transform:uppercase;opacity:.65}
@media (max-width:640px){.partner-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* ---------- services ---------- */
.svc{border-radius:var(--radius-card);padding:clamp(20px,3.5vw,44px);margin-bottom:18px}
.svc.surface{background:var(--surface);color:var(--surface-text)}
.svc.deep{background:var(--bg-deep);color:var(--text)}
.svc-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px}
.svc-name{font-family:var(--font-display);text-transform:uppercase;font-size:clamp(34px,6.5vw,72px);line-height:1}
.svc-num{font-weight:700;font-size:15px}
.svc-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(16px,3vw,36px);align-items:start}
.svc-media{aspect-ratio:4/3;border-radius:calc(var(--radius-card) - 10px);overflow:hidden;position:relative}
.svc-desc{font-size:clamp(15px,1.9vw,19px);font-weight:500;line-height:1.5;margin-bottom:16px}
.pills{display:flex;flex-wrap:wrap;gap:8px}
.pill{background:var(--pill-bg);color:var(--pill-text);border-radius:var(--radius-pill);padding:8px 15px;font-size:13px;font-weight:600}
.svc.deep .pill{background:var(--surface);color:var(--surface-text)}
@media (max-width:760px){.svc-grid{grid-template-columns:1fr}}

/* ---------- contact ---------- */
.contact{padding-top:clamp(40px,8vh,100px);padding-bottom:120px;text-align:center}
.contact-loc{display:flex;justify-content:space-between;font-size:14px;color:var(--accent);font-weight:600;padding-bottom:clamp(26px,5vh,60px)}
.contact-h{font-family:var(--font-display);text-transform:uppercase;font-size:clamp(48px,11vw,140px);line-height:.95;margin-bottom:26px}
.contact-email{color:var(--text);font-weight:700;font-size:clamp(16px,2.4vw,22px);text-decoration:underline;text-underline-offset:5px}
.contact-cta{display:inline-block;margin-top:26px;background:var(--surface);color:var(--surface-text);border:none;border-radius:var(--radius-pill);padding:16px 34px;font-weight:700;font-size:16px;font-family:var(--font-body);cursor:pointer;transition:transform .2s ease}
.contact-cta:hover{transform:translateY(-2px)}
.footer{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-top:60px;color:var(--accent);font-size:13px}
.footer a{color:var(--text);text-decoration:none;font-weight:600}
.footer a:hover{text-decoration:underline}
.footer a.ig{display:inline-flex;align-items:center;line-height:0}
.footer a.ig:hover{opacity:.75}

/* ---------- floating pill ---------- */
.fab{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:40;background:var(--surface);color:var(--surface-text);border:none;border-radius:var(--radius-pill);padding:14px 30px;font-weight:800;font-size:15px;font-family:var(--font-body);cursor:pointer;box-shadow:0 14px 34px rgba(0,0,0,.35);transition:transform .2s ease,opacity .5s ease}
.fab:hover{transform:translateX(-50%) translateY(-3px)}
.fab.hide{opacity:0;pointer-events:none}

/* ---------- modal ---------- */
.overlay{position:fixed;inset:0;background:rgba(8,8,8,.6);backdrop-filter:blur(3px);z-index:60;display:flex;align-items:flex-end;justify-content:center;animation:fade .25s ease}
@keyframes fade{from{opacity:0}to{opacity:1}}
.modal{background:var(--surface);color:var(--surface-text);width:min(680px,100%);border-radius:26px 26px 0 0;padding:clamp(22px,4vw,40px);max-height:88vh;overflow-y:auto;animation:up .45s cubic-bezier(.2,.95,.3,1)}
@keyframes up{from{transform:translateY(100%)}to{transform:none}}
.modal-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
.modal-title{font-family:var(--font-display);text-transform:uppercase;font-size:clamp(30px,6vw,52px)}
.modal-x{background:var(--pill-bg);color:var(--pill-text);border:none;width:42px;height:42px;border-radius:50%;font-size:18px;cursor:pointer;font-weight:700}
.field{margin-bottom:14px;text-align:left}
.field label{display:block;font-weight:700;font-size:13px;margin-bottom:6px;text-transform:uppercase;letter-spacing:.04em}
.field input,.field select,.field textarea{width:100%;font-size:16px;font-family:var(--font-body);padding:14px;border-radius:14px;border:2px solid var(--pill-bg);background:#fff;color:var(--surface-text)}
.field textarea{min-height:110px;resize:vertical}
.send{width:100%;background:var(--pill-bg);color:var(--pill-text);border:none;border-radius:var(--radius-pill);padding:16px;font-weight:800;font-size:16px;font-family:var(--font-body);cursor:pointer;margin-top:6px}
.sent-note{margin-top:12px;font-size:14px;font-weight:600}

/* ---------- video ---------- */
/* fullscreen: letterbox instead of crop so the whole frame is visible */
video:fullscreen{object-fit:contain !important;background:#000}

/* ---------- case study ---------- */
.case-hero{padding-top:24px}
.case-name{font-family:var(--font-display);text-transform:uppercase;font-size:clamp(40px,9vw,116px);line-height:.95;text-align:center;padding:14px 0 24px}
.case-main{aspect-ratio:16/9;border-radius:var(--radius-card);overflow:hidden;position:relative}
/* hero grid variant: 2 rows of 3 vertical 9:16 tiles */
.case-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.case-grid .vtile{aspect-ratio:9/16;border-radius:18px;overflow:hidden;position:relative}
@media (max-width:640px){.case-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
/* mobile: hero-grid becomes a snap-scrolling circular carousel */
.case-carousel{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.case-carousel::-webkit-scrollbar{display:none}
.case-carousel .ctile{flex:0 0 76%;aspect-ratio:9/16;border-radius:18px;overflow:hidden;position:relative;scroll-snap-align:center}
.case-meta{display:flex;flex-wrap:wrap;gap:24px;justify-content:space-between;padding:26px 0;color:var(--accent);font-size:14px;font-weight:600}
.case-blurb{font-size:clamp(17px,2.4vw,24px);font-weight:600;line-height:1.45;max-width:60ch;padding-bottom:22px}
.case-gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;padding-bottom:40px}
.case-gallery .gitem:only-child{grid-column:1/-1}
.case-gallery .gtile{aspect-ratio:4/3;border-radius:18px;overflow:hidden;position:relative}
.case-gallery .gitem:only-child .gtile{aspect-ratio:16/9}
@media (max-width:640px){.case-gallery{grid-template-columns:1fr}}
.case-nav{display:flex;justify-content:space-between;gap:14px;padding-bottom:120px}
.case-nav button{background:var(--bg-deep);color:var(--text);border:none;border-radius:var(--radius-pill);padding:14px 24px;font-weight:700;font-family:var(--font-body);font-size:14px;cursor:pointer}
.back{background:none;border:2px solid var(--accent);color:var(--text);border-radius:var(--radius-pill);padding:10px 22px;font-weight:700;font-family:var(--font-body);cursor:pointer}
`;

/* ---------- helpers ---------- */

function Media({ src, label, alt, withAudio }) {
  // media entries may be a plain path or an object { src, client, location }
  if (src && typeof src === "object") src = src.src;
  if (src && /instagram\.com\/(reel|p|tv)\//.test(src)) {
    const embed = src.split("?")[0].replace(/\/$/, "") + "/embed/";
    return (
      <iframe
        src={embed}
        title={alt || label || "Instagram reel"}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        scrolling="no"
        style={{ width: "100%", height: "100%", border: 0, display: "block", background: "#000" }}
      />
    );
  }
  if (src && /\.(mp4|webm|mov)(\?|$)/i.test(src)) {
    // every video has a same-named .jpg poster frame beside it
    const poster = src.replace(/\.(mp4|webm|mov)$/i, ".jpg");
    // withAudio: standard browser controls, no autoplay — playback is coordinated
    // by CaseStudy so only one video plays (with sound) at a time.
    // preload="metadata": paused videos cost ~nothing until actually played.
    if (withAudio)
      return <video src={src} poster={poster} preload="metadata" muted loop playsInline controls controlsList="nodownload" disablePictureInPicture style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
    return <video src={src} poster={poster} autoPlay muted loop playsInline controlsList="nodownload" disablePictureInPicture style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />;
  }
  if (src)
    return <img src={src} alt={alt || label} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  return (
    <div className={`ph ${label && label.length % 2 ? "alt" : ""}`}>
      <span className="phn">{label || "Media"}</span>
    </div>
  );
}

function useReveal(enabled) {
  useEffect(() => {
    if (!enabled) return;
    const els = document.querySelectorAll(".rv");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

function useWellingtonTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const upd = () =>
      setTime(
        new Intl.DateTimeFormat("en-NZ", {
          hour: "2-digit", minute: "2-digit", timeZone: "Pacific/Auckland",
        }).format(new Date())
      );
    upd();
    const id = setInterval(upd, 30000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ---------- intro state machine ----------
   start (name hidden, centred + small)
   -> hold (name fades in, stays centred)
   -> done (name rises + scales to top, page fades in after)   */
function useIntro() {
  const [phase, setPhase] = useState("start");
  const [pageIn, setPageIn] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setPhase("done"); setPageIn(true); return; }
    const t = CONFIG.theme;
    let t1, t2, t3, cancelled = false;
    const start = () => {
      if (cancelled) return;
      t1 = setTimeout(() => setPhase("hold"), 90);
      t2 = setTimeout(() => setPhase("done"), 90 + t.introFadeIn + t.introHold);
      t3 = setTimeout(() => setPageIn(true), 90 + t.introFadeIn + t.introHold + t.introRise - 250);
    };
    // wait (briefly) for the display font so the intro doesn't restyle mid-animation
    Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 600))]).then(start);
    return () => { cancelled = true; clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);
  return { phase, pageIn };
}

/* Minimal monochrome scroll indicator: appears while scrolling, fades out
   after a moment of stillness. Replaces the hidden native scrollbar. */
function ScrollIndicator() {
  const thumbRef = useRef(null);
  const trackRef = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let t;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const track = trackRef.current;
      const thumb = thumbRef.current;
      if (track && thumb) {
        const trackH = track.getBoundingClientRect().height;
        const thumbH = Math.max(40, trackH * (window.innerHeight / doc.scrollHeight));
        thumb.style.height = thumbH + "px";
        thumb.style.transform = `translateY(${(window.scrollY / max) * (trackH - thumbH)}px)`;
      }
      setVisible(true);
      clearTimeout(t);
      t = setTimeout(() => setVisible(false), 900);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);
  return (
    <div className={`scrollbar ${visible ? "show" : ""}`} ref={trackRef} aria-hidden="true">
      <div className="scrollbar-thumb" ref={thumbRef} />
    </div>
  );
}

/* ---------- sections ---------- */

function Hero({ phase, pageIn }) {
  const tiles = [...CONFIG.hero.media, ...CONFIG.hero.media];
  return (
    <section className="hero">
      <h1 className={`hero-name wrap i-${phase}`}>
        <div className="hero-pop">
          <span>{CONFIG.hero.line1}</span>
          <span>{CONFIG.hero.line2}</span>
        </div>
      </h1>
      {/* smooth GPU CSS auto-scroll; light video files keep the weight down */}
      <div className={`marquee ${pageIn ? "m-in" : "m-out"}`} aria-hidden="true">
        <div className="marquee-track">
          {tiles.map((m, i) => (
            <div className="tile" key={i}>
              <Media src={m} label={`Reel ${(i % CONFIG.hero.media.length) + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkList({ openCase }) {
  const [active, setActive] = useState(null);
  const [isTouch, setIsTouch] = useState(false);
  const prevRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  useEffect(() => {
    if (isTouch) return;
    let raf;
    const loop = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.14;
      p.y += (p.ty - p.y) * 0.14;
      if (prevRef.current) {
        prevRef.current.style.left = p.x + 20 + "px";
        prevRef.current.style.top = p.y - 140 + "px";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isTouch]);

  const onMove = useCallback((e) => {
    pos.current.tx = e.clientX;
    pos.current.ty = e.clientY;
  }, []);

  const proj = CONFIG.work.find((w) => w.id === active);

  return (
    <section className="wrap worklist" onMouseMove={isTouch ? undefined : onMove}>
      <div className="sec-head rv">
        <div className="sec-title">Featured Work</div>
        <div className="sec-hint">{isTouch ? "(Tap to preview, tap again to view)" : "(Click to view)"}</div>
      </div>
      {CONFIG.work.map((w) => (
        <div key={w.id} className="rv">
          <button
            className={`work-item ${active === w.id ? "active" : ""}`}
            onMouseEnter={() => !isTouch && setActive(w.id)}
            onMouseLeave={() => !isTouch && setActive(null)}
            onClick={() => {
              if (isTouch && active !== w.id) setActive(w.id);
              else openCase(w.id);
            }}
          >
            {w.name}
          </button>
          {isTouch && active === w.id && (
            <>
              <div className="work-preview-mobile">
                <Media src={w.media[0]} label={w.name} />
              </div>
              <button className="work-open" onClick={() => openCase(w.id)}>
                View project →
              </button>
            </>
          )}
        </div>
      ))}
      {!isTouch && (
        <div ref={prevRef} className={`work-preview ${proj ? "show" : ""}`}>
          {proj && <Media src={proj.media[0]} label={proj.name} />}
        </div>
      )}
    </section>
  );
}

function About() {
  const a = CONFIG.about;
  return (
    <section className="wrap about">
      <div className="sec-head rv">
        <div className="sec-title">{a.label}</div>
      </div>
      <p className="about-p rv">{a.paragraph}</p>
      <div className="strip rv">
        {a.stripMedia.map((m, i) => (
          <div className="tile" key={i}>
            <Media src={m} label={`BTS ${i + 1}`} />
          </div>
        ))}
      </div>
      {a.stripCaption && <p className="strip-cap rv">{a.stripCaption}</p>}
    </section>
  );
}

function Partners() {
  const p = CONFIG.partners;
  return (
    <section className="wrap partners">
      <div className="sec-head rv">
        <div className="sec-title">{p.label}</div>
      </div>
      <div className="partner-grid rv">
        {p.logos.map((m, i) => (
          <div className="partner-cell" key={i}>
            {m
              ? <img src={m} alt={`Partner logo ${i + 1}`} loading="lazy" />
              : <span className="partner-ph">Logo {i + 1}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="wrap">
      <div className="sec-head rv">
        <div className="sec-title">Services</div>
      </div>
      {CONFIG.services.map((s) => (
        <div key={s.num} className={`svc rv ${s.tint}`}>
          <div className="svc-top">
            <h3 className="svc-name">{s.name}</h3>
            <span className="svc-num">({s.num})</span>
          </div>
          <div className="svc-grid">
            <div className="svc-media">
              <Media src={s.media} label={s.name} />
            </div>
            <div>
              <p className="svc-desc">{s.desc}</p>
              <div className="pills">
                {s.tags.map((t) => (
                  <span className="pill" key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function Contact({ openModal }) {
  const c = CONFIG.contact;
  const time = useWellingtonTime();
  return (
    <section className="wrap contact" id="contact">
      <div className="contact-loc rv">
        <span>{c.location}</span>
        <span>{time}</span>
      </div>
      <h2 className="contact-h rv">{c.headline}</h2>
      <div className="rv">
        <a className="contact-email" href={`mailto:${c.email}`}>{c.email}</a>
        <br />
        <button className="contact-cta" onClick={openModal}>Send me a message</button>
      </div>
      <div className="footer rv">
        <span>© {new Date().getFullYear()} Tawhiti Media — {c.website}</span>
        <a className="ig" href={c.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
            <circle cx="12" cy="12" r="4.4" />
            <circle cx="17.6" cy="6.4" r="1.3" fill="currentColor" stroke="none" />
          </svg>
        </a>
        <a href="#top">Back to top ↑</a>
      </div>
    </section>
  );
}

function Modal({ close }) {
  const c = CONFIG.contact;
  const [sent, setSent] = useState(null); // null | "sending" | "ok" | "fallback"
  const submit = async (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    setSent("sending");
    try {
      // FormSubmit relays the enquiry to the email in CONFIG — no backend needed
      const res = await fetch(`https://formsubmit.co/ajax/${c.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `Enquiry — ${f.get("type")}`,
          _replyto: f.get("email"),
          _template: "table",
          name: f.get("name"),
          email: f.get("email"),
          project: f.get("type"),
          date: f.get("date") || "-",
          budget: f.get("budget") || "-",
          message: f.get("msg"),
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setSent("ok");
    } catch {
      // network/service failure: fall back to the visitor's email app
      const body = encodeURIComponent(
        `Name: ${f.get("name")}\nEmail: ${f.get("email")}\nProject: ${f.get("type")}\nDate: ${f.get("date") || "-"}\nBudget: ${f.get("budget") || "-"}\n\n${f.get("msg")}`
      );
      window.open(`mailto:${c.email}?subject=${encodeURIComponent("Enquiry — " + f.get("type"))}&body=${body}`);
      setSent("fallback");
    }
  };
  return (
    <div className="overlay" onClick={(e) => e.target.classList.contains("overlay") && close()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-h">
          <div className="modal-title">Get in touch</div>
          <button className="modal-x" onClick={close} aria-label="Close">✕</button>
        </div>
        <form onSubmit={submit}>
          <div className="field"><label>Full name</label><input name="name" required placeholder="Your name" /></div>
          <div className="field"><label>Email</label><input name="email" type="email" required placeholder="you@email.com" /></div>
          <div className="field"><label>Project type</label>
            <select name="type" required defaultValue="">
              <option value="" disabled>Select one</option>
              {c.projectTypes.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="field"><label>Event / shoot date</label><input name="date" placeholder="Optional" /></div>
          <div className="field"><label>Budget range</label><input name="budget" placeholder="Optional" /></div>
          <div className="field"><label>Message</label><textarea name="msg" required placeholder="Tell me about your project" /></div>
          <button className="send" type="submit" disabled={sent === "sending"}>
            {sent === "sending" ? "Sending…" : "Send enquiry"}
          </button>
          {sent === "ok" && <p className="sent-note">Thanks — your enquiry has been sent! I'll get back to you soon.</p>}
          {sent === "fallback" && <p className="sent-note">Direct sending didn't work, so your email app should have opened with the enquiry pre-filled — just hit send there.</p>}
        </form>
      </div>
    </div>
  );
}

/* Mobile-only circular carousel for the vertical hero-grid videos.
   First/last tiles are clones of the real ends so swiping wraps around. */
function VerticalCarousel({ media, name }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const centerOn = (child) =>
      el.scrollTo({ left: child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2, behavior: "instant" });
    centerOn(el.children[1]); // start on the first real tile
    let t;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const kids = [...el.children];
        const center = el.scrollLeft + el.clientWidth / 2;
        let idx = kids.findIndex((k) => center >= k.offsetLeft && center < k.offsetLeft + k.offsetWidth);
        if (idx === 0) { centerOn(kids[kids.length - 2]); idx = kids.length - 2; } // left clone -> real last
        else if (idx === kids.length - 1) { centerOn(kids[1]); idx = 1; } // right clone -> real first
        // auto-play the video that settled in view; the page's play handler
        // unmutes it and pauses + mutes whichever video was playing before
        const v = kids[idx] && kids[idx].querySelector("video");
        if (v && v.paused) v.play().catch(() => {});
      }, 120);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(t); el.removeEventListener("scroll", onScroll); };
  }, []);
  const slots = media.slice(0, 6);
  const ext = [slots[slots.length - 1], ...slots, slots[0]];
  return (
    <div className="case-carousel" ref={ref}>
      {ext.map((m, i) => {
        const clone = i === 0 || i === ext.length - 1;
        return (
          <div className="ctile" key={i} data-clone={clone || undefined}>
            <Media src={m} label={`${name} ${clone ? "" : i}`} withAudio />
          </div>
        );
      })}
    </div>
  );
}

function CaseStudy({ id, openCase, goHome }) {
  const idx = CONFIG.work.findIndex((w) => w.id === id);
  const w = CONFIG.work[idx];
  const prev = CONFIG.work[(idx - 1 + CONFIG.work.length) % CONFIG.work.length];
  const next = CONFIG.work[(idx + 1) % CONFIG.work.length];
  const sectionRef = useRef(null);
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const upd = () => setMobile(mq.matches);
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  /* One video at a time: playing any video unmutes it and pauses + mutes the
     rest. On page open the first video starts with sound (muted fallback if
     the browser blocks unmuted playback). */
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const onPlay = (e) => {
      const v = e.target;
      if (!v || v.tagName !== "VIDEO") return;
      v.muted = false;
      root.querySelectorAll("video").forEach((o) => { if (o !== v && !o.paused) { o.pause(); o.muted = true; } });
    };
    root.addEventListener("play", onPlay, true);
    // first real (non-clone) video starts with sound
    const first = [...root.querySelectorAll("video")].find((v) => !v.closest("[data-clone]"));
    if (first) {
      first.muted = false;
      first.play().catch(() => { first.muted = true; first.play().catch(() => {}); });
    }
    return () => root.removeEventListener("play", onPlay, true);
  }, [id, mobile]);
  return (
    <section className="wrap case-hero" ref={sectionRef}>
      <button className="back" onClick={goHome}>← Back to home</button>
      <h1 className="case-name">{w.name}</h1>
      {w.heroGrid ? (
        mobile ? (
          <VerticalCarousel media={w.media} name={w.name} />
        ) : (
          <div className="case-grid">
            {w.media.slice(0, 6).map((m, i) => (
              <div className="vtile" key={i}><Media src={m} label={`${w.name} ${i + 1}`} withAudio /></div>
            ))}
          </div>
        )
      ) : (
        <div className="case-main"><Media src={w.media[0]} label={`${w.name} — Hero`} withAudio /></div>
      )}
      <div className="case-meta">
        <span>{w.client}</span>
        <span>{w.location}</span>
      </div>
      <p className="case-blurb">{w.blurb}</p>
      <div className="pills" style={{ paddingBottom: 30 }}>
        {w.tags.map((t) => <span className="pill" key={t} style={{ background: T.surface, color: T.surfaceText }}>{t}</span>)}
      </div>
      <div className="case-gallery">
        {/* empty (null) media slots stay hidden until a URL is added;
            object entries ({src, client, location}) get their own caption */}
        {(w.heroGrid ? w.media.slice(6) : w.media.slice(1)).filter(Boolean).map((m, i) => {
          const src = typeof m === "object" ? m.src : m;
          const hasMeta = typeof m === "object" && (m.client || m.location);
          return (
            <div className="gitem" key={i}>
              <div className="gtile"><Media src={src} label={`${w.name} ${i + 2}`} withAudio /></div>
              {hasMeta && (
                <div className="case-meta">
                  <span>{m.client}</span>
                  <span>{m.location}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="case-nav">
        <button onClick={() => openCase(prev.id)}>← {prev.name}</button>
        <button onClick={() => openCase(next.id)}>{next.name} →</button>
      </div>
    </section>
  );
}

/* ---------- app ---------- */

export default function App() {
  const [route, setRoute] = useState(null); // null = home, otherwise project id
  const [modal, setModal] = useState(false);
  const { phase, pageIn } = useIntro();
  useReveal(pageIn);

  useEffect(() => {
    document.body.style.overflow = modal || !pageIn ? "hidden" : "";
  }, [modal, pageIn]);

  return (
    <div className="site" id="top">
      <style>{css}</style>

      {route === null ? (
        <>
          <Hero phase={phase} pageIn={pageIn} />
          <div className={`page-rest ${pageIn ? "show" : ""}`}>
            <WorkList openCase={setRoute} />
            <About />
            <Partners />
            <Services />
            <Contact openModal={() => setModal(true)} />
          </div>
        </>
      ) : (
        <CaseStudy id={route} openCase={setRoute} goHome={() => setRoute(null)} />
      )}

      <ScrollIndicator />
      <button className={`fab ${pageIn || route ? "" : "hide"}`} onClick={() => setModal(true)}>Contact ✦</button>
      {modal && <Modal close={() => setModal(false)} />}
    </div>
  );
}
