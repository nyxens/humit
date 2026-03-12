// ═══════════════════════════════════════════════════
// COUNTRY CONFIG — centroid lookup for globe hit testing
// iso2 → { name, flag, lat, lng }
// ═══════════════════════════════════════════════════
const COUNTRIES = {
  AF:{name:"Afghanistan",flag:"🇦🇫",lat:33.9391,lng:67.7100},
  AL:{name:"Albania",flag:"🇦🇱",lat:41.1533,lng:20.1683},
  DZ:{name:"Algeria",flag:"🇩🇿",lat:28.0339,lng:1.6596},
  AO:{name:"Angola",flag:"🇦🇴",lat:-11.2027,lng:17.8739},
  AR:{name:"Argentina",flag:"🇦🇷",lat:-38.4161,lng:-63.6167},
  AM:{name:"Armenia",flag:"🇦🇲",lat:40.0691,lng:45.0382},
  AU:{name:"Australia",flag:"🇦🇺",lat:-25.2744,lng:133.7751},
  AT:{name:"Austria",flag:"🇦🇹",lat:47.5162,lng:14.5501},
  AZ:{name:"Azerbaijan",flag:"🇦🇿",lat:40.1431,lng:47.5769},
  BH:{name:"Bahrain",flag:"🇧🇭",lat:26.0667,lng:50.5577},
  BD:{name:"Bangladesh",flag:"🇧🇩",lat:23.6850,lng:90.3563},
  BY:{name:"Belarus",flag:"🇧🇾",lat:53.7098,lng:27.9534},
  BE:{name:"Belgium",flag:"🇧🇪",lat:50.5039,lng:4.4699},
  BZ:{name:"Belize",flag:"🇧🇿",lat:17.1899,lng:-88.4976},
  BJ:{name:"Benin",flag:"🇧🇯",lat:9.3077,lng:2.3158},
  BT:{name:"Bhutan",flag:"🇧🇹",lat:27.5142,lng:90.4336},
  BO:{name:"Bolivia",flag:"🇧🇴",lat:-16.2902,lng:-63.5887},
  BA:{name:"Bosnia",flag:"🇧🇦",lat:43.9159,lng:17.6791},
  BW:{name:"Botswana",flag:"🇧🇼",lat:-22.3285,lng:24.6849},
  BR:{name:"Brazil",flag:"🇧🇷",lat:-14.2350,lng:-51.9253},
  BN:{name:"Brunei",flag:"🇧🇳",lat:4.5353,lng:114.7277},
  BG:{name:"Bulgaria",flag:"🇧🇬",lat:42.7339,lng:25.4858},
  BF:{name:"Burkina Faso",flag:"🇧🇫",lat:12.3641,lng:-1.5330},
  BI:{name:"Burundi",flag:"🇧🇮",lat:-3.3731,lng:29.9189},
  KH:{name:"Cambodia",flag:"🇰🇭",lat:12.5657,lng:104.9910},
  CM:{name:"Cameroon",flag:"🇨🇲",lat:3.8480,lng:11.5021},
  CA:{name:"Canada",flag:"🇨🇦",lat:56.1304,lng:-106.3468},
  CF:{name:"Central African Republic",flag:"🇨🇫",lat:6.6111,lng:20.9394},
  TD:{name:"Chad",flag:"🇹🇩",lat:15.4542,lng:18.7322},
  CL:{name:"Chile",flag:"🇨🇱",lat:-35.6751,lng:-71.5430},
  CN:{name:"China",flag:"🇨🇳",lat:35.8617,lng:104.1954},
  CO:{name:"Colombia",flag:"🇨🇴",lat:4.5709,lng:-74.2973},
  CG:{name:"Congo",flag:"🇨🇬",lat:-0.2280,lng:15.8277},
  CR:{name:"Costa Rica",flag:"🇨🇷",lat:9.7489,lng:-83.7534},
  HR:{name:"Croatia",flag:"🇭🇷",lat:45.1000,lng:15.2000},
  CU:{name:"Cuba",flag:"🇨🇺",lat:21.5218,lng:-77.7812},
  CY:{name:"Cyprus",flag:"🇨🇾",lat:35.1264,lng:33.4299},
  CZ:{name:"Czech Republic",flag:"🇨🇿",lat:49.8175,lng:15.4730},
  DK:{name:"Denmark",flag:"🇩🇰",lat:56.2639,lng:9.5018},
  DO:{name:"Dominican Republic",flag:"🇩🇴",lat:18.7357,lng:-70.1627},
  EC:{name:"Ecuador",flag:"🇪🇨",lat:-1.8312,lng:-78.1834},
  EG:{name:"Egypt",flag:"🇪🇬",lat:26.8206,lng:30.8025},
  SV:{name:"El Salvador",flag:"🇸🇻",lat:13.7942,lng:-88.8965},
  EE:{name:"Estonia",flag:"🇪🇪",lat:58.5953,lng:25.0136},
  ET:{name:"Ethiopia",flag:"🇪🇹",lat:9.1450,lng:40.4897},
  FI:{name:"Finland",flag:"🇫🇮",lat:61.9241,lng:25.7482},
  FR:{name:"France",flag:"🇫🇷",lat:46.2276,lng:2.2137},
  GE:{name:"Georgia",flag:"🇬🇪",lat:42.3154,lng:43.3569},
  DE:{name:"Germany",flag:"🇩🇪",lat:51.1657,lng:10.4515},
  GH:{name:"Ghana",flag:"🇬🇭",lat:7.9465,lng:-1.0232},
  GR:{name:"Greece",flag:"🇬🇷",lat:39.0742,lng:21.8243},
  GT:{name:"Guatemala",flag:"🇬🇹",lat:15.7835,lng:-90.2308},
  GN:{name:"Guinea",flag:"🇬🇳",lat:9.9456,lng:-11.6014},
  HT:{name:"Haiti",flag:"🇭🇹",lat:18.9712,lng:-72.2852},
  HN:{name:"Honduras",flag:"🇭🇳",lat:15.1999,lng:-86.2419},
  HK:{name:"Hong Kong",flag:"🇭🇰",lat:22.3193,lng:114.1694},
  HU:{name:"Hungary",flag:"🇭🇺",lat:47.1625,lng:19.5033},
  IS:{name:"Iceland",flag:"🇮🇸",lat:64.9631,lng:-19.0208},
  IN:{name:"India",flag:"🇮🇳",lat:20.5937,lng:78.9629},
  ID:{name:"Indonesia",flag:"🇮🇩",lat:-0.7893,lng:113.9213},
  IR:{name:"Iran",flag:"🇮🇷",lat:32.4279,lng:53.6880},
  IQ:{name:"Iraq",flag:"🇮🇶",lat:33.2232,lng:43.6793},
  IE:{name:"Ireland",flag:"🇮🇪",lat:53.1424,lng:-7.6921},
  IL:{name:"Israel",flag:"🇮🇱",lat:31.0461,lng:34.8516},
  IT:{name:"Italy",flag:"🇮🇹",lat:41.8719,lng:12.5674},
  JM:{name:"Jamaica",flag:"🇯🇲",lat:18.1096,lng:-77.2975},
  JP:{name:"Japan",flag:"🇯🇵",lat:36.2048,lng:138.2529},
  JO:{name:"Jordan",flag:"🇯🇴",lat:30.5852,lng:36.2384},
  KZ:{name:"Kazakhstan",flag:"🇰🇿",lat:48.0196,lng:66.9237},
  KE:{name:"Kenya",flag:"🇰🇪",lat:-0.0236,lng:37.9062},
  KW:{name:"Kuwait",flag:"🇰🇼",lat:29.3117,lng:47.4818},
  KG:{name:"Kyrgyzstan",flag:"🇰🇬",lat:41.2044,lng:74.7661},
  LA:{name:"Laos",flag:"🇱🇦",lat:19.8563,lng:102.4955},
  LV:{name:"Latvia",flag:"🇱🇻",lat:56.8796,lng:24.6032},
  LB:{name:"Lebanon",flag:"🇱🇧",lat:33.8547,lng:35.8623},
  LY:{name:"Libya",flag:"🇱🇾",lat:26.3351,lng:17.2283},
  LT:{name:"Lithuania",flag:"🇱🇹",lat:55.1694,lng:23.8813},
  LU:{name:"Luxembourg",flag:"🇱🇺",lat:49.8153,lng:6.1296},
  MK:{name:"Macedonia",flag:"🇲🇰",lat:41.6086,lng:21.7453},
  MG:{name:"Madagascar",flag:"🇲🇬",lat:-18.7669,lng:46.8691},
  MW:{name:"Malawi",flag:"🇲🇼",lat:-13.2543,lng:34.3015},
  MY:{name:"Malaysia",flag:"🇲🇾",lat:4.2105,lng:101.9758},
  MV:{name:"Maldives",flag:"🇲🇻",lat:3.2028,lng:73.2207},
  ML:{name:"Mali",flag:"🇲🇱",lat:17.5707,lng:-3.9962},
  MT:{name:"Malta",flag:"🇲🇹",lat:35.9375,lng:14.3754},
  MR:{name:"Mauritania",flag:"🇲🇷",lat:21.0079,lng:-10.9408},
  MX:{name:"Mexico",flag:"🇲🇽",lat:23.6345,lng:-102.5528},
  MD:{name:"Moldova",flag:"🇲🇩",lat:47.4116,lng:28.3699},
  MN:{name:"Mongolia",flag:"🇲🇳",lat:46.8625,lng:103.8467},
  ME:{name:"Montenegro",flag:"🇲🇪",lat:42.7087,lng:19.3744},
  MA:{name:"Morocco",flag:"🇲🇦",lat:31.7917,lng:-7.0926},
  MZ:{name:"Mozambique",flag:"🇲🇿",lat:-18.6657,lng:35.5296},
  MM:{name:"Myanmar",flag:"🇲🇲",lat:21.9162,lng:95.9560},
  NA:{name:"Namibia",flag:"🇳🇦",lat:-22.9576,lng:18.4904},
  NP:{name:"Nepal",flag:"🇳🇵",lat:28.3949,lng:84.1240},
  NL:{name:"Netherlands",flag:"🇳🇱",lat:52.1326,lng:5.2913},
  NZ:{name:"New Zealand",flag:"🇳🇿",lat:-40.9006,lng:174.8860},
  NI:{name:"Nicaragua",flag:"🇳🇮",lat:12.8654,lng:-85.2072},
  NE:{name:"Niger",flag:"🇳🇪",lat:17.6078,lng:8.0817},
  NG:{name:"Nigeria",flag:"🇳🇬",lat:9.0820,lng:8.6753},
  KP:{name:"North Korea",flag:"🇰🇵",lat:40.3399,lng:127.5101},
  NO:{name:"Norway",flag:"🇳🇴",lat:60.4720,lng:8.4689},
  OM:{name:"Oman",flag:"🇴🇲",lat:21.4735,lng:55.9754},
  PK:{name:"Pakistan",flag:"🇵🇰",lat:30.3753,lng:69.3451},
  PA:{name:"Panama",flag:"🇵🇦",lat:8.5380,lng:-80.7821},
  PG:{name:"Papua New Guinea",flag:"🇵🇬",lat:-6.3150,lng:143.9555},
  PY:{name:"Paraguay",flag:"🇵🇾",lat:-23.4425,lng:-58.4438},
  PE:{name:"Peru",flag:"🇵🇪",lat:-9.1900,lng:-75.0152},
  PH:{name:"Philippines",flag:"🇵🇭",lat:12.8797,lng:121.7740},
  PL:{name:"Poland",flag:"🇵🇱",lat:51.9194,lng:19.1451},
  PT:{name:"Portugal",flag:"🇵🇹",lat:39.3999,lng:-8.2245},
  PR:{name:"Puerto Rico",flag:"🇵🇷",lat:18.2208,lng:-66.5901},
  QA:{name:"Qatar",flag:"🇶🇦",lat:25.3548,lng:51.1839},
  RO:{name:"Romania",flag:"🇷🇴",lat:45.9432,lng:24.9668},
  RU:{name:"Russia",flag:"🇷🇺",lat:61.5240,lng:105.3188},
  RW:{name:"Rwanda",flag:"🇷🇼",lat:-1.9403,lng:29.8739},
  SA:{name:"Saudi Arabia",flag:"🇸🇦",lat:23.8859,lng:45.0792},
  SN:{name:"Senegal",flag:"🇸🇳",lat:14.4974,lng:-14.4524},
  RS:{name:"Serbia",flag:"🇷🇸",lat:44.0165,lng:21.0059},
  SL:{name:"Sierra Leone",flag:"🇸🇱",lat:8.4606,lng:-11.7799},
  SG:{name:"Singapore",flag:"🇸🇬",lat:1.3521,lng:103.8198},
  SK:{name:"Slovakia",flag:"🇸🇰",lat:48.6690,lng:19.6990},
  SI:{name:"Slovenia",flag:"🇸🇮",lat:46.1512,lng:14.9955},
  SO:{name:"Somalia",flag:"🇸🇴",lat:5.1521,lng:46.1996},
  ZA:{name:"South Africa",flag:"🇿🇦",lat:-30.5595,lng:22.9375},
  KR:{name:"South Korea",flag:"🇰🇷",lat:35.9078,lng:127.7669},
  SS:{name:"South Sudan",flag:"🇸🇸",lat:6.8770,lng:31.3070},
  ES:{name:"Spain",flag:"🇪🇸",lat:40.4637,lng:-3.7492},
  LK:{name:"Sri Lanka",flag:"🇱🇰",lat:7.8731,lng:80.7718},
  SD:{name:"Sudan",flag:"🇸🇩",lat:12.8628,lng:30.2176},
  SE:{name:"Sweden",flag:"🇸🇪",lat:60.1282,lng:18.6435},
  CH:{name:"Switzerland",flag:"🇨🇭",lat:46.8182,lng:8.2275},
  SY:{name:"Syria",flag:"🇸🇾",lat:34.8021,lng:38.9968},
  TW:{name:"Taiwan",flag:"🇹🇼",lat:23.6978,lng:120.9605},
  TJ:{name:"Tajikistan",flag:"🇹🇯",lat:38.8610,lng:71.2761},
  TZ:{name:"Tanzania",flag:"🇹🇿",lat:-6.3690,lng:34.8888},
  TH:{name:"Thailand",flag:"🇹🇭",lat:15.8700,lng:100.9925},
  TG:{name:"Togo",flag:"🇹🇬",lat:8.6195,lng:0.8248},
  TT:{name:"Trinidad and Tobago",flag:"🇹🇹",lat:10.6918,lng:-61.2225},
  TN:{name:"Tunisia",flag:"🇹🇳",lat:33.8869,lng:9.5375},
  TR:{name:"Turkey",flag:"🇹🇷",lat:38.9637,lng:35.2433},
  TM:{name:"Turkmenistan",flag:"🇹🇲",lat:38.9697,lng:59.5563},
  UG:{name:"Uganda",flag:"🇺🇬",lat:1.3733,lng:32.2903},
  UA:{name:"Ukraine",flag:"🇺🇦",lat:48.3794,lng:31.1656},
  AE:{name:"United Arab Emirates",flag:"🇦🇪",lat:23.4241,lng:53.8478},
  GB:{name:"United Kingdom",flag:"🇬🇧",lat:55.3781,lng:-3.4360},
  US:{name:"United States",flag:"🇺🇸",lat:37.0902,lng:-95.7129},
  UY:{name:"Uruguay",flag:"🇺🇾",lat:-32.5228,lng:-55.7658},
  UZ:{name:"Uzbekistan",flag:"🇺🇿",lat:41.3775,lng:64.5853},
  VE:{name:"Venezuela",flag:"🇻🇪",lat:6.4238,lng:-66.5897},
  VN:{name:"Vietnam",flag:"🇻🇳",lat:14.0583,lng:108.2772},
  YE:{name:"Yemen",flag:"🇾🇪",lat:15.5527,lng:48.5164},
  ZM:{name:"Zambia",flag:"🇿🇲",lat:-13.1339,lng:27.8493},
  ZW:{name:"Zimbabwe",flag:"🇿🇼",lat:-19.0154,lng:29.1549},
};

