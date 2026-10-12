// Source of the NutriLens app icon, adaptive icon, splash and favicon: a
// muscular man in a double-biceps pose next to a healthy bowl (broccoli,
// salmon, egg, olives), in the app's "Olive Press at Dusk" colours
// (theme/tokens.ts). Rendered to PNG by scripts/render-icons.mjs; edit here,
// then re-render.

export const C = {
  ground: '#12150F',
  groundLift: '#252E20',
  goldTop: '#F0C66A',
  goldBottom: '#B5812C',
  goldShade: '#8A6020',
  hair: '#5A4318',
  bowl: '#E8EBDF',
  bowlShade: '#B7C0A8',
  broccoli: '#8DB46A',
  broccoliDark: '#5F8243',
  stem: '#B9D49A',
  salmon: '#E58B62',
  salmonLine: '#F8C9AE',
  eggWhite: '#FBFAF4',
  yolk: '#F2B33D',
  olive: '#7E5F99',
  oliveLight: '#B79BCF',
};

/** The man on a 1024 grid, centred on x = 440 (arms mirrored). */
function man(mono) {
  const fill = mono ? '#fff' : 'url(#gold)';
  const m = (s, v) => (s === 1 ? v : 880 - v);
  const arm = (s) => `
      <path d="M ${m(s, 318)} 452 L ${m(s, 214)} 456" stroke="${fill}" stroke-width="86" stroke-linecap="round"/>
      <ellipse cx="${m(s, 258)}" cy="414" rx="64" ry="50" fill="${fill}"/>
      <path d="M ${m(s, 212)} 458 L ${m(s, 200)} 330" stroke="${fill}" stroke-width="68" stroke-linecap="round"/>
      <circle cx="${m(s, 199)}" cy="310" r="38" fill="${fill}"/>
      <circle cx="${m(s, 322)}" cy="448" r="60" fill="${fill}"/>`;
  const details = mono
    ? ''
    : `
      <path d="M 380 276 Q 376 226 440 222 Q 504 226 500 276 Q 492 258 470 255 Q 440 250 410 255 Q 388 258 380 276 Z" fill="${C.hair}"/>
      <g fill="none" stroke="${C.goldShade}" stroke-linecap="round" opacity="0.6">
        <path d="M 360 512 Q 400 548 440 518 Q 480 548 520 512" stroke-width="10"/>
        <path d="M 440 528 L 440 708" stroke-width="8"/>
        <path d="M 406 588 Q 423 594 438 588 M 442 588 Q 457 594 474 588" stroke-width="8"/>
        <path d="M 410 640 Q 425 646 438 640 M 442 640 Q 455 646 470 640" stroke-width="8"/>
        <path d="M 414 690 Q 427 696 438 690 M 442 690 Q 453 696 466 690" stroke-width="8"/>
        <path d="M 226 420 Q 252 388 292 410" stroke-width="8"/>
        <path d="M ${880 - 226} 420 Q ${880 - 252} 388 ${880 - 292} 410" stroke-width="8"/>
      </g>`;
  return `
    <g>
      ${arm(1)}${arm(-1)}
      <path d="M 322 426 Q 360 402 392 392 Q 402 372 404 334 L 476 334 Q 478 372 488 392 Q 520 402 558 426 L 582 476 Q 564 568 524 628 Q 508 692 502 754 L 378 754 Q 372 692 356 628 Q 316 568 298 476 Z" fill="${fill}"/>
      <circle cx="440" cy="292" r="62" fill="${fill}"/>
      ${details}
    </g>`;
}

