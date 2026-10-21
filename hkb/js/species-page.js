/* Hydrate one species page from hkb/data/pages.json.
   Address: detail.html?species=49562&language=en */

function hkbPageEsc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    }[ch]));
}

function hkbPair(en, zh) {
    return `<span class="lang-en">${hkbPageEsc(en)}</span><span class="lang-zh hidden">${hkbPageEsc(zh)}</span>`;
}

function hkbApaReference(ref) {
    if (!ref) return "";
    const vol = ref.volume ? ` (Vol. ${hkbPageEsc(ref.volume)})` : "";
    const titleZh = ref.title_zh ? ` [${hkbPageEsc(ref.title_zh)}]` : "";
    return `${hkbPageEsc(ref.authors)} (${hkbPageEsc(ref.year)}). <em>${hkbPageEsc(ref.title)}</em>${titleZh}${vol}. ${hkbPageEsc(ref.publisher)}.`;
}

function hkbPhenologyRows(flower, fruit) {
    const letters = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    const row = (months, onClass) => {
        const cells = [];
        for (let m = 1; m <= 12; m++) {
            const on = months.includes(m);
            cells.push(`<div class="month ${on ? onClass : "inactive"}" style="height:${on ? "100%" : "30%"}" title="${letters[m - 1]}"></div>`);
        }
        return `<div class="phenology-bar" style="height:22px">${cells.join("")}</div>`;
    };
    const caption = letters.map((letter) => `<div class="month-label">${letter}</div>`).join("");
    return `<div class="space-y-2">
        <div>
            <div class="text-[11px] font-semibold tracking-wide text-stone-500 mb-1">${hkbPair("Flowering", "花期")}</div>
            ${row(parseMonths(flower), "active")}
        </div>
        <div>
            <div class="text-[11px] font-semibold tracking-wide text-stone-500 mb-1">${hkbPair("Fruiting", "果期")}</div>
            ${row(parseMonths(fruit), "fruit")}
            <div class="phenology-bar" style="height:auto">${caption}</div>
        </div>
    </div>`;
}

function hkbSpeciesQuery() {
    const params = new URLSearchParams(location.search);
    const species = (params.get("species") || "").trim();
    return /^\d{5}$/.test(species) ? species : "";
}

(function hkbSyncLanguageFromUrl() {
    const lang = new URLSearchParams(location.search).get("language");
    if (lang === "en" || lang === "zh") {
        currentLang = lang;
        localStorage.setItem("hkb-lang", lang);
    }
})();

function hkbCard(icon, titleHtml, bodyHtml) {
    return `<div class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 bg-stone-50 border-b border-stone-200">
            <h2 class="font-serif font-bold text-lg text-stone-900 flex items-center gap-2"><i class="${icon} text-botanical"></i> ${titleHtml}</h2>
        </div>
        <div class="p-6">${bodyHtml}</div>
    </div>`;
}