// GeoJSON ISO name → ISO2 code mapping (for hit detection)
const NAME_TO_CODE = {};
Object.entries(COUNTRIES).forEach(([code, c]) => {
  NAME_TO_CODE[c.name.toLowerCase()] = code;
});

// Additional aliases for GeoJSON feature names that differ
const GEOJSON_ALIASES = {
  "usa": "US", "united states of america": "US",
  "uk": "GB", "great britain": "GB",
  "russia": "RU", "russian federation": "RU",
  "south korea": "KR", "republic of korea": "KR",
  "north korea": "KP", "democratic people's republic of korea": "KP",
  "iran": "IR", "islamic republic of iran": "IR",
  "syria": "SY", "syrian arab republic": "SY",
  "taiwan": "TW", "taiwan, province of china": "TW",
  "vietnam": "VN", "viet nam": "VN",
  "bolivia": "BO", "plurinational state of bolivia": "BO",
  "venezuela": "VE", "bolivarian republic of venezuela": "VE",
  "tanzania": "TZ", "united republic of tanzania": "TZ",
  "czech republic": "CZ", "czechia": "CZ",
  "moldova": "MD", "republic of moldova": "MD",
  "congo": "CG", "republic of the congo": "CG",
  "dr congo": "CD", "democratic republic of the congo": "CD",
  "côte d'ivoire": "CI", "ivory coast": "CI",
  "palestine": "PS", "west bank": "PS",
  "laos": "LA", "lao pdr": "LA",
  "myanmar": "MM", "burma": "MM",
  "macedonia": "MK", "north macedonia": "MK",
};