/** A bowl of broccoli, salmon, a boiled egg and olives, tucked against his side. */
function bowl(mono) {
  const rim = 742;
  const body = `M 500 ${rim} L 760 ${rim} Q 748 870 630 880 Q 512 870 500 ${rim} Z`;
  if (mono) {
    return `
      <path d="${body}" fill="#fff"/>
      <circle cx="560" cy="702" r="44" fill="#fff"/>
      <rect x="600" y="690" width="96" height="46" rx="18" fill="#fff" transform="rotate(-10 648 713)"/>
      <ellipse cx="716" cy="716" rx="40" ry="30" fill="#fff"/>`;
  }
  return `
    <g>
      <path d="M 556 ${rim} L 560 712" stroke="${C.stem}" stroke-width="22" stroke-linecap="round"/>
      <circle cx="534" cy="704" r="30" fill="${C.broccoliDark}"/>
      <circle cx="584" cy="700" r="30" fill="${C.broccoliDark}"/>
      <circle cx="558" cy="676" r="34" fill="${C.broccoli}"/>
      <circle cx="530" cy="694" r="22" fill="${C.broccoli}"/>
      <circle cx="590" cy="690" r="22" fill="${C.broccoli}"/>
      <g transform="rotate(-10 650 712)">
        <rect x="604" y="690" width="96" height="46" rx="18" fill="${C.salmon}"/>
        <path d="M 628 694 L 622 732 M 652 692 L 646 734 M 676 694 L 670 732" stroke="${C.salmonLine}" stroke-width="7" stroke-linecap="round"/>
      </g>
      <ellipse cx="718" cy="718" rx="40" ry="30" fill="${C.eggWhite}"/>
      <circle cx="722" cy="716" r="15" fill="${C.yolk}"/>
      <circle cx="686" cy="736" r="14" fill="${C.olive}"/>
      <circle cx="681" cy="731" r="4" fill="${C.oliveLight}"/>
      <path d="${body}" fill="${C.bowl}"/>
      <path d="M 514 768 Q 630 782 746 768" stroke="${C.bowlShade}" stroke-width="9" fill="none" stroke-linecap="round"/>
    </g>`;
}

// Bounding box of the drawing (fists, hair, bowl), used to centre and scale it.
const BOX = { x0: 161, y0: 220, x1: 760, y1: 880 };

function art({ scale, mono = false }) {
  const cx = (BOX.x0 + BOX.x1) / 2;
  const cy = (BOX.y0 + BOX.y1) / 2;
  // One gradient across the whole figure so the separate shapes never show seams.
  const defs = mono
    ? ''
    : `<defs><linearGradient id="gold" gradientUnits="userSpaceOnUse" x1="0" y1="${BOX.y0}" x2="0" y2="760">
         <stop offset="0" stop-color="${C.goldTop}"/><stop offset="1" stop-color="${C.goldBottom}"/>
       </linearGradient></defs>`;
  return `${defs}<g transform="translate(512 512) scale(${scale}) translate(${-cx} ${-cy})">${man(mono)}${bowl(mono)}</g>`;
}

const ground = `<defs><radialGradient id="lift" cx="0.5" cy="0.42" r="0.62">
    <stop offset="0" stop-color="${C.groundLift}"/><stop offset="1" stop-color="${C.ground}"/>
  </radialGradient></defs><rect width="1024" height="1024" fill="url(#lift)"/>`;

const svg = (body, withGround) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">${withGround ? ground : ''}${body}</svg>`;

/** Every raster the app ships, with its size and whether it is transparent. */
export const outputs = [
  // Legacy / store icon: full bleed ground, figure large.
  { file: 'icon.png', size: 1024, svg: svg(art({ scale: 1.2 }), true) },
  // Android adaptive foreground: kept inside the 66/108 safe-zone circle.
  { file: 'adaptive-icon.png', size: 1024, transparent: true, svg: svg(art({ scale: 0.76 })) },
  // Android 13+ themed icon: one-colour silhouette, same safe zone.
  { file: 'adaptive-icon-monochrome.png', size: 1024, transparent: true, svg: svg(art({ scale: 0.76, mono: true })) },
  // Splash image (expo-splash-screen centres it on the ground colour).
  { file: 'splash-icon.png', size: 1024, transparent: true, svg: svg(art({ scale: 1.35 })) },
  // Web favicon.
  { file: 'favicon.png', size: 48, svg: svg(art({ scale: 1.4 }), true) },
];