function hkbRenderPage(page) {
    document.title = `${page.sci} · BLP ${page.blp} | Hong Kong Botanica`;
    const hero = document.getElementById("speciesHero");
    const heroUrl = page.hero_id ? hkbPhotoUrl(page.hero_id) : page.hero;
    hero.style.backgroundImage = `linear-gradient(to top, rgba(28,25,23,0.82), rgba(28,25,23,0.35)), url("${heroUrl}")`;
    const native = page.native
        ? `<span class="bg-emerald-600/90 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">${hkbPair("Native", "原生")}</span>`
        : "";
    hero.innerHTML = `<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div class="flex flex-col gap-3">
            <div class="flex flex-wrap items-center gap-3">
                <span class="blp-badge" title="BLP">BLP ${hkbPageEsc(page.blp)}</span>
                ${native}
                <span class="bg-white/20 backdrop-blur text-white text-xs font-medium px-3 py-1 rounded-full">${hkbPageEsc(page.family)}</span>
            </div>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white italic drop-shadow-lg">${hkbPageEsc(page.sci)}</h1>
            <p class="text-xl md:text-2xl text-white/90 font-light">${hkbPageEsc(page.chi_line || "")}</p>
            <p class="text-lg text-white/70 font-serif">${hkbPageEsc(page.authority || "")}</p>
        </div>
    </div>`;

    document.getElementById("speciesCrumb").innerHTML = `<span class="text-stone-900 font-medium italic">${hkbPageEsc(page.sci)}</span>
        <span class="blp-badge blp-badge-ink">BLP ${hkbPageEsc(page.blp)}</span>`;

    const taxRows = [
        ["Order", "目", page.order, false],
        ["Family", "科", page.family, false],
        ["Genus", "屬", page.genus, true],
        ["Species", "種", page.sci, true]
    ].map(([en, zh, value, italic]) => `<tr class="border-b border-stone-100 last:border-b-0">
        <td class="py-2.5 pr-4 text-stone-500 font-medium w-32">${hkbPair(en, zh)}</td>
        <td class="py-2.5 ${italic ? "italic" : ""}">${hkbPageEsc(value)}</td>
    </tr>`).join("");

    const morph = (page.morphology || []).map((block, i) => `<div class="${i ? "border-t border-stone-100 pt-6" : ""}">
        <h3 class="font-serif font-bold text-stone-900 text-base mb-3">${hkbPair(block.title_en, block.title_zh)}</h3>
        <div class="space-y-4">${(block.items || []).map((item) => `<div>
            <div class="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-1">${hkbPair(item.label_en, item.label_zh)}</div>
            <p class="lang-en">${hkbPageEsc(item.en)}</p>
            <p class="lang-zh hidden">${hkbPageEsc(item.zh)}</p>
        </div>`).join("")}</div>
    </div>`).join("");

    const ecology = `<ul class="list-disc list-inside space-y-3 text-stone-700 leading-relaxed">${(page.ecology || []).map((item) => `<li>
        <span class="lang-en"><strong>${hkbPageEsc(item.label_en)}.</strong> ${hkbPageEsc(item.en)}</span>
        <span class="lang-zh hidden"><strong>${hkbPageEsc(item.label_zh)}。</strong> ${hkbPageEsc(item.zh)}</span>
    </li>`).join("")}</ul>`;

    const facts = (page.facts || []).map((fact) => `<div class="flex items-start gap-3">
        <div class="w-9 h-9 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center flex-shrink-0"><i class="fa-solid ${hkbPageEsc(fact.icon || "fa-circle")}"></i></div>
        <div class="w-full">
            <div class="text-xs text-stone-400 font-semibold uppercase tracking-wider">${hkbPair(fact.label_en, fact.label_zh)}</div>
            <div class="text-stone-800 font-medium text-sm">${hkbPair(fact.en, fact.zh)}</div>
            ${fact.phenology ? `<div id="speciesPheno" class="mt-2"></div>` : ""}
        </div>
    </div>`).join("");

    const chips = (names) => (names || []).map((name) => `<span class="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm font-medium">${hkbPageEsc(name)}</span>`).join("");

    document.getElementById("speciesColumns").innerHTML = `<div class="w-full lg:w-[60%] space-y-8">
        ${hkbCard("fa-solid fa-sitemap", hkbPair("Taxonomic classification", "分類"), `<table class="w-full text-sm"><tbody>${taxRows}</tbody></table>`)}
        ${hkbCard("fa-solid fa-seedling", hkbPair("Plant morphology", "植物形態"), `<div class="space-y-6 text-stone-700 leading-relaxed text-sm">${morph}</div>`)}
        ${hkbCard("fa-solid fa-leaf", hkbPair("Ecology", "生態"), ecology)}
        ${hkbCard("fa-solid fa-camera", hkbPair("Representative photographs", "代表照片"), `<div id="photoMount"></div>`)}
        ${hkbCard("fa-solid fa-bookmark", hkbPair("Source", "出處"), `<p class="text-sm text-stone-600 leading-relaxed">${hkbApaReference(page.reference)}</p>`)}
    </div>
    <div class="w-full lg:w-[40%] space-y-6">
        <div class="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div class="px-6 py-4 bg-botanical-dark text-white">
                <h2 class="font-serif font-bold text-lg flex items-center gap-2"><i class="fa-solid fa-clipboard-list"></i> ${hkbPair("Quick facts", "速覽")}</h2>
            </div>
            <div class="p-6 space-y-5">${facts}</div>
        </div>
        ${hkbCard("fa-solid fa-language", hkbPair("Names", "名稱"), `<div class="space-y-4">
            <div>
                <div class="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-1">Scientific name</div>
                <div class="text-stone-900 font-serif italic text-lg">${hkbPageEsc(page.sci)} <span class="not-italic text-stone-500 text-sm">${hkbPageEsc(page.authority || "")}</span></div>
                ${page.synonyms && page.synonyms.length ? `<p class="text-sm text-stone-500 mt-1">${hkbPair("Synonyms", "異名")} ${page.synonyms.map((name) => `<span class="italic">${hkbPageEsc(name)}</span>`).join(", ")}</p>` : ""}
            </div>
            <div class="border-t border-stone-100 pt-4">
                <div class="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-1.5">${hkbPair("Chinese names", "中文名")}</div>
                <div class="flex flex-wrap gap-2">${chips(page.chi_names)}</div>
            </div>
            <div class="border-t border-stone-100 pt-4">
                <div class="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-1.5">${hkbPair("English names", "英文名")}</div>
                <div class="flex flex-wrap gap-2">${chips(page.en_names)}</div>
            </div>
            <div class="border-t border-stone-100 pt-4">
                <span class="blp-badge blp-badge-ink">BLP ${hkbPageEsc(page.blp)}</span>
            </div>
        </div>`)}
    </div>`;

    document.getElementById("speciesStatus").classList.add("hidden");
    hero.classList.remove("hidden");
    document.getElementById("speciesMain").classList.remove("hidden");
    if (page.flower) {
        const el = document.getElementById("speciesPheno");
        const fruitArg = Object.prototype.hasOwnProperty.call(page, "fruit") ? page.fruit : page.flower;
        if (el) el.innerHTML = hkbPhenologyRows(page.flower, fruitArg);
    }
}