// ═══════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════
let activeFilter   = "concerts"; // concerts | topsongs
let selectedCode   = null;
let concertCache   = {};
let countryPins    = {};
let isDragging     = false;   // hoisted — needed by click/hover handling

// ═══════════════════════════════════════════════════
// GLOBE SETUP — Three.js
// ═══════════════════════════════════════════════════
const canvas   = document.getElementById("globeCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.z = 2.8;

scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(5, 3, 5);
scene.add(dirLight);

// globe sphere
const globe = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  new THREE.MeshPhongMaterial({ color: 0x0d0d0f, shininess: 10, specular: 0x000000 })
);
scene.add(globe);

// wireframe overlay
const wireGlobe = new THREE.Mesh(
  new THREE.SphereGeometry(1.001, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x1a0000, wireframe: true, transparent: true, opacity: 0.18 })
);
scene.add(wireGlobe);

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════
function latLngToVec3(lat, lng, r = 1.02) {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "Date TBA";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

// ═══════════════════════════════════════════════════
// COUNTRY BORDERS
// ═══════════════════════════════════════════════════
const borderLines = [];
let geoFeatures   = [];   // stored for hit detection

async function loadCountryBorders() {
  try {
    const res  = await fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson");
    const data = await res.json();
    geoFeatures = data.features;   // keep for click/hover hit testing

    data.features.forEach(feature => {
      const geom  = feature.geometry;
      const polys = geom.type === "Polygon" ? [geom.coordinates]
                  : geom.type === "MultiPolygon" ? geom.coordinates : [];
      polys.forEach(poly => {
        poly.forEach(ring => {
          const pts = ring.map(([lng, lat]) => latLngToVec3(lat, lng, 1.003));
          if (pts.length < 2) return;
          const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pts),
            new THREE.LineBasicMaterial({ color: 0xC10206, transparent: true, opacity: 0.35 })
          );
          scene.add(line);
          borderLines.push(line);
        });
      });
    });
  } catch (e) {
    console.warn("Could not load country borders:", e);
  }
}
loadCountryBorders();

// ── point-in-polygon (ray casting) on a flat ring ──
function pointInRing(px, py, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (((yi > py) !== (yj > py)) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

// Convert a globe-surface hit point → { lat, lng }
function vec3ToLatLng(v) {
  const n   = v.clone().normalize();
  const lat = Math.asin(Math.max(-1, Math.min(1, n.y))) * (180 / Math.PI);
  // latLngToVec3: x = -sin(phi)*cos(theta), z = sin(phi)*sin(theta)
  // theta = (lng+180)*PI/180  →  lng = atan2(z, -x) * 180/PI - 180
  const lng = Math.atan2(n.z, -n.x) * (180 / Math.PI) - 180;
  // normalise to [-180, 180]
  const lngN = ((lng + 540) % 360) - 180;
  return { lat, lng: lngN };
}

// Resolve a { lat, lng } to a country code via GeoJSON hit test,
// Returns { code, name, flag } for a lat/lng point.
// Uses GeoJSON polygon containment first, centroid fallback second.
function resolveCountryFull(lat, lng) {
  for (const feature of geoFeatures) {
    const rawName = (feature.properties?.name || "").toLowerCase();
    const code    = GEOJSON_ALIASES[rawName] || NAME_TO_CODE[rawName] || null;

    const geom  = feature.geometry;
    const polys = geom.type === "Polygon"      ? [geom.coordinates]
                : geom.type === "MultiPolygon" ? geom.coordinates : [];

    for (const poly of polys) {
      if (pointInRing(lng, lat, poly[0])) {
        // use our COUNTRIES record if available, else use GeoJSON name
        if (code && COUNTRIES[code]) {
          return { code, name: COUNTRIES[code].name, flag: COUNTRIES[code].flag };
        } else {
          // derive flag from code, or use globe emoji
          const geoName = feature.properties?.name || "Unknown";
          const derivedFlag = code ? codeToFlag(code) : "🌍";
          return { code: code || rawName, name: geoName, flag: derivedFlag };
        }
      }
    }
  }

  // fallback — nearest centroid from COUNTRIES (only if reasonably close)
  let nearest = null, minDist = Infinity;
  Object.entries(COUNTRIES).forEach(([c, data]) => {
    const d = Math.hypot(lat - data.lat, lng - data.lng);
    if (d < minDist) { minDist = d; nearest = c; }
  });
  // only snap if within ~8 degrees (avoids ocean false-positives)
  if (nearest && minDist < 8) return { code: nearest, name: COUNTRIES[nearest].name, flag: COUNTRIES[nearest].flag };
  return { code: null, name: null, flag: null };
}

// keep old name as alias for backwards compat
function resolveCountry(lat, lng) { return resolveCountryFull(lat, lng).code; }

// convert ISO2 code to flag emoji
function codeToFlag(iso2) {
  if (!iso2 || iso2.length !== 2) return "🌍";
  return String.fromCodePoint(...[...iso2.toUpperCase()].map(c => 0x1F1E6 - 65 + c.charCodeAt(0)));
}

// ═══════════════════════════════════════════════════
// COUNTRY PINS (one per country, always visible)
// ═══════════════════════════════════════════════════
function createCountryPin(code, country) {
  const group = new THREE.Group();
  const color = 0xC10206;

  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.008, 10, 10),
    new THREE.MeshBasicMaterial({ color })
  );
  dot.position.y = 0.008;
  group.add(dot);



  const pos = latLngToVec3(country.lat, country.lng);
  group.position.copy(pos);
  group.lookAt(new THREE.Vector3(0, 0, 0));
  group.rotateX(Math.PI / 2);
  group.userData.code    = code;
  group.userData.country = country;

  return group;
}