function hkbPhotoViewer(photos) {
    const mount = document.getElementById("photoMount");
    if (!photos || !photos.length) {
        mount.innerHTML = `<p class="text-sm text-stone-400">${hkbPair("No representative photographs yet.", "尚未有代表照片。")}</p>`;
        return;
    }
    const state = { i: 0, scale: 1, open: false, controls: true, panX: 0, panY: 0 };
    mount.innerHTML = `<div id="photoStage" class="photo-stage">
        <button type="button" class="photo-toggle" id="photoToggle" aria-pressed="true">
            <i class="fa-solid fa-sliders"></i>
            <span class="lang-en">Controls</span><span class="lang-zh hidden">控制</span>
        </button>
        <button type="button" class="photo-arrow prev" data-act="left" aria-label="Left"><i class="fa-solid fa-chevron-left"></i></button>
        <button type="button" class="photo-arrow next" data-act="right" aria-label="Right"><i class="fa-solid fa-chevron-right"></i></button>
        <img id="photoImg" alt="" draggable="false">
        <p id="photoCaption" class="photo-caption"></p>
        <div id="photoDock" class="photo-dock">
            <button type="button" data-act="enlarge"><i class="fa-solid fa-magnifying-glass-plus"></i><span class="lang-en">Enlarge</span><span class="lang-zh hidden">放大</span></button>
            <button type="button" data-act="contract"><i class="fa-solid fa-magnifying-glass-minus"></i><span class="lang-en">Contract</span><span class="lang-zh hidden">縮小</span></button>
            <button type="button" data-act="left"><i class="fa-solid fa-chevron-left"></i><span class="lang-en">Left</span><span class="lang-zh hidden">向左</span></button>
            <button type="button" data-act="right"><i class="fa-solid fa-chevron-right"></i><span class="lang-en">Right</span><span class="lang-zh hidden">向右</span></button>
            <button type="button" data-act="close"><i class="fa-solid fa-xmark"></i><span class="lang-en">Close</span><span class="lang-zh hidden">關閉</span></button>
        </div>
    </div>
    <div id="photoThumbs" class="photo-thumbs"></div>
    <p id="photoCount" class="text-xs text-stone-400 mt-2"></p>`;

    const stage = document.getElementById("photoStage");
    const img = document.getElementById("photoImg");
    const thumbs = document.getElementById("photoThumbs");
    thumbs.innerHTML = photos.map((photo, i) => `<button type="button" class="photo-thumb" data-i="${i}"><img src="${hkbPageEsc(photo.image_id ? hkbPhotoUrl(photo.image_id, "H300") : photo.src)}" alt=""></button>`).join("");

    function applyFrame() {
        const photo = photos[state.i];
        img.src = photo.image_id ? hkbPhotoUrl(photo.image_id) : photo.src;
        img.alt = photo.en || "";
        document.getElementById("photoCaption").innerHTML = hkbPair(photo.en, photo.zh);
        document.getElementById("photoCount").textContent = `${state.i + 1} / ${photos.length}`;
        thumbs.querySelectorAll(".photo-thumb").forEach((btn, i) => btn.classList.toggle("on", i === state.i));
        img.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.scale})`;
        stage.classList.toggle("is-enlarged", state.open);
        stage.classList.toggle("controls-off", !state.controls);
        document.getElementById("photoToggle").setAttribute("aria-pressed", state.controls ? "true" : "false");
        document.body.style.overflow = state.open ? "hidden" : "";
        if (typeof applyLanguage === "function") applyLanguage();
    }

    function flip(step) {
        state.i = (state.i + step + photos.length) % photos.length;
        state.scale = 1;
        state.panX = 0;
        state.panY = 0;
        applyFrame();
    }

    function enlarge() {
        if (!state.open) {
            state.open = true;
            state.scale = 1;
        } else {
            state.scale = Math.min(3, Math.round((state.scale + 0.5) * 10) / 10);
        }
        applyFrame();
    }

    function contract() {
        if (state.scale > 1) {
            state.scale = Math.max(1, Math.round((state.scale - 0.5) * 10) / 10);
            if (state.scale === 1) {
                state.panX = 0;
                state.panY = 0;
            }
        } else if (state.open) {
            state.open = false;
            state.panX = 0;
            state.panY = 0;
        }
        applyFrame();
    }

    function closeViewer() {
        state.open = false;
        state.scale = 1;
        state.panX = 0;
        state.panY = 0;
        applyFrame();
    }

    function act(name) {
        if (name === "left") flip(-1);
        else if (name === "right") flip(1);
        else if (name === "enlarge") enlarge();
        else if (name === "contract") contract();
        else if (name === "close") closeViewer();
    }

    stage.addEventListener("click", (event) => {
        const button = event.target.closest("[data-act]");
        if (button) {
            event.preventDefault();
            act(button.dataset.act);
            return;
        }
        if (event.target.id === "photoToggle" || event.target.closest("#photoToggle")) {
            state.controls = !state.controls;
            applyFrame();
            return;
        }
        if (event.target === img) {
            if (!state.open) enlarge();
            else if (!state.controls) {
                state.controls = true;
                applyFrame();
            }
        }
    });
    thumbs.addEventListener("click", (event) => {
        const button = event.target.closest("[data-i]");
        if (!button) return;
        state.i = parseInt(button.dataset.i, 10);
        state.scale = 1;
        state.panX = 0;
        state.panY = 0;
        applyFrame();
    });

    let drag = null;
    img.addEventListener("pointerdown", (event) => {
        if (!state.open || state.scale <= 1) {
            drag = { x: event.clientX, y: event.clientY, swipe: true };
            return;
        }
        drag = { x: event.clientX, y: event.clientY, panX: state.panX, panY: state.panY, swipe: false };
        img.setPointerCapture(event.pointerId);
    });
    img.addEventListener("pointermove", (event) => {
        if (!drag || drag.swipe) return;
        state.panX = drag.panX + (event.clientX - drag.x);
        state.panY = drag.panY + (event.clientY - drag.y);
        img.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.scale})`;
    });
    img.addEventListener("pointerup", (event) => {
        if (!drag) return;
        const dx = event.clientX - drag.x;
        if (drag.swipe && Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(event.clientY - drag.y)) {
            flip(dx < 0 ? 1 : -1);
        }
        drag = null;
    });

    document.addEventListener("keydown", (event) => {
        if (event.target.matches("input, textarea")) return;
        if (event.key === "ArrowLeft") act("left");
        else if (event.key === "ArrowRight") act("right");
        else if (event.key === "Escape") closeViewer();
        else if (event.key === "+" || event.key === "=") enlarge();
        else if (event.key === "-" || event.key === "_") contract();
    });

    applyFrame();
}

document.addEventListener("DOMContentLoaded", () => {
    const blp = hkbSpeciesQuery();
    const status = document.getElementById("speciesStatus");
    const params = new URLSearchParams(location.search);
    if (params.get("language") !== "en" && params.get("language") !== "zh") {
        params.set("language", currentLang === "zh" ? "zh" : "en");
        if (blp) params.set("species", blp);
        history.replaceState(null, "", location.pathname + "?" + params.toString());
    }
    if (!blp) {
        status.textContent = "This page needs a species number, such as detail.html?species=49562&language=en.";
        return;
    }
    fetch("../data/pages.json?v=9").then((res) => {
        if (!res.ok) throw new Error("pages.json " + res.status);
        return res.json();
    }).then((data) => {
        const page = (data.pages || {})[blp];
        if (!page) {
            status.textContent = "No page details for BLP " + blp + ".";
            return;
        }
        hkbRenderPage(page);
        hkbPhotoViewer(page.photos || []);
        if (typeof applyLanguage === "function") applyLanguage();
    }).catch((err) => {
        status.textContent = "Could not load the species page. Open this page through a local server. " + err.message;
    });
});