// build one pin per country
Object.entries(COUNTRIES).forEach(([code, country]) => {
  const pin = createCountryPin(code, country);
  scene.add(pin);
  countryPins[code] = pin;
});



// ═══════════════════════════════════════════════════
// FILTER TABS + PIN VISIBILITY
// ═══════════════════════════════════════════════════
function setPinVisibility(visible) {
  Object.values(countryPins).forEach(pin => { pin.visible = visible; });
}

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;

    // hide pins in top songs mode, show in concerts mode
    setPinVisibility(activeFilter === "concerts");

    // re-render panel for selected country if one is open
    if (selectedCode) loadCountryPanel(selectedCode);
  });
});

// ═══════════════════════════════════════════════════
// TOOLTIP
// ═══════════════════════════════════════════════════
// ═══════════════════════════════════════════════════
// RAYCASTING — shared setup
// ═══════════════════════════════════════════════════
const raycaster = new THREE.Raycaster();
const mouse     = new THREE.Vector2();

function getGlobeHitLatLng(e) {
  const rect  = canvas.getBoundingClientRect();
  mouse.x =  ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
  mouse.y = -((e.clientY - rect.top)   / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(globe);
  if (!hits.length) return null;
  // un-rotate the hit point back to canonical orientation
  // un-rotate using the globe's actual quaternion inverse
  const pt = hits[0].point.clone();
  pt.applyQuaternion(globe.quaternion.clone().invert());
  return vec3ToLatLng(pt);
}

// ── hover → cursor change ──
canvas.addEventListener("mousemove", e => {
  if (isDragging) return;
  // change cursor to pointer when hovering over globe
  const ll = getGlobeHitLatLng(e);
  canvas.style.cursor = ll ? "pointer" : "default";
});

canvas.addEventListener("mouseleave", () => { canvas.style.cursor = "default"; });

// ── click → select country ──
function onCanvasClick(e) {
  // in concerts mode, also check pins first for a snappier feel
  if (activeFilter === "concerts") {
    const rect = canvas.getBoundingClientRect();
    mouse.x =  ((e.clientX - rect.left)  / rect.width)  * 2 - 1;
    mouse.y = -((e.clientY - rect.top)   / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const meshes = [];
    Object.values(countryPins).forEach(g => g.children.forEach(c => meshes.push(c)));
    const pinHit = raycaster.intersectObjects(meshes);
    if (pinHit.length) {
      selectCountry(pinHit[0].object.parent.userData.code);
      return;
    }
  }

  const ll = getGlobeHitLatLng(e);
  if (!ll) return;
  const { code, name, flag } = resolveCountryFull(ll.lat, ll.lng);
  if (code) selectCountry(code, name, flag);
}

function selectCountry(code, nameOverride, flagOverride) {
  // highlight pin if in concert mode
  Object.entries(countryPins).forEach(([c, pin]) => {
    pin.children.forEach(mesh => {
      if (mesh.material) mesh.material.color.setHex(c === code ? 0xff4444 : 0xC10206);
    });
  });
  selectedCode = code;
  loadCountryPanel(code, nameOverride, flagOverride);
}

// ═══════════════════════════════════════════════════
// PANEL LOADER — switches based on active filter
// ═══════════════════════════════════════════════════
async function loadCountryPanel(code, nameOverride, flagOverride) {
  const country = COUNTRIES[code] || { name: nameOverride || code, flag: flagOverride || codeToFlag(code) };

  document.getElementById("resultsCountry").textContent = country.name;
  document.getElementById("resultsFlag").textContent    = country.flag;

  const panel = document.getElementById("resultsPanel");
  panel.classList.add("visible");
  setTimeout(() => panel.scrollIntoView({ behavior: "smooth", block: "start" }), 60);

  if (activeFilter === "topsongs") {
    showTopSongs(code, country);
  } else {
    showConcerts(code, country);
  }
}

// ═══════════════════════════════════════════════════
// CONCERTS — Ticketmaster via backend proxy
// ═══════════════════════════════════════════════════
async function showConcerts(code, country) {
  document.getElementById("sectionSongs").style.display  = "none";
  document.getElementById("sectionEvent").style.display  = "block";
  document.getElementById("eventTypeLabel").textContent  = "Upcoming Concerts";

  const card = document.getElementById("eventCard");
  card.innerHTML = `<div class="panel-loading"><span class="loading-spinner"></span>Fetching live events…</div>`;

  try {
    if (!concertCache[code]) {
      const res  = await fetch(`/api/concerts?countryCode=${code}&size=6`);
      if (!res.ok) throw new Error("API error " + res.status);
      const data = await res.json();
      concertCache[code] = data.events || [];
    }

    const events = concertCache[code];

    if (!events.length) {
      card.innerHTML = `<div class="panel-no-results"><span>🎵</span><p>No upcoming concerts found for ${country.name}</p></div>`;
      return;
    }

    card.innerHTML = events.map(ev => `
      <div class="concert-row">
        ${ev.image
          ? `<img class="concert-thumb" src="${ev.image}" alt="${ev.name}">`
          : `<div class="concert-thumb-placeholder">🎵</div>`}
        <div class="concert-meta">
          <div class="concert-name">${ev.name}</div>
          <div class="concert-detail">📍 ${ev.venue}${ev.city ? ", " + ev.city : ""}</div>
          <div class="concert-detail">📅 ${formatDate(ev.date)}${ev.time ? " · " + ev.time.slice(0,5) : ""}</div>
          ${ev.genre ? `<div class="concert-genre">${ev.genre}${ev.subGenre && ev.subGenre !== ev.genre ? " · " + ev.subGenre : ""}</div>` : ""}
          ${ev.priceMin ? `<div class="concert-price">From ${ev.currency || "$"}${Math.round(ev.priceMin)}</div>` : ""}
        </div>
        ${ev.url ? `<a class="concert-link" href="${ev.url}" target="_blank" rel="noopener">Get Tickets →</a>` : ""}
      </div>
    `).join("");
  } catch (err) {
    console.error(err);
    card.innerHTML = `<div class="panel-no-results error"><span>✕</span><p>Failed to load concerts. Check your API key or try again.</p></div>`;
  }
}

// ═══════════════════════════════════════════════════
// TOP SONGS — iTunes RSS
// ═══════════════════════════════════════════════════
// ── active audio preview player ──
let currentAudio   = null;
let currentPlayBtn = null;

function stopCurrentPreview() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (currentPlayBtn) {
    currentPlayBtn.textContent = "▶";
    currentPlayBtn.classList.remove("playing");
    currentPlayBtn = null;
  }
}

function formatDuration(secs) {
  if (!secs) return "";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

async function showTopSongs(code, country) {
  document.getElementById("sectionSongs").style.display = "block";
  document.getElementById("sectionEvent").style.display  = "none";

  stopCurrentPreview();

  const grid = document.getElementById("songsList");
  grid.innerHTML = Array.from({length: 10}, (_, i) => `
    <div class="song-card song-card-skeleton">
      <div class="song-card-art-wrap skeleton-art"></div>
      <div class="song-card-info">
        <div class="skeleton-line w80"></div>
        <div class="skeleton-line w60"></div>
        <div class="skeleton-line w40"></div>
      </div>
    </div>
  `).join("");

  try {
    const res  = await fetch(`/api/topsongs?countryCode=${code}&limit=10`);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    const songs = data.songs || [];

    const sectionTitle = document.querySelector("#sectionSongs .panel-section-title");
    if (data.fallback) {
      sectionTitle.innerHTML = `♪ Top Songs <span class="fallback-note">(no data for ${country.name} — showing Global)</span>`;
    } else {
      sectionTitle.innerHTML = `♪ Top Songs in ${country.name}`;
    }

    if (!songs.length) {
      grid.innerHTML = `<div class="songs-empty">No chart data available for ${country.name}</div>`;
      return;
    }

    const fmt = (ms) => {
      if (!ms) return "";
      const m = Math.floor(ms / 60), s = ms % 60;
      return `${m}:${String(s).padStart(2,"0")}`;
    };
    const fmtListeners = (n) => {
      if (!n) return "";
      if (n >= 1000000) return (n/1000000).toFixed(1) + "M";
      if (n >= 1000)    return (n/1000).toFixed(0)    + "K";
      return n;
    };

    grid.innerHTML = songs.map(s => `
      <div class="song-card">
        <div class="song-card-art-wrap">
          ${s.artHD
            ? `<img class="song-card-art" src="${s.artHD}" alt="${s.name}" loading="lazy">`
            : `<div class="song-card-art-placeholder"><span class="art-music-icon">♪</span></div>`
          }
          <span class="song-card-rank">${s.rank}</span>
        </div>
        <div class="song-card-info">
          <div class="song-card-title">${s.name}</div>
          <div class="song-card-artist">${s.artist}</div>
          <div class="song-card-meta">
            ${s.genre    ? `<span class="song-card-genre">${s.genre}</span>`              : ""}
            ${s.duration ? `<span class="song-card-duration">${fmt(s.duration)}</span>`   : ""}
            ${s.listeners ? `<span class="song-card-listeners">${fmtListeners(s.listeners)} listeners</span>` : ""}
          </div>
        </div>
        ${s.url ? `<a class="song-card-link" href="${s.url}" target="_blank" rel="noopener">Last.fm →</a>` : ""}
      </div>
    `).join("");

  } catch {
    grid.innerHTML = `<div class="songs-empty">Failed to load chart data. Try again.</div>`;
  }
}

// ═══════════════════════════════════════════════════
// PANEL CLOSE
// ═══════════════════════════════════════════════════
document.getElementById("panelClose").addEventListener("click", () => {
  document.getElementById("resultsPanel").classList.remove("visible");
  // scroll back up to globe
  document.querySelector(".globe-stage").scrollIntoView({ behavior: "smooth", block: "start" });
  // reset pin colours
  Object.values(countryPins).forEach(pin => {
    pin.children.forEach(mesh => {
      if (mesh.material) mesh.material.color.setHex(0xC10206);
    });
  });
  selectedCode = null;
});


// ═══════════════════════════════════════════════════
// DRAG / HOVER / ROTATION
// ═══════════════════════════════════════════════════
let isHovering = false;
let prevX = 0, prevY = 0;
let rotX = 0, rotY = 0, velX = 0, velY = 0;
let mouseDownPos = { x: 0, y: 0 };

canvas.addEventListener("mouseenter", () => { isHovering = true; });
canvas.addEventListener("mouseleave", () => { isHovering = false; });

canvas.addEventListener("mousedown", e => {
  isDragging = true;
  prevX = e.clientX; prevY = e.clientY;
  mouseDownPos = { x: e.clientX, y: e.clientY };
  velX = 0; velY = 0;
});
window.addEventListener("mouseup",   () => { isDragging = false; });
window.addEventListener("mousemove", e => {
  if (!isDragging) return;
  velY = (e.clientX - prevX) * 0.005;
  velX = (e.clientY - prevY) * 0.005;
  rotY += velY; rotX += velX;
  rotX = Math.max(-1.2, Math.min(1.2, rotX));
  prevX = e.clientX; prevY = e.clientY;
});

// click vs drag
canvas.addEventListener("click", e => {
  const dx = e.clientX - mouseDownPos.x;
  const dy = e.clientY - mouseDownPos.y;
  if (Math.sqrt(dx * dx + dy * dy) > 4) return;
  onCanvasClick(e);
});

// touch
canvas.addEventListener("touchstart", e => {
  isDragging = true;
  prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
  mouseDownPos = { x: prevX, y: prevY };
  velX = 0; velY = 0;
});
canvas.addEventListener("touchend",   () => { isDragging = false; });
canvas.addEventListener("touchmove",  e => {
  if (!isDragging) return;
  velY = (e.touches[0].clientX - prevX) * 0.005;
  velX = (e.touches[0].clientY - prevY) * 0.005;
  rotY += velY; rotX += velX;
  rotX = Math.max(-1.2, Math.min(1.2, rotX));
  prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
  e.preventDefault();
}, { passive: false });

// ═══════════════════════════════════════════════════
// RESIZE
// ═══════════════════════════════════════════════════
function resize() {
  const wrap = document.querySelector(".globe-stage");
  const size = Math.min(wrap.clientWidth - 48, 650);
  renderer.setSize(size, size);
  camera.aspect = 1;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();

// ═══════════════════════════════════════════════════
// ANIMATION LOOP
// ═══════════════════════════════════════════════════
let t = 0;
function animate() {
  requestAnimationFrame(animate);
  t += 0.01;

  if (isDragging) {
    // user dragging — no auto spin
  } else if (isHovering) {
    velX *= 0.88; velY *= 0.88;
    rotY += velY; rotX += velX;
  } else {
    velX *= 0.92; velY *= 0.92;
    rotY += velY; rotX += velX;
    rotY += 0.002;
  }

  globe.rotation.y     = rotY;
  globe.rotation.x     = rotX;
  wireGlobe.rotation.y = rotY;
  wireGlobe.rotation.x = rotX;
  borderLines.forEach(l => { l.rotation.y = rotY; l.rotation.x = rotX; });

  // sync country pins
  Object.entries(countryPins).forEach(([code, g], i) => {
    const c = COUNTRIES[code];
    const rotatedPos = latLngToVec3(c.lat, c.lng)
      .clone().applyEuler(new THREE.Euler(rotX, rotY, 0));
    g.position.copy(rotatedPos);
    g.lookAt(new THREE.Vector3(0, 0, 0));
    g.rotateX(Math.PI / 2);


  });

  renderer.render(scene, camera);
}
animate();