(function loadLucideIcons() {
    if (window.lucide?.createIcons) return;
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/lucide@latest';
    script.onload = () => {
        if (typeof renderLucideIcons === 'function') renderLucideIcons(document);
    };
    document.head.appendChild(script);
})();
(async () => {
    try {
        const [appModule, authModule, firestoreModule] = await Promise.all([
            import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"),
            import("https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"),
            import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js")
        ]);
        const { initializeApp } = appModule;
        const { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut: fbSignOut, onAuthStateChanged, setPersistence, browserLocalPersistence } = authModule;
        const { getFirestore, doc, setDoc, getDoc } = firestoreModule;
        const firebaseConfig = { apiKey: "AIzaSyBGByQV7o655YvsCa8_c16P6zIaMGr7Uq0", authDomain: "falconx-f1016.firebaseapp.com", projectId: "falconx-f1016", storageBucket: "falconx-f1016.firebasestorage.app", messagingSenderId: "357270984794", appId: "1:357270984794:web:93a4c9e3502eeeeca42063" };
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        await setPersistence(auth, browserLocalPersistence);
        await getRedirectResult(auth);
        window.signInWithGoogle = async () => {
            const provider = new GoogleAuthProvider();
            try { await signInWithPopup(auth, provider); }
            catch (err) { await signInWithRedirect(auth, provider); }
        };
        window.signOut = async () => { await fbSignOut(auth); };
        window._saveToCloud = async () => {
            if (!auth.currentUser) return;
            const ref = doc(db, "users", auth.currentUser.uid);
            await setDoc(ref, { likedSongs: Array.from(likedSongs), playlists: playlists }, { merge: true });
        };
        async function loadUserData() {
            if (!auth.currentUser) return;
            const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
            if (snap.exists()) {
                const data = snap.data();
                const cloudLiked = Array.isArray(data.likedSongs) ? data.likedSongs.filter((f) => typeof f === "string") : [];
                cloudLiked.forEach((f) => likedSongs.add(f));
                if (data.playlists && typeof data.playlists === "object") {
                    for (const id in data.playlists) {
                        const incoming = data.playlists[id];
                        if (!incoming || typeof incoming !== "object") continue;
                        const incomingSongs = Array.isArray(incoming.songs) ? incoming.songs.filter((s) => s && typeof s === "object" && typeof s.file === "string").map((s) => ({ ...s, file: s.file, title: typeof s.title === "string" ? s.title : "", poster: typeof s.poster === "string" ? s.poster : "", artistName: typeof s.artistName === "string" ? s.artistName : "", addedAt: typeof s.addedAt === "number" ? s.addedAt : 0 })) : [];
                        if (!playlists[id]) {
                            playlists[id] = { ...incoming, name: typeof incoming.name === "string" ? incoming.name : "Playlist", songs: incomingSongs };
                            continue;
                        }
                        const localSongs = Array.isArray(playlists[id].songs) ? playlists[id].songs : [];
                        const seen = new Set(localSongs.map((s) => s && s.file).filter((f) => typeof f === "string"));
                        const mergedSongs = [...localSongs];
                        incomingSongs.forEach((s) => {
                            if (!seen.has(s.file)) {
                                seen.add(s.file);
                                mergedSongs.push(s);
                            }
                        });
                        playlists[id] = { ...incoming, ...playlists[id], name: typeof playlists[id].name === "string" && playlists[id].name ? playlists[id].name : (typeof incoming.name === "string" ? incoming.name : "Playlist"), songs: mergedSongs };
                    }
                }
                if (typeof saveAppData === "function") saveAppData();
                else {
                    localStorage.setItem("eq_liked", JSON.stringify([...likedSongs]));
                    localStorage.setItem("eq_playlists", JSON.stringify(playlists));
                }
                try { if (typeof refreshVisibleSongLists === "function") refreshVisibleSongLists(); } catch (e) {}
            }
        }
        onAuthStateChanged(auth, async user => {
            const loginBtn = document.getElementById("loginBtn");
            const userBar = document.getElementById("userBar");
            const syncDot = document.getElementById("syncDot");
            const syncLabel = document.getElementById("syncLabel");
            const userNameEl = document.getElementById("userDisplayNameMain");
            const userEmailEl = document.getElementById("userEmailMain");
            const userAvatarEl = document.getElementById("userAvatarMain");
            const mobileLoginBtn = document.getElementById("mobileLoginBtn");
            const mobileUserBtn = document.getElementById("mobileUserBtn");
            const mobileUserAvatar = document.getElementById("mobileUserAvatar");
            if (user) {
                if (loginBtn) loginBtn.style.display = "none";
                if (userBar) userBar.style.display = "flex";
                if (userNameEl) userNameEl.textContent = user.displayName || "User";
                if (userEmailEl) userEmailEl.textContent = user.email || "";
                if (userAvatarEl) userAvatarEl.src = user.photoURL || "";
                if (mobileLoginBtn) mobileLoginBtn.style.display = "none";
                if (mobileUserBtn) mobileUserBtn.style.display = "flex";
                if (mobileUserAvatar) mobileUserAvatar.src = user.photoURL || "";
                if (syncDot) syncDot.className = "sync-dot syncing";
                if (syncLabel) syncLabel.textContent = "Syncing...";
                await loadUserData();
                if (syncDot) syncDot.className = "sync-dot synced";
                if (syncLabel) syncLabel.textContent = "Synced";
            } else {
                if (userBar) userBar.style.display = "none";
                if (loginBtn) loginBtn.style.display = "block";
                if (mobileLoginBtn) mobileLoginBtn.style.display = "flex";
                if (mobileUserBtn) mobileUserBtn.style.display = "none";
                if (syncDot) syncDot.className = "sync-dot";
                if (syncLabel) syncLabel.textContent = "Offline";
            }
        });
    } catch (err) {
        console.error('Firebase initialization failed:', err);
    }
})();
// Appearance system: themes, accents, toggles, persistence
        (function(){
            const STORAGE_KEY = 'appearance_settings_v1';
            const defaults = { mode: 'dark', theme: 'green', accent: '#c8f542', dynamicAlbum: true, blurEffects: true, animations: true, glass: true };

            function $(sel,root=document) { return root.querySelector(sel); }
            function $all(sel,root=document){ return Array.from(root.querySelectorAll(sel)); }

            function applySettings(s){
                const set = Object.assign({}, defaults, s);
                // Mode palettes
                if(set.mode==='light'){
                    document.documentElement.style.setProperty('--bg','#f7f8fb');
                    document.documentElement.style.setProperty('--bg2','#f2f3f6');
                    document.documentElement.style.setProperty('--surface','#ffffff');
                    document.documentElement.style.setProperty('--surface2','#fbfbfd');
                    document.documentElement.style.setProperty('--surface3','#f0f0f0');
                    document.documentElement.style.setProperty('--text','#0a0a0a');
                    document.documentElement.style.setProperty('--text2','#505050');
                } else if(set.mode==='amoled'){
                    document.documentElement.style.setProperty('--bg','#000000');
                    document.documentElement.style.setProperty('--bg2','#050505');
                    document.documentElement.style.setProperty('--surface','#0a0a0a');
                    document.documentElement.style.setProperty('--surface2','#0d0d0d');
                    document.documentElement.style.setProperty('--surface3','#111111');
                    document.documentElement.style.setProperty('--text','#eaeaea');
                    document.documentElement.style.setProperty('--text2','#9b9b9b');
                } else {
                    // dark
                    document.documentElement.style.setProperty('--bg','#0a0a0a');
                    document.documentElement.style.setProperty('--bg2','#121212');
                    document.documentElement.style.setProperty('--surface','#181818');
                    document.documentElement.style.setProperty('--surface2','#1f1f1f');
                    document.documentElement.style.setProperty('--surface3','#282828');
                    document.documentElement.style.setProperty('--text','#ffffff');
                    document.documentElement.style.setProperty('--text2','#b3b3b3');
                }

                // Theme palettes
                const themeMap = {
                    green: {accent:'#c8f542',accent2:'#9fd02a',ambient:'200,245,66'},
                    blue: {accent:'#4e9cff',accent2:'#3b7be0',ambient:'78,156,255'},
                    purple: {accent:'#a45fff',accent2:'#7b3fd6',ambient:'164,95,255'},
                    red: {accent:'#ff6b6b',accent2:'#d94a4a',ambient:'255,107,107'},
                    gold: {accent:'#ffd166',accent2:'#e6b800',ambient:'255,209,102'},
                    orange: {accent:'#ff9248',accent2:'#ff6a24',ambient:'255,146,72'},
                    pink: {accent:'#ff9ac2',accent2:'#ff6fa8',ambient:'255,154,194'}
                };
                const t = themeMap[set.theme] || themeMap.green;
                document.documentElement.style.setProperty('--accent', set.accent || t.accent);
                document.documentElement.style.setProperty('--accent2', t.accent2);
                document.documentElement.style.setProperty('--accent-glow', (set.accent || t.accent) + '22');
                document.documentElement.style.setProperty('--ambient-rgb', t.ambient);

                // Accent override if user chooses a specific color
                if(set.accent){ document.documentElement.style.setProperty('--accent', set.accent); }

                // Toggles
                if(set.blurEffects) document.body.classList.remove('no-blur'); else document.body.classList.add('no-blur');
                if(set.animations) document.body.classList.remove('no-animations'); else document.body.classList.add('no-animations');
                if(set.dynamicAlbum) document.body.classList.add('dynamic-album'); else document.body.classList.remove('dynamic-album');
                if(set.glass) document.body.classList.remove('no-glass'); else document.body.classList.add('no-glass');

                // Update UI controls
                $all('[name="ap-mode"]').forEach(r=>r.checked=(r.value===set.mode));
                $all('.ap-swatch[data-theme]').forEach(b=>b.classList.toggle('active', b.dataset.theme===set.theme));
                $all('.ap-swatch[data-accent]').forEach(b=>b.classList.toggle('active', (b.dataset.accent||'').toLowerCase() === (set.accent||'').toLowerCase()));
                $all('.ap-switch').forEach(el=>{ const key=el.dataset.key; const on = !!set[key]; el.classList.toggle('on', on); });

                localStorage.setItem(STORAGE_KEY, JSON.stringify(set));
            }

            function loadSettings(){ try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaults; }catch(e){ return defaults; } }

            // Open/close
            window.openAppearance = function(){ const bp = $('#appearanceBackdrop'); const panel = $('#appearancePanel'); if(!bp||!panel) return; bp.classList.add('open'); panel.classList.add('open'); panel.classList.toggle('desktop-modal', window.innerWidth >= 769); bp.setAttribute('aria-hidden','false'); panel.setAttribute('aria-hidden','false'); }
            window.closeAppearance = function(){ const bp = $('#appearanceBackdrop'); const panel = $('#appearancePanel'); if(!bp||!panel) return; bp.classList.remove('open'); panel.classList.remove('open'); panel.classList.remove('desktop-modal'); bp.setAttribute('aria-hidden','true'); panel.setAttribute('aria-hidden','true'); }

            // Reset
            window.resetAppearance = function(){ localStorage.removeItem(STORAGE_KEY); applySettings(defaults); }

            // Wire up controls
            document.addEventListener('click', (e)=>{
                const t = e.target;
                if(!t) return;
                // swatches: themes
                const themeBtn = t.closest('.ap-swatch[data-theme]');
                if(themeBtn){ const current = loadSettings(); current.theme = themeBtn.dataset.theme; applySettings(current); return; }
                const accentBtn = t.closest('.ap-swatch[data-accent]');
                if(accentBtn){ const current = loadSettings(); current.accent = accentBtn.dataset.accent; applySettings(current); return; }
                const radio = t.closest('label.ap-radio');
                if(radio && radio.querySelector('input[name="ap-mode"]')){
                    const val = radio.querySelector('input[name="ap-mode"]').value; const current=loadSettings(); current.mode=val; applySettings(current); return;
                }
                const sw = t.closest('.ap-switch');
                if(sw){ const k = sw.dataset.key; const s = loadSettings(); s[k] = !s[k]; applySettings(s); return; }
            }, true);

            // Initialize on load
            document.addEventListener('DOMContentLoaded', ()=>{
                const s = loadSettings(); applySettings(s);
            });
        })();
        const splashEl = document.getElementById('splash');
        const splashBarFillEl = document.getElementById('splashBarFill');
        let splashDone = false;

        function setSplashProgress(value) {
            const pct = Math.max(0, Math.min(100, Math.round(value)));
            if (splashBarFillEl) splashBarFillEl.style.width = pct + "%";
        }

        function finishSplash() {
            if (splashDone) return;
            splashDone = true;
            document.body.classList.add("app-ready");
            if (splashEl) splashEl.classList.add("is-exiting");
            setTimeout(() => {
                document.body.classList.remove("loading");
                document.body.classList.add("app-revealed");
                if (splashEl) splashEl.style.display = "none";
            }, 920);
        }

        function startSplashSequence() {
            if (!splashEl) {
                document.body.classList.remove("loading");
                return;
            }
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            const startTime = performance.now();
            const minViewMs = reduceMotion ? 420 : 3300;
            const progressDurationMs = reduceMotion ? 300 : 3400;
            let progressComplete = false;
            let pageReady = document.readyState === "complete";

            const maybeFinish = () => {
                if (!progressComplete || !pageReady) return;
                const elapsed = performance.now() - startTime;
                const waitMs = Math.max(0, minViewMs - elapsed);
                setTimeout(finishSplash, waitMs);
            };

            const progressStart = performance.now();
            const progressStep = (now) => {
                const t = Math.min(1, (now - progressStart) / progressDurationMs);
                const eased = 1 - Math.pow(1 - t, 3);
                setSplashProgress(eased * 100);
                if (t < 1) {
                    requestAnimationFrame(progressStep);
                } else {
                    progressComplete = true;
                    maybeFinish();
                }
            };
            requestAnimationFrame(progressStep);

            if (!pageReady) {
                window.addEventListener("load", () => {
                    pageReady = true;
                    maybeFinish();
                }, {
                    once: true
                });
                setTimeout(() => {
                    pageReady = true;
                    maybeFinish();
                }, 6000);
            } else {
                maybeFinish();
            }
        }
        startSplashSequence();

        const uiIcon = (name, className = '') => `<i data-lucide="${name}"${className ? ` class="${className}"` : ''} aria-hidden="true"></i>`;

        function renderLucideIcons(root = document) {
            try {
                if (!window.lucide || typeof window.lucide.createIcons !== 'function') return;
                window.lucide.createIcons({
                    root,
                    attrs: {
                        'stroke-width': 2,
                        'aria-hidden': 'true'
                    }
                });
            } catch (e) {}
        }

        function setElementIcon(el, iconName) {
            if (!el) return;
            el.innerHTML = uiIcon(iconName);
            renderLucideIcons(el);
        }

        function setPlayButtonIcons(paused = true) {
            setElementIcon(playBtn, paused ? 'play' : 'pause');
            setElementIcon(document.getElementById('fsPlay'), paused ? 'play' : 'pause');
            setElementIcon(document.getElementById('miniPlayBtn'), paused ? 'play' : 'pause');
            playBtn?.setAttribute('aria-label', paused ? 'Play' : 'Pause');
            document.getElementById('fsPlay')?.setAttribute('aria-label', paused ? 'Play' : 'Pause');
            document.getElementById('miniPlayBtn')?.setAttribute('aria-label', paused ? 'Play' : 'Pause');
        }

        const __lucideObserver = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
                m.addedNodes.forEach((node) => {
                    if (!(node instanceof Element)) return;
                    if (node.matches('[data-lucide]') || node.querySelector('[data-lucide]')) {
                        renderLucideIcons(node);
                    }
                });
            });
        });

        function initLucideSystem() {
            renderLucideIcons(document);
            if (document.body) {
                __lucideObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }

        
        const artists = {
            prem: {
                name: "Prem Dhillon",
                image: "images/prem.jpeg",
                songs: [{
                    title: "Shoes Off",
                    file: "Prem Dhillon/ShoesOff.mp3",
                    poster: "images/ShoesOff.jpeg"
                }, {
                    title: "Putt Jam Te Lau",
                    file: "Prem Dhillon/Putt Jam Te Lau.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "London",
                    file: "Prem Dhillon/London.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "Map",
                    file: "Prem Dhillon/Map.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "Made For This Shi",
                    file: "Prem Dhillon/Made For This Shi.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "UNDERCOVER",
                    file: "Prem Dhillon/UNDERCOVER.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "NOTHIN",
                    file: "Prem Dhillon/Nothin.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "GT",
                    file: "Prem Dhillon/GT.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "DEALER",
                    file: "Prem Dhillon/Dealer.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "GD UP",
                    file: "Prem Dhillon/GD UP.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "Wannabes",
                    file: "Prem Dhillon/Wannabes.mp3",
                    poster: "images/Majhaestic.jpeg"
                }, {
                    title: "Get At Me",
                    file: "Prem Dhillon/Get At Me.mp3",
                    poster: "images/Get At Me.jpeg"
                }, {
                    title: "Bootcut",
                    file: "Prem Dhillon/Boot cut.mp3",
                    poster: "images/bootcut.jpeg"

                }, {
                    title: "3am In Gillco",
                    file: "Prem Dhillon/3am In Gillco.mp3",
                    poster: "images/3am In Gillco.jpeg"
                }, {
                    title: "Lying Anyway",
                    file: "Prem Dhillon/Lying Anyway.mp3",
                    poster: "images/Lying Anyway.jpeg"
                }, {
                    title: "By MoonLight",
                    file: "Prem Dhillon/By Moonlight.mp3",
                    poster: "images/Lying Anyway.jpeg"
                }, {
                    title: "Blackberry Sap",
                    file: "Prem Dhillon/Blackberry Sap.mp3",
                    poster: "images/neveragain.jpeg"
                }, {
                    title: "Nah They Can'nt",
                    file: "Prem Dhillon/Nah They Cant.mp3",
                    poster: "images/neveragain.jpeg"
                }, {
                    title: "No Soul There",
                    file: "Prem Dhillon/No Soul There.mp3",
                    poster: "images/moveon.jpeg"
                }, {
                    title: "Move On",
                    file: "Prem Dhillon/Move On.mp3",
                    poster: "images/moveon.jpeg"
                }, {
                    title: "Those Dayz",
                    file: "Prem Dhillon/Those Dayz.mp3",
                    poster: "images/flowersaints.jpeg"
                }, {
                    title: "Flower & Saints",
                    file: "Prem Dhillon/Flowersaints.mp3",
                    poster: "images/flowersaints.jpeg"
                }, {
                    title: "Never Again",
                    file: "Prem Dhillon/Never Again.mp3",
                    poster: "images/neveragain.jpeg"
                }, {
                    title: "U Dnt Even Knw",
                    file: "Prem Dhillon/U Dnt Even Knw.mp3",
                    poster: "images/udntevenknw.jpeg"
                }, {
                    title: "Badmashi",
                    file: "Prem Dhillon/Badmashi.mp3",
                    poster: "images/badmashi.jpeg"
                }, {
                    title: "Can't Be Us",
                    file: "Prem Dhillon/Cant Be Us.mp3",
                    poster: "images/Cant Be Us.jpeg"
                }, {
                    title: "ASTARR",
                    file: "Prem Dhillon/ASTARR.mp3",
                    poster: "images/ASTARR.jpeg"
                }, {
                    title: "Damn Daddy",
                    file: "Prem Dhillon/Damn Daddy.mp3",
                    poster: "images/Damn Daddy.jpeg"
                }, {
                    title: "RUBICON",
                    file: "Prem Dhillon/RUBICON.mp3",
                    poster: "images/RUBICON.jpeg"
                }, {
                    title: "BADBOY",
                    file: "Prem Dhillon/BADBOY.mp3",
                    poster: "images/ASTARR.jpeg"
                }, {
                    title: "TOP DAWG",
                    file: "Prem Dhillon/TOP DAWG.mp3",
                    poster: "images/ASTARR.jpeg"
                }, {
                    title: "Busy Doin Nothin",
                    file: "Prem Dhillon/Busy Doin Nothin.mp3",
                    poster: "images/Busy Doin Nothin.jpeg"
                }, {
                    title: "Still Mine",
                    file: "Prem Dhillon/Still Mine.mp3",
                    poster: "images/Still Mine.jpeg"
                }, {
                    title: "Silicone",
                    file: "Prem Dhillon/Silicone.mp3",
                    poster: "images/Silicone.jpeg"
                }, {
                    title: "Old Skool",
                    file: "Prem Dhillon/Old Skool.mp3",
                    poster: "images/Old Skool.jpeg"
                }, {
                    title: "Majha Block",
                    file: "Prem Dhillon/Majha Block.mp3",
                    poster: "images/Majha Block.jpeg"
                }, {
                    title: "TYPE SHII",
                    file: "Prem Dhillon/TYPE SHII.mp3",
                    poster: "images/ASTARR.jpeg"
                }, {
                    title: "Wake Up Call",
                    file: "Prem Dhillon/Wake Up Call.mp3",
                    poster: "images/Wake Up Call.jpeg"
                }, {
                    title: "Back Of Car",
                    file: "Prem Dhillon/Back Of Car.mp3",
                    poster: "images/Back Of Car.jpeg"
                }, {
                    title: "26 Blvd",
                    file: "Prem Dhillon/26 Blvd.mp3",
                    poster: "images/neveragain.jpeg"
                }, {
                    title: "All Ace",
                    file: "Prem Dhillon/All Ace.mp3",
                    poster: "images/allace.jpeg"
                }]
            },
            sidhu: {
                name: "Sidhu Moosewala",
                image: "images/sidhu.jpeg",
                songs: [{
                    title: "Eyes On Me",
                    file: "Sidhu Moosewala/Eyes On Me.mp3",
                    poster: "images/Eyes On Me.jpeg"
                },{
                    title: "The Last Ride",
                    file: "Sidhu Moosewala/The Last Ride.mp3",
                    poster: "images/ride.jpeg"
                },{
                    title: "Game",
                    file: "Sidhu Moosewala/Game.mp3",
                    poster: "images/game.jpeg"
                },{
                    title: "0008",
                    file: "Sidhu Moosewala/0008.mp3",
                    poster: "images/0008.jpeg"
                },{
                    title: "Take Notes",
                    file: "Sidhu Moosewala/Take Notes.mp3",
                    poster: "images/0008.jpeg"
                },{
                    title: "Neal",
                    file: "Sidhu Moosewala/Neal.mp3",
                    poster: "images/0008.jpeg"
                },{
                    title: "Same Beef",
                    file: "Sidhu Moosewala/Same Beef.mp3",
                    poster: "images/samebeef.jpeg"
                },{
                    title: "Warning Shots",
                    file: "Sidhu Moosewala/Warning Shots.mp3",
                    poster: "images/shot.jpeg"
                },{
                    title: "Flop Song",
                    file: "Sidhu Moosewala/Flop Song.mp3",
                    poster: "images/Flop.jpeg"
                }, {
                    title: "Levels",
                    file: "Sidhu Moosewala/Levels.mp3",
                    poster: "images/levels.jpeg"
                }, {
                    title: "Legend",
                    file: "Sidhu Moosewala/Legend.mp3",
                    poster: "images/legend.jpeg"
                }, {
                    title: "Mafia",
                    file: "Sidhu Moosewala/Mafia.mp3",
                    poster: "images/mafia.jpeg"
                }, {
                    title: "Just Listen",
                    file: "Sidhu Moosewala/Just Listen.mp3",
                    poster: "images/Just Listen.jpeg"
                }, {
                    title: "Jaat Da Muqabala",
                    file: "Sidhu Moosewala/Jaat Da Muqabala.mp3",
                    poster: "images/pbx1.jpeg"
                }, {
                    title: "410",
                    file: "Sidhu Moosewala/410.mp3",
                    poster: "images/410.jpeg"
                }, {
                    title: "Barota",
                    file: "Sidhu Moosewala/Barota.mp3",
                    poster: "images/Barota.jpeg"
                }, {
                    title: "SCAPEGOAT",
                    file: "Sidhu Moosewala/Scapegoat.mp3",
                    poster: "images/scapegoat.jpeg"
                }, {
                    title: "Never fold",
                    file: "Sidhu Moosewala/Neverfold.mp3",
                    poster: "images/Neverfold.jpeg"
                }, {
                    title: "Signed To God",
                    file: "Sidhu Moosewala/Signed To God.mp3",
                    poster: "images/Signed To God.jpeg"
                }, {
                    title: "Love sick",
                    file: "Sidhu Moosewala/Love sick.mp3",
                    poster: "images/Neverfold.jpeg"
                }, {
                    title: "Attach",
                    file: "Sidhu Moosewala/Attach.mp3",
                    poster: "images/Attach.jpeg"
                }, {
                    title: "Lock",
                    file: "Sidhu Moosewala/Lock.mp3",
                    poster: "images/Lock.jpeg"
                }, {
                    title: "Watch Out",
                    file: "Sidhu Moosewala/Watch Out.mp3",
                    poster: "images/Watch Out.jpeg"
                }, {
                    title: "Wiseman",
                    file: "Sidhu Moosewala/Wiseman.mp3",
                    poster: "images/Wiseman.jpeg"
                }, {
                    title: "US",
                    file: "Sidhu Moosewala/US.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "UNFUCKWITHABLE",
                    file: "Sidhu Moosewala/Unfuckwithable.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "295",
                    file: "Sidhu Moosewala/295.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "ULTIMATUM",
                    file: "Sidhu Moosewala/Ultimatum.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "TRAIL DAY SKIT",
                    file: "Sidhu Moosewala/TrialDaySkit.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "THESE DAYS",
                    file: "Sidhu Moosewala/TheseDays.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "SIDHU SON",
                    file: "Sidhu Moosewala/SidhuSon.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "REGRET",
                    file: "Sidhu Moosewala/Regret.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "REAL ONE SKIT",
                    file: "Sidhu Moosewala/RealOneSkit.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "RACKS AND ROUNDS",
                    file: "Sidhu Moosewala/RacksAndRounds.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "POWER",
                    file: "Sidhu Moosewala/Power.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "PIND HOOD DAMN GOOD",
                    file: "Sidhu Moosewala/PindHoodDamnGood.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "MOSSEDRILLA",
                    file: "Sidhu Moosewala/MosseDrilla.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "ME AND MY GIRLFRIEND",
                    file: "Sidhu Moosewala/MeAndMyGirlfriend.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "MALWA BLOCK",
                    file: "Sidhu Moosewala/Malwa_Block.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "INVINICIBLE",
                    file: "Sidhu Moosewala/Invincible.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "IDGAF",
                    file: "Sidhu Moosewala/IDGAF.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "G SHIT",
                    file: "Sidhu Moosewala/GShit.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "FACTS SKIT",
                    file: "Sidhu Moosewala/FactsSkit.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "CHACHA HU SKIT",
                    file: "Sidhu Moosewala/ChachaHuuSkit.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "GOAT",
                    file: "Sidhu Moosewala/GOAT.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "CELEBRITY KILLER",
                    file: "Sidhu Moosewala/Celebrity Killer.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "CALABOOSE",
                    file: "Sidhu Moosewala/Calaboose.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "BURBERRY",
                    file: "Sidhu Moosewala/Burberry.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "BUILT DIFFERENT",
                    file: "Sidhu Moosewala/BuiltDifferent.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "BROWN SHORTIE",
                    file: "Sidhu Moosewala/BrownShortie.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "BOO CALL SKIT",
                    file: "Sidhu Moosewala/BooCallSkit.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "BITCH I'M BACK",
                    file: "Sidhu Moosewala/Bitch I M Back.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "B W",
                    file: "Sidhu Moosewala/B W.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "AROMA",
                    file: "Sidhu Moosewala/Aroma.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }, {
                    title: "AMLI TALK SKIT",
                    file: "Sidhu Moosewala/Amli Talk Skit.mp3",
                    poster: "images/MOSSETAPE.jpeg"
                }]
            },
            shubh: {
                name: "Shubh",
                image: "images/shubh.jpeg",
                songs: [{
                    title: "Ace",
                    file: "Shubh/Ace.mp3",
                    poster: "images/chapter4.jpeg"
                }, {

                    title: "Bounce",
                    file: "Shubh/Bounce.mp3",
                    poster: "images/chapter4.jpeg"
                }, {

                    title: "Moves",
                    file: "Shubh/Moves.mp3",
                    poster: "images/chapter4.jpeg"
                }, {

                    title: "Broken",
                    file: "Shubh/Broken.mp3",
                    poster: "images/chapter4.jpeg"
                }, {

                    title: "Sohniye",
                    file: "Shubh/Sohniye.mp3",
                    poster: "images/sohniye.jpeg"
                }, {
                    title: "We Rollin",
                    file: "Shubh/We Rollin.mp3",
                    poster: "images/We Rollin.jpeg"
                }, {
                    title: "Supreme",
                    file: "Shubh/Supreme.mp3",
                    poster: "images/Supreme.jpeg"
                }, {
                    title: "Balenci",
                    file: "Shubh/Balenci.mp3",
                    poster: "images/Balenci.jpeg"
                }, {
                    title: "Buckle Up",
                    file: "Shubh/Buckle Up.mp3",
                    poster: "images/Buckle Up.jpeg"
                }, {
                    title: "No Love",
                    file: "Shubh/No Love.mp3",
                    poster: "images/No Love.jpeg"
                }, {
                    title: "Aura",
                    file: "Shubh/Aura.mp3",
                    poster: "images/Aura.jpeg"
                }, {
                    title: "Baller",
                    file: "Shubh/Baller.mp3",
                    poster: "images/Baller.jpeg"
                }, {
                    title: "Bandana",
                    file: "Shubh/Bandana.mp3",
                    poster: "images/Bandana.jpeg"
                }, {
                    title: "Bars",
                    file: "Shubh/Bars.mp3",
                    poster: "images/Bars.jpeg"
                }, {
                    title: "Offshore",
                    file: "Shubh/Offshore.mp3",
                    poster: "images/Offshore.jpeg"
                }, {
                    title: "Still Rollin",
                    file: "Shubh/Still Rollin.mp3",
                    poster: "images/Still Rollin.jpeg"
                }, {
                    title: "OG",
                    file: "Shubh/OG.mp3",
                    poster: "images/OG.jpeg"
                }, {
                    title: "Be Mine",
                    file: "Shubh/Be Mine.mp3",
                    poster: "images/Be Mine.jpeg"
                }, {
                    title: "You and Me",
                    file: "Shubh/You and Me.mp3",
                    poster: "images/You and Me.jpeg"
                }, {
                    title: "King Shit",
                    file: "Shubh/King Shit.mp3",
                    poster: "images/King Shit.jpeg"
                }, {
                    title: "Her",
                    file: "Shubh/Her.mp3",
                    poster: "images/Her.jpeg"
                }, {
                    title: "Hood Anthem",
                    file: "Shubh/Hood Anthem.mp3",
                    poster: "images/Hood Anthem.jpeg"
                }, {
                    title: "Carti",
                    file: "Shubh/Carti.mp3",
                    poster: "images/Carti.jpeg"
                }, {
                    title: "Cheques",
                    file: "Shubh/Cheques.mp3",
                    poster: "images/Cheques.jpeg"
                }, {
                    title: "Dior",
                    file: "Shubh/Dior.mp3",
                    poster: "images/Dior.jpeg"
                }, {
                    title: "Fell For You",
                    file: "Shubh/Fell For You.mp3",
                    poster: "images/Fell For You.jpeg"
                }, {
                    title: "Ice",
                    file: "Shubh/Ice.mp3",
                    poster: "images/Ice.jpeg"
                }, {
                    title: "In Love",
                    file: "Shubh/In Love.mp3",
                    poster: "images/In Love.jpeg"
                }, {
                    title: "MVP",
                    file: "Shubh/MVP.mp3",
                    poster: "images/MVP.jpeg"
                }, {
                    title: "One Love",
                    file: "Shubh/One Love.mp3",
                    poster: "images/One Love.jpeg"
                }, {
                    title: "Reckless",
                    file: "Shubh/Reckless.mp3",
                    poster: "images/Reckless.jpeg"
                }, {
                    title: "Routine",
                    file: "Shubh/Routine.mp3",
                    poster: "images/Routine.jpeg"
                }, {
                    title: "Ruger",
                    file: "Shubh/Ruger.mp3",
                    poster: "images/Ruger.jpeg"
                }, {
                    title: "Top G",
                    file: "Shubh/Top G.mp3",
                    poster: "images/Top G.jpeg"
                }, {
                    title: "Ruthless",
                    file: "Shubh/Ruthless.mp3",
                    poster: "images/Ruthless.jpeg"
                }, {
                    title: "Safety Off",
                    file: "Shubh/Safety Off.mp3",
                    poster: "images/Safety Off.jpeg"
                }, {
                    title: "The Flow",
                    file: "Shubh/The Flow.mp3",
                    poster: "images/The Flow.jpeg"
                }, {
                    title: "Together",
                    file: "Shubh/Together.mp3",
                    poster: "images/Together.jpeg"
                }]
            },
            sukha: {
                name: "Sukha",
                image: "images/sukha.jpeg",
                songs: [{
                    title: "Attraction",
                    file: "Sukha/Attraction.mp3",
                    poster: "images/Attraction.jpeg"
                }, {
                    title: "8 Asle",
                    file: "Sukha/8 Asle.mp3",
                    poster: "images/8 Asle.jpeg"
                }, {
                    title: "Dil Dardeh",
                    file: "Sukha/Dil Dardeh.mp3",
                    poster: "images/Dil Dardeh.jpeg"
                }, {
                    title: "Armed",
                    file: "Sukha/ARMED.mp3",
                    poster: "images/8 Asle.jpeg"
                }, {
                    title: "Hey Luv",
                    file: "Sukha/Hey Luv.mp3",
                    poster: "images/sukha.jpeg"
                }, {
                    title: "Sangdi",
                    file: "Sukha/Sangdi.mp3",
                    poster: "images/Sangdi.jpeg"
                }]
            },
            navaan: {
                name: "Navaan Sandhu",
                image: "images/navaan.jpeg",
                songs: [{
                    title: "90's Typa Love",
                    file: "Navaan Sandhu/90s Typa Love.mp3",
                    poster: "images/90's Typa Love.jpeg"
                }, {
                    title: "Kath Lagda",
                    file: "Navaan Sandhu/Kath Lagda.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Hood Ambience",
                    file: "Navaan Sandhu/Hood Ambience.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "City Dreams",
                    file: "Navaan Sandhu/City Dreams.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Moodshift",
                    file: "Navaan Sandhu/Moodshift.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Naveezy Era",
                    file: "Navaan Sandhu/Naveezy Era.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Yaara ve yaara",
                    file: "Navaan Sandhu/Yaara ve yaara.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "She ain't easy",
                    file: "Navaan Sandhu/She Aint easy.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Star Girl",
                    file: "Navaan Sandhu/Star Girl.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Yaad",
                    file: "Navaan Sandhu/Yaad.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Kaare",
                    file: "Navaan Sandhu/Kaare.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Headliner",
                    file: "Navaan Sandhu/Headliner.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Bodyguard",
                    file: "Navaan Sandhu/Bodyguard.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "Boozed Up",
                    file: "Navaan Sandhu/Boozed Up.mp3",
                    poster: "images/Bipolar.jpeg"
                }, {
                    title: "My Prime",
                    file: "Navaan Sandhu/My Prime.mp3",
                    poster: "images/Naveezy.jpeg"
                }, {
                    title: "Rukh",
                    file: "Navaan Sandhu/Rukh.mp3",
                    poster: "images/Rukh.jpeg"
                }, {
                    title: "Rehan Deyan",
                    file: "Navaan Sandhu/Rehan Deyan.mp3",
                    poster: "images/Naveezy.jpeg"
                }, {
                    title: "Naveezy",
                    file: "Navaan Sandhu/Naveezy.mp3",
                    poster: "images/Naveezy.jpeg"
                }, {
                    title: "Dil Lagiyan",
                    file: "Navaan Sandhu/Dil Lagiyan.mp3",
                    poster: "images/Naveezy.jpeg"
                }, {
                    title: "Kach Wangu",
                    file: "Navaan Sandhu/Kach Wangu.mp3",
                    poster: "images/Naveezy.jpeg"
                }, {
                    title: "Jail",
                    file: "Navaan Sandhu/Jail.mp3",
                    poster: "images/Naveezy.jpeg"
                }, {
                    title: "Dinar",
                    file: "Navaan Sandhu/Dinar.mp3",
                    poster: "images/Naveezy.jpeg"
                }, {
                    title: "Sit Down Son",
                    file: "Navaan Sandhu/Sit Down Son.mp3",
                    poster: "images/Sit Down Son.jpeg"
                }, {
                    title: "Culture Clicks",
                    file: "Navaan Sandhu/Culture Clicks.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Dapper Dan",
                    file: "Navaan Sandhu/Dapper Dan.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Eyes On Us",
                    file: "Navaan Sandhu/Eyes On Us.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Levels N Graphs",
                    file: "Navaan Sandhu/Levels N Graphs.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Navior",
                    file: "Navaan Sandhu/Navior.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Racks On Racks",
                    file: "Navaan Sandhu/Racks On Racks.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Regret",
                    file: "Navaan Sandhu/Regret.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Sajda",
                    file: "Navaan Sandhu/Sajda.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Tabaah",
                    file: "Navaan Sandhu/Tabaah.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Deewane",
                    file: "Navaan Sandhu/Deewane.mp3",
                    poster: "images/Navior.jpeg"
                }, {
                    title: "Raah",
                    file: "Navaan Sandhu/Raah.mp3",
                    poster: "images/Raah.jpeg"
                }, {
                    title: "2 Asle",
                    file: "Navaan Sandhu/2 Asle.mp3",
                    poster: "images/2 Asle.jpeg"
                }, {
                    title: "24/7",
                    file: "Navaan Sandhu/241.mp3",
                    poster: "images/241.jpeg"
                }, {
                    title: "Black Life Original",
                    file: "Navaan Sandhu/Black Life Original.mp3",
                    poster: "images/Black Life Original.jpeg"
                }, {
                    title: "Black Life",
                    file: "Navaan Sandhu/Black Life.mp3",
                    poster: "images/Black Life.jpeg"
                }, {
                    title: "Do Asle",
                    file: "Navaan Sandhu/Do Asle.mp3",
                    poster: "images/Do Asle.jpeg"
                }, {
                    title: "Do Pal",
                    file: "Navaan Sandhu/Do Pal.mp3",
                    poster: "images/Do Pal.jpeg"
                }, {
                    title: "Hanji Hanji",
                    file: "Navaan Sandhu/Hanji Hanji.mp3",
                    poster: "images/Hanji Hanji.jpeg"
                }, {
                    title: "Hero",
                    file: "Navaan Sandhu/Hero.mp3",
                    poster: "images/Hero.jpeg"
                }, {
                    title: "Hirni",
                    file: "Navaan Sandhu/Hirni.mp3",
                    poster: "images/Hirni.jpeg"
                }, {
                    title: "In Demand",
                    file: "Navaan Sandhu/In Demand.mp3",
                    poster: "images/In Demand.jpeg"
                }, {
                    title: "Majha Forever",
                    file: "Navaan Sandhu/Majha Forever.mp3",
                    poster: "images/Majha Forever.jpeg"
                }, {
                    title: "Mann Di Nahi",
                    file: "Navaan Sandhu/Mann Di Nahi.mp3",
                    poster: "images/Mann Di Nahi.jpeg"
                }, {
                    title: "NO MIDMAN",
                    file: "Navaan Sandhu/NO MIDMAN.mp3",
                    poster: "images/NO MIDMAN.jpeg"
                }, {
                    title: "Picture Perfect",
                    file: "Navaan Sandhu/Picture Perfect.mp3",
                    poster: "images/Picture Perfect.jpeg"
                }, {
                    title: "Plug Talk",
                    file: "Navaan Sandhu/Plug Talk.mp3",
                    poster: "images/Plug Talk.jpeg"
                }, {
                    title: "Sandhu Takeover",
                    file: "Navaan Sandhu/Sandhu Takeover.mp3",
                    poster: "images/Sandhu Takeover.jpeg"
                }, {
                    title: "Sherni Banke",
                    file: "Navaan Sandhu/Sherni Banke.mp3",
                    poster: "images/Sherni Banke.jpeg"
                }, {
                    title: "Sick Tone",
                    file: "Navaan Sandhu/Sick Tone.mp3",
                    poster: "images/Sick Tone.jpeg"
                }, {
                    title: "So Mean",
                    file: "Navaan Sandhu/So Mean.mp3",
                    poster: "images/So Mean.jpeg"
                }, {
                    title: "Unbothered",
                    file: "Navaan Sandhu/Unbothered.mp3",
                    poster: "images/Unbothered.jpeg"
                }, {
                    title: "Taaz",
                    file: "Navaan Sandhu/Taaz.mp3",
                    poster: "images/Taaz.jpeg"
                }, {
                    title: "Waare Waare",
                    file: "Navaan Sandhu/Waare Waare.mp3",
                    poster: "images/Waare Waare.jpeg"
                }, {
                    title: "Ziddi Generation",
                    file: "Navaan Sandhu/Ziddi Generation.mp3",
                    poster: "images/Ziddi Generation.jpeg"
                }, {
                    title: "Ziddi Generation (Alt)",
                    file: "Navaan Sandhu/Ziddi_Generation.mp3",
                    poster: "images/Zidddi Generation.jpeg"
                }]
            },
            cheema: {
                name: "Cheema Y",
                image: "images/cheema.jpeg",
                songs: [{
                    title: "Cartel",
                    file: "Cheema Y/Cartel.mp3",
                    poster: "images/bermuda.jpeg"
                }, {
                    title: "CEO",
                    file: "Cheema Y/CEO.mp3",
                    poster: "images/bermuda.jpeg"
                }, {
                    title: "Jackpot",
                    file: "Cheema Y/Jackpot.mp3",
                    poster: "images/bermuda.jpeg"
                }, {
                    title: "Komagata Maru",
                    file: "Cheema Y/Komagata Maru.mp3",
                    poster: "images/bermuda.jpeg"
                }, {
                    title: "Love Salary",
                    file: "Cheema Y/Love Salary.mp3",
                    poster: "images/bermuda.jpeg"
                }, {
                    title: "Money 2X",
                    file: "Cheema Y/Money 2X.mp3",
                    poster: "images/bermuda.jpeg"
                },{
                    title: "Rebel",
                    file: "Cheema Y/Rebel.mp3",
                    poster: "images/bermuda.jpeg"
                },{
                    title: "Shady",
                    file: "Cheema Y/Shady.mp3",
                    poster: "images/bermuda.jpeg"
                }]
            },
            bilall: {
                name: "Bilal Saeed",
                image: "images/bilal.jpeg",
                songs: [{
                    title: "12 Saal",
                    file: "Bilal Saeed/12 Saal.mp3",
                    poster: "images/12.jpeg"
                }, {
                    title: "Adhi Adhi Raat",
                    file: "Bilal Saeed/Adhi Adhi Raat.mp3",
                    poster: "images/12.jpeg"
                }]
            },
            deep: {
                name: "Deep Dhaliwal",
                image: "images/deep.jpeg",
                songs: [{
                    title: "Hypnotic",
                    file: "Deep Dhaliwal/Hypnotic.mp3",
                    poster: "images/Hypnotic.jpeg"
                }, {
                    title: "Na Na",
                    file: "Deep Dhaliwal/Na NA.mp3",
                    poster: "images/nana.jpeg"
                }]
            },
            jind: {
                name: "Jind Universe",
                image: "images/jinduniverse.jpeg",
                songs: [{
                    title: "High On You",
                    file: "Jind Universe/High On You.mp3",
                    poster: "images/highonu.jpeg"
                }, {
                    title: "Love Exit",
                    file: "Jind Universe/Love Exit.mp3",
                    poster: "images/loveexit.jpeg"
                }, {
                    title: "I Know Love",
                    file: "Jind Universe/I Know Love.mp3",
                    poster: "images/iknowlove.jpeg"
                }]
            },
            talwinder: {
                name: "Talwinder",
                image: "images/talwinder.jpeg",
                songs: [{
                    title: "Pal Pal",
                    file: "Talwinder/Pal Pal.mp3",
                    poster: "images/palpal.jpeg"
                }, {
                    title: "To The Moon",
                    file: "Talwinder/To The Moon.mp3",
                    poster: "images/tothemoon.jpeg"
                }, {
                    title: "Wishes",
                    file: "Talwinder/Wishes.mp3",
                    poster: "images/wishes.jpeg"
                }, {
                    title: "Haseen",
                    file: "Talwinder/Haseen.mp3",
                    poster: "images/haseen.jpeg"
                }, {
                    title: "Jhol",
                    file: "Talwinder/Jhol.mp3",
                    poster: "images/Jhol.jpeg"
                }, {
                    title: "Dhundhala",
                    file: "Talwinder/Dhundhala.mp3",
                    poster: "images/Dhundhala.jpeg"
                }, {
                    title: "Khayaal",
                    file: "Talwinder/Khayaal.mp3",
                    poster: "images/Khayaal.jpeg"
                },{
                    title: "Sajna Da Dil Torya",
                    file: "Talwinder/Sajna.mp3",
                    poster: "images/sajna.jpeg"
                }]
            },
            amrindergill: {
                name: "Amrinder Gill",
                image: "images/amrindergill.jpeg",
                songs: [{
                    title: "Adore",
                    file: "Amrinder Gill/Adore.mp3",
                    poster: "images/adorre.jpeg"
                }, {
                    title: "Asi Gabhru Punjabi",
                    file: "Amrinder Gill/Asi Gabhru Punjabi.mp3",
                    poster: "images/ju.jpeg"
                }, {
                    title: "Bahut Nede",
                    file: "Amrinder Gill/Bahut Nede.mp3",
                    poster: "images/bahutnede.jpeg"
                }, {
                    title: "Dildarian",
                    file: "Amrinder Gill/Dildarian.mp3",
                    poster: "images/ju.jpeg"
                }, {
                    title: "That Girl",
                    file: "Amrinder Gill/That Girl.mp3",
                    poster: "images/thatgirl.jpeg"
                }, {
                    title: "Judda",
                    file: "Amrinder Gill/Judda.mp3",
                    poster: "images/ju.jpeg"
                }]
            },
            hardy: {
                name: "Harddy Sandhu",
                image: "images/hardy.jpeg",
                songs: [{
                    title: "Soch",
                    file: "Harddy Sandhu/Soch.mp3",
                    poster: "images/Sochh.jpeg"
                }]
            },
            anuvjain: {
                name: "Anuv Jain",
                image: "images/anuv.jpeg",
                songs: [{
                    title: "Afsos",
                    file: "Anuv Jain/Afsos.mp3",
                    poster: "images/afsos.jpeg"
                }, {
                    title: "Inaam",
                    file: "Anuv Jain/Inaam.mp3",
                    poster: "images/inaam.jpeg"

                }, {
                    title: "Baarishein",
                    file: "Anuv Jain/BAARISHEIN.mp3",
                    poster: "images/Baarishein.jpeg"
                }, {
                    title: "Gul",
                    file: "Anuv Jain/Gul.mp3",
                    poster: "images/Gul.jpeg"
                }, {
                    title: "Antariksh",
                    file: "Anuv Jain/ANTARIKSH.mp3",
                    poster: "images/Antariksh.jpeg"
                }, {
                    title: "Jo Tum Mere Ho",
                    file: "Anuv Jain/Jo Tum Mere Ho.mp3",
                    poster: "images/Jo Tum Mere Ho.jpeg"
                }, {
                    title: "Riha",
                    file: "Anuv Jain/Riha.mp3",
                    poster: "images/Riha.jpeg"
                }, {
                    title: "Alag Aasmaan",
                    file: "Anuv Jain/Alag Aasmaan.mp3",
                    poster: "images/alag.jpeg"
                }, {
                    title: "Husn",
                    file: "Anuv Jain/Husn.mp3",
                    poster: "images/Husn.jpeg"
                }, {
                    title: "Maula",
                    file: "Anuv Jain/Maula.mp3",
                    poster: "images/maula.jpeg"
                }, {
                    title: "Meri Baaton Mein Tu",
                    file: "Anuv Jain/Meri Baaton Mein Tu.mp3",
                    poster: "images/meri.jpeg"
                }]
            },
            mehro: {
                name: "Mehro",
                image: "images/mehro.jpeg",
                songs: [{
                    title: "Chance With You",
                    file: "Mehro/Chance With You.mp3",
                    poster: "images/chance.jpeg"
                }, {
                    title: "Perfum",
                    file: "Mehro/Perfum.mp3",
                    poster: "images/chance.jpeg"
                }, {
                    title: "Hideous",
                    file: "Mehro/Hideous.mp3",
                    poster: "images/chance.jpeg"
                }]
            },
            diljit: {
                name: "Diljit Dosanjh",
                image: "images/diljit.jpeg",
                songs: [{
                    title: "Born To Shine",
                    file: "Diljit Dosanjh/Born To Shine.mp3",
                    poster: "images/B2S.jpeg"
                }, {
                    title: "G.O.A.T",
                    file: "Diljit Dosanjh/G.O.A.T.mp3",
                    poster: "images/GOAT.jpeg"
                }]
            },
            karan: {
                name: "Karan Aujla",
                image: "images/karan.jpeg",
                songs: [{
                    title: "5-7",
                    file: "Karan Aujla/5 7.mp3",
                    poster: "images/5 7.jpeg"
                }, {
                    title: "Guilty",
                    file: "Karan Aujla/Guilty.mp3",
                    poster: "images/Guilty.jpeg"
                }, {
                    title: "Top Fella",
                    file: "Karan Aujla/Top Fella.mp3",
                    poster: "images/Top Fella.jpeg"
                }, {
                    title: "Don't Look",
                    file: "Karan Aujla/Don'nt Look.mp3",
                    poster: "images/Don'nt Look.jpeg"
                }, {
                    title: "Courtside",
                    file: "Karan Aujla/Courtside.mp3",
                    poster: "images/Courtside.jpeg"
                }, {
                    title: "MF Gabhru",
                    file: "Karan Aujla/MF Gabhru.mp3",
                    poster: "images/MF Gabhru.jpeg"
                }, {
                    title: "Jhanjar",
                    file: "Karan Aujla/Jhanjar.mp3",
                    poster: "images/Jhanjar.jpeg"
                }, {
                    title: "Kya Baat Aa",
                    file: "Karan Aujla/Kya Baat Aa.mp3",
                    poster: "images/Kya Baat Aa.jpeg"
                }, {
                    title: "7 7 Magnitude",
                    file: "Karan Aujla/7 7 Magnitude.mp3",
                    poster: "images/MF Gabhru.jpeg"
                }, {
                    title: "52 Bars",
                    file: "Karan Aujla/52 Bars.mp3",
                    poster: "images/52 Bars.jpeg"
                }, {
                    title: "Admirin You",
                    file: "Karan Aujla/Admirin You.mp3",
                    poster: "images/Admirin You.jpeg"
                }, {
                    title: "Antidote",
                    file: "Karan Aujla/Antidote.mp3",
                    poster: "images/IDK How.jpeg"
                }, {
                    title: "Boyfriend",
                    file: "Karan Aujla/Boyfriend.mp3",
                    poster: "images/MF Gabhru.jpeg"
                }, {
                    title: "Fallin Apart",
                    file: "Karan Aujla/FallinApart.mp3",
                    poster: "images/Nothing Lasts.jpeg"
                }, {
                    title: "For A Reason",
                    file: "Karan Aujla/For A Reason.mp3",
                    poster: "images/MF Gabhru.jpeg"
                }, {
                    title: "Game Over",
                    file: "Karan Aujla/Game Over.mp3",
                    poster: "images/Game Over.jpeg"
                }, {
                    title: "Goin Off",
                    file: "Karan Aujla/Goin Off.mp3",
                    poster: "images/Goin Off.jpeg"
                }, {
                    title: "HIM",
                    file: "Karan Aujla/HIM.mp3",
                    poster: "images/MF Gabhru.jpeg"
                }, {
                    title: "I Really Do",
                    file: "Karan Aujla/I Really Do.mp3",
                    poster: "images/MF Gabhru.jpeg"
                }, {
                    title: "IDK How",
                    file: "Karan Aujla/IDK How.mp3",
                    poster: "images/IDK How.jpeg"
                }, {
                    title: "Let em Play",
                    file: "Karan Aujla/Let em Play.mp3",
                    poster: "images/Let em Play.jpeg"
                }, {
                    title: "Mexico",
                    file: "Karan Aujla/Mexico.mp3",
                    poster: "images/Mexico.jpeg"
                }, {
                    title: "Nothing Lasts",
                    file: "Karan Aujla/Nothing Lasts.mp3",
                    poster: "images/Nothing Lasts.jpeg"
                }, {
                    title: "On Top",
                    file: "Karan Aujla/On Top.mp3",
                    poster: "images/On Top.jpeg"
                }, {
                    title: "P POP CULTURE",
                    file: "Karan Aujla/P POP CULTURE.mp3",
                    poster: "images/MF Gabhru.jpeg"
                }, {
                    title: "Soch",
                    file: "Karan Aujla/Soch.mp3",
                    poster: "images/Soch.jpeg"
                }, {
                    title: "Take It Easy",
                    file: "Karan Aujla/Take It Easy.mp3",
                    poster: "images/52 Bars.jpeg"
                }, {
                    title: "Tareefan",
                    file: "Karan Aujla/Tareefan.mp3",
                    poster: "images/Nothing Lasts.jpeg"
                }, {
                    title: "Wavy",
                    file: "Karan Aujla/Wavy.mp3",
                    poster: "images/Wavy.jpeg"
                }, {
                    title: "Winning Speech",
                    file: "Karan Aujla/Winning Speech.mp3",
                    poster: "images/Winning Speech.jpeg"
                }]
            },
            smg: {
                name: "S.M.G",
                image: "images/smg.jpeg",
                songs: [{
                    title: "NYPD",
                    file: "SMG/NYPD.mp3",
                    poster: "images/FATHER.JPEG"
                }, {
                    title: "3 AM IN MUMBAI",
                    file: "SMG/3 AM IN MUMBAI.mp3",
                    poster: "images/FATHER.JPEG"
                }, {
                    title: "ALL I NEED",
                    file: "SMG/ALL I NEED.mp3",
                    poster: "images/FATHER.JPEG"
                }, {
                    title: "OVERSEAS",
                    file: "SMG/OVERSEAS.mp3",
                    poster: "images/FATHER.JPEG"
                }, {
                    title: "Bexley Road",
                    file: "SMG/Bexley Road.mp3",
                    poster: "images/Bexley Road.jpeg"
                }, {
                    title: "C R E A M POSSE",
                    file: "SMG/C R E A M POSSE.mp3",
                    poster: "images/STIFF KIN.jpeg"
                }, {
                    title: "G.O.D",
                    file: "SMG/G.O.D.mp3",
                    poster: "images/G.O.D.jpeg"
                }, {
                    title: "HIGH ROLLERZ",
                    file: "SMG/HIGH ROLLERZ.mp3",
                    poster: "images/STIFF KIN.jpeg"
                }, {
                    title: "Intezaar",
                    file: "SMG/Intezaar.mp3",
                    poster: "images/Intezaar.jpeg"
                }, {
                    title: "LMK",
                    file: "SMG/LMK.mp3",
                    poster: "images/LMK.jpeg"
                }, {
                    title: "Lord Knows",
                    file: "SMG/Lord Knows.mp3",
                    poster: "images/Lord Knows.jpeg"
                }, {
                    title: "STIFF KIN",
                    file: "SMG/STIFF KIN.mp3",
                    poster: "images/STIFF KIN.jpeg"
                }, {
                    title: "WHY",
                    file: "SMG/Why.mp3",
                    poster: "images/Why.jpeg"
                }, ]
            },
            jerry: {
                name: "Jerry",
                image: "images/jerry.jpeg",
                songs: [{
                    title: "Zero Cares",
                    file: "Jerry/Zero Cares.mp3",
                    poster: "images/Zero Cares.jpeg"
                }, {
                    title: "Young G",
                    file: "Jerry/Young G.mp3",
                    poster: "images/Young G.jpeg"
                }, {
                    title: "Weakness",
                    file: "Jerry/Weakness.mp3",
                    poster: "images/Weakness.jpeg"
                }, {
                    title: "Vehnde Vehnde",
                    file: "Jerry/Vehnde Vehnde.mp3",
                    poster: "images/Vehnde Vehnde.jpeg"
                }, {
                    title: "Trippin",
                    file: "Jerry/Trippin.mp3",
                    poster: "images/Trippin.jpeg"
                }, {
                    title: "Tera Hassna",
                    file: "Jerry/Tera Hassna.mp3",
                    poster: "images/Tera Hassna.jpeg"
                }, {
                    title: "Tease",
                    file: "Jerry/Tease.mp3",
                    poster: "images/Tease.jpeg"
                }, {
                    title: "Street Style",
                    file: "Jerry/Street Style.mp3",
                    poster: "images/Street Style.jpeg"
                }, {
                    title: "Step Off",
                    file: "Jerry/Step Off.mp3",
                    poster: "images/Step Off.jpeg"
                }, {
                    title: "Statement",
                    file: "Jerry/Statement.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Sinner",
                    file: "Jerry/Sinner.mp3",
                    poster: "images/Sinner.jpeg"
                }, {
                    title: "Showstopper",
                    file: "Jerry/Showstopper.mp3",
                    poster: "images/Showstopper.jpeg"
                }, {
                    title: "She S The One",
                    file: "Jerry/She S The One.mp3",
                    poster: "images/She S The One.jpeg"
                }, {
                    title: "Pyaar Na Di Cheez",
                    file: "Jerry/Pyaar Na Di Cheez.mp3",
                    poster: "images/Pyaar Na Di Cheez.jpeg"
                }, {
                    title: "Pta Ni",
                    file: "Jerry/Pta Ni.mp3",
                    poster: "images/Pta Ni.jpeg"
                }, {
                    title: "Pta Kro",
                    file: "Jerry/Pta Kro.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Pricey",
                    file: "Jerry/Pricey.mp3",
                    poster: "images/Tease.jpeg"
                }, {
                    title: "President",
                    file: "Jerry/President.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Photo",
                    file: "Jerry/Photo.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Palm Angels",
                    file: "Jerry/Palm Angels.mp3",
                    poster: "images/Palm Angels.jpeg"
                }, {
                    title: "One Of One",
                    file: "Jerry/One Of One.mp3",
                    poster: "images/Tease.jpeg"
                }, {
                    title: "Miami Flow",
                    file: "Jerry/Miami Flow.mp3",
                    poster: "images/Tease.jpeg"
                }, {
                    title: "Mainu Nai Pehchaandi",
                    file: "Jerry/Mainu Nai Pehchaandi.mp3",
                    poster: "images/Mainu Nai Pehchaandi.jpeg"
                }, {
                    title: "LV",
                    file: "Jerry/LV.mp3",
                    poster: "images/LV.jpeg"
                }, {
                    title: "Link Up",
                    file: "Jerry/Link Up.mp3",
                    poster: "images/Tease.jpeg"
                }, {
                    title: "January",
                    file: "Jerry/January.mp3",
                    poster: "images/January.jpeg"
                }, {
                    title: "Illegal Whip",
                    file: "Jerry/Illegal Whip.mp3",
                    poster: "images/Illegal Whip.jpeg"
                }, {
                    title: "Icon",
                    file: "Jerry/Icon.mp3",
                    poster: "images/Icon.jpeg"
                }, {
                    title: "Holy Faak",
                    file: "Jerry/Holy Faak.mp3",
                    poster: "images/Holy Faak.jpeg"
                }, {
                    title: "Hanju",
                    file: "Jerry/Hanju.mp3",
                    poster: "images/Hanju.jpeg"
                }, {
                    title: "Hall Of Fame",
                    file: "Jerry/Hall Of Fame.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Gunda Van",
                    file: "Jerry/Gunda Van.mp3",
                    poster: "images/Gunda Van.jpeg"
                }, {
                    title: "Goddamn",
                    file: "Jerry/Goddamn.mp3",
                    poster: "images/Goddamn.jpeg"
                }, {
                    title: "Gaani",
                    file: "Jerry/Gaani.mp3",
                    poster: "images/Gaani.jpeg"
                }, {
                    title: "Fidah",
                    file: "Jerry/Fidah.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Destiny",
                    file: "Jerry/Destiny.mp3",
                    poster: "images/Tease.jpeg"
                }, {
                    title: "Damn Good",
                    file: "Jerry/Damn Good.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Culture",
                    file: "Jerry/Culture.mp3",
                    poster: "images/Culture.jpeg"
                }, {
                    title: "Confess",
                    file: "Jerry/Confess.mp3",
                    poster: "images/Confess.jpeg"
                }, {
                    title: "College Dropout",
                    file: "Jerry/College Dropout.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Cheetah",
                    file: "Jerry/Cheetah.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Casanova",
                    file: "Jerry/Casanova.mp3",
                    poster: "images/Casanova.jpeg"
                }, {
                    title: "Bet On Me",
                    file: "Jerry/Bet On Me.mp3",
                    poster: "images/Bet On Me.jpeg"
                }, {
                    title: "Bae Call",
                    file: "Jerry/Bae Call.mp3",
                    poster: "images/Bae Call.jpeg"
                }, {
                    title: "Badtmeeji",
                    file: "Jerry/Badtmeejifho.mp3",
                    poster: "images/Badtmeeji.jpeg"
                }, {
                    title: "Attwadi Dasde",
                    file: "Jerry/Attwadi Dasde.mp3",
                    poster: "images/Attwadi Dasde.jpeg"
                }, {
                    title: "Antisocial",
                    file: "Jerry/Antisocial.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "Alpha",
                    file: "Jerry/Alpha.mp3",
                    poster: "images/Tease.jpeg"
                }, {
                    title: "Aint Gonna Stop",
                    file: "Jerry/Aint Gonna Stop.mp3",
                    poster: "images/Aint Gonna Stop.jpeg"
                }, {
                    title: "Adore",
                    file: "Jerry/Adore.mp3",
                    poster: "images/Adore.jpeg"
                }, {
                    title: "999",
                    file: "Jerry/999.mp3",
                    poster: "images/999.jpeg"
                }, {
                    title: "80 Lac",
                    file: "Jerry/80 Lac.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "38",
                    file: "Jerry/38.mp3",
                    poster: "images/38.jpeg"
                }, {
                    title: "9 2 11",
                    file: "Jerry/9 2 11.mp3",
                    poster: "images/Statement.jpeg"
                }, {
                    title: "7 Saal",
                    file: "Jerry/7 Saal.mp3",
                    poster: "images/7 Saal.jpeg"
                }]
            },
            gurindergill: {
                name: "Gurinder Gill",
                image: "images/gurinder.jpeg",
                songs: [{
                    title: "LATE KNIGHTS",
                    file: "Gurinder Gill/Late Knights.mp3",
                    poster: "images/Late Knight.jpeg"
                }, {
                    title: "RICH HEART",
                    file: "Gurinder Gill/Rich Heart.mp3",
                    poster: "images/Rich Heart.jpeg"
                }]
            },
            gurnambhullar: {
                name: "GURNAM BHULLAR",
                image: "images/gurnam bhullar.jpeg",
                songs: [{
                    title: "DIAMOND",
                    file: "Gurnam Bhullar/Diamond.mp3",
                    poster: "images/Diamond.jpeg"
                }, {
                    title: "Wakh Ho Jana",
                    file: "Gurnam Bhullar/Wakh Ho Jana.mp3",
                    poster: "images/wakh.jpeg"
                }]
            },
            mankirataulakh: {
                name: "Mankirat Aulakh",
                image: "images/mankirat.jpeg",
                songs: [{
                    title: "GODDESS",
                    file: "Mankirat Aulakh/Goddess.mp3",
                    poster: "images/Goddess.jpeg"
                }]
            },
            parmishverma: {
                name: "Parmish Verma",
                image: "images/parmish.jpeg",
                songs: [{
                    title: "Aam Jahe Munde",
                    file: "Parmish Verma/Aam Jahe Munde.mp3",
                    poster: "images/Aam Jahe Munde.jpeg"
                }, {
                    title: "Car Culture",
                    file: "Parmish Verma/Car Culture.mp3",
                    poster: "images/carculture.jpeg"
                }, {
                    title: "Check It Out",
                    file: "Parmish Verma/Check It Out.mp3",
                    poster: "images/check it out.jpeg"
                }, {
                    title: "Dil Da Showroom",
                    file: "Parmish Verma/Dil Da Showroom.mp3",
                    poster: "images/dildashowroom.jpeg"
                }]
            },
            arjan: {
                name: "Arjan Dhillon",
                image: "images/arjan.jpeg",
                songs: [{
                    title: "Mohabbat",
                    file: "Arjan Dhillon/Mohabbat.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "Ik Tarfa",
                    file: "Arjan Dhillon/Ik Tarfa.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "No Shortcut",
                    file: "Arjan Dhillon/No Shortcut.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Enigma",
                    file: "Arjan Dhillon/Enigma.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Counting Gems",
                    file: "Arjan Dhillon/Counting Gems.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "One Call Away",
                    file: "Arjan Dhillon/One Call Away.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Skyfull",
                    file: "Arjan Dhillon/Skyfull.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "420 Miles",
                    file: "Arjan Dhillon/420 Miles.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Me Vs Me",
                    file: "Arjan Dhillon/Me Vs Me.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Ruthless",
                    file: "Arjan Dhillon/Ruthless.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Better With Me",
                    file: "Arjan Dhillon/Better With Me.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Culture",
                    file: "Arjan Dhillon/Culture.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Mahila Mittar",
                    file: "Arjan Dhillon/Mahila Mittar.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Last Goodbye",
                    file: "Arjan Dhillon/No Shortcut.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "Raw Rich Rare",
                    file: "Arjan Dhillon/Raw Rich Rare.mp3",
                    poster: "images/Enigma.jpeg"
                }, {
                    title: "25-25",
                    file: "Arjan Dhillon/25-25.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "Hazur",
                    file: "Arjan Dhillon/Hazur.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "Trucker",
                    file: "Arjan Dhillon/Trucker.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "AKAD",
                    file: "Arjan Dhillon/AKAD.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "Din Te Gin",
                    file: "Arjan Dhillon/Din Te Gin.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "Hawa Banke",
                    file: "Arjan Dhillon/Hawa Banke.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "Karma Walia Akhan",
                    file: "Arjan Dhillon/Karma Walia Akhan.mp3",
                    poster: "images/aaa.jpeg"
                }, {
                    title: "Kavita",
                    file: "Arjan Dhillon/Kavita.mp3",
                    poster: "images/Hawa Banke.jpeg"
                }, {
                    title: "Khat Likhi",
                    file: "Arjan Dhillon/Khat Likhi.mp3",
                    poster: "images/Hawa Banke.jpeg"
                }, {
                    title: "Pakka Ghar",
                    file: "Arjan Dhillon/Pakka Ghar.mp3",
                    poster: "images/Hawa Banke.jpeg"
                }, {
                    title: "Taj Mahal",
                    file: "Arjan Dhillon/Taj Mahal.mp3",
                    poster: "images/Hawa Banke.jpeg"
                }, {
                    title: "Tattoo",
                    file: "Arjan Dhillon/Tatoo.mp3",
                    poster: "images/Hawa Banke.jpeg"
                }, {
                    title: "Trucker (Alt)",
                    file: "Arjan Dhillon/trucker.mp3",
                    poster: "images/Hawa Banke.jpeg"
                }, {
                    title: "2-2 Asle",
                    file: "Arjan Dhillon/2 2 Asle.mp3",
                    poster: "images/youngsters.jpeg"
                }, {
                    title: "Greatest",
                    file: "Arjan Dhillon/Greatest.mp3",
                    poster: "images/youngsters.jpeg"
                }, {
                    title: "ILzaam",
                    file: "Arjan Dhillon/ILzaam.mp3",
                    poster: "images/youngsters.jpeg"
                }, {
                    title: "Kalli Sohni",
                    file: "Arjan Dhillon/Kalli Sohni.mp3",
                    poster: "images/sohni.jpeg"
                }, {
                    title: "Kath",
                    file: "Arjan Dhillon/Kath.mp3",
                    poster: "images/kath.jpeg"
                }, {
                    title: "Never Ever",
                    file: "Arjan Dhillon/Never Ever.mp3",
                    poster: "images/youngsters.jpeg"
                }, {
                    title: "Setting",
                    file: "Arjan Dhillon/Setting.mp3",
                    poster: "images/setting.jpeg"
                }]
            },
            apdhillon: {
                name: "AP Dhillon",
                image: "images/apdhillon.jpeg",
                songs: [{
                    title: "Excuses",
                    file: "AP Dhillon/Excuses.mp3",
                    poster: "images/excuses.jpeg"
                }, {
                    title: "STFU",
                    file: "AP Dhillon/STFU.mp3",
                    poster: "images/STFU.jpeg"

                }]
            },
            bohemia: {
                name: "Bohemia",
                image: "images/bohemia.jpeg",
                songs: [{
                    title: "Ek Tera Pyar",
                    file: "Bohemia/Ek Tera Pyar.mp3",
                    poster: "images/Ek Tera Pyar.jpeg"
                }]
            },
            boss: {
                name: "Boss",
                image: "images/boss.jpeg",
                songs: [{
                    title: "BOSS",
                    file: "Boss/Boss.mp3",
                    poster: "images/Boss.jpeg"
                }]
            },
            dhanda: {
                name: "Dhanda",
                image: "images/dhanda.jpeg",
                songs: [{
                    title: "Dhandha",
                    file: "Dhandha/Dhandha.mp3",
                    poster: "images/Dhandha.jpeg"
                }]
            },
            dulla: {
                name: "Dulla Bhatti",
                image: "images/dulla.jpeg",
                songs: [{
                    title: "Dulla Bhatti",
                    file: "Dulla Bhatti/Dulla Bhatti.mp3",
                    poster: "images/Dulla Bhatti.jpeg"
                }]
            },
            gursidhu: {
                name: "Gursidhu",
                image: "images/Gursidhu.jpeg",
                songs: [{
                    title: "Gursidhu",
                    file: "Gursidhu/Gursidhu.mp3",
                    poster: "images/Gursidhu.jpeg"
                }]
            },
            harkirataulakh: {
                name: "Harkirat Aulakh",
                image: "images/harkirat.jpeg",
                songs: [{
                    title: "Harkirat Aulakh",
                    file: "Harkirat Aulakh/Harkirat Aulakh.mp3",
                    poster: "images/Harkirat.jpeg"
                }]
            },
            honey: {
                name: " Yo Yo Honey Singh",
                image: "images/honey.jpeg",
                songs: [{
                    title: "Yo Yo Honey Singh",
                    file: "Yo Yo Honey Singh/Yo Yo Honey Singh.mp3",
                    poster: "images/Yo Yo Honey Singh.jpeg"
                }]

            },
            iqbal: {
                name: "Iqbal",
                image: "images/iq.jpeg",
                songs: [{
                    title: "Hath Haula",
                    file: "Iqbal/Hath Haula.mp3",
                    poster: "images/hathhola.jpeg"
                },{
                     title: "Koor Koor",
                    file: "Iqbal/Koor Koor.mp3",
                    poster: "images/koor.jpeg"
                }]
            },
            jassi: {
                name: "Jassi Gill",
                image: "images/jassi.jpeg",
                songs: [{
                    title: "Jassi Gill",
                    file: "Jassi Gill/Jassi Gill.mp3",
                    poster: "images/Jassi.jpeg"
                }]
            },
            jordansandhu: {
                name: "Jordan Sandhu",
                image: "images/jrdan.jpeg",
                songs: [{
                    title: "Banda Bamb",
                    file: "Jordan Sandhu/Banda Bamb.mp3",
                    poster: "images/bamb.jpeg"
                }]
            },
            nijjar: {
                name: "Nijjar",
                image: "images/nijjar.jpeg",
                songs: [{
                    title: "Nijjar",
                    file: "Nijjar/Nijjar.mp3",
                    poster: "images/Nijjar.jpeg"
                }]
            },
            pardeep: {
                name: "Pardeep Jeed",
                image: "images/pardeep.jpeg",
                songs: [{
                    title: "Pardeep Jeed",
                    file: "Pardeep Jeed/Pardeep Jeed.mp3",
                    poster: "images/Pardeep.jpeg"
                }]
            },
            saabi: {
                name: "Saabi",
                image: "images/saabi.jpeg",
                songs: [{
                    title: "Sabbir",
                    file: "Sabbir/Sabbir.mp3",
                    poster: "images/Sabbir.jpeg"
                }]
            },
            sultaan: {
                name: "Sultan",
                image: "images/suli.jpeg",
                songs: [{
                    title: "Sultan",
                    file: "Sultan/Sultan.mp3",
                    poster: "images/Sultan.jpeg"
                }]
            },
        };


        const CACHE_NAME = 'falcon-offline-v3';
        const LEGACY_CACHE_NAMES = ['falcon-offline-v2'];
        const SONG_CACHE_PREFIX = 'songs/';
        const NETWORK_STATE_KEY = 'falcon_network_state_v1';
        const OFFLINE_DB_NAME = 'falconx-offline-library';
        const OFFLINE_DB_VERSION = 1;
        const OFFLINE_TRACK_STORE = 'tracks';
        const SMART_PRELOAD_LIMIT = 2;
        const SMART_PRELOAD_RETAIN_LIMIT = 4;
        let downloadedFiles = new Set();
        let downloadedSongMeta = {};
        let songDurationMeta = {};
        let currentPlaybackSource = 'network';
        let preloadTimer = 0;
        let preloadRunToken = 0;
        let smartPreloadedFiles = new Set();
        let offlineDbPromise = null;
        let networkState = {
            online: navigator.onLine !== false,
            offlineOnly: false,
            lastToastAt: 0
        };

        function normalizeCachePath(path = '') {
            const raw = String(path || '').replace(/\\/g, '/').replace(/^\.?\//, '');
            return raw.startsWith(SONG_CACHE_PREFIX) ? raw : SONG_CACHE_PREFIX + raw;
        }

        function cacheRequestCandidates(path = '') {
            const normalized = normalizeCachePath(path);
            const encoded = normalized.split('/').map((part) => encodeURIComponent(part)).join('/');
            const candidates = [normalized, encoded];
            try {
                candidates.push(new URL(normalized, location.href).href);
                candidates.push(new URL(encoded, location.href).href);
            } catch (e) {}
            return [...new Set(candidates)];
        }

        function normalizeOfflineFileId(fileId = '') {
            return String(fileId || '').replace(/\\/g, '/').replace(/^\.?\//, '').replace(new RegExp('^' + SONG_CACHE_PREFIX), '');
        }

        function openOfflineDb() {
            if (!('indexedDB' in window)) return Promise.resolve(null);
            if (offlineDbPromise) return offlineDbPromise;
            offlineDbPromise = new Promise((resolve) => {
                const request = indexedDB.open(OFFLINE_DB_NAME, OFFLINE_DB_VERSION);
                request.onupgradeneeded = () => {
                    const db = request.result;
                    if (!db.objectStoreNames.contains(OFFLINE_TRACK_STORE)) {
                        db.createObjectStore(OFFLINE_TRACK_STORE, { keyPath: 'file' });
                    }
                };
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => resolve(null);
                request.onblocked = () => resolve(null);
            });
            return offlineDbPromise;
        }

        function collectOfflineLyrics(song = {}) {
            const embedded = song.syncedLyrics || song.lyricsLrc || song.lrc || song.lyrics || song.plainLyrics || '';
            const payload = {
                embedded,
                syncedLyrics: song.syncedLyrics || song.lyricsLrc || song.lrc || '',
                plainLyrics: song.plainLyrics || ''
            };
            try {
                if (typeof getLyricsCacheKey === 'function' && typeof lyricsCacheStore === 'object') {
                    const cacheKey = getLyricsCacheKey(song);
                    const cached = cacheKey ? lyricsCacheStore[cacheKey] : null;
                    if (cached) {
                        payload.syncedLyrics = payload.syncedLyrics || cached.syncedLyrics || cached.synced || cached.lrc || '';
                        payload.plainLyrics = payload.plainLyrics || cached.plainLyrics || '';
                    }
                }
            } catch (e) {}
            return payload;
        }

        function buildOfflineTrackRecord(song = {}, source = 'download') {
            const file = normalizeOfflineFileId(song.file);
            if (!file) return null;
            const artistName = song.artistName || song.artist || '';
            return {
                file,
                title: song.title || 'Unknown Track',
                artistName,
                artist: artistName,
                album: song.album || song.albumName || (typeof deriveSongAlbum === 'function' ? deriveSongAlbum(song, artistName) : ''),
                poster: song.poster || '',
                duration: song.duration || songDurationMeta[file] || 0,
                explicit: typeof isExplicitSong === 'function' ? isExplicitSong(song) : false,
                lyrics: collectOfflineLyrics(song),
                downloaded: source === 'download',
                source,
                updatedAt: Date.now()
            };
        }

        async function putOfflineTrackRecord(song, source = 'download') {
            const record = buildOfflineTrackRecord(song, source);
            if (!record) return;
            const db = await openOfflineDb();
            if (!db) return;
            await new Promise((resolve) => {
                const tx = db.transaction(OFFLINE_TRACK_STORE, 'readwrite');
                tx.objectStore(OFFLINE_TRACK_STORE).put(record);
                tx.oncomplete = () => resolve();
                tx.onerror = () => resolve();
            });
        }

        async function deleteOfflineTrackRecord(fileId) {
            const file = normalizeOfflineFileId(fileId);
            const db = await openOfflineDb();
            if (!db || !file) return;
            await new Promise((resolve) => {
                const tx = db.transaction(OFFLINE_TRACK_STORE, 'readwrite');
                tx.objectStore(OFFLINE_TRACK_STORE).delete(file);
                tx.oncomplete = () => resolve();
                tx.onerror = () => resolve();
            });
        }

        async function clearOfflineTrackRecords() {
            const db = await openOfflineDb();
            if (!db) return;
            await new Promise((resolve) => {
                const tx = db.transaction(OFFLINE_TRACK_STORE, 'readwrite');
                tx.objectStore(OFFLINE_TRACK_STORE).clear();
                tx.oncomplete = () => resolve();
                tx.onerror = () => resolve();
            });
        }

        async function cacheArtworkForSong(song, signal) {
            if (!('caches' in window) || !song?.poster || !canUseNetwork()) return;
            try {
                const cache = await caches.open(CACHE_NAME);
                const existing = await cache.match(song.poster, { ignoreSearch: true });
                if (existing) return;
                const response = await fetch(song.poster, { signal });
                if (response.ok) await cache.put(song.poster, response);
            } catch (e) {}
        }

        async function matchOfflineCache(path = '') {
            if (!('caches' in window)) return null;
            const candidates = cacheRequestCandidates(path);
            const names = [CACHE_NAME, ...LEGACY_CACHE_NAMES];
            for (const name of names) {
                try {
                    const cache = await caches.open(name);
                    for (const candidate of candidates) {
                        const match = await cache.match(candidate, { ignoreSearch: true });
                        if (match) return { cache, response: match, cacheName: name, key: candidate };
                    }
                } catch (e) {}
            }
            return null;
        }

        async function getAudioResolution(filePath) {
            const normalized = normalizeCachePath(filePath);
            const fileId = normalizeOfflineFileId(normalized);
            try {
                const cached = await matchOfflineCache(fileId);
                if (cached?.response) {
                    const blob = await cached.response.blob();
                    return { src: URL.createObjectURL(blob), source: 'local', cached: true };
                }
            } catch (e) {
                console.warn('Offline cache lookup failed:', e);
            }
            if (!canUseNetwork()) {
                throw new Error(networkState.offlineOnly ? 'Offline-only mode is enabled' : 'No internet connection');
            }
            return { src: normalized, source: 'network', cached: false };
        }

        async function ensureSongPlayable(song) {
            if (!song?.file) return { playable: false, reason: 'missing' };
            const cached = await matchOfflineCache(song.file);
            if (cached?.response) {
                if (!downloadedFiles.has(song.file)) {
                    downloadedFiles.add(song.file);
                    downloadedSongMeta[song.file] = downloadedSongMeta[song.file] || Date.now();
                    saveDownloaded();
                }
                return { playable: true, offline: true };
            }
            if (canUseNetwork()) return { playable: true, offline: false };
            return { playable: false, reason: networkState.offlineOnly ? 'offline-only' : 'offline' };
        }

        function getUpcomingSongs(limit = SMART_PRELOAD_LIMIT) {
            const upcoming = [];
            const seen = new Set();
            const add = (song) => {
                const file = normalizeOfflineFileId(song?.file);
                if (!file || seen.has(file) || upcoming.length >= limit) return;
                seen.add(file);
                upcoming.push(song);
            };
            if (Array.isArray(queue) && queue.length) queue.forEach(add);
            if (!isShuffle && Array.isArray(currentSongs) && currentSongs.length > 1 && upcoming.length < limit) {
                for (let offset = 1; offset < currentSongs.length && upcoming.length < limit; offset += 1) {
                    add(currentSongs[(currentIndex + offset) % currentSongs.length]);
                }
            }
            return upcoming.slice(0, limit);
        }

        async function preloadSongForPlayback(song) {
            if (!song?.file || !('caches' in window)) return false;
            const file = normalizeOfflineFileId(song.file);
            if (!file) return false;
            if ((await matchOfflineCache(file))?.response) {
                await putOfflineTrackRecord(song, isDownloaded(file) ? 'download' : 'preload');
                return true;
            }
            if (!canUseNetwork()) return false;
            try {
                const cache = await caches.open(CACHE_NAME);
                const url = normalizeCachePath(file);
                const response = await fetch(url, { method: 'GET', cache: 'force-cache' });
                if (!response.ok) return false;
                await cache.put(url, response);
                await Promise.allSettled([
                    cacheArtworkForSong(song),
                    putOfflineTrackRecord(song, 'preload')
                ]);
                smartPreloadedFiles.add(file);
                return true;
            } catch (e) {
                return false;
            }
        }

        async function trimSmartPreloadCache(keepSongs = []) {
            if (!('caches' in window) || smartPreloadedFiles.size <= SMART_PRELOAD_RETAIN_LIMIT) return;
            const keep = new Set(keepSongs.map((song) => normalizeOfflineFileId(song?.file)).filter(Boolean));
            if (currentSong?.file) keep.add(normalizeOfflineFileId(currentSong.file));
            for (const file of [...smartPreloadedFiles]) {
                if (smartPreloadedFiles.size <= SMART_PRELOAD_RETAIN_LIMIT) break;
                if (!file || keep.has(file) || isDownloaded(file)) continue;
                try {
                    const cache = await caches.open(CACHE_NAME);
                    await Promise.all(cacheRequestCandidates(file).map((key) => cache.delete(key)));
                    await deleteOfflineTrackRecord(file);
                } catch (e) {}
                smartPreloadedFiles.delete(file);
            }
        }

        function scheduleSmartPreload(reason = 'playback') {
            window.clearTimeout(preloadTimer);
            const token = ++preloadRunToken;
            preloadTimer = window.setTimeout(async () => {
                if (token !== preloadRunToken) return;
                const upcoming = getUpcomingSongs(SMART_PRELOAD_LIMIT);
                for (const song of upcoming) {
                    if (token !== preloadRunToken) return;
                    const ok = await preloadSongForPlayback(song);
                    if (!ok && !canUseNetwork()) break;
                }
                await trimSmartPreloadCache(upcoming);
            }, reason === 'queue-change' ? 180 : 420);
        }

        function findNextDownloadedIndex(startIndex = 0) {
            if (!Array.isArray(currentSongs) || !currentSongs.length) return -1;
            for (let offset = 1; offset <= currentSongs.length; offset += 1) {
                const index = (startIndex + offset) % currentSongs.length;
                if (isDownloaded(currentSongs[index]?.file)) return index;
            }
            return -1;
        }

        function loadDownloaded() {
            try {
                downloadedFiles = new Set(JSON.parse(localStorage.getItem('falcon_downloaded') || '[]'));
            } catch (e) {}
            try {
                const meta = JSON.parse(localStorage.getItem('eq_downloaded_meta') || '{}');
                downloadedSongMeta = meta && typeof meta === 'object' && !Array.isArray(meta) ? Object.fromEntries(Object.entries(meta).filter(([k, v]) => typeof k === 'string' && Number.isFinite(v) && v > 0).map(([k, v]) => [k, Math.floor(v)])) : {};
            } catch (e) {
                downloadedSongMeta = {};
            }
            let seedTs = Date.now();
            downloadedFiles.forEach((fileId) => {
                if (!Number.isFinite(downloadedSongMeta[fileId]) || downloadedSongMeta[fileId] <= 0) {
                    downloadedSongMeta[fileId] = seedTs--;
                }
            });
            Object.keys(downloadedSongMeta).forEach((fileId) => {
                if (!downloadedFiles.has(fileId)) delete downloadedSongMeta[fileId];
            });
            try {
                const durations = JSON.parse(localStorage.getItem('eq_song_duration_meta') || '{}');
                songDurationMeta = durations && typeof durations === 'object' && !Array.isArray(durations) ? Object.fromEntries(Object.entries(durations).filter(([k, v]) => typeof k === 'string' && Number.isFinite(v) && v > 0).map(([k, v]) => [k, Math.floor(v)])) : {};
            } catch (e) {
                songDurationMeta = {};
            }
        }

        function saveDownloaded() {
            Object.keys(downloadedSongMeta).forEach((fileId) => {
                if (!downloadedFiles.has(fileId)) delete downloadedSongMeta[fileId];
            });
            localStorage.setItem('falcon_downloaded', JSON.stringify([...downloadedFiles]));
            localStorage.setItem('eq_downloaded_meta', JSON.stringify(downloadedSongMeta));
            if (typeof notifyCloudStateChange === 'function') notifyCloudStateChange('downloads');
        }

        function isDownloaded(f) {
            return downloadedFiles.has(f);
        }
        loadDownloaded();

        function loadNetworkState() {
            try {
                const saved = JSON.parse(localStorage.getItem(NETWORK_STATE_KEY) || '{}');
                networkState.offlineOnly = !!saved.offlineOnly;
            } catch (e) {}
            networkState.online = navigator.onLine !== false;
        }

        function saveNetworkState() {
            try {
                localStorage.setItem(NETWORK_STATE_KEY, JSON.stringify({ offlineOnly: !!networkState.offlineOnly }));
            } catch (e) {}
        }

        loadNetworkState();

        function canUseNetwork() {
            return networkState.online && !networkState.offlineOnly;
        }

        function handleNetworkAvailabilityChange(online) {
            const wasOnline = networkState.online;
            networkState.online = online;
            saveNetworkState();
            if (currentSong) updatePlayerDlBtn();
            if (!online) {
                if (dlAbortController) {
                    try { dlAbortController.abort(); } catch (e) {}
                }
                scheduleSmartPreload('network-change');
                return;
            }
            if (!wasOnline && dlQueue.some((item) => item.status === 'queued') && !dlPaused && !dlBusy) processQueue();
            scheduleSmartPreload('network-change');
        }

        window.addEventListener('online', () => handleNetworkAvailabilityChange(true));
        window.addEventListener('offline', () => handleNetworkAvailabilityChange(false));

        function saveSongDurationMeta() {
            try {
                localStorage.setItem('eq_song_duration_meta', JSON.stringify(songDurationMeta));
            } catch (e) {}
        }

        const SORT_STORAGE_KEYS = {
            liked: 'likedSongsSort',
            playlist: 'playlistSort',
            artist: 'artistSort',
            download: 'downloadSort',
            queue: 'queueSort'
        };

        const SORT_LEGACY_STORAGE_KEYS = {
            liked: ['eq_fav_sort'],
            playlist: ['eq_playlist_sort'],
            artist: ['eq_artist_sort'],
            download: ['eq_download_sort'],
            queue: ['eq_queue_sort']
        };

        const SORT_DEFAULTS = {
            liked: 'az',
            playlist: 'recentlyAdded',
            artist: 'az',
            download: 'downloadedFirst',
            queue: 'custom'
        };

        const SORT_TYPE_ALIASES = {
            title: 'az',
            recent: 'recentlyAdded',
            plays: 'mostPlayed',
            artist: 'artistName',
            liked: 'likedFirst',
            liked_title: 'likedFirst',
            downloaded: 'downloadedFirst',
            album: 'albumName',
            duration_desc: 'duration',
            smart: 'smartQueue',
            ai: 'aiSmartOrder'
        };

        const SORT_TYPE_CONFIG = {
            custom: { label: 'Custom Order', icon: 'grip-vertical' },
            az: { label: 'A-Z', icon: 'arrow-up-a-z' },
            za: { label: 'Z-A', icon: 'arrow-down-z-a' },
            recentlyAdded: { label: 'Recently Added', icon: 'calendar-plus' },
            recentlyPlayed: { label: 'Recently Played', icon: 'history' },
            mostPlayed: { label: 'Most Played', icon: 'bar-chart-3' },
            artistName: { label: 'Artist Name', icon: 'user' },
            albumName: { label: 'Album Name', icon: 'disc-3' },
            duration: { label: 'Duration', icon: 'clock-3' },
            downloadedFirst: { label: 'Downloaded First', icon: 'download' },
            likedFirst: { label: 'Liked First', icon: 'heart' },
            smartQueue: { label: 'Smart Queue', icon: 'list-music', advanced: true },
            smartShuffle: { label: 'Smart Shuffle', icon: 'shuffle', advanced: true },
            mood: { label: 'Mood', icon: 'sparkles', advanced: true },
            genre: { label: 'Genre', icon: 'radio', advanced: true },
            bpm: { label: 'BPM', icon: 'gauge', advanced: true },
            aiSmartOrder: { label: 'AI Smart Order', icon: 'brain', advanced: true }
        };

        const SORT_SECTION_OPTIONS = {
            liked: ['az', 'za', 'recentlyAdded', 'recentlyPlayed', 'mostPlayed', 'artistName', 'albumName', 'duration', 'downloadedFirst', 'likedFirst', 'smartShuffle', 'mood', 'genre', 'bpm', 'aiSmartOrder'],
            playlist: ['custom', 'recentlyAdded', 'az', 'za', 'recentlyPlayed', 'mostPlayed', 'artistName', 'albumName', 'duration', 'downloadedFirst', 'likedFirst', 'smartShuffle', 'mood', 'genre', 'bpm', 'aiSmartOrder'],
            artist: ['az', 'za', 'recentlyAdded', 'recentlyPlayed', 'mostPlayed', 'artistName', 'albumName', 'duration', 'downloadedFirst', 'likedFirst', 'smartShuffle', 'mood', 'genre', 'bpm', 'aiSmartOrder'],
            download: ['downloadedFirst', 'az', 'za', 'recentlyAdded', 'recentlyPlayed', 'mostPlayed', 'artistName', 'albumName', 'duration', 'likedFirst', 'smartShuffle', 'mood', 'genre', 'bpm', 'aiSmartOrder'],
            queue: ['custom', 'smartQueue', 'az', 'za', 'recentlyPlayed', 'mostPlayed', 'artistName', 'albumName', 'duration', 'downloadedFirst', 'likedFirst', 'smartShuffle', 'mood', 'genre', 'bpm', 'aiSmartOrder']
        };

        const sortTextCollator = new Intl.Collator(undefined, {
            numeric: true,
            sensitivity: 'base'
        });

        function normalizeSortType(type, fallback = 'az') {
            const raw = String(type || '').trim();
            const mapped = SORT_TYPE_ALIASES[raw] || raw;
            return SORT_TYPE_CONFIG[mapped] ? mapped : fallback;
        }

        function getSortConfig(type) {
            return SORT_TYPE_CONFIG[normalizeSortType(type, 'az')] || SORT_TYPE_CONFIG.az;
        }

        function getSortLabel(type) {
            return getSortConfig(type).label;
        }

        function getSortIcon(type) {
            return getSortConfig(type).icon;
        }

        function saveSortPreference(scope, sortType) {
            const key = SORT_STORAGE_KEYS[scope];
            if (!key) return;
            const normalized = normalizeSortType(sortType, SORT_DEFAULTS[scope] || 'az');
            try {
                localStorage.setItem(key, normalized);
            } catch (e) {}
        }

        function loadSortPreference(scope, fallback = 'az') {
            const nextFallback = normalizeSortType(fallback, 'az');
            const key = SORT_STORAGE_KEYS[scope];
            try {
                const saved = key ? localStorage.getItem(key) : '';
                if (saved) return normalizeSortType(saved, nextFallback);
                const legacyKeys = SORT_LEGACY_STORAGE_KEYS[scope] || [];
                for (const legacyKey of legacyKeys) {
                    const legacy = localStorage.getItem(legacyKey);
                    if (legacy) return normalizeSortType(legacy, nextFallback);
                }
            } catch (e) {}
            return nextFallback;
        }

        function getSongFileKey(song) {
            return String(song?.file || '').replace(/\\/g, '/').trim().toLowerCase();
        }

        function getLibrarySongByFile(fileId) {
            const target = getSongFileKey({ file: fileId });
            if (!target || typeof artists !== 'object') return null;
            for (const key in artists) {
                const artist = artists[key];
                const song = artist.songs.find((entry) => getSongFileKey(entry) === target);
                if (song) return { artistKey: key, artistName: getArtistDisplayNameByKey(key, artist.name), song };
            }
            return null;
        }

        function deriveSongAlbum(song, artistName = '') {
            if (song?.album) return String(song.album);
            if (song?.albumName) return String(song.albumName);
            const poster = String(song?.poster || '').split('/').pop() || '';
            const cleanPoster = poster.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim();
            return cleanPoster || artistName || 'Singles';
        }

        function readExplicitMetadata(song) {
            if (!song || typeof song !== 'object') return null;
            const raw = song.explicit ?? song.isExplicit ?? song.contentExplicit ?? song.parentalAdvisory ?? song.advisory ?? song.rating ?? song.contentRating;
            if (typeof raw === 'boolean') return raw;
            if (typeof raw === 'number') return raw > 0;
            if (typeof raw === 'string') {
                const normalized = raw.trim().toLowerCase();
                if (['true', 'yes', '1', 'explicit', 'e', 'parental advisory', 'advisory'].includes(normalized)) return true;
                if (['false', 'no', '0', 'clean', 'none', 'not explicit'].includes(normalized)) return false;
            }
            return null;
        }

        function isExplicitSong(song) {
            const direct = readExplicitMetadata(song);
            if (direct !== null) return direct;
            const haystack = `${song?.title || ''} ${song?.file || ''}`.toLowerCase();
            return /\b(stfu|unfuckwithable|bitch|g shit|shit|faak|fuck|explicit|parental advisory)\b/.test(haystack);
        }

        function explicitBadgeHTML(song) {
            return isExplicitSong(song) ? '<span class="explicit-badge" title="Explicit" aria-label="Explicit content">E</span>' : '';
        }

        function songTitleHTML(song, fallbackTitle = '') {
            const title = String(song?.title || fallbackTitle || 'Unknown');
            return `<span class="title-with-badge"><span class="title-text">${escH(title)}</span>${explicitBadgeHTML(song)}</span>`;
        }

        function syncExplicitBadges(song = currentSong) {
            const show = !!(song && isExplicitSong(song));
            ['playerExplicitBadge', 'fsExplicitBadge', 'fsHeaderExplicitBadge'].forEach((id) => {
                const badge = document.getElementById(id);
                if (badge) badge.classList.toggle('hidden', !show);
            });
        }

        function getRecentSongMeta(fileId) {
            const target = getSongFileKey({ file: fileId });
            if (!target || !Array.isArray(continueListening)) return null;
            const index = continueListening.findIndex((song) => getSongFileKey(song) === target);
            if (index < 0) return null;
            const song = continueListening[index];
            return {
                ...song,
                lastPlayed: Number.isFinite(song.lastPlayed) ? song.lastPlayed : Date.now() - index
            };
        }

        function normalizeSongForSorting(song, index = 0, context = {}) {
            const file = song?.file || '';
            const libraryHit = song?.artistName || song?.artist ? null : getLibrarySongByFile(file);
            const artistName = String(song?.artist || song?.artistName || context.artistName || libraryHit?.artistName || '').trim();
            const recent = getRecentSongMeta(file);
            const fileKey = getSongFileKey(song);
            const likedAt = Number.isFinite(likedSongMeta?.[file]) ? likedSongMeta[file] : 0;
            const downloadedAt = Number.isFinite(downloadedSongMeta?.[file]) ? downloadedSongMeta[file] : 0;
            const directAddedAt = Number(song?.addedAt);
            const scopeAddedAt = context.scope === 'liked' ? likedAt : context.scope === 'download' ? downloadedAt : 0;
            const addedAt = Number.isFinite(directAddedAt) && directAddedAt > 0 ? directAddedAt : scopeAddedAt;
            const directDuration = Number(song?.duration);
            const storedDuration = Number(songDurationMeta?.[file]);
            const directLastPlayed = Number(song?.lastPlayed);
            return {
                ...song,
                title: String(song?.title || '').trim(),
                artist: artistName,
                artistName,
                album: deriveSongAlbum(song, artistName),
                duration: Number.isFinite(directDuration) && directDuration > 0 ? directDuration : Number.isFinite(storedDuration) ? storedDuration : 0,
                playCount: Number.isFinite(Number(song?.playCount)) ? Number(song.playCount) : (songPlayCounts?.[file] || songPlayCounts?.[fileKey] || 0),
                liked: typeof song?.liked === 'boolean' ? song.liked : !!likedSongs?.has(file),
                downloaded: typeof song?.downloaded === 'boolean' ? song.downloaded : isDownloaded(file),
                addedAt,
                lastPlayed: Number.isFinite(directLastPlayed) && directLastPlayed > 0 ? directLastPlayed : (recent?.lastPlayed || 0),
                likedAt,
                downloadedAt,
                genre: String(song?.genre || '').trim(),
                mood: String(song?.mood || '').trim(),
                bpm: Number.isFinite(Number(song?.bpm)) ? Number(song.bpm) : 0,
                explicit: isExplicitSong(song),
                __baseIndex: Number.isFinite(song?.__baseIndex) ? song.__baseIndex : index
            };
        }

        function compareText(a, b) {
            return sortTextCollator.compare(String(a || ''), String(b || ''));
        }

        function stableSongTieBreak(a, b) {
            return compareText(a.title, b.title) || compareText(a.artist, b.artist) || ((a.__baseIndex || 0) - (b.__baseIndex || 0));
        }

        function sortHash(song) {
            const input = `${song.file || ''}|${song.title || ''}|${song.artist || ''}`;
            let hash = 0;
            for (let i = 0; i < input.length; i++) {
                hash = ((hash << 5) - hash + input.charCodeAt(i)) | 0;
            }
            return Math.abs(hash);
        }

        function sortSongs(songs, sortType = 'az') {
            const normalizedType = normalizeSortType(sortType, 'az');
            const prepared = Array.isArray(songs) ? songs.map((song, index) => normalizeSongForSorting(song, index)) : [];
            const sorted = [...prepared];
            const byRecentAdded = (a, b) => (b.addedAt || 0) - (a.addedAt || 0) || (b.__baseIndex || 0) - (a.__baseIndex || 0);
            const byRecentPlayed = (a, b) => (b.lastPlayed || 0) - (a.lastPlayed || 0) || (b.playCount || 0) - (a.playCount || 0) || stableSongTieBreak(a, b);
            const byMostPlayed = (a, b) => (b.playCount || 0) - (a.playCount || 0) || byRecentPlayed(a, b);
            const comparators = {
                custom: (a, b) => (a.__baseIndex || 0) - (b.__baseIndex || 0),
                az: (a, b) => compareText(a.title, b.title) || stableSongTieBreak(a, b),
                za: (a, b) => compareText(b.title, a.title) || stableSongTieBreak(a, b),
                recentlyAdded: byRecentAdded,
                recentlyPlayed: byRecentPlayed,
                mostPlayed: byMostPlayed,
                artistName: (a, b) => compareText(a.artist, b.artist) || compareText(a.title, b.title) || stableSongTieBreak(a, b),
                albumName: (a, b) => compareText(a.album, b.album) || compareText(a.title, b.title) || stableSongTieBreak(a, b),
                duration: (a, b) => (b.duration || 0) - (a.duration || 0) || stableSongTieBreak(a, b),
                downloadedFirst: (a, b) => Number(b.downloaded) - Number(a.downloaded) || (b.downloadedAt || 0) - (a.downloadedAt || 0) || stableSongTieBreak(a, b),
                likedFirst: (a, b) => Number(b.liked) - Number(a.liked) || (b.likedAt || 0) - (a.likedAt || 0) || stableSongTieBreak(a, b),
                smartQueue: (a, b) => Number(b.liked) - Number(a.liked) || Number(b.downloaded) - Number(a.downloaded) || (b.playCount || 0) - (a.playCount || 0) || (a.lastPlayed || 0) - (b.lastPlayed || 0) || stableSongTieBreak(a, b),
                smartShuffle: (a, b) => Number(b.liked) - Number(a.liked) || (a.lastPlayed || 0) - (b.lastPlayed || 0) || (sortHash(a) % 97) - (sortHash(b) % 97) || stableSongTieBreak(a, b),
                mood: (a, b) => compareText(a.mood || a.genre || a.artist, b.mood || b.genre || b.artist) || stableSongTieBreak(a, b),
                genre: (a, b) => compareText(a.genre || a.artist, b.genre || b.artist) || stableSongTieBreak(a, b),
                bpm: (a, b) => (b.bpm || 0) - (a.bpm || 0) || stableSongTieBreak(a, b),
                aiSmartOrder: (a, b) => Number(b.liked) - Number(a.liked) || (b.playCount || 0) - (a.playCount || 0) || (b.lastPlayed || 0) - (a.lastPlayed || 0) || Number(b.downloaded) - Number(a.downloaded) || stableSongTieBreak(a, b)
            };
            sorted.sort(comparators[normalizedType] || comparators.az);
            return sorted.map((song) => {
                const out = { ...song };
                delete out.__baseIndex;
                delete out.likedAt;
                delete out.downloadedAt;
                return out;
            });
        }

        function applySorting(scope, songs, sortType = loadSortPreference(scope, SORT_DEFAULTS[scope] || 'az'), context = {}) {
            const normalizedType = normalizeSortType(sortType, SORT_DEFAULTS[scope] || 'az');
            const prepared = Array.isArray(songs) ? songs.map((song, index) => normalizeSongForSorting(song, index, { ...context, scope })) : [];
            return sortSongs(prepared, normalizedType);
        }

        function sortControlHTML(scope, activeType, options = SORT_SECTION_OPTIONS[scope] || SORT_SECTION_OPTIONS.artist, title = 'Sort') {
            const normalizedType = normalizeSortType(activeType, SORT_DEFAULTS[scope] || 'az');
            const sheetId = `${scope}SortSheet`;
            const optionHTML = options.map((type) => {
                const normalizedOption = normalizeSortType(type, SORT_DEFAULTS[scope] || 'az');
                const cfg = getSortConfig(normalizedOption);
                return `<button class="sort-option${cfg.advanced ? ' advanced' : ''}${normalizedOption === normalizedType ? ' active' : ''}" type="button" data-sort-option data-sort-scope="${escA(scope)}" data-sort-type="${escA(normalizedOption)}"><span class="sort-option-icon">${uiIcon(cfg.icon)}</span><span>${escH(cfg.label)}</span><span class="sort-option-check">${uiIcon('check')}</span></button>`;
            }).join('');
            return `<div class="sort-control-row"><button class="sort-trigger" type="button" data-sort-trigger="${escA(scope)}" aria-haspopup="dialog" aria-expanded="false"><span class="sort-pill-icon" data-sort-current-icon="${escA(scope)}">${uiIcon(getSortIcon(normalizedType))}</span><span class="sort-trigger-text">Sort: <span data-sort-label="${escA(scope)}">${escH(getSortLabel(normalizedType))}</span></span><span class="sort-chevron">${uiIcon('chevron-down')}</span></button></div><div class="sort-sheet" id="${escA(sheetId)}" data-sort-sheet="${escA(scope)}"><div class="sort-sheet-card"><div class="sort-sheet-title">${uiIcon('arrow-up-down')}<span>${escH(title)}</span></div>${optionHTML}<button class="sort-close" type="button" data-sort-close="${escA(scope)}">Close</button></div></div>`;
        }

        function updateSortUI(scope, activeType) {
            const normalizedType = normalizeSortType(activeType, SORT_DEFAULTS[scope] || 'az');
            document.querySelectorAll(`[data-sort-label="${scope}"]`).forEach((el) => {
                el.textContent = getSortLabel(normalizedType);
            });
            document.querySelectorAll(`[data-sort-current-icon="${scope}"]`).forEach((el) => {
                el.innerHTML = uiIcon(getSortIcon(normalizedType));
                renderLucideIcons(el);
            });
            document.querySelectorAll(`[data-sort-option][data-sort-scope="${scope}"]`).forEach((btn) => {
                btn.classList.toggle('active', btn.dataset.sortType === normalizedType);
            });
        }

        function closeSortSheet(scope) {
            const sheets = scope ? document.querySelectorAll(`[data-sort-sheet="${scope}"]`) : document.querySelectorAll('[data-sort-sheet]');
            sheets.forEach((sheet) => sheet.classList.remove('open'));
            const triggers = scope ? document.querySelectorAll(`[data-sort-trigger="${scope}"]`) : document.querySelectorAll('[data-sort-trigger]');
            triggers.forEach((trigger) => trigger.setAttribute('aria-expanded', 'false'));
        }

        function toggleSortSheet(scope) {
            const sheet = document.querySelector(`[data-sort-sheet="${scope}"]`);
            const trigger = document.querySelector(`[data-sort-trigger="${scope}"]`);
            if (!sheet) return;
            const willOpen = !sheet.classList.contains('open');
            closeSortSheet();
            sheet.classList.toggle('open', willOpen);
            if (trigger) trigger.setAttribute('aria-expanded', String(willOpen));
        }

        function renderSortedList(container, html, rowSelector, afterRender) {
            if (!container) return;
            const mainArea = document.getElementById('mainArea');
            const mainScrollTop = mainArea ? mainArea.scrollTop : 0;
            const containerScrollTop = container.scrollTop;
            const template = document.createElement('template');
            template.innerHTML = html;
            container.classList.add('sort-song-list');
            container.replaceChildren(template.content);
            if (typeof afterRender === 'function') afterRender();
            if (mainArea) mainArea.scrollTop = mainScrollTop;
            container.scrollTop = containerScrollTop;
        }

        document.addEventListener('click', (event) => {
            const target = event.target instanceof Element ? event.target : null;
            if (!target) return;
            const trigger = target.closest('[data-sort-trigger]');
            if (trigger) {
                event.preventDefault();
                toggleSortSheet(trigger.dataset.sortTrigger || '');
                return;
            }
            const option = target.closest('[data-sort-option]');
            if (option) {
                event.preventDefault();
                setSortForScope(option.dataset.sortScope || '', option.dataset.sortType || '');
                return;
            }
            const close = target.closest('[data-sort-close]');
            if (close) {
                event.preventDefault();
                closeSortSheet(close.dataset.sortClose || '');
                return;
            }
            const sheet = target.closest('[data-sort-sheet]');
            if (sheet && target === sheet) closeSortSheet(sheet.dataset.sortSheet || '');
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeSortSheet();
        });

        window.sortSongs = sortSongs;
        window.saveSortPreference = saveSortPreference;
        window.loadSortPreference = loadSortPreference;
        window.applySorting = applySorting;

        const DL_QUEUE_STORAGE_KEY = 'falcon_download_queue_v1';
        let dlQueue = [],
            dlPaused = false,
            dlBusy = false,
            dlAbortController = null;
        const dpanel = () => document.getElementById('downloadPanel');

        function saveDlQueue() {
            try {
                const pending = dlQueue.filter((item) => item.status !== 'done').map((item) => ({
                    ...item,
                    status: item.status === 'active' ? 'queued' : item.status,
                    progress: item.status === 'active' ? 0 : item.progress,
                    rateBps: 0,
                    etaSec: 0
                }));
                localStorage.setItem(DL_QUEUE_STORAGE_KEY, JSON.stringify(pending));
            } catch (e) {}
        }

        function loadDlQueue() {
            try {
                const saved = JSON.parse(localStorage.getItem(DL_QUEUE_STORAGE_KEY) || '[]');
                if (!Array.isArray(saved)) return;
                dlQueue = saved.filter((item) => item && item.song && typeof item.song.file === 'string' && !isDownloaded(item.song.file)).map((item) => ({
                    ...item,
                    id: typeof item.id === 'string' ? item.id : 'dl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
                    status: item.status === 'error' ? 'error' : 'queued',
                    progress: item.status === 'error' ? 0 : Math.max(0, Math.min(95, Number(item.progress) || 0)),
                    bytesDone: Number(item.bytesDone) || 0,
                    bytesTotal: Number(item.bytesTotal) || 0,
                    startedAt: 0,
                    lastTickAt: 0,
                    rateBps: 0,
                    etaSec: 0,
                    retryCount: Number(item.retryCount) || 0,
                    retryAt: Number(item.retryAt) || 0,
                    errorMessage: typeof item.errorMessage === 'string' ? item.errorMessage : ''
                }));
            } catch (e) {
                dlQueue = [];
            }
        }

        function scheduleDownloadRetry(item, err) {
            const retryCount = (Number(item.retryCount) || 0) + 1;
            item.retryCount = retryCount;
            item.status = 'queued';
            item.progress = Math.max(0, Math.min(item.progress || 0, 95));
            item.rateBps = 0;
            item.etaSec = 0;
            item.errorMessage = '';
            const delay = Math.min(30000, 1500 * Math.pow(2, Math.min(retryCount - 1, 4)));
            item.retryAt = Date.now() + delay;
            saveDlQueue();
            renderDpItem(item);
            updateDpStats();
            window.setTimeout(() => {
                if (!dlBusy && !dlPaused && canUseNetwork()) processQueue();
            }, delay + 80);
            if (retryCount === 1) showToast('Network interrupted. Retrying download...');
            console.warn('Download retry scheduled:', err);
        }

        function queueStats() {
            const q = dlQueue.filter(i => i.status === 'queued').length,
                a = dlQueue.filter(i => i.status === 'active').length,
                d = dlQueue.filter(i => i.status === 'done').length;
            return {
                total: dlQueue.length,
                q,
                a,
                d
            };
        }

        function updateDpStats() {
            const s = queueStats();
            document.getElementById('dpTotal').textContent = s.total;
            document.getElementById('dpActive').textContent = s.a;
            document.getElementById('dpDone').textContent = s.d;
            const badge = document.getElementById('dlQueueBadge');
            if (s.q + s.a > 0) {
                badge.textContent = s.a > 0 ? '?' : s.q;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
            updateDownloadStorageStats();
        }

        function renderDpItem(item) {
            const container = document.getElementById('dpItems');
            const empty = container.querySelector('.dp-empty');
            if (empty) empty.remove();
            let el = document.getElementById('dpi_' + item.id);
            if (!el) {
                el = document.createElement('div');
                el.id = 'dpi_' + item.id;
                el.innerHTML = `<img src="${escH(item.song.poster)}" onerror="this.style.background='var(--surface3)'"><div class="dp-item-info"><div class="dp-item-title">${escH(item.song.title)}</div><div class="dp-item-status"><div class="dp-dot"></div><span class="dp-status-text">${item.status}</span></div><div class="dp-item-meta"></div><div class="dp-progress"><div class="dp-progress-bar" style="width:0%"></div></div></div><button class="dp-item-del" title="Remove from queue" aria-label="Remove from queue">${uiIcon('x')}</button>`;
                container.appendChild(el);
                renderLucideIcons(el);
            }
            el.className = 'dp-item ' + (item.status === 'active' ? 'active' : item.status === 'done' ? 'done' : item.status === 'error' ? 'error' : '');
            const statusText = item.status === 'active' ? 'Downloading…' : item.status === 'done' ? 'Saved offline' : item.status === 'error' ? 'Failed' : item.status;
            el.querySelector('.dp-status-text').textContent = statusText;
            el.querySelector('.dp-progress-bar').style.width = item.progress + '%';
            const metaEl = el.querySelector('.dp-item-meta');
            if (metaEl) {
                if (item.status === 'active') {
                    const speed = item.rateBps && item.rateBps > 0 ? `${(item.rateBps / 1024).toFixed(0)} KB/s` : 'Calculating speed…';
                    const eta = Number.isFinite(item.etaSec) && item.etaSec > 0 ? `ETA ${Math.ceil(item.etaSec)}s` : 'Estimating…';
                    metaEl.textContent = `${speed} • ${eta}`;
                } else if (item.status === 'done') {
                    const mb = Number.isFinite(item.bytesDone) ? (item.bytesDone / (1024 * 1024)).toFixed(1) : null;
                    metaEl.textContent = mb ? `${mb} MB cached` : 'Available offline';
                } else if (item.status === 'error') {
                    metaEl.textContent = item.errorMessage || 'Tap retry to download again';
                } else {
                    metaEl.textContent = 'Waiting in queue';
                }
            }
            const actionBtn = el.querySelector('.dp-item-del');
            if (actionBtn) {
                if (item.status === 'error') {
                    actionBtn.setAttribute('title', 'Retry');
                    actionBtn.setAttribute('aria-label', 'Retry');
                    actionBtn.onclick = () => retryDlQueueItem(item.id);
                    if (actionBtn.dataset.icon !== 'refresh-cw') {
                        actionBtn.dataset.icon = 'refresh-cw';
                        setElementIcon(actionBtn, 'refresh-cw');
                    }
                } else {
                    actionBtn.setAttribute('title', 'Remove from queue');
                    actionBtn.setAttribute('aria-label', 'Remove from queue');
                    actionBtn.onclick = () => removeFromDlQueue(item.id);
                    if (actionBtn.dataset.icon !== 'x') {
                        actionBtn.dataset.icon = 'x';
                        setElementIcon(actionBtn, 'x');
                    }
                }
            }
        }

        function updateDownloadStorageStats() {
            const doneBytes = dlQueue.filter((item) => item.status === 'done').reduce((acc, item) => acc + (item.bytesDone || 0), 0);
            const header = document.getElementById('dpStats');
            if (!header) return;
            const storageEl = document.getElementById('dpStorage');
            if (storageEl) storageEl.textContent = `${(doneBytes / (1024 * 1024)).toFixed(1)} MB`;
            header.title = doneBytes > 0 ? `Offline cache ${ (doneBytes / (1024 * 1024)).toFixed(1) } MB` : '';
            if (navigator.storage?.estimate) {
                navigator.storage.estimate().then((estimate) => {
                    const usage = Number(estimate?.usage || 0);
                    if (!storageEl) return;
                    if (!Number.isFinite(usage) || usage <= 0) return;
                    const mb = usage / (1024 * 1024);
                    storageEl.textContent = `${mb.toFixed(1)} MB`;
                    header.title = `Device storage used ${mb.toFixed(1)} MB`;
                }).catch(() => {});
            }
        }

        window.removeFromDlQueue = (id) => {
            dlQueue = dlQueue.filter(i => i.id !== id);
            saveDlQueue();
            const el = document.getElementById('dpi_' + id);
            if (el) el.remove();
            if (!dlQueue.length) {
                const items = document.getElementById('dpItems');
                items.innerHTML = `<div class="dp-empty">${uiIcon('download')} <span>Queue empty - tap download on any song</span></div>`;
                renderLucideIcons(items);
            }
            updateDpStats();
            updateDownloadStorageStats();
        };

        window.retryDlQueueItem = (id) => {
            const item = dlQueue.find((entry) => entry.id === id);
            if (!item) return;
            item.status = 'queued';
            item.progress = 0;
            item.errorMessage = '';
            item.startedAt = 0;
            item.rateBps = 0;
            item.etaSec = 0;
            renderDpItem(item);
            saveDlQueue();
            updateDpStats();
            if (!dlBusy && !dlPaused) processQueue();
        };

        window.clearAllFromQueue = () => {
            if (!confirm('Clear download queue?')) return;
            if (dlAbortController) {
                try {
                    dlAbortController.abort();
                } catch (e) {}
            }
            dlQueue = [];
            saveDlQueue();
            const items = document.getElementById('dpItems');
            items.innerHTML = `<div class="dp-empty">${uiIcon('download')} <span>Queue empty - tap download on any song</span></div>`;
            renderLucideIcons(items);
            updateDpStats();
            dpanel().classList.remove('open');
        };

        window.toggleQueuePause = () => {
            dlPaused = !dlPaused;
            saveDlQueue();
            document.getElementById('dpPauseBtn').textContent = dlPaused ? 'Resume All' : 'Pause All';
            if (dlPaused && dlAbortController) {
                try {
                    dlAbortController.abort();
                } catch (e) {}
            }
            if (!dlPaused && !dlBusy) processQueue();
            showToast(dlPaused ? 'Downloads paused' : 'Downloads resumed');
        };

        async function addToDlQueue(song) {
            if (isDownloaded(song.file)) {
                showToast('Already downloaded');
                return;
            }
            const cached = await matchOfflineCache(song.file);
            if (cached?.response) {
                downloadedFiles.add(song.file);
                downloadedSongMeta[song.file] = downloadedSongMeta[song.file] || Date.now();
                await Promise.allSettled([
                    putOfflineTrackRecord(song, 'download'),
                    cacheArtworkForSong(song)
                ]);
                saveDownloaded();
                refreshVisibleSongLists();
                updatePlayerDlBtn();
                showToast('Already downloaded');
                return;
            }
            if (dlQueue.some(i => i.song.file === song.file)) {
                showToast('Already in queue');
                return;
            }
            const id = 'dl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5);
            const item = {
                id,
                song,
                status: 'queued',
                progress: 0,
                bytesDone: 0,
                bytesTotal: 0,
                startedAt: 0,
                lastTickAt: 0,
                rateBps: 0,
                etaSec: 0,
                errorMessage: ''
            };
            dlQueue.push(item);
            saveDlQueue();
            renderDpItem(item);
            updateDpStats();
            updateDownloadStorageStats();
            dpanel().classList.add('open');
            if (!dlBusy && !dlPaused) processQueue();
            return id;
        }

        async function processQueue() {
            if (dlBusy || dlPaused) return;
            if (!canUseNetwork()) return;
            const next = dlQueue.find(i => i.status === 'queued');
            if (!next) return;
            dlBusy = true;
            next.status = 'active';
            next.progress = 10;
            next.startedAt = performance.now();
            next.lastTickAt = next.startedAt;
            next.rateBps = 0;
            next.etaSec = 0;
            next.errorMessage = '';
            saveDlQueue();
            renderDpItem(next);
            updateDpStats();
            try {
                const url = normalizeCachePath(next.song.file);
                let cache;
                try {
                    cache = await caches.open(CACHE_NAME);
                } catch (e) {
                    throw new Error('Cache API not available');
                }
                dlAbortController = new AbortController();
                const resp = await fetch(url, {
                    method: 'GET',
                    signal: dlAbortController.signal
                });
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                const contentLength = resp.headers.get('Content-Length');
                if (contentLength) {
                    const total = parseInt(contentLength, 10);
                    next.bytesTotal = Number.isFinite(total) ? total : 0;
                    const reader = resp.body.getReader();
                    const chunks = [];
                    let received = 0;
                    let prevBytes = 0;
                    let prevTime = performance.now();
                    while (true) {
                        const {
                            done,
                            value
                        } = await reader.read();
                        if (done) break;
                        chunks.push(value);
                        received += value.length;
                        next.bytesDone = received;
                        const now = performance.now();
                        const dt = Math.max(16, now - prevTime) / 1000;
                        const dBytes = Math.max(0, received - prevBytes);
                        const instantRate = dBytes / dt;
                        next.rateBps = next.rateBps > 0 ? (next.rateBps * 0.72 + instantRate * 0.28) : instantRate;
                        prevBytes = received;
                        prevTime = now;
                        const left = Math.max(0, total - received);
                        next.etaSec = next.rateBps > 0 ? (left / next.rateBps) : 0;
                        next.progress = Math.round(10 + (received / total) * 85);
                        renderDpItem(next);
                    }
                    const blob = new Blob(chunks);
                    await cache.put(url, new Response(blob, {
                        headers: {
                            'Content-Type': 'audio/mpeg'
                        }
                    }));
                } else {
                    next.progress = 40;
                    renderDpItem(next);
                    await cache.put(url, resp);
                    next.progress = 80;
                    next.bytesDone = next.bytesDone || 0;
                    renderDpItem(next);
                }
                try {
                    const ir = await fetch(next.song.poster, {
                        signal: dlAbortController.signal
                    });
                    if (ir.ok) await cache.put(next.song.poster, ir);
                } catch (e) {}
                await putOfflineTrackRecord(next.song, 'download');
                downloadedFiles.add(next.song.file);
                downloadedSongMeta[next.song.file] = Date.now();
                saveDownloaded();
                next.status = 'done';
                next.progress = 100;
                next.etaSec = 0;
                next.rateBps = 0;
                saveDlQueue();
                renderDpItem(next);
                updateDpStats();
                updateDownloadStorageStats();
                updatePlayerDlBtn();
                refreshVisibleSongLists();
                if (document.getElementById('downloadsSongsList')) showDownloads();
                showToast('"' + next.song.title + '" saved offline');
                setTimeout(() => {
                    const el = document.getElementById('dpi_' + next.id);
                    if (el) {
                        el.style.opacity = '0';
                        el.style.transition = 'opacity .4s';
                        setTimeout(() => el.remove(), 400);
                    }
                    dlQueue = dlQueue.filter(i => i.id !== next.id);
                    saveDlQueue();
                    updateDpStats();
                    updateDownloadStorageStats();
                }, 3000);
            } catch (err) {
                if (dlPaused || !canUseNetwork() || err?.name === 'AbortError') {
                    next.status = 'queued';
                    next.progress = Math.max(0, Math.min(next.progress || 0, 95));
                    next.errorMessage = '';
                } else {
                    next.status = 'error';
                    next.progress = 0;
                    next.errorMessage = String(err?.message || 'Download failed');
                    showToast('Download failed');
                    console.error('DL error:', err);
                }
                renderDpItem(next);
                saveDlQueue();
                updateDpStats();
            }
            dlAbortController = null;
            dlBusy = false;
            if (!dlPaused) processQueue();
        }

        window.toggleDownloadPanel = () => dpanel().classList.toggle('open');


        const audio = document.getElementById('audio'),
            audioFade = document.getElementById('audioFade');
        const progressBar = document.getElementById('progressBar'),
            playBtn = document.getElementById('playBtn');
        const posterEl = document.getElementById('poster'),
            playerTitle = document.getElementById('playerTitle'),
            playerArtist = document.getElementById('playerArtist');
        const volumeSlider = document.getElementById('volumeSlider');
        let currentSongs = [],
            currentIndex = 0,
            currentSong = null,
            currentArtistKey = null;
        let isShuffle = false,
            isRepeat = false,
            isMuted = false,
            prevVol = 1;
        let queue = [],
            likedSongs = new Set(),
            playlists = {};
        let likedSongMeta = {};
        let shuffleHistory = [],
            continueListening = [];
        let crossfadeTimer = null,
            crossfadeInTimer = null,
            crossfadeFallbackTimers = new Set(),
            crossfadeSeconds = Math.max(0, Math.min(12, parseInt(localStorage.getItem('eq_crossfade_seconds') || '0', 10) || 0)),
            crossfadeAutoArmed = false,
            crossfadeTransitionActive = false,
            crossfadePauseSuppressUntil = 0;
        let crossfadeMainGain = null,
            crossfadeFadeGain = null,
            crossfadeFadeSource = null,
            crossfadeEngineReady = false;
        let pageFrozen = false;
        let queuePanelOpen = false,
            modalCallback = null,
            currentPlaylistId = null;
        let currentPlaylistSortType = loadSortPreference('playlist', SORT_DEFAULTS.playlist),
            currentPlaylistViewSongs = [];
        let currentFavSortType = loadSortPreference('liked', SORT_DEFAULTS.liked);
        let currentArtistSortType = loadSortPreference('artist', SORT_DEFAULTS.artist),
            currentDownloadSortType = loadSortPreference('download', SORT_DEFAULTS.download),
            currentQueueSortType = loadSortPreference('queue', SORT_DEFAULTS.queue);
        if (!SORT_SECTION_OPTIONS.liked.includes(currentFavSortType)) currentFavSortType = SORT_DEFAULTS.liked;
        if (!SORT_SECTION_OPTIONS.playlist.includes(currentPlaylistSortType)) currentPlaylistSortType = SORT_DEFAULTS.playlist;
        if (!SORT_SECTION_OPTIONS.artist.includes(currentArtistSortType)) currentArtistSortType = SORT_DEFAULTS.artist;
        if (!SORT_SECTION_OPTIONS.download.includes(currentDownloadSortType)) currentDownloadSortType = SORT_DEFAULTS.download;
        if (!SORT_SECTION_OPTIONS.queue.includes(currentQueueSortType)) currentQueueSortType = SORT_DEFAULTS.queue;
        let songPlayCounts = {};
        const APP_DATA_STORAGE_KEY = 'eq_app_data_v1';

        function loadAppData() {
            let loadedFromCombinedState = false;
            try {
                const appStateRaw = localStorage.getItem(APP_DATA_STORAGE_KEY);
                const appState = appStateRaw ? JSON.parse(appStateRaw) : null;
                if (appState && typeof appState === 'object' && !Array.isArray(appState)) {
                    const savedLiked = Array.isArray(appState.likedSongs) ? appState.likedSongs.filter((f) => typeof f === 'string') : [];
                    likedSongs = new Set(savedLiked);
                    playlists = sanitizeCloudPlaylists(appState.playlists);
                    queue = sanitizeCloudSongArray(appState.queue, 120);
                    continueListening = sanitizeCloudSongArray(appState.recentlyPlayed, 40);
                    shuffleHistory = Array.isArray(appState.shuffleHistory) ? appState.shuffleHistory.filter((f) => typeof f === 'string').slice(-80) : [];
                    const meta = appState.likedSongMeta;
                    likedSongMeta = meta && typeof meta === 'object' && !Array.isArray(meta) ? Object.fromEntries(Object.entries(meta).filter(([k, v]) => typeof k === 'string' && Number.isFinite(v) && v > 0).map(([k, v]) => [k, Math.floor(v)])) : {};
                    const counts = appState.songPlayCounts;
                    if (counts && typeof counts === 'object' && !Array.isArray(counts)) {
                        songPlayCounts = Object.fromEntries(Object.entries(counts).filter(([k, v]) => typeof k === 'string' && Number.isFinite(v) && v >= 0).map(([k, v]) => [k, Math.floor(v)]));
                    }
                    loadedFromCombinedState = true;
                }
            } catch (e) {}

            if (!loadedFromCombinedState) {
                try {
                    likedSongs = new Set(JSON.parse(localStorage.getItem('eq_liked') || '[]'));
                } catch (e) {}
                try {
                    const meta = JSON.parse(localStorage.getItem('eq_liked_meta') || '{}');
                    if (meta && typeof meta === 'object' && !Array.isArray(meta)) {
                        likedSongMeta = Object.fromEntries(Object.entries(meta).filter(([k, v]) => typeof k === 'string' && Number.isFinite(v) && v > 0).map(([k, v]) => [k, Math.floor(v)]));
                    }
                } catch (e) {}
                try {
                    playlists = sanitizeCloudPlaylists(JSON.parse(localStorage.getItem('eq_playlists') || '{}'));
                } catch (e) {}
                try {
                    queue = sanitizeCloudSongArray(JSON.parse(localStorage.getItem('eq_queue') || '[]'), 120);
                } catch (e) {}
                try {
                    shuffleHistory = JSON.parse(localStorage.getItem('eq_shuffle_history') || '[]');
                    if (!Array.isArray(shuffleHistory)) shuffleHistory = [];
                } catch (e) {}
                try {
                    continueListening = sanitizeCloudSongArray(JSON.parse(localStorage.getItem('eq_continue_listening') || '[]'), 40);
                } catch (e) {}
                try {
                    const counts = JSON.parse(localStorage.getItem('eq_song_play_counts') || '{}');
                    if (counts && typeof counts === 'object' && !Array.isArray(counts)) {
                        songPlayCounts = Object.fromEntries(Object.entries(counts).filter(([k, v]) => typeof k === 'string' && Number.isFinite(v) && v >= 0).map(([k, v]) => [k, Math.floor(v)]));
                    }
                } catch (e) {}
            }

            let likedSeedTs = Date.now();
            likedSongs.forEach((fileId) => {
                if (!Number.isFinite(likedSongMeta[fileId]) || likedSongMeta[fileId] <= 0) {
                    likedSongMeta[fileId] = likedSeedTs--;
                }
            });
            Object.keys(likedSongMeta).forEach((fileId) => {
                if (!likedSongs.has(fileId)) delete likedSongMeta[fileId];
            });
            saveAppData();
        }
        loadAppData();

        function notifyCloudStateChange(scope) {
            if (typeof window._onLocalStateChanged === 'function') {
                window._onLocalStateChanged(scope || 'local-change');
            }
        }

        function sanitizeCloudPlaylists(input) {
            if (!input || typeof input !== 'object' || Array.isArray(input)) return {};
            const out = {};
            for (const [id, pl] of Object.entries(input)) {
                if (!pl || typeof pl !== 'object') continue;
                const songs = Array.isArray(pl.songs) ? pl.songs.filter((s) => s && typeof s === 'object' && typeof s.file === 'string').map((s) => ({
                    ...s,
                    file: s.file,
                    title: typeof s.title === 'string' ? s.title : '',
                    poster: typeof s.poster === 'string' ? s.poster : '',
                    artistName: typeof s.artistName === 'string' ? s.artistName : '',
                    explicit: isExplicitSong(s),
                    addedAt: typeof s.addedAt === 'number' ? s.addedAt : 0
                })) : [];
                out[id] = {
                    ...pl,
                    name: typeof pl.name === 'string' ? pl.name : 'Playlist',
                    songs
                };
            }
            return out;
        }

        function sanitizeCloudSongArray(items, maxItems = 40) {
            if (!Array.isArray(items)) return [];
            return items.filter((s) => s && typeof s === 'object' && typeof s.file === 'string').slice(0, maxItems).map((s) => ({
                ...s,
                file: s.file,
                title: typeof s.title === 'string' ? s.title : '',
                poster: typeof s.poster === 'string' ? s.poster : '',
                artistName: typeof s.artistName === 'string' ? s.artistName : '',
                explicit: isExplicitSong(s)
            }));
        }

        function saveAppData() {
            Object.keys(likedSongMeta).forEach((fileId) => {
                if (!likedSongs.has(fileId)) delete likedSongMeta[fileId];
            });
            const safePlaylists = sanitizeCloudPlaylists(playlists);
            const safeQueue = sanitizeCloudSongArray(queue, 120);
            const safeRecent = sanitizeCloudSongArray(continueListening, 40);
            const safeShuffleHistory = Array.isArray(shuffleHistory) ? shuffleHistory.filter((f) => typeof f === 'string').slice(-80) : [];
            const safePlayCounts = songPlayCounts && typeof songPlayCounts === 'object' && !Array.isArray(songPlayCounts) ? Object.fromEntries(Object.entries(songPlayCounts).filter(([k, v]) => typeof k === 'string' && Number.isFinite(v) && v >= 0).map(([k, v]) => [k, Math.floor(v)])) : {};
            const payload = {
                likedSongs: [...likedSongs],
                likedSongMeta,
                playlists: safePlaylists,
                queue: safeQueue,
                recentlyPlayed: safeRecent,
                shuffleHistory: safeShuffleHistory,
                songPlayCounts: safePlayCounts
            };
            localStorage.setItem(APP_DATA_STORAGE_KEY, JSON.stringify(payload));
            localStorage.setItem('eq_liked', JSON.stringify(payload.likedSongs));
            localStorage.setItem('eq_liked_meta', JSON.stringify(likedSongMeta));
            localStorage.setItem('eq_playlists', JSON.stringify(safePlaylists));
            localStorage.setItem('eq_continue_listening', JSON.stringify(safeRecent));
            localStorage.setItem('eq_queue', JSON.stringify(safeQueue));
            localStorage.setItem('eq_shuffle_history', JSON.stringify(safeShuffleHistory));
            localStorage.setItem('eq_song_play_counts', JSON.stringify(safePlayCounts));
        }

        function saveLiked() {
            saveAppData();
            notifyCloudStateChange('likedSongs');
        }

        function savePlaylists() {
            saveAppData();
            notifyCloudStateChange('playlists');
        }

        function saveContinueListening() {
            saveAppData();
            notifyCloudStateChange('recentlyPlayed');
        }

        function saveQueue() {
            saveAppData();
            notifyCloudStateChange('queue');
            try {
                updateQueueIndicators();
            } catch (e) {}
        }
        window.saveAppData = saveAppData;
        window.loadAppData = loadAppData;

        function setSortForScope(scope, sortType) {
            const normalizedType = normalizeSortType(sortType, SORT_DEFAULTS[scope] || 'az');
            if (!SORT_SECTION_OPTIONS[scope]?.includes(normalizedType)) return;
            saveSortPreference(scope, normalizedType);
            if (normalizedType === 'aiSmartOrder') showToast('AI Smart Order is ready as a smart local placeholder');

            if (scope === 'liked') {
                currentFavSortType = normalizedType;
                if (document.getElementById('favSongsList')) {
                    renderMobileLikedSongList(false);
                    syncFavoritesPlaybackSource();
                }
            } else if (scope === 'playlist') {
                currentPlaylistSortType = normalizedType;
                const activeFile = currentSong ? currentSong.file : null;
                if (currentPlaylistId && document.getElementById('playlistSongsList')) {
                    renderPlaylistSongs(currentPlaylistId, false);
                    if (activeFile && playlistContainsSong(currentPlaylistId, activeFile)) {
                        const nextSource = currentPlaylistViewSongs.map((song) => ({ ...song }));
                        const nextIndex = nextSource.findIndex((song) => song.file === activeFile);
                        currentSongs = nextSource;
                        currentArtistKey = null;
                        if (nextIndex >= 0) {
                            currentIndex = nextIndex;
                            currentSong = nextSource[nextIndex];
                        }
                    }
                }
            } else if (scope === 'artist') {
                currentArtistSortType = normalizedType;
                if (currentArtistKey && document.getElementById('songsList')) {
                    renderArtistSongs(currentArtistKey, false);
                }
            } else if (scope === 'download') {
                currentDownloadSortType = normalizedType;
                if (document.getElementById('downloadsSongsList')) renderDownloadsList(false);
            } else if (scope === 'queue') {
                currentQueueSortType = normalizedType;
                if (queue.length) {
                    queue = applySorting('queue', queue, currentQueueSortType);
                    saveQueue();
                    scheduleSmartPreload('queue-change');
                }
                renderQueuePanel();
            }
            updateSortUI(scope, normalizedType);
            closeSortSheet(scope);
        }

        window.setSortForScope = setSortForScope;

        window.__getCloudStatePayload = () => ({
            likedSongs: [...likedSongs],
            playlists: sanitizeCloudPlaylists(playlists),
            recentlyPlayed: sanitizeCloudSongArray(continueListening, 40),
            downloads: [...downloadedFiles],
            queue: sanitizeCloudSongArray(queue, 120)
        });

        window.__applyCloudState = (incoming = {}) => {
            const safeLiked = Array.isArray(incoming.likedSongs) ? incoming.likedSongs.filter((f) => typeof f === 'string') : [];
            const safeDownloads = Array.isArray(incoming.downloads) ? incoming.downloads.filter((f) => typeof f === 'string') : [];
            const safePlaylists = sanitizeCloudPlaylists(incoming.playlists);
            const safeRecent = sanitizeCloudSongArray(incoming.recentlyPlayed, 40);
            const safeQueue = sanitizeCloudSongArray(incoming.queue, 120);

            likedSongs = new Set(safeLiked);
            playlists = safePlaylists;
            continueListening = safeRecent;
            downloadedFiles = new Set(safeDownloads);
            queue = safeQueue;
            let incomingLikedSeedTs = Date.now();
            likedSongs.forEach((fileId) => {
                if (!Number.isFinite(likedSongMeta[fileId]) || likedSongMeta[fileId] <= 0) {
                    likedSongMeta[fileId] = incomingLikedSeedTs--;
                }
            });
            Object.keys(likedSongMeta).forEach((fileId) => {
                if (!likedSongs.has(fileId)) delete likedSongMeta[fileId];
            });

            saveAppData();
            localStorage.setItem('falcon_downloaded', JSON.stringify([...downloadedFiles]));

            try {
                refreshVisibleSongLists();
            } catch (e) {}
            try {
                renderQueuePanel();
            } catch (e) {}
            try {
                updateQueueIndicators();
            } catch (e) {}
            try {
                updateDpStats();
            } catch (e) {}

            if (currentSong) {
                try {
                    updatePlayerLikeBtn(currentSong.file);
                } catch (e) {}
                try {
                    updatePlayerDlBtn();
                } catch (e) {}
                try {
                    updateFullPlayerUI();
                } catch (e) {}
            }

            const favTab = document.getElementById('navFav');
            const playlistsTab = document.getElementById('navPlaylists');
            const downloadsTab = document.getElementById('navDownloads');

            if (favTab && favTab.classList.contains('active')) {
                try {
                    refreshLikedDisplay();
                } catch (e) {}
            }
            if (playlistsTab && playlistsTab.classList.contains('active')) {
                try {
                    if (currentPlaylistId && playlists[currentPlaylistId]) openPlaylist(currentPlaylistId);
                    else showPlaylists();
                } catch (e) {}
            }
            if (downloadsTab && downloadsTab.classList.contains('active')) {
                try {
                    showDownloads();
                } catch (e) {}
            }
        };

        function savePlaybackMemory() {
            if (!currentSong) return;
            localStorage.setItem('eq_last_song', JSON.stringify({
                file: currentSong.file,
                title: currentSong.title,
                poster: currentSong.poster,
                artist: currentSong.artist || currentSong.artistName || playerArtist.textContent || '',
                album: currentSong.album || deriveSongAlbum(currentSong, playerArtist.textContent || ''),
                duration: currentSong.duration || songDurationMeta[currentSong.file] || 0,
                explicit: isExplicitSong(currentSong),
                playCount: songPlayCounts[currentSong.file] || 0,
                liked: likedSongs.has(currentSong.file),
                downloaded: isDownloaded(currentSong.file),
                addedAt: currentSong.addedAt || 0,
                lastPlayed: Date.now(),
                artistKey: currentArtistKey,
                artistName: playerArtist.textContent,
                currentTime: audio.currentTime,
                volume: audio.volume,
                isShuffle,
                isRepeat
            }));
        }


        function loadPlaybackMemory() {
            try {
                const vol = parseFloat(localStorage.getItem('eq_volume') || '1');
                audio.volume = isNaN(vol) ? 1 : vol;
                volumeSlider.value = audio.volume;
                isShuffle = localStorage.getItem('eq_shuffle') === 'true';
                isRepeat = localStorage.getItem('eq_repeat') === 'true';
                syncPlaybackModeUI();
                const last = JSON.parse(localStorage.getItem('eq_last_song') || 'null');
                if (!last) return;
                currentSong = {
                    file: last.file,
                    title: last.title,
                    poster: last.poster,
                    artist: last.artist || last.artistName || '',
                    artistName: last.artistName || last.artist || '',
                    album: last.album || '',
                    duration: last.duration || 0,
                    explicit: isExplicitSong(last),
                    playCount: last.playCount || 0,
                    liked: !!last.liked,
                    downloaded: !!last.downloaded,
                    addedAt: last.addedAt || 0,
                    lastPlayed: last.lastPlayed || 0
                };
                currentArtistKey = last.artistKey;
                if (last.artistKey && artists[last.artistKey]) {
                    currentSongs = artists[last.artistKey].songs;
                    currentIndex = currentSongs.findIndex(s => s.file === last.file);
                    if (currentIndex < 0) currentIndex = 0;
                }
                posterEl.src = last.poster;
                playerTitle.textContent = last.title;
                playerArtist.textContent = last.artistName || '';
                document.getElementById('fsPoster').src = last.poster;
                document.getElementById('fsTitle').textContent = last.title;
                document.getElementById('fsArtist').textContent = last.artistName || '';
                updatePlayerLikeBtn(last.file);
                updatePlayerDlBtn();
                syncExplicitBadges(currentSong);
                updateAmbientFromSong({
                    file: last.file,
                    title: last.title,
                    poster: last.poster,
                    explicit: isExplicitSong(last),
                    artistName: last.artistName || ''
                });
                syncLyricsPanelShell();
                if (lyricsPanelOpen) loadLyricsPanel(currentSong);
                getAudioSrc('songs/' + last.file).then(src => {
                    setPrimaryAudioSource(src);
                    audio.addEventListener('loadedmetadata', () => {
                        if (last.currentTime > 0) audio.currentTime = Math.min(last.currentTime, audio.duration - 1);
                    }, {
                        once: true
                    });
                });
            } catch (e) {}
        }

        async function getAudioSrc(filePath) {
            const resolved = await getAudioResolution(filePath);
            currentPlaybackSource = resolved.source;
            return resolved.src;
        }

        let activeAudioObjectUrl = '';
        function releaseAudioObjectUrl(url, delay = 0) {
            if (!url || !url.startsWith('blob:')) return;
            window.setTimeout(() => URL.revokeObjectURL(url), delay);
        }

        function setPrimaryAudioSource(src, revokePrevious = true) {
            const previousUrl = activeAudioObjectUrl;
            activeAudioObjectUrl = src && src.startsWith('blob:') ? src : '';
            audio.src = src;
            if (revokePrevious && previousUrl && previousUrl !== activeAudioObjectUrl) releaseAudioObjectUrl(previousUrl);
            return previousUrl;
        }

        async function removeCachedSong(fileId) {
            try {
                const keys = cacheRequestCandidates(fileId);
                for (const name of [CACHE_NAME, ...LEGACY_CACHE_NAMES]) {
                    try {
                        const cache = await caches.open(name);
                        await Promise.all(keys.map((key) => cache.delete(key)));
                    } catch (e) {}
                }
            } catch (e) {}
            downloadedFiles.delete(fileId);
            delete downloadedSongMeta[fileId];
            smartPreloadedFiles.delete(normalizeOfflineFileId(fileId));
            await deleteOfflineTrackRecord(fileId);
            saveDownloaded();
            refreshVisibleSongLists();
            if (document.getElementById('downloadsSongsList')) showDownloads();
            updatePlayerDlBtn();
            showToast('Removed from offline');
        }

        function updatePlayerDlBtn() {
            const btn = document.getElementById('playerDlBtn'),
                badge = document.getElementById('offlineBadge');
            if (!currentSong) return;
            const dl = isDownloaded(currentSong.file);
            btn.classList.toggle('downloaded', dl);
            setElementIcon(btn, dl ? 'check' : 'download');
            btn.title = dl ? 'Downloaded — click to remove' : 'Download for offline';
            badge.classList.toggle('visible', currentPlaybackSource === 'local');
        }

        window.downloadCurrentSong = async() => {
            if (!currentSong) {
                showToast('Play a song first');
                return;
            }
            if (isDownloaded(currentSong.file)) {
                if (confirm(`Remove "${currentSong.title}" from offline?`)) await removeCachedSong(currentSong.file);
                return;
            }
            addToDlQueue(currentSong);
        };

        async function getDownloadedCount() {
            try {
                const cache = await caches.open(CACHE_NAME);
                const keys = await cache.keys();
                return keys.filter(k => k.url.includes('.mp3')).length;
            } catch (e) {
                return 0;
            }
        }

        function getDownloadedSongsBase() {
            const dlSongs = [];
            for (let key in artists) artists[key].songs.forEach(s => {
                if (isDownloaded(s.file)) dlSongs.push({
                    ...s,
                    artistName: getArtistDisplayNameByKey(key, artists[key].name),
                    artist: getArtistDisplayNameByKey(key, artists[key].name),
                    artistKey: key,
                    addedAt: downloadedSongMeta[s.file] || 0,
                    downloaded: true,
                    liked: likedSongs.has(s.file),
                    playCount: songPlayCounts[s.file] || 0
                });
            });
            return dlSongs;
        }

        function downloadSongRowHTML(song, i) {
            const liked = likedSongs.has(song.file);
            return `<div class="song-row" data-file="${escH(song.file)}" onclick="playDlSong(${i})"><div class="song-num">${i + 1}</div><div class="song-row-info"><img src="${escH(song.poster)}" onerror="this.style.background='#282828'" loading="lazy"><div class="song-row-text"><h4>${songTitleHTML(song)}</h4><p>${escH(song.artistName)}</p></div></div><div class="song-actions"><button class="like-btn${liked ? ' liked' : ''}" onclick="event.stopPropagation();toggleLike('${escA(song.file)}')" title="${liked ? 'Unlike' : 'Like'}">${liked ? uiIcon('heart') : uiIcon('heart-off')}</button><button class="song-more-btn" onclick="event.stopPropagation();showSongRowActionsMenu(event,'${escA(song.file)}')" title="More options">${uiIcon('more-horizontal')}</button></div></div>`;
        }

        function renderDownloadsList(autoScrollActive = false) {
            const list = document.getElementById('downloadsSongsList');
            if (!list) return;
            window.__dlSongs = applySorting('download', getDownloadedSongsBase(), currentDownloadSortType);
            renderSortedList(list, window.__dlSongs.map((song, i) => downloadSongRowHTML(song, i)).join(''), '.song-row', () => {
                renderLucideIcons(list);
                updateSortUI('download', currentDownloadSortType);
            });
        }

        async function showDownloads() {
            setNavActive('navDownloads');
            setMobileBack(true);
            closeSortSheet('download');
            const count = await getDownloadedCount();
            const dlSongs = getDownloadedSongsBase();
            const mainArea = document.getElementById('mainArea');
            mainArea.innerHTML = `
            <div class="main-topbar"><div class="nav-arrows"><button class="nav-arrow-btn" onclick="history.back()">${uiIcon('chevron-left')}</button></div><div style="flex:1"><div style="font-size:1.2rem;font-weight:800">Downloads</div><div style="font-size:.72rem;color:var(--text2)">${count} cached offline</div></div><div class="topbar-actions"><button class="topbar-menu-btn" onclick="openMobileDrawer()" title="Menu">${uiIcon('menu')}</button></div>${dlSongs.length>0?`<button class="btn btn-outline" onclick="clearAllDownloads()" style="font-size:.75rem;display:inline-flex;align-items:center;gap:6px">${uiIcon('trash-2')}<span>Clear All</span></button>`:''}</div>
            <div class="songs-section" style="padding-top:20px">
            ${dlSongs.length===0?`<div class="empty-state"><div class="emoji">${uiIcon('download')}</div><p>No songs downloaded yet.</p><p style="font-size:.8rem;margin-top:6px;color:var(--muted)">Tap download on any song to save offline.</p></div>`:`${sortControlHTML('download', currentDownloadSortType, SORT_SECTION_OPTIONS.download, 'Sort Downloads')}<div class="songs-table-header"><span class="th">#</span><span class="th">Title</span><span class="th"></span></div><div id="downloadsSongsList" class="sort-song-list"></div>`}
            </div>`;
            renderLucideIcons(mainArea);
            if (dlSongs.length) renderDownloadsList(true);
        }

        window.playDlSong = (i) => { if (!window.__dlSongs) return; currentSongs = window.__dlSongs; currentArtistKey = null; currentIndex = i; playSong(i,true); };
        window.clearAllDownloads = async () => { if (!confirm('Remove all downloads?')) return; try { await Promise.all([CACHE_NAME, ...LEGACY_CACHE_NAMES].map((name) => caches.delete(name))); await clearOfflineTrackRecords(); smartPreloadedFiles.clear(); downloadedFiles.clear(); downloadedSongMeta = {}; saveDownloaded(); refreshVisibleSongLists(); updatePlayerDlBtn(); showToast('All downloads cleared'); showDownloads(); } catch(e) { showToast('Error clearing cache'); } };

        // -- PLAYLISTS --
        function saveSongPlayCounts() {
            try {
                localStorage.setItem('eq_song_play_counts', JSON.stringify(songPlayCounts));
            } catch (e) {}
        }

        function trackSongPlay(fileId) {
            if (!fileId) return;
            songPlayCounts[fileId] = (songPlayCounts[fileId] || 0) + 1;
            saveSongPlayCounts();
        }

        function getPlaylistSortLabel(type) {
            return getSortLabel(type);
        }

        function getSortedPlaylistSongs(plId, type = currentPlaylistSortType) {
            const pl = playlists[plId];
            if (!pl || !Array.isArray(pl.songs)) return [];
            const base = pl.songs.map((song, index) => ({
                ...song,
                artist: song.artist || song.artistName || '',
                liked: likedSongs.has(song.file),
                downloaded: isDownloaded(song.file),
                playCount: songPlayCounts[song.file] || 0,
                __baseIndex: index
            }));
            return applySorting('playlist', base, type);
        }

        function playlistContainsSong(plId, fileId) {
            const pl = playlists[plId];
            return !!(pl && Array.isArray(pl.songs) && pl.songs.some((s) => s.file === fileId));
        }

        function getPlaylistPlaybackSource(plId) {
            if (currentPlaylistId === plId && currentPlaylistViewSongs.length) {
                return currentPlaylistViewSongs;
            }
            const pl = playlists[plId];
            if (!pl || !Array.isArray(pl.songs)) return [];
            return pl.songs;
        }

        function closePlaylistSortSheet() {
            closeSortSheet('playlist');
        }

        window.closePlaylistSortSheet = closePlaylistSortSheet;
        window.closePlaylistSortSheetOnOverlay = (e) => {
            if (e.target && e.target.dataset?.sortSheet === 'playlist') closePlaylistSortSheet();
        };
        function updatePlaylistSortUI() {
            updateSortUI('playlist', currentPlaylistSortType);
        }

        function playlistIndexContent(i, playing) {
            if (playing) return '<div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>';
            if (currentPlaylistSortType === 'custom') return `<span class="ps-drag-handle" title="Drag to reorder">${uiIcon('grip-vertical')}</span>`;
            return String(i + 1);
        }

        function updatePlaylistPlayingState(autoScrollActive = false) {
            if (!currentPlaylistId) return;
            const list = document.getElementById('playlistSongsList');
            if (!list) return;
            const rows = list.querySelectorAll('.playlist-song-row');
            rows.forEach((row, i) => {
                const song = currentPlaylistViewSongs[i];
                const isPlaying = !!(song && currentSong && currentSong.file === song.file && !audio.paused);
                row.classList.toggle('playing', isPlaying);
                const num = row.querySelector('.ps-num');
                if (num) {
                    if (isPlaying) {
                        num.innerHTML = playlistIndexContent(i, true);
                    } else {
                        num.innerHTML = playlistIndexContent(i, false);
                        renderLucideIcons(num);
                    }
                }
            });
        }

        function movePlaylistSong(plId, fromFile, toFile) {
            const pl = playlists[plId];
            if (!pl || !Array.isArray(pl.songs) || !fromFile || !toFile || fromFile === toFile) return;
            const fromIndex = pl.songs.findIndex((song) => song.file === fromFile);
            const toIndex = pl.songs.findIndex((song) => song.file === toFile);
            if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;
            const [picked] = pl.songs.splice(fromIndex, 1);
            pl.songs.splice(toIndex, 0, picked);
            currentPlaylistSortType = 'custom';
            saveSortPreference('playlist', currentPlaylistSortType);
            savePlaylists();
            renderPlaylistSongs(plId, true);
        }

        function setupPlaylistDragAndDrop() {
            const list = document.getElementById('playlistSongsList');
            if (!list || list.dataset.dragBound === '1') return;
            list.dataset.dragBound = '1';
            let dragFile = '';

            list.addEventListener('dragstart', (e) => {
                const row = e.target instanceof Element ? e.target.closest('.playlist-song-row[data-file]') : null;
                if (!row || currentPlaylistSortType !== 'custom') {
                    e.preventDefault();
                    return;
                }
                dragFile = row.getAttribute('data-file') || '';
                row.classList.add('dragging');
                if (e.dataTransfer) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', dragFile);
                }
            });

            list.addEventListener('dragend', () => {
                dragFile = '';
                list.querySelectorAll('.playlist-song-row.dragging').forEach((row) => row.classList.remove('dragging'));
            });

            list.addEventListener('dragover', (e) => {
                const row = e.target instanceof Element ? e.target.closest('.playlist-song-row[data-file]') : null;
                if (!row || currentPlaylistSortType !== 'custom') return;
                e.preventDefault();
            });

            list.addEventListener('drop', (e) => {
                const row = e.target instanceof Element ? e.target.closest('.playlist-song-row[data-file]') : null;
                if (!row || currentPlaylistSortType !== 'custom') return;
                e.preventDefault();
                const toFile = row.getAttribute('data-file') || '';
                movePlaylistSong(currentPlaylistId, dragFile, toFile);
            });
        }

        function renderPlaylistSongs(plId, autoScrollActive = false) {
            const list = document.getElementById('playlistSongsList');
            if (!list) return;
            currentPlaylistViewSongs = getSortedPlaylistSongs(plId, currentPlaylistSortType);
            renderSortedList(list, currentPlaylistViewSongs.map((song, i) => playlistSongRowHTML(plId, song, i)).join(''), '.playlist-song-row', () => {
                renderLucideIcons(list);
                updatePlaylistSortUI();
                setupPlaylistDragAndDrop();
                updatePlaylistPlayingState(autoScrollActive);
            });
        }

        window.togglePlaylistSortSheet = () => {
            toggleSortSheet('playlist');
        };

        window.setPlaylistSort = (type) => {
            setSortForScope('playlist', type);
        };

        function showPlaylists() {
            setNavActive('navPlaylists'); setMobileBack(true);
            closePlaylistSortSheet();
            currentPlaylistId = null;
            currentPlaylistViewSongs = [];
            const ids = Object.keys(playlists);
            const mainArea = document.getElementById('mainArea');
            mainArea.innerHTML = `
            <div class="main-topbar"><div class="nav-arrows"><button class="nav-arrow-btn" onclick="loadArtists()">${uiIcon('chevron-left')}</button></div><div style="flex:1"><div style="font-size:1.2rem;font-weight:800">Playlists</div><div style="font-size:.72rem;color:var(--text2)">${ids.length} playlist${ids.length!==1?'s':''}</div></div><div class="topbar-actions"><button class="topbar-menu-btn" onclick="openMobileDrawer()" title="Menu">${uiIcon('menu')}</button></div><button class="btn btn-accent" onclick="openCreatePlaylistModal()">${uiIcon('plus')}<span>New</span></button></div>
            <div class="playlists-wrap" style="padding-top:20px">
                <button class="create-playlist-btn" onclick="openCreatePlaylistModal()"><div class="create-playlist-icon">${uiIcon('plus')}</div><span>Create new playlist</span></button>
                ${ids.length===0?`<div class="empty-state" style="padding:40px 0"><div class="emoji">${uiIcon('list-music')}</div><p>No playlists yet.</p></div>`:`<div class="playlist-grid">${ids.map(id=>playlistCardHTML(id)).join('')}</div>`}
            </div>`;
            renderLucideIcons(mainArea);
        }

        function playlistCardHTML(id) { const pl=playlists[id]; const songs=pl.songs||[]; const covers=songs.slice(0,4).map(s=>s.poster); while(covers.length<4)covers.push(null); return`<div class="playlist-card" onclick="openPlaylist('${escA(id)}')"><div class="playlist-card-cover">${covers.map(c=>c?`<img src="${escH(c)}" onerror="this.parentElement.style.background='var(--surface3)'">`:`<div class="cover-ph">${uiIcon('music-2')}</div>`).join('')}</div><div class="playlist-card-name">${escH(pl.name)}</div><div class="playlist-card-count">${songs.length} song${songs.length!==1?'s':''}</div><button class="playlist-card-play" onclick="event.stopPropagation();playPlaylistById('${escA(id)}')">${uiIcon('play')}</button><button class="playlist-card-del" onclick="event.stopPropagation();deletePlaylist('${escA(id)}')" title="Delete">${uiIcon('trash-2')}</button></div>`; }

        function openPlaylist(id) {
            const pl = playlists[id];
            if (!pl) return;
            currentPlaylistId = id;
            setMobileBack(true);
            closePlaylistSortSheet();
            const songs = pl.songs || [];
            const covers = songs.slice(0, 4).map((s) => s.poster);
            while (covers.length < 4) covers.push(null);
            const hasSongs = songs.length > 0;
            const mainArea = document.getElementById('mainArea');
            mainArea.innerHTML = `
            <div class="playlist-page-header">
                <div class="playlist-cover-collage">${covers.map(c=>c?`<img src="${escH(c)}" onerror="this.src=''">`:`<div class="cover-ph">${uiIcon('music-2')}</div>`).join('')}</div>
                <div class="playlist-page-info">
                    <div class="playlist-type-label">Playlist</div>
                    <div class="playlist-page-title">${escH(pl.name)}</div>
                    <div class="playlist-page-stats">${songs.length} songs</div>
                    <div class="playlist-page-actions">
                        <button class="playlist-play-btn" title="Play playlist" onclick="playPlaylistById('${escA(id)}')">${uiIcon('play')}</button>
                        <button class="playlist-shuffle-btn" title="Shuffle playlist" onclick="shufflePlaylistById('${escA(id)}')">${uiIcon('shuffle')}<span>Shuffle</span></button>
                        <button class="btn btn-outline" onclick="openRenamePlaylistModal('${escA(id)}')">${uiIcon('pencil')}<span>Rename</span></button>
                        <button class="btn btn-outline" style="color:rgba(255,85,85,.7);border-color:rgba(255,85,85,.2)" onclick="deletePlaylist('${escA(id)}')">${uiIcon('trash-2')}</button>
                    </div>
                </div>
            </div>
            ${hasSongs ? sortControlHTML('playlist', currentPlaylistSortType, SORT_SECTION_OPTIONS.playlist, 'Sort Playlist') : ''}
            <div class="playlist-song-list">${hasSongs?`<div class="playlist-song-header"><span>#</span><span>Title</span><span></span></div><div id="playlistSongsList" class="sort-song-list"></div>`:`<div class="empty-state" style="padding:44px 0"><div class="emoji">${uiIcon('music-2')}</div><p>No songs yet.</p></div>`}</div>
            `;
            renderLucideIcons(mainArea);
            if (hasSongs) {
                renderPlaylistSongs(id, true);
            } else {
                currentPlaylistViewSongs = [];
            }
        }

        function playlistSongRowHTML(plId,song,i) {
            const playing = currentSong && currentSong.file === song.file && !audio.paused;
            const liked = likedSongs.has(song.file);
            const canDrag = currentPlaylistSortType === 'custom';
            return `<div class="playlist-song-row${playing?' playing':''}" data-file="${escH(song.file)}" draggable="${canDrag ? 'true' : 'false'}" onclick="playFromPlaylist('${escA(plId)}',${i})"><div class="ps-num">${playlistIndexContent(i, playing)}</div><div class="ps-info"><img src="${escH(song.poster)}" onerror="this.style.background='#282828'"><div class="ps-text"><h4>${songTitleHTML(song)}</h4><p>${escH(song.artistName||song.artist||'')}</p></div></div><div class="ps-actions"><button class="ps-icon-btn${liked?' liked':''}" title="${liked?'Unlike':'Like'}" onclick="event.stopPropagation();togglePlaylistLike('${escA(plId)}','${escA(song.file)}')">${liked?uiIcon('heart'):uiIcon('heart-off')}</button><button class="ps-icon-btn" title="More options" onclick="event.stopPropagation();showSongRowActionsMenu(event,'${escA(song.file)}')">${uiIcon('more-horizontal')}</button></div></div>`;
        }

        window.playFromPlaylist = (plId,i) => { const source=getPlaylistPlaybackSource(plId); if(!source[i])return; currentSongs=source.map(s=>({...s})); currentArtistKey=null; currentIndex=i; playSong(i,true); };
        window.playPlaylistById = (id) => { const pl=playlists[id]; const source=getPlaylistPlaybackSource(id); if(!pl||!source.length)return; currentSongs=source.map(s=>({...s})); currentArtistKey=null; currentIndex=0; playSong(0,true); showToast(`Playing ${pl.name}`); };
        window.shufflePlaylistById = (id) => { const pl=playlists[id]; const source=getPlaylistPlaybackSource(id); if(!pl||!source.length)return; currentSongs=source.map(s=>({...s})); currentArtistKey=null; currentIndex=Math.floor(Math.random()*currentSongs.length); playSong(currentIndex,true); showToast(`Shuffling ${pl.name}`); };
        window.deletePlaylist = (id) => { if(!confirm(`Delete playlist "${playlists[id]?.name}"?`))return; delete playlists[id]; savePlaylists(); showToast('Playlist deleted'); if(currentPlaylistId===id)currentPlaylistId=null; showPlaylists(); };
        window.removeSongFromPlaylist = (plId,fileId) => { if(!playlists[plId]||!Array.isArray(playlists[plId].songs))return; const idx=playlists[plId].songs.findIndex(s=>s.file===fileId); if(idx<0)return; playlists[plId].songs.splice(idx,1); savePlaylists(); openPlaylist(plId); showToast('Song removed'); };
        window.togglePlaylistLike = (plId, fileId) => {
            toggleLike(fileId);
            if (currentPlaylistId === plId && document.getElementById('playlistSongsList')) {
                renderPlaylistSongs(plId, false);
            }
        };

        function openCreatePlaylistModal() { openModal('Create Playlist','Playlist name…','Create',()=>{ const name=document.getElementById('modalInput').value.trim(); if(!name)return; const id='pl_'+Date.now()+'_'+Math.random().toString(36).slice(2,7); playlists[id]={name,createdAt:Date.now(),songs:[]}; savePlaylists(); showToast(`"${name}" created`); showPlaylists(); }); }
        window.openRenamePlaylistModal = (id) => { const pl=playlists[id]; if(!pl)return; document.getElementById('modalInput').value=pl.name; openModal('Rename Playlist',pl.name,'Save',()=>{ const name=document.getElementById('modalInput').value.trim(); if(!name)return; playlists[id].name=name; savePlaylists(); showToast('Renamed'); openPlaylist(id); }); };
        window.openCreatePlaylistModal = openCreatePlaylistModal;

        function openModal(title,placeholder,confirmText,cb) { document.getElementById('modalTitle').textContent=title; const inp=document.getElementById('modalInput'); inp.placeholder=placeholder; if(title==='Create Playlist')inp.value=''; document.getElementById('modalConfirm').textContent=confirmText; modalCallback=cb; document.getElementById('modalOverlay').style.display='flex'; setTimeout(()=>inp.focus(),50); }
        window.closeModal = () => { document.getElementById('modalOverlay').style.display='none'; modalCallback=null; };
        window.closeModalOnOverlay = (e) => { if(e.target===document.getElementById('modalOverlay'))closeModal(); };
        window.confirmModal = () => { if(modalCallback)modalCallback(); closeModal(); };
        document.getElementById('modalInput').addEventListener('keydown',e=>{ if(e.key==='Enter')confirmModal(); if(e.key==='Escape')closeModal(); });

        function addSongToPlaylistById(song,artistName,plId) { if(!playlists[plId])return; if(playlists[plId].songs.some(s=>s.file===song.file)){showToast('Already in playlist');return;} const payload=normalizeSongForSorting({...song,artistName,artist:artistName,addedAt:Date.now()},0,{scope:'playlist',artistName}); delete payload.__baseIndex; delete payload.likedAt; delete payload.downloadedAt; playlists[plId].songs.push(payload); savePlaylists(); showToast(`Added to "${playlists[plId].name}"`); }
        window.addSongToPlaylistById = addSongToPlaylistById;

        let openDropdownEl = null;
        function closeDropdown() {
            document.querySelectorAll('.profile-avatar-btn[aria-expanded="true"]').forEach((btn) => btn.setAttribute('aria-expanded', 'false'));
            if(openDropdownEl){openDropdownEl.remove();openDropdownEl=null;}
        }
        document.addEventListener('click',e=>{ if(openDropdownEl&&!openDropdownEl.contains(e.target))closeDropdown(); });
        window.closeDropdown = closeDropdown;

        function resolveSongForRow(fileId) {
            const target = normalizeSongFile(fileId);
            if (!target) return null;
            const found = findSongInLibraryByFile(target);
            if (found?.song) {
                return {
                    ...found.song,
                    artistName: found.artistName || found.song.artistName || ''
                };
            }
            return null;
        }

        function showSongRowActionsMenu(e, fileId, rowIndex = null) {
            e.stopPropagation();
            closeDropdown();
            const song = resolveSongForRow(fileId) || (rowIndex !== null && rowIndex !== undefined ? currentSongs[rowIndex] : null);
            if (!song) return;
            const target = e.currentTarget || e.target;
            const rect = target && typeof target.getBoundingClientRect === 'function' ? target.getBoundingClientRect() : { bottom: window.innerHeight / 2, right: window.innerWidth / 2, left: window.innerWidth / 2 };
            const menu = document.createElement('div');
            menu.className = 'song-row-action-menu';
            const liked = likedSongs.has(song.file);
            const downloaded = isDownloaded(song.file);
            const top = Math.min(window.innerHeight - 320, Math.max(12, rect.bottom + 8));
            const left = Math.min(window.innerWidth - 240, Math.max(12, rect.right - 205));
            menu.style.top = `${top}px`;
            menu.style.left = `${left}px`;
            menu.innerHTML = `
                <div class="song-row-menu-header">${escH(song.title || 'Song')}</div>
                <button class="song-row-menu-item" data-action="queue">${uiIcon('list-plus')}<span>Add to Queue</span></button>
                <button class="song-row-menu-item" data-action="playlist">${uiIcon('folder-plus')}<span>Add to Another Playlist</span></button>
                <button class="song-row-menu-item" data-action="download">${uiIcon(downloaded ? 'check' : 'download')}<span>${downloaded ? 'Remove Download' : 'Download'}</span></button>
                <button class="song-row-menu-item" data-action="share">${uiIcon('share-2')}<span>Share</span></button>
                <button class="song-row-menu-item" data-action="details">${uiIcon('info')}<span>Song Details</span></button>
                <button class="song-row-menu-item" data-action="like">${uiIcon(liked ? 'heart' : 'heart-off')}<span>${liked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}</span></button>
            `;
            document.body.appendChild(menu);
            renderLucideIcons(menu);
            menu.querySelector('[data-action="queue"]').addEventListener('click', async (event) => {
                event.stopPropagation();
                closeDropdown();
                addSongToQueueByFile(song.file, false);
            });
            menu.querySelector('[data-action="playlist"]').addEventListener('click', (event) => {
                event.stopPropagation();
                closeDropdown();
                showAddToPlaylistMenu({
                    stopPropagation() {},
                    preventDefault() {},
                    target: menu.querySelector('[data-action="playlist"]'),
                    currentTarget: menu.querySelector('[data-action="playlist"]')
                }, song.file, rowIndex);
            });
            menu.querySelector('[data-action="download"]').addEventListener('click', async (event) => {
                event.stopPropagation();
                closeDropdown();
                const tempBtn = document.createElement('button');
                await handleDlBtn(tempBtn, song.file);
                refreshVisibleSongLists();
            });
            menu.querySelector('[data-action="share"]').addEventListener('click', async (event) => {
                event.stopPropagation();
                closeDropdown();
                try {
                    const shareText = `${song.title || 'Song'}${song.artistName ? ` — ${song.artistName}` : ''}`;
                    if (navigator.share) {
                        await navigator.share({
                            title: song.title || 'Song',
                            text: shareText,
                            url: window.location.href
                        });
                    } else if (navigator.clipboard?.writeText) {
                        await navigator.clipboard.writeText(shareText);
                        showToast('Shared details copied');
                    } else {
                        showToast('Sharing not available');
                    }
                } catch (e) {
                    showToast('Share cancelled');
                }
            });
            menu.querySelector('[data-action="details"]').addEventListener('click', (event) => {
                event.stopPropagation();
                closeDropdown();
                const details = document.createElement('div');
                details.className = 'song-row-action-menu';
                const detailTop = Math.min(window.innerHeight - 280, Math.max(20, window.innerHeight / 2 - 120));
                const detailLeft = Math.min(window.innerWidth - 260, Math.max(20, window.innerWidth / 2 - 130));
                details.style.top = `${detailTop}px`;
                details.style.left = `${detailLeft}px`;
                details.style.minWidth = '260px';
                details.innerHTML = `
                    <div class="song-row-menu-header">Song Details</div>
                    <div style="padding:6px 8px 2px; display:flex; flex-direction:column; gap:8px; color:var(--text)">
                        <div><div style="font-size:.72rem;color:var(--text2);text-transform:uppercase;letter-spacing:1px">Title</div><div style="font-size:.95rem;font-weight:700;margin-top:2px">${escH(song.title || 'Untitled')}</div></div>
                        <div><div style="font-size:.72rem;color:var(--text2);text-transform:uppercase;letter-spacing:1px">Artist</div><div style="font-size:.9rem;margin-top:2px">${escH(song.artistName || '')}</div></div>
                        <div><div style="font-size:.72rem;color:var(--text2);text-transform:uppercase;letter-spacing:1px">File</div><div style="font-size:.74rem;margin-top:2px;color:var(--text2)">${escH(song.file || '')}</div></div>
                    </div>
                `;
                document.body.appendChild(details);
                renderLucideIcons(details);
                openDropdownEl = details;
            });
            menu.querySelector('[data-action="like"]').addEventListener('click', (event) => {
                event.stopPropagation();
                closeDropdown();
                toggleLike(song.file);
                refreshVisibleSongLists();
            });
            openDropdownEl = menu;
        }

        window.showSongRowActionsMenu = showSongRowActionsMenu;

        let deferredInstallPrompt = null;
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            deferredInstallPrompt = event;
        });

        window.installFalconXApp = async () => {
            closeDropdown();
            if (!deferredInstallPrompt) {
                showToast('Use your browser menu to install FalconX');
                return;
            }
            deferredInstallPrompt.prompt();
            try {
                await deferredInstallPrompt.userChoice;
            } catch (err) {}
            deferredInstallPrompt = null;
        };

        window.showDesktopProfileMenu = (e) => {
            e.stopPropagation();
            closeDropdown();
            const btn = e.currentTarget || e.target.closest?.('.profile-avatar-btn') || e.target;
            const rect = btn.getBoundingClientRect();
            const name = document.getElementById('userDisplayNameMain')?.textContent || 'FalconX Listener';
            const email = document.getElementById('userEmailMain')?.textContent || 'Premium account';
            const avatar = document.getElementById('userAvatarMain')?.src || 'images/falcon.jpeg';
            const dd = document.createElement('div');
            dd.className = 'desktop-profile-dropdown';
            dd.setAttribute('role', 'menu');
            dd.style.top = `${rect.bottom + 10}px`;
            dd.style.left = `${Math.min(window.innerWidth - 272, Math.max(12, rect.right - 260))}px`;
            dd.innerHTML = `
                <div class="desktop-profile-head">
                    <img src="${escH(avatar)}" alt="">
                    <div>
                        <div class="desktop-profile-name">${escH(name)}</div>
                        <div class="desktop-profile-email">${escH(email)}</div>
                    </div>
                </div>
                <div class="desktop-profile-divider"></div>
                <button class="desktop-profile-menu-item" role="menuitem" onclick="closeDropdown();showToast('Profile settings coming soon')"><i data-lucide="user" aria-hidden="true"></i><span>Profile</span></button>
                <button class="desktop-profile-menu-item" role="menuitem" onclick="closeDropdown();showLikedSongs()"><i data-lucide="heart" aria-hidden="true"></i><span>Liked Songs</span></button>
                <button class="desktop-profile-menu-item" role="menuitem" onclick="closeDropdown();showPlaylists()"><i data-lucide="list-music" aria-hidden="true"></i><span>Playlists</span></button>
                <button class="desktop-profile-menu-item" role="menuitem" onclick="closeDropdown();showDownloads()"><i data-lucide="download" aria-hidden="true"></i><span>Downloads</span></button>
                <button class="desktop-profile-menu-item" role="menuitem" onclick="closeDropdown();openAppearance()"><i data-lucide="palette" aria-hidden="true"></i><span>Appearance</span></button>
                <button class="desktop-profile-menu-item" role="menuitem" onclick="installFalconXApp()"><i data-lucide="monitor-down" aria-hidden="true"></i><span>Install FalconX App</span></button>
                <div class="desktop-profile-divider"></div>
                <button class="desktop-profile-menu-item danger" role="menuitem" onclick="closeDropdown();signOut()"><i data-lucide="log-out" aria-hidden="true"></i><span>Sign Out</span></button>
            `;
            document.body.appendChild(dd);
            renderLucideIcons(dd);
            btn.setAttribute('aria-expanded', 'true');
            openDropdownEl = dd;
        };

        window.showDesktopMenu = window.showDesktopProfileMenu;

        function getSongFolderArtistName(song) {
            const folder = String(song?.file || '').replace(/\\/g, '/').split('/')[0]?.trim();
            return folder || '';
        }

        function getArtistCatalogEntry(key) {
            const artist = artists[key];
            if (!artist || !Array.isArray(artist.songs) || !artist.songs.length) return null;
            const folderCounts = new Map();
            artist.songs.forEach((song) => {
                const folder = getSongFolderArtistName(song);
                if (folder) folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);
            });
            const folderName = [...folderCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || '';
            const name = (folderName || String(artist.name || '').trim() || key).trim();
            return {
                key,
                name,
                originalName: String(artist.name || '').trim(),
                image: artist.image,
                songs: artist.songs
            };
        }

        function getArtistCatalogEntries() {
            return Object.keys(artists).map((key) => getArtistCatalogEntry(key)).filter(Boolean);
        }

        function getArtistDisplayNameByKey(key, fallback = '') {
            return getArtistCatalogEntry(key)?.name || String(fallback || artists[key]?.name || '').trim();
        }

        function buildSidebar() { const sb=document.getElementById('sidebarArtists'); sb.innerHTML=''; getArtistCatalogEntries().forEach((entry) => { sb.innerHTML+=`<div class="artist-item" id="sb_${entry.key}" onclick="openArtist('${escA(entry.key)}')"><img src="${escH(entry.image)}" onerror="this.style.background='#282828'"><span class="artist-item-name">${escH(entry.name)}</span></div>`; }); }

     
        function buildLibrarySongPool() {
            const pool = [];
            getArtistCatalogEntries().forEach((entry) => {
                entry.songs.forEach((song, idx) => {
                    const normalized = normalizeSongForSorting({
                        ...song,
                        artistKey: entry.key,
                        artistName: entry.name,
                        artist: entry.name,
                        __baseIndex: idx
                    }, idx, { scope: 'library', artistName: entry.name, artistKey: entry.key });
                    pool.push({
                        ...normalized,
                        index: idx,
                        plays: normalized.playCount || 0
                    });
                });
            });
            return pool;
        }

        function loadArtists() {
            setNavActive('navHome');
            setMobileBack(false);
            const artistEntries = getArtistCatalogEntries();
            const keys = artistEntries.map((entry) => entry.key);
            const artistEntryByKey = Object.fromEntries(artistEntries.map((entry) => [entry.key, entry]));
            const songPool = buildLibrarySongPool();
            const featuredSong = currentSong ? ({
                ...currentSong,
                artistName: currentArtistKey && artistEntryByKey[currentArtistKey] ? artistEntryByKey[currentArtistKey].name : (currentSong.artistName || playerArtist.textContent || '')
            }) : (continueListening[0] || songPool[0] || null);
            const trendingSongs = [...songPool].sort((a, b) => (b.plays || 0) - (a.plays || 0) || a.title.localeCompare(b.title)).slice(0, 10);
            const likedPool = songPool.filter((song) => likedSongs.has(song.file));
            const recommendationSeed = likedPool.length ? likedPool : songPool;
            const recommendSongs = [...recommendationSeed].sort((a, b) => (b.plays || 0) - (a.plays || 0) || a.artistName.localeCompare(b.artistName)).slice(0, 8);
            const albumGroups = [...songPool.reduce((map, song) => {
                const album = deriveSongAlbum(song, song.artistName);
                const id = `${album}|${song.artistName}`;
                if (!map.has(id)) map.set(id, { album, artistName: song.artistName, poster: song.poster, songs: [], plays: 0 });
                const group = map.get(id);
                group.songs.push(song);
                group.plays += song.plays || song.playCount || 0;
                return map;
            }, new Map()).values()].sort((a, b) => b.songs.length - a.songs.length || b.plays - a.plays || a.album.localeCompare(b.album)).slice(0, 6);
            const recentSongs = continueListening.slice(0, 6);
            const onDeckSongs = recentSongs.length ? recentSongs : trendingSongs.slice(0, 6);
            const leadSongs = [featuredSong, ...trendingSongs, ...recommendSongs].filter(Boolean);
            const stationSongs = leadSongs.filter((song, index, arr) => arr.findIndex((item) => item.file === song.file) === index).slice(0, 4);
            const recListSongs = recommendSongs.length ? recommendSongs : trendingSongs.slice(0, 6);
            const uniqueArtists = keys;
            const libraryTrackCount = songPool.length;
            const totalPlays = songPool.reduce((sum, song) => sum + (song.plays || song.playCount || 0), 0);
            const heroSubtitle = featuredSong ? `${escH(featuredSong.artistName || 'FalconX Curated')} sets the tone for a cinematic black-and-gold listening session.` : 'A cinematic launchpad for new music, favorites, and deep cuts.';
            const playClick = (song) => `playSongByFile('${escA(song.file)}')`;
            const historyClick = (song) => `playFromHistory('${escA(song.file)}','${escA(song.artistKey || '')}')`;
            const miniRowHTML = (song, useHistory = false, icon = 'plus') => `<div class="home-mini-row hx-row" onclick="${useHistory ? historyClick(song) : playClick(song)}"><img src="${escH(song.poster)}" onerror="this.style.background='var(--surface3)'" loading="lazy"><div class="home-text"><div class="home-title">${songTitleHTML(song)}</div><div class="home-meta">${escH(song.artistName || '')}</div></div><button class="home-icon-action" onclick="event.stopPropagation();addSongToQueueByFile('${escA(song.file)}', false)" title="Add to queue">${uiIcon(icon)}</button></div>`;
            const trendCardHTML = (song, i) => `<div class="hx-trend-card" onclick="${playClick(song)}"><div class="hx-trend-rank">${String(i + 1).padStart(2, '0')}</div><img src="${escH(song.poster)}" onerror="this.style.background='var(--surface3)'" loading="lazy"><div class="home-text"><div class="home-title">${songTitleHTML(song)}</div><div class="home-meta">${escH(song.artistName)} - ${song.plays || song.playCount || 0} plays</div></div><button class="home-icon-action" onclick="event.stopPropagation();addSongToQueueByFile('${escA(song.file)}', false)" title="Add to queue">${uiIcon('list-plus')}</button></div>`;
            const recCardHTML = (song, i) => `<div class="hx-rec-card" onclick="${playClick(song)}"><div class="hx-rec-art"><img src="${escH(song.poster)}" onerror="this.style.background='var(--surface3)'" loading="lazy"><button class="card-play-btn" onclick="event.stopPropagation();${playClick(song)}">${uiIcon('play')}</button></div><div class="home-title">${songTitleHTML(song)}</div><div class="home-meta">${escH(song.artistName || '')}${i === 0 ? ' - Prime pick' : ''}</div></div>`;
            const albumCardHTML = (album) => `<div class="home-album-card hx-album-card" onclick="${playClick(album.songs[0])}"><img src="${escH(album.poster)}" onerror="this.style.background='var(--surface3)'" loading="lazy"><div class="home-album-title">${escH(album.album)}</div><div class="home-album-meta">${escH(album.artistName)} - ${album.songs.length} track${album.songs.length !== 1 ? 's' : ''}</div></div>`;
            const artistCardHTML = (key) => { const artist = artistEntryByKey[key]; return `<div class="artist-card hx-artist-card" onclick="openArtist('${escA(key)}')"><div class="artist-card-img-wrap"><img src="${escH(artist.image)}" onerror="this.style.background='#282828'" loading="lazy"><button class="card-play-btn" onclick="event.stopPropagation();playArtist('${escA(key)}')">${uiIcon('play')}</button></div><div class="artist-card-name">${escH(artist.name)}</div><div class="artist-card-count">${artist.songs.length} tracks</div></div>`; };
            const moodTilesHTML = [
                { icon: 'heart', title: 'Gold Favorites', meta: `${likedSongs.size} saved tracks`, action: 'showLikedSongs()' },
                { icon: 'list-music', title: 'Private Playlists', meta: `${Object.keys(playlists || {}).length} collections`, action: 'showPlaylists()' },
                { icon: 'download', title: 'Offline Vault', meta: `${downloadedFiles.size} downloads`, action: 'showDownloads()' },
                { icon: 'sliders-horizontal', title: 'Audio Suite', meta: 'Shape the sound', action: 'renderAudioPage()' }
            ].map((tile) => `<button class="hx-action-tile" onclick="${tile.action}"><span>${uiIcon(tile.icon)}</span><div><strong>${tile.title}</strong><em>${tile.meta}</em></div></button>`).join('');
            const featuredHTML = featuredSong ? `<section class="hx-stage">
                <div class="hx-feature-card">
                    <div class="hx-feature-orbit" aria-hidden="true"></div>
                    <div class="hx-feature-copy">
                        <div class="home-eyebrow">${uiIcon('sparkles')}<span>FalconX Signature</span></div>
                        <h1>${songTitleHTML(featuredSong, 'Featured Sound')}</h1>
                        <p>${heroSubtitle}</p>
                        <div class="hx-feature-meta"><span>${escH(featuredSong.artistName || 'FalconX')}</span><span>${libraryTrackCount} tracks</span><span>${totalPlays} plays</span></div>
                        <div class="home-hero-actions">
                            <button class="home-play-primary" onclick="${playClick(featuredSong)}">${uiIcon('play')}<span>Play Feature</span></button>
                            <button class="home-action-ghost" onclick="addSongToQueueByFile('${escA(featuredSong.file)}', true)">${uiIcon('list-plus')}<span>Play Next</span></button>
                        </div>
                    </div>
                    <div class="hx-feature-art">
                        <img src="${escH(featuredSong.poster || '')}" alt="${escH(featuredSong.title || 'Featured song')}" onerror="this.style.background='var(--surface3)'" loading="lazy">
                    </div>
                </div>
                <aside class="hx-now-card">
                    <div class="home-section-headline"><div><div class="home-section-kicker">${uiIcon(recentSongs.length ? 'history' : 'radio')}<span>${recentSongs.length ? 'Resume' : 'On Deck'}</span></div><div class="home-section-title">${recentSongs.length ? 'Continue Listening' : 'Start Your Session'}</div></div><div class="home-section-meta">${onDeckSongs.length} Picks</div></div>
                    <div class="hx-now-list home-rail">${onDeckSongs.map((song) => miniRowHTML(song, !!recentSongs.length, recentSongs.length ? 'plus' : 'list-plus')).join('')}</div>
                </aside>
            </section>` : '';

            const mainArea = document.getElementById('mainArea');
            mainArea.innerHTML = `
            <div class="main-topbar">
                <div class="nav-arrows"><button class="nav-arrow-btn" title="Back">${uiIcon('chevron-left')}</button><button class="nav-arrow-btn" title="Forward">${uiIcon('chevron-right')}</button></div>
                <div class="search-box">
                    <span class="search-icon">${uiIcon('search')}</span>
                    <input type="text" id="searchBar" placeholder="Search artists or songs..." oninput="globalSearch()">
                    <button class="search-clear" id="searchClear" onclick="clearSearch()">${uiIcon('x')}</button>
                </div>
                <div class="topbar-actions">
                    <button class="topbar-menu-btn" onclick="openMobileDrawer()" title="Menu">${uiIcon('menu')}</button>
                    <button class="topbar-icon-btn" onclick="showLikedSongs()" title="Favorites">${uiIcon('heart')}</button>
                    <button class="topbar-icon-btn" onclick="showPlaylists()" title="Playlists">${uiIcon('list-music')}</button>
                </div>
            </div>
            <div class="home-shell hx-home">
                ${featuredHTML}
                <section class="home-section hx-command-strip">
                    ${moodTilesHTML}
                </section>
                <section class="home-section hx-grid-block">
                    <div class="hx-chart-panel">
                        <div class="home-section-headline"><div><div class="home-section-kicker">${uiIcon('flame')}<span>Pulse Chart</span></div><div class="home-section-title">Trending Now</div></div><div class="home-section-meta">${trendingSongs.length} Tracks</div></div>
                        <div class="hx-trend-list">${trendingSongs.map((song, i) => trendCardHTML(song, i)).join('') || '<div class="home-empty-note">No tracks available.</div>'}</div>
                    </div>
                    <div class="hx-station-panel">
                        <div class="home-section-headline"><div><div class="home-section-kicker">${uiIcon('radio')}<span>Stations</span></div><div class="home-section-title">Instant Mixes</div></div><div class="home-section-meta">FalconX</div></div>
                        <div class="hx-station-grid">${stationSongs.map((song, i) => `<button class="hx-station-card" onclick="${playClick(song)}"><img src="${escH(song.poster)}" onerror="this.style.background='var(--surface3)'" loading="lazy"><span>${['After Dark', 'Gold Room', 'Focus Drive', 'Deep Cut'][i] || 'Prime Mix'}</span><em>${escH(song.artistName || 'FalconX')}</em></button>`).join('') || '<div class="home-empty-note">No stations yet.</div>'}</div>
                    </div>
                </section>
                <section class="home-section">
                    <div class="home-section-headline"><div><div class="home-section-kicker">${uiIcon('gem')}<span>Curated</span></div><div class="home-section-title">Recommended For You</div></div><div class="home-section-meta">${likedPool.length ? 'Personalized' : 'Fresh Picks'}</div></div>
                    <div class="hx-rec-grid home-rail">
                        ${recListSongs.map((song, i) => recCardHTML(song, i)).join('') || '<div class="home-empty-note">No recommendations yet.</div>'}
                    </div>
                </section>
                <section class="home-section">
                    <div class="home-section-headline"><div><div class="home-section-kicker">${uiIcon('disc-3')}<span>New Energy</span></div><div class="home-section-title">Albums & Collections</div></div><div class="home-section-meta">${albumGroups.length} Picks</div></div>
                    <div class="home-album-grid home-rail">${albumGroups.map((album) => albumCardHTML(album)).join('') || '<div class="home-empty-note">No albums available.</div>'}</div>
                </section>
                <section class="home-section home-artists">
                    <div class="home-section-headline"><div><div class="home-section-kicker">${uiIcon('users')}<span>Spotlight</span></div><div class="home-section-title">Popular Artists</div></div><div class="home-section-meta">${keys.length} Artists</div></div>
                    <div class="artists-grid">
                        ${uniqueArtists.map((key) => artistCardHTML(key)).join('')}
                    </div>
                </section>
            </div>`;
            initSearchClear();
            renderLucideIcons(mainArea);
            const totalUniqueArtists = artistEntries.length;
            const renderedArtistCards = mainArea.querySelectorAll('.home-artists .artist-card').length;
            console.log("Unique artists:", totalUniqueArtists);
            console.log("Rendered artist cards:", renderedArtistCards);
        }

        function initSearchClear() { const inp=document.getElementById('searchBar'); const clr=document.getElementById('searchClear'); if(!inp||!clr)return; inp.addEventListener('input',()=>clr.classList.toggle('visible',inp.value.length>0)); }

        function syncDesktopSearchValue(value = '') {
            const desktopInp = document.getElementById('desktopSearchBar');
            const desktopClr = document.getElementById('desktopSearchClear');
            if (desktopInp && desktopInp.value !== value) desktopInp.value = value;
            if (desktopClr) desktopClr.classList.toggle('visible', String(value).trim().length > 0);
        }

        window.clearSearch = () => {
            const inp=document.getElementById('searchBar');
            if(inp) inp.value='';
            document.getElementById('searchClear')?.classList.remove('visible');
            syncDesktopSearchValue('');
            loadArtists();
        };

        window.desktopHeaderSearch = () => {
            const desktopInp = document.getElementById('desktopSearchBar');
            if (!desktopInp) return;
            const rawQuery = desktopInp.value || '';
            syncDesktopSearchValue(rawQuery);
            let pageSearch = document.getElementById('searchBar');
            if (!pageSearch) {
                loadArtists();
                pageSearch = document.getElementById('searchBar');
            }
            if (pageSearch) pageSearch.value = rawQuery;
            if (normalizeSearchText(rawQuery)) globalSearch();
            else loadArtists();
            syncDesktopSearchValue(rawQuery);
            const refreshedDesktopInp = document.getElementById('desktopSearchBar');
            if (refreshedDesktopInp && document.activeElement !== refreshedDesktopInp) {
                refreshedDesktopInp.focus();
                refreshedDesktopInp.setSelectionRange(refreshedDesktopInp.value.length, refreshedDesktopInp.value.length);
            }
        };

        window.clearDesktopSearch = () => {
            syncDesktopSearchValue('');
            const pageSearch = document.getElementById('searchBar');
            if (pageSearch) pageSearch.value = '';
            document.getElementById('searchClear')?.classList.remove('visible');
            loadArtists();
        };

        
        function getSortedArtistSongs(key, type = currentArtistSortType) {
            const artist = getArtistCatalogEntry(key);
            if (!artist) return [];
            const base = artist.songs.map((song, index) => ({
                ...song,
                artistName: artist.name,
                artist: artist.name,
                artistKey: key,
                liked: likedSongs.has(song.file),
                downloaded: isDownloaded(song.file),
                playCount: songPlayCounts[song.file] || 0,
                __baseIndex: index
            }));
            return applySorting('artist', base, type, { artistName: artist.name, artistKey: key });
        }

        function openArtist(key) {
            const a = getArtistCatalogEntry(key);
            if (!a) return;
            currentArtistKey = key; currentSongs = getSortedArtistSongs(key);
            setSidebarActive(key); setMobileBack(true);
            const mainArea = document.getElementById('mainArea');
            mainArea.innerHTML = `
            <div class="main-topbar">
                <div class="nav-arrows"><button class="nav-arrow-btn" onclick="loadArtists()">${uiIcon('chevron-left')}</button></div>
                <div class="search-box"><span class="search-icon">${uiIcon('search')}</span><input type="text" id="searchBar" placeholder="Search in ${a.name}…" oninput="globalSearch()"><button class="search-clear" id="searchClear" onclick="clearSearch()">${uiIcon('x')}</button></div>
                <div class="topbar-actions"><button class="topbar-menu-btn" onclick="openMobileDrawer()" title="Menu">${uiIcon('menu')}</button></div>
            </div>
            <div class="artist-hero"><div class="artist-hero-bg" style="background-image:url('${a.image}')"></div><div class="artist-hero-overlay"></div><div class="artist-hero-content"><img class="artist-hero-img" src="${a.image}" onerror="this.style.background='#282828'"><div><div class="artist-hero-tag">Artist</div><div class="artist-hero-name">${a.name}</div><div style="font-size:.8rem;color:var(--text2);margin-bottom:16px">${a.songs.length} songs</div><div class="artist-hero-actions"><button class="btn btn-white" onclick="playArtist('${key}')">${uiIcon('play')}<span>Play</span></button><button class="btn btn-outline" onclick="shuffleArtist('${key}')">${uiIcon('shuffle')}<span>Shuffle</span></button></div></div></div></div>
            <div class="songs-section" style="padding-top:20px">
                ${sortControlHTML('artist', currentArtistSortType, SORT_SECTION_OPTIONS.artist, 'Sort Artist Songs')}
                <div class="songs-table-header"><span class="th">#</span><span class="th">Title</span><span class="th"></span></div>
                <div id="songsList" class="sort-song-list"></div>
            </div>`;
            initSearchClear();
            renderLucideIcons(mainArea);
            renderArtistSongs(key, true);
        }

        function songRowHTML(song,i,artistName) { const playing=currentSong&&currentSong.file===song.file&&!audio.paused; const liked=likedSongs.has(song.file); const rowArtist=song.artistName||song.artist||artistName||''; return`<div class="song-row${playing?' playing':''}" id="row_${i}" data-file="${escH(song.file)}" onclick="playSong(${i},true)"><div class="song-num">${playing?'<div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>':i+1}</div><div class="song-row-info"><img src="${escH(song.poster)}" onerror="this.style.background='#282828'" loading="lazy"><div class="song-row-text"><h4>${songTitleHTML(song)}</h4><p>${escH(rowArtist)}</p></div></div><div class="song-actions"><button class="like-btn${liked?' liked':''}" onclick="event.stopPropagation();toggleLike('${escA(song.file)}',${i})" title="${liked?'Unlike':'Like'}">${liked?uiIcon('heart'):uiIcon('heart-off')}</button><button class="song-more-btn" onclick="event.stopPropagation();showSongRowActionsMenu(event,'${escA(song.file)}',${i})" title="More options">${uiIcon('more-horizontal')}</button></div></div>`; }

        window.handleDlBtn = async(btn,fileId) => { if(isDownloaded(fileId)){if(confirm('Remove from offline?')){await removeCachedSong(fileId);btn.classList.remove('downloaded');setElementIcon(btn,'download');}}else{let song=null;for(let k in artists){song=artists[k].songs.find(s=>s.file===fileId);if(song){song={...song,artistName:artists[k].name};break;}}if(song)addToDlQueue(song);} };

        function updateArtistPlayingState(autoScrollActive = false) {
            if (!currentArtistKey) return;
            const list = document.getElementById('songsList');
            if (!list) return;
            list.querySelectorAll('.song-row').forEach((row, i) => {
                const song = currentSongs[i];
                const isPlaying = !!(song && currentSong && currentSong.file === song.file && !audio.paused);
                row.classList.toggle('playing', isPlaying);
                const num = row.querySelector('.song-num');
                if (!num) return;
                if (isPlaying) {
                    num.innerHTML = '<div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>';
                } else {
                    num.textContent = String(i + 1);
                }
            });
        }

        function renderArtistSongs(key = currentArtistKey, autoScrollActive = false) {
            if (!key) return;
            const list = document.getElementById('songsList');
            if (!list) return;
            const artist = getArtistCatalogEntry(key);
            if (!artist) return;
            currentSongs = getSortedArtistSongs(key, currentArtistSortType);
            currentArtistKey = key;
            renderSortedList(list, currentSongs.map((song, i) => songRowHTML(song, i, artist.name)).join(''), '.song-row', () => {
                renderLucideIcons(list);
                updateSortUI('artist', currentArtistSortType);
                updateArtistPlayingState(autoScrollActive);
            });
        }

        function refreshSongRows() { if(!currentArtistKey)return; const list=document.getElementById('songsList'); if(!list)return; renderArtistSongs(currentArtistKey,false); }
        function refreshVisibleSongLists() {
            refreshSongRows();
            if (currentPlaylistId && document.getElementById('playlistSongsList')) {
                renderPlaylistSongs(currentPlaylistId, false);
            }
            if (document.getElementById('favSongsList')) {
                refreshLikedDisplay();
            }
            if (document.getElementById('downloadsSongsList')) {
                renderDownloadsList(false);
            }
        }

        function getTargetVolume() {
            return isMuted ? 0 : (parseFloat(volumeSlider.value) || 1);
        }

        function isBackgroundPlayback() {
            return document.hidden || pageFrozen;
        }

        function resumeAudioContext(reason = 'playback') {
            if (!visualizerCtx || visualizerCtx.state !== 'suspended' || audio.paused) return Promise.resolve(false);
            return visualizerCtx.resume().then(() => true).catch((err) => {
                console.warn('AudioContext resume failed:', reason, err);
                return false;
            });
        }

        function stopCrossfadeTimers() {
            if (crossfadeTimer) {
                clearTimeout(crossfadeTimer);
                crossfadeTimer = null;
            }
            if (crossfadeInTimer) {
                clearTimeout(crossfadeInTimer);
                crossfadeInTimer = null;
            }
            crossfadeFallbackTimers.forEach((timerId) => clearTimeout(timerId));
            crossfadeFallbackTimers.clear();
        }

        function clearCrossfadeFallbackTimer(timerId) {
            if (!timerId) return;
            clearTimeout(timerId);
            crossfadeFallbackTimers.delete(timerId);
        }

        function setCrossfadeGain(gainNode, value) {
            if (!gainNode || !visualizerCtx) return false;
            const now = visualizerCtx.currentTime;
            gainNode.gain.cancelScheduledValues(now);
            gainNode.gain.setValueAtTime(value, now);
            return true;
        }

        function rampCrossfadeGain(gainNode, from, to, durationMs, onComplete) {
            if (gainNode && visualizerCtx) {
                const now = visualizerCtx.currentTime;
                const duration = Math.max(.08, (durationMs || 0) / 1000);
                gainNode.gain.cancelScheduledValues(now);
                gainNode.gain.setValueAtTime(from, now);
                gainNode.gain.linearRampToValueAtTime(to, now + duration);
                const timerId = window.setTimeout(() => {
                    clearCrossfadeFallbackTimer(timerId);
                    gainNode.gain.cancelScheduledValues(visualizerCtx.currentTime);
                    gainNode.gain.setValueAtTime(to, visualizerCtx.currentTime);
                    if (onComplete) onComplete();
                }, Math.max(90, durationMs || 0) + 40);
                crossfadeFallbackTimers.add(timerId);
                return timerId;
            }
            return 0;
        }

        function animateAudioVolume(mediaEl, from, to, durationMs, onComplete) {
            const duration = Math.max(90, durationMs || 0);
            const startedAt = performance.now();
            const tick = () => {
                const t = Math.min(1, (performance.now() - startedAt) / duration);
                const eased = Math.sin(t * Math.PI / 2);
                mediaEl.volume = from + ((to - from) * eased);
                if (t >= 1) {
                    mediaEl.volume = to;
                    if (onComplete) onComplete();
                    return;
                }
                const timerId = window.setTimeout(() => {
                    clearCrossfadeFallbackTimer(timerId);
                    tick();
                }, 33);
                crossfadeFallbackTimers.add(timerId);
            };
            tick();
            return 0;
        }

        function scheduleCrossfadeAuto(reason = 'schedule') {
            if (crossfadeTimer) {
                clearTimeout(crossfadeTimer);
                crossfadeTimer = null;
            }
            crossfadeAutoArmed = false;
            if (crossfadeSeconds <= 0 || isRepeat || audio.paused || !Number.isFinite(audio.duration) || audio.duration <= crossfadeSeconds + 1) return;
            const remainingMs = Math.max(0, ((audio.duration - audio.currentTime - crossfadeSeconds) * 1000) - 45);
            crossfadeTimer = window.setTimeout(() => {
                crossfadeTimer = null;
                if (crossfadeSeconds <= 0 || isRepeat || audio.paused || crossfadeTransitionActive) return;
                if (!Number.isFinite(audio.duration) || (audio.duration - audio.currentTime) > crossfadeSeconds + .65) {
                    scheduleCrossfadeAuto('late-check');
                    return;
                }
                crossfadeAutoArmed = true;
                next();
            }, Math.max(0, remainingMs));
        }

        function updateCrossfadeSettingUI() {
            const slider = document.getElementById('crossfadeSlider');
            const value = document.getElementById('crossfadeValue');
            if (slider) slider.value = String(crossfadeSeconds);
            if (value) value.textContent = crossfadeSeconds === 0 ? 'Off' : `${crossfadeSeconds}s`;
        }

        function setCrossfadeSeconds(value) {
            const nextValue = Math.max(0, Math.min(12, parseInt(value, 10) || 0));
            crossfadeSeconds = nextValue;
            localStorage.setItem('eq_crossfade_seconds', String(crossfadeSeconds));
            updateCrossfadeSettingUI();
            if (crossfadeSeconds === 0) {
                stopCrossfadeTimers();
                releaseAudioObjectUrl(audioFade.src);
                audioFade.pause();
                audioFade.removeAttribute('src');
                audioFade.load();
                audio.volume = getTargetVolume();
                setCrossfadeGain(crossfadeMainGain, 1);
                setCrossfadeGain(crossfadeFadeGain, 0);
            } else {
                scheduleCrossfadeAuto('setting-change');
            }
        }

        window.showAddToPlaylistMenu = (e,fileId,rowIdx) => { e.stopPropagation(); closeDropdown(); const resolved = resolveSongForRow(fileId); const song = resolved || (Number.isInteger(rowIdx) && currentSongs[rowIdx] ? currentSongs[rowIdx] : null); if(!song)return; const artistName=song.artistName || (currentArtistKey?getArtistDisplayNameByKey(currentArtistKey):''); window.__ctxSong=song; window.__ctxArtist=artistName; const ids=Object.keys(playlists); const dd=document.createElement('div'); dd.className='add-to-playlist-dropdown'; dd.style.position='fixed'; const target=e.currentTarget || e.target; const rect=target && typeof target.getBoundingClientRect==='function' ? target.getBoundingClientRect() : { bottom: window.innerHeight / 2, left: window.innerWidth / 2 }; dd.style.top=(rect.bottom+4)+'px'; dd.style.left=Math.max(10,rect.left-140)+'px'; if(!ids.length){dd.innerHTML=`<div class="no-playlists">No playlists yet.</div><button onclick="closeDropdown();openCreatePlaylistModal()">${uiIcon('plus')}<span>Create playlist</span></button>`;}else{dd.innerHTML=`<button onclick="closeDropdown();openCreatePlaylistModal()">${uiIcon('plus')}<span>New playlist</span></button>`+ids.map(id=>`<button onclick="addSongToPlaylistById(window.__ctxSong,window.__ctxArtist,'${escA(id)}');closeDropdown()">${escH(playlists[id].name)}</button>`).join('');}document.body.appendChild(dd);renderLucideIcons(dd);openDropdownEl=dd; };

      
        async function playSong(index, manualSelection = false) {
            if (!currentSongs[index]) return false;
            currentIndex = index;
            const song = currentSongs[index];
            const previousSongFile = currentSong ? currentSong.file : null;
            if (manualSelection && isRepeat && previousSongFile && previousSongFile !== song.file) {
                isRepeat = false;
                localStorage.setItem('eq_repeat', 'false');
            }
            currentSong = song;
            trackSongPlay(song.file);
            song.playCount = songPlayCounts[song.file] || 0;
            song.liked = likedSongs.has(song.file);
            song.downloaded = isDownloaded(song.file);
            song.lastPlayed = Date.now();
            stopCrossfadeTimers();
            setupVisualizer();
            setCrossfadeGain(crossfadeMainGain, 1);
            setCrossfadeGain(crossfadeFadeGain, 0);
            if (audioFade.src) {
                releaseAudioObjectUrl(audioFade.src);
                audioFade.pause();
                audioFade.removeAttribute('src');
                audioFade.load();
            }
            crossfadeAutoArmed = false;
            const targetVol = getTargetVolume();
            const fadeMs = crossfadeSeconds * 1000;
            const shouldCrossfade = crossfadeSeconds > 0 && !audio.paused && audio.currentTime > 0 && audio.src;
            crossfadeTransitionActive = shouldCrossfade;
            if (shouldCrossfade) {
                const fadingObjectUrl = activeAudioObjectUrl;
                audioFade.src = audio.src;
                audioFade.currentTime = audio.currentTime;
                audioFade.volume = targetVol;
                setCrossfadeGain(crossfadeFadeGain, 1);
                audioFade.play().catch(() => {});
                const finishFadeOut = () => {
                    audioFade.pause();
                    audioFade.removeAttribute('src');
                    audioFade.load();
                    releaseAudioObjectUrl(fadingObjectUrl);
                    crossfadeTimer = null;
                    crossfadeTransitionActive = false;
                    setCrossfadeGain(crossfadeFadeGain, 0);
                };
                crossfadeTimer = crossfadeEngineReady ? rampCrossfadeGain(crossfadeFadeGain, 1, 0, fadeMs, finishFadeOut) : animateAudioVolume(audioFade, targetVol, 0, fadeMs, finishFadeOut);
            } else {
                crossfadeTransitionActive = false;
                audioFade.pause();
                audioFade.removeAttribute('src');
                audioFade.load();
                setCrossfadeGain(crossfadeFadeGain, 0);
            }
            let src = '';
            try {
                src = await getAudioSrc('songs/' + song.file);
            } catch (err) {
                currentPlaybackSource = 'network';
                updatePlayerDlBtn();
                showToast(isDownloaded(song.file) ? 'Offline copy is unavailable' : 'This song is not available offline');
                if (shouldCrossfade) stopCrossfadeTimers();
                return false;
            }
            if (shouldCrossfade) crossfadePauseSuppressUntil = performance.now() + 350;
            setPrimaryAudioSource(src, !shouldCrossfade);
            audio.volume = shouldCrossfade ? 0 : targetVol;
            setCrossfadeGain(crossfadeMainGain, shouldCrossfade ? 0 : 1);
            resumeAudioContext('song-change');
            posterEl.src = song.poster;
            playerTitle.textContent = song.title;
            const artistKey = currentArtistKey || Object.keys(artists).find((k) => artists[k].songs === currentSongs);
            const artistName = artistKey ? getArtistDisplayNameByKey(artistKey) : (song.artistName || '');
            playerArtist.textContent = artistName;
            syncExplicitBadges(song);
            updatePlayerLikeBtn(song.file);
            updatePlayerDlBtn();
            audio.play().then(() => {
                resumeAudioContext('song-play');
                if (!shouldCrossfade) {
                    audio.volume = targetVol;
                    setCrossfadeGain(crossfadeMainGain, 1);
                    scheduleCrossfadeAuto('playSong');
                    return;
                }
                if (crossfadeEngineReady) audio.volume = targetVol;
                const finishFadeIn = () => {
                    setCrossfadeGain(crossfadeMainGain, 1);
                    crossfadeInTimer = null;
                    scheduleCrossfadeAuto('fade-in-complete');
                };
                crossfadeInTimer = crossfadeEngineReady ? rampCrossfadeGain(crossfadeMainGain, 0, 1, fadeMs, finishFadeIn) : animateAudioVolume(audio, 0, targetVol, fadeMs, finishFadeIn);
            }).catch(() => {
                audio.volume = targetVol;
                setCrossfadeGain(crossfadeMainGain, 1);
                if (crossfadeTimer) {
                    clearTimeout(crossfadeTimer);
                    crossfadeTimer = null;
                    crossfadeTransitionActive = false;
                    try {
                        audioFade.pause();
                        audioFade.removeAttribute('src');
                        audioFade.load();
                    } catch (e) {}
                }
            });
            setPlayButtonIcons(false);
            document.getElementById('fsPoster').src = song.poster;
            document.getElementById('fsTitle').textContent = song.title;
            document.getElementById('fsArtist').textContent = artistName;
            syncExplicitBadges(song);
            updateAmbientFromSong({
                ...song,
                artistName
            });
            if (currentArtistKey) updateArtistPlayingState(false);
            if (currentPlaylistId && document.getElementById('playlistSongsList')) updatePlaylistPlayingState(true);
            if (document.getElementById('favSongsList')) updateFavoritesPlayingState(true);
            shuffleHistory.push(song.file);
            if (shuffleHistory.length > 30) shuffleHistory = shuffleHistory.slice(-30);
            localStorage.setItem('eq_shuffle_history', JSON.stringify(shuffleHistory));
            const sh = {
                file: song.file,
                title: song.title,
                poster: song.poster,
                artistKey: currentArtistKey,
                artistName,
                album: song.album || deriveSongAlbum(song, artistName),
                duration: song.duration || songDurationMeta[song.file] || 0,
                explicit: isExplicitSong(song),
                playCount: songPlayCounts[song.file] || 0,
                liked: likedSongs.has(song.file),
                downloaded: isDownloaded(song.file),
                addedAt: Date.now(),
                lastPlayed: Date.now()
            };
            const ei = continueListening.findIndex((s) => s.file === song.file);
            if (ei >= 0) continueListening.splice(ei, 1);
            continueListening.unshift(sh);
            if (continueListening.length > 10) continueListening = continueListening.slice(0, 10);
            saveContinueListening();
            savePlaybackMemory();
            renderQueuePanel();
            syncPlaybackModeUI();
            updateFullPlayerUI();
            if (lyricsPanelOpen) loadLyricsPanel(currentSong);
            else syncLyricsPanelShell();
            updateNowPlayingIndicator();
            localStorage.removeItem('falcon_mini_closed');
            updateMiniPlayer();
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: song.title,
                    artist: artistName,
                    artwork: [{
                        src: song.poster,
                        sizes: '512x512',
                        type: 'image/jpeg'
                    }]
                });
            }
            scheduleSmartPreload('playback');
            return true;
        }

        function togglePlay() { if(audio.paused){audio.play().then(()=>resumeAudioContext('toggle-play')).catch(()=>{});setPlayButtonIcons(false);}else{audio.pause();setPlayButtonIcons(true);savePlaybackMemory();} updateNowPlayingIndicator(); }

        function next() {
            if (queue.length > 0) {
                if (!canUseNetwork()) {
                    const offlineQueueIndex = queue.findIndex((song) => isDownloaded(normalizeOfflineFileId(song?.file)));
                    window.playFromQueue(offlineQueueIndex >= 0 ? offlineQueueIndex : 0);
                    return;
                }
                window.playFromQueue(0);
                return;
            }
            if (!currentSongs.length) return;
            if (!canUseNetwork()) {
                const offlineIndex = findNextDownloadedIndex(currentIndex);
                if (offlineIndex >= 0) {
                    currentIndex = offlineIndex;
                    playSong(currentIndex, true);
                    return;
                }
            }
            if (isShuffle) {
                const recent = new Set(shuffleHistory.slice(-Math.min(shuffleHistory.length, Math.floor(currentSongs.length * .5))));
                const avail = currentSongs.map((_, i) => i).filter((i) => !recent.has(currentSongs[i].file));
                currentIndex = avail.length > 0 ? avail[Math.floor(Math.random() * avail.length)] : Math.floor(Math.random() * currentSongs.length);
            } else {
                currentIndex = (currentIndex + 1) % currentSongs.length;
            }
            playSong(currentIndex, true);
        }

        function previous() { if(!currentSongs.length)return; if(audio.currentTime>3){audio.currentTime=0;scheduleCrossfadeAuto('restart');return;} currentIndex=(currentIndex-1+currentSongs.length)%currentSongs.length; playSong(currentIndex,true); }

        function playArtist(key) { currentSongs=getSortedArtistSongs(key,currentArtistSortType); currentArtistKey=key; currentIndex=0; playSong(0,true); }
        function shuffleArtist(key) { currentSongs=getSortedArtistSongs(key,currentArtistSortType); currentArtistKey=key; currentIndex=Math.floor(Math.random()*currentSongs.length); playSong(currentIndex,true); }
        window.playFromHistory = async(fileId,artistKey) => {
            if (artists[artistKey]) {
                currentArtistKey = artistKey;
                currentSongs = artists[artistKey].songs;
                const idx = currentSongs.findIndex((s) => s.file === fileId);
                if (idx >= 0) {
                    await playSong(idx, true);
                    return;
                }
            }
            await playSongByFile(fileId, true);
        };
        window.playSongByFile = playSongByFile;

    
        let isDragging = false;
        let activeDragTrack = null;
        let lastPlaybackSaveAt = 0;

        function updateNowPlayingIndicator() {
            const bar = document.getElementById('nowPlayingBar');
            const indicator = document.getElementById('nowPlayingIndicator');
            const songEl = document.getElementById('nowPlayingSong');
            const artistEl = document.getElementById('nowPlayingArtist');
            const posterEl = document.getElementById('nowPlayingPoster');
            
            if (currentSong && !audio.paused) {
                songEl.textContent = currentSong.title;
                artistEl.textContent = playerArtist.textContent;
                posterEl.src = currentSong.poster;
                bar.classList.add('active');
                indicator.classList.add('active', 'playing');
            } else {
                bar.classList.remove('active');
                indicator.classList.remove('active', 'playing');
            }
        }

        function updateMiniPlayerProgress(current = audio.currentTime || 0, duration = audio.duration || 0) {
            const fill = document.getElementById('miniProgressFill');
            if (!fill) return;
            const pct = duration > 0 ? Math.max(0, Math.min(100, (current / duration) * 100)) : 0;
            fill.style.width = pct + '%';
        }

        function updateMiniPlayer() {
            const mini = document.getElementById('miniPlayer');
            if (!mini) return;
            const hasSong = !!currentSong;
            mini.classList.toggle('hidden', !hasSong || localStorage.getItem('falcon_mini_closed') === '1');
            if (!hasSong) return;
            const cover = document.getElementById('miniCover');
            const title = document.getElementById('miniTitle');
            const artist = document.getElementById('miniArtist');
            if (cover && cover.src !== currentSong.poster) cover.src = currentSong.poster || '';
            if (title) title.textContent = currentSong.title || 'Unknown track';
            if (artist) artist.textContent = playerArtist.textContent || currentSong.artistName || 'Unknown artist';
            updateMiniPlayerProgress();
            setPlayButtonIcons(audio.paused);
        }

        window.closeMiniPlayer = () => {
            localStorage.setItem('falcon_mini_closed', '1');
            document.getElementById('miniPlayer')?.classList.add('hidden');
        };

        window.toggleMiniPlayerCollapse = () => {
            const mini = document.getElementById('miniPlayer');
            if (!mini) return;
            mini.classList.toggle('collapsed');
            localStorage.setItem('falcon_mini_collapsed', mini.classList.contains('collapsed') ? '1' : '0');
        };

        function initMiniPlayerDrag() {
            const mini = document.getElementById('miniPlayer');
            if (!mini || mini.dataset.dragBound === '1') return;
            mini.dataset.dragBound = '1';
            if (localStorage.getItem('falcon_mini_collapsed') === '1') mini.classList.add('collapsed');
            const saved = (() => {
                try { return JSON.parse(localStorage.getItem('falcon_mini_pos') || 'null'); } catch (e) { return null; }
            })();
            if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
                mini.style.left = saved.x + 'px';
                mini.style.top = saved.y + 'px';
                mini.style.right = 'auto';
                mini.style.bottom = 'auto';
            }
            let dragging = false, startX = 0, startY = 0, baseX = 0, baseY = 0;
            const down = (e) => {
                if (e.target instanceof Element && e.target.closest('button')) return;
                const point = e.touches ? e.touches[0] : e;
                const rect = mini.getBoundingClientRect();
                dragging = true;
                startX = point.clientX;
                startY = point.clientY;
                baseX = rect.left;
                baseY = rect.top;
                mini.style.right = 'auto';
                mini.style.bottom = 'auto';
                mini.style.left = baseX + 'px';
                mini.style.top = baseY + 'px';
            };
            const move = (e) => {
                if (!dragging) return;
                const point = e.touches ? e.touches[0] : e;
                const nextX = clampNumber(baseX + point.clientX - startX, 8, window.innerWidth - mini.offsetWidth - 8);
                const nextY = clampNumber(baseY + point.clientY - startY, 8, window.innerHeight - mini.offsetHeight - 8);
                mini.style.left = nextX + 'px';
                mini.style.top = nextY + 'px';
                if (e.cancelable) e.preventDefault();
            };
            const up = () => {
                if (!dragging) return;
                dragging = false;
                const rect = mini.getBoundingClientRect();
                localStorage.setItem('falcon_mini_pos', JSON.stringify({ x: Math.round(rect.left), y: Math.round(rect.top) }));
            };
            mini.addEventListener('mousedown', down);
            mini.addEventListener('touchstart', down, { passive: true });
            window.addEventListener('mousemove', move);
            window.addEventListener('touchmove', move, { passive: false });
            window.addEventListener('mouseup', up);
            window.addEventListener('touchend', up, { passive: true });
        }

        function getClientX(e) {
            if (e.touches && e.touches[0]) return e.touches[0].clientX;
            if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].clientX;
            return e.clientX;
        }

        function seekFromClientX(trackEl, clientX) {
            if (!trackEl || !audio.duration) return;
            const r = trackEl.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
            audio.currentTime = ratio * audio.duration;
        }

        function startDrag(e) {
            const track = document.getElementById('progressTrack');
            if (!track) return;
            isDragging = true;
            activeDragTrack = track;
            track.classList.add('dragging');
            seekFromClientX(track, getClientX(e));
            if (e.cancelable) e.preventDefault();
        }

        function updateProgressFromEvent(e) {
            if (!isDragging || !activeDragTrack) return;
            seekFromClientX(activeDragTrack, getClientX(e));
            if (e.cancelable) e.preventDefault();
        }

        function endDrag() {
            isDragging = false;
            document.getElementById('progressTrack')?.classList.remove('dragging');
            document.getElementById('fsProgressTrack')?.classList.remove('dragging');
            activeDragTrack = null;
        }

        window.addEventListener('mousemove', (e) => { if (isDragging) updateProgressFromEvent(e); });
        window.addEventListener('touchmove', (e) => { if (isDragging) updateProgressFromEvent(e); }, { passive: false });
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);

        function updateQueueIndicators() {
            const count = Array.isArray(queue) ? queue.length : 0;
            if (queueCountBadge) {
                queueCountBadge.textContent = String(count);
                queueCountBadge.classList.toggle('hidden', count <= 0);
            }
            if (queueCountLabel) queueCountLabel.textContent = String(count);
            if (fsQueueBtn) fsQueueBtn.classList.toggle('active', queuePanelOpen);
        }

        function findSongInLibraryByFile(fileId) {
            const target = normalizeSongFile(fileId);
            if (!target) return null;
            for (const key in artists) {
                const artist = artists[key];
                const idx = artist.songs.findIndex((song) => normalizeSongFile(song.file) === target);
                if (idx >= 0) {
                    return {
                        artistKey: key,
                        artistName: artist.name,
                        index: idx,
                        song: artist.songs[idx]
                    };
                }
            }
            return null;
        }

        async function playSongByFile(fileId, manualSelection = true) {
            const found = findSongInLibraryByFile(fileId);
            if (!found) return false;
            currentArtistKey = found.artistKey;
            currentSongs = artists[found.artistKey].songs.slice();
            currentIndex = found.index;
            if (document.getElementById('songsList')) {
                try {
                    setSidebarActive(found.artistKey);
                } catch (e) {}
            }
            return (await playSong(found.index, manualSelection)) !== false;
        }

        function buildQueueSongPayload(song, fallbackArtistName = '') {
            if (!song) return null;
            const lib = findSongInLibraryByFile(song.file);
            const payload = normalizeSongForSorting({
                ...song,
                artistName: song.artistName || lib?.artistName || fallbackArtistName || ''
            }, 0, { scope: 'queue', artistName: song.artistName || lib?.artistName || fallbackArtistName || '' });
            delete payload.__baseIndex;
            delete payload.likedAt;
            delete payload.downloadedAt;
            return payload;
        }

        function enqueueSong(song, options = {}) {
            const opts = {
                playNext: false,
                toast: true,
                dedupe: false,
                ...options
            };
            const payload = buildQueueSongPayload(song, opts.artistName || '');
            if (!payload || !payload.file) return;
            if (opts.dedupe && queue.some((q) => normalizeSongFile(q.file) === normalizeSongFile(payload.file))) {
                if (opts.toast) showToast('Already in queue');
                return;
            }
            if (opts.playNext) queue.unshift(payload);
            else queue.push(payload);
            if (currentQueueSortType !== 'custom') queue = applySorting('queue', queue, currentQueueSortType);
            saveQueue();
            renderQueuePanel();
            scheduleSmartPreload('queue-change');
            if (opts.toast) showToast(opts.playNext ? 'Will play next' : 'Added to queue');
        }

        function addToQueue(index) {
            const song = currentSongs[index];
            if (!song) return;
            const artistKey = currentArtistKey || Object.keys(artists).find((k) => artists[k].songs === currentSongs);
            const artistName = artistKey ? getArtistDisplayNameByKey(artistKey) : '';
            enqueueSong({
                ...song,
                artistName
            }, {
                playNext: false,
                toast: true
            });
        }

        window.addSongToQueueByFile = (fileId, playNext = false) => {
            const found = findSongInLibraryByFile(fileId);
            if (!found) return;
            enqueueSong({
                ...found.song,
                artistName: found.artistName
            }, {
                playNext: !!playNext,
                toast: true
            });
        };

        function syncPlaybackModeUI() {
            const shuffleBtn = document.getElementById('shuffleBtn');
            const repeatBtn = document.getElementById('repeatBtn');
            const fsShuffle = document.getElementById('fsShuffle');
            const fsRepeat = document.getElementById('fsRepeat');
            if (shuffleBtn) shuffleBtn.classList.toggle('on', isShuffle);
            if (repeatBtn) repeatBtn.classList.toggle('on', isRepeat);
            if (shuffleBtn) shuffleBtn.setAttribute('aria-pressed', String(isShuffle));
            if (repeatBtn) repeatBtn.setAttribute('aria-pressed', String(isRepeat));
            if (fsShuffle) fsShuffle.classList.toggle('active', isShuffle);
            if (fsRepeat) fsRepeat.classList.toggle('active', isRepeat);
            audio.loop = !!isRepeat;
        }

        function toggleShuffle() { isShuffle=!isShuffle; syncPlaybackModeUI(); localStorage.setItem('eq_shuffle',String(isShuffle)); savePlaybackMemory(); showToast(isShuffle?'Shuffle on':'Shuffle off'); }
        function toggleRepeat() { isRepeat=!isRepeat; syncPlaybackModeUI(); localStorage.setItem('eq_repeat',String(isRepeat)); savePlaybackMemory(); }
        function toggleMute() { if(isMuted){audio.volume=prevVol;volumeSlider.value=prevVol;isMuted=false;}else{prevVol=audio.volume||1;audio.volume=0;volumeSlider.value=0;isMuted=true;} }
        function toggleQueuePanel() {
            queuePanelOpen = !queuePanelOpen;
            const panel = document.getElementById('queuePanel');
            const backdrop = document.getElementById('queueBackdrop');
            panel.classList.toggle('open', queuePanelOpen);
            document.getElementById('queueToggleBtn').classList.toggle('active', queuePanelOpen);
            document.getElementById('queueToggleBtn')?.setAttribute('aria-expanded', String(queuePanelOpen));
            panel?.setAttribute('aria-hidden', String(!queuePanelOpen));
            if (backdrop) {
                backdrop.classList.toggle('open', queuePanelOpen);
                backdrop.setAttribute('aria-hidden', String(!queuePanelOpen));
            }
            if (fsQueueBtn) fsQueueBtn.classList.toggle('active', queuePanelOpen);
            if (queuePanelOpen) {
                renderQueuePanel();
                setupQueuePanelInteractions();
                bindQueueSheetSwipe();
            } else {
                const panelStyle = panel?.style;
                if (panelStyle) panelStyle.transform = '';
            }
            updateQueueIndicators();
        }

        function closeQueuePanel() {
            if (!queuePanelOpen) return;
            toggleQueuePanel();
        }

        function bindQueueSheetSwipe() {
            const panel = document.getElementById('queuePanel');
            if (!panel || panel.dataset.sheetBound === '1') return;
            panel.dataset.sheetBound = '1';
            let swipeStartY = 0;
            let swipeActive = false;
            let currentTranslate = 0;
            const threshold = 96;
            const onTouchStart = (e) => {
                if (window.innerWidth > 768) return;
                if (!queuePanelOpen) return;
                if (!e.touches || e.touches.length !== 1) return;
                swipeStartY = e.touches[0].clientY;
                currentTranslate = 0;
                swipeActive = true;
            };
            const onTouchMove = (e) => {
                if (!swipeActive || !queuePanelOpen || !e.touches || e.touches.length !== 1) return;
                const deltaY = e.touches[0].clientY - swipeStartY;
                if (deltaY <= 0) return;
                e.preventDefault();
                currentTranslate = deltaY;
                panel.style.transition = 'none';
                panel.style.transform = `translateY(${deltaY}px)`;
            };
            const onTouchEnd = () => {
                if (!swipeActive) return;
                swipeActive = false;
                panel.style.transition = '';
                if (currentTranslate >= threshold || currentTranslate > panel.offsetHeight * 0.35) {
                    closeQueuePanel();
                } else {
                    panel.style.transform = '';
                }
            };
            panel.addEventListener('touchstart', onTouchStart, { passive: true });
            panel.addEventListener('touchmove', onTouchMove, { passive: false });
            panel.addEventListener('touchend', onTouchEnd, { passive: true });
            panel.addEventListener('touchcancel', onTouchEnd, { passive: true });
        }

        function renderQueuePanel() {
            const body = document.getElementById('queuePanelBody');
            if (!body) return;
            let html = '';
            if (currentSong) {
                html += `<div class="qp-section">Now Playing</div><div class="qp-item active"><img src="${escH(currentSong.poster)}" onerror="this.style.background='#282828'"><div class="qp-item-info"><div class="qp-item-title">${songTitleHTML(currentSong)}</div><div class="qp-item-artist">${escH(playerArtist.textContent)}</div></div></div>`;
            }
            if (queue.length > 0) {
                html += sortControlHTML('queue', currentQueueSortType, SORT_SECTION_OPTIONS.queue, 'Sort Queue');
                html += `<div class="qp-section" style="margin-top:7px">Up Next (${queue.length})</div>`;
                queue.forEach((song, i) => {
                    html += `<div class="qp-item" draggable="true" data-queue-index="${i}" data-file="${escH(song.file || '')}" onclick="playFromQueue(${i})"><span class="qp-item-drag" title="Drag to reorder" onclick="event.stopPropagation()">${uiIcon('grip-vertical')}</span><img src="${escH(song.poster)}" onerror="this.style.background='#282828'" loading="lazy"><div class="qp-item-info"><div class="qp-item-title">${songTitleHTML(song)}</div><div class="qp-item-artist">${escH(song.artistName || '')}</div></div><button class="qp-item-top" onclick="event.stopPropagation();moveQueueItemToTop(${i})" title="Move to top" aria-label="Move to top">${uiIcon('arrow-up-to-line')}</button><button class="qp-item-rm" onclick="event.stopPropagation();removeFromQueue(${i})" title="Remove" aria-label="Remove from queue">${uiIcon('x')}</button></div>`;
                });
            }
            if (currentSong && currentArtistKey && currentSongs.length > 1) {
                const nextList = currentSongs.slice(currentIndex + 1, currentIndex + 5);
                if (nextList.length > 0) {
                    html += `<div class="qp-section" style="margin-top:7px">Recommended Next</div>`;
                    nextList.forEach((song, i) => {
                        html += `<div class="qp-item" onclick="playSong(${currentIndex + 1 + i},true)"><img src="${escH(song.poster)}" onerror="this.style.background='#282828'"><div class="qp-item-info"><div class="qp-item-title">${songTitleHTML(song)}</div><div class="qp-item-artist">${escH(currentArtistKey ? getArtistDisplayNameByKey(currentArtistKey) : '')}</div></div></div>`;
                    });
                }
            }
            if (!currentSong && !queue.length) {
                html = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:50px 20px;color:var(--text2);gap:10px;font-size:.85rem"><div style="opacity:.3">${uiIcon('list-music')}</div><p>Your queue is empty</p></div>`;
            }
            const scrollTop = body.scrollTop;
            const template = document.createElement('template');
            template.innerHTML = html;
            body.replaceChildren(template.content);
            body.scrollTop = scrollTop;
            renderLucideIcons(body);
            updateSortUI('queue', currentQueueSortType);
            updateQueueIndicators();
        }

        function moveQueueItem(fromIndex, toIndex) {
            if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex)) return;
            if (fromIndex === toIndex) return;
            if (fromIndex < 0 || toIndex < 0 || fromIndex >= queue.length || toIndex >= queue.length) return;
            const [picked] = queue.splice(fromIndex, 1);
            queue.splice(toIndex, 0, picked);
            currentQueueSortType = 'custom';
            saveSortPreference('queue', currentQueueSortType);
            saveQueue();
            renderQueuePanel();
            scheduleSmartPreload('queue-change');
        }

        window.moveQueueItemToTop = (index) => {
            if (!Number.isInteger(index) || index <= 0 || index >= queue.length) return;
            moveQueueItem(index, 0);
            showToast('Moved to top');
        };

        function setupQueuePanelInteractions() {
            const body = document.getElementById('queuePanelBody');
            if (!body || body.dataset.bound === '1') return;
            body.dataset.bound = '1';
            let dragFromIndex = -1;

            body.addEventListener('dragstart', (e) => {
                const item = e.target instanceof Element ? e.target.closest('.qp-item[data-queue-index]') : null;
                if (!item) return;
                dragFromIndex = Number(item.getAttribute('data-queue-index'));
                item.classList.add('dragging');
                if (e.dataTransfer) {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', String(dragFromIndex));
                }
            });

            body.addEventListener('dragend', () => {
                dragFromIndex = -1;
                body.querySelectorAll('.qp-item.dragging,.qp-item.drag-over').forEach((el) => el.classList.remove('dragging', 'drag-over'));
            });

            body.addEventListener('dragover', (e) => {
                const overItem = e.target instanceof Element ? e.target.closest('.qp-item[data-queue-index]') : null;
                if (!overItem) return;
                e.preventDefault();
                body.querySelectorAll('.qp-item.drag-over').forEach((el) => {
                    if (el !== overItem) el.classList.remove('drag-over');
                });
                overItem.classList.add('drag-over');
            });

            body.addEventListener('drop', (e) => {
                const dropItem = e.target instanceof Element ? e.target.closest('.qp-item[data-queue-index]') : null;
                if (!dropItem) return;
                e.preventDefault();
                const toIndex = Number(dropItem.getAttribute('data-queue-index'));
                body.querySelectorAll('.qp-item.drag-over').forEach((el) => el.classList.remove('drag-over'));
                moveQueueItem(dragFromIndex, toIndex);
            });

            let pointerDrag = null;
            body.addEventListener('pointerdown', (e) => {
                if (!(e.target instanceof Element) || !e.target.closest('.qp-item-drag')) return;
                const item = e.target.closest('.qp-item[data-queue-index]');
                if (!item) return;
                pointerDrag = {
                    from: Number(item.getAttribute('data-queue-index')),
                    pointerId: e.pointerId
                };
                item.classList.add('dragging');
                item.setPointerCapture?.(e.pointerId);
                if (e.cancelable) e.preventDefault();
            });

            body.addEventListener('pointermove', (e) => {
                if (!pointerDrag) return;
                const target = document.elementFromPoint(e.clientX, e.clientY);
                const overItem = target instanceof Element ? target.closest('.qp-item[data-queue-index]') : null;
                body.querySelectorAll('.qp-item.drag-over').forEach((el) => {
                    if (el !== overItem) el.classList.remove('drag-over');
                });
                if (overItem) overItem.classList.add('drag-over');
                if (e.cancelable) e.preventDefault();
            });

            const finishPointerDrag = (e) => {
                if (!pointerDrag) return;
                const target = document.elementFromPoint(e.clientX || 0, e.clientY || 0);
                const overItem = target instanceof Element ? target.closest('.qp-item[data-queue-index]') : null;
                const to = overItem ? Number(overItem.getAttribute('data-queue-index')) : -1;
                body.querySelectorAll('.qp-item.dragging,.qp-item.drag-over').forEach((el) => el.classList.remove('dragging', 'drag-over'));
                if (Number.isInteger(to) && to >= 0) moveQueueItem(pointerDrag.from, to);
                pointerDrag = null;
            };
            body.addEventListener('pointerup', finishPointerDrag);
            body.addEventListener('pointercancel', finishPointerDrag);

            body.addEventListener('touchstart', (e) => {
                if (e.target instanceof Element && e.target.closest('.qp-item-drag')) return;
                const item = e.target instanceof Element ? e.target.closest('.qp-item[data-queue-index]') : null;
                if (!item || !e.touches || e.touches.length !== 1) return;
                queueSwipeState.target = item;
                queueSwipeState.startX = e.touches[0].clientX;
                queueSwipeState.startY = e.touches[0].clientY;
                queueSwipeState.lastX = queueSwipeState.startX;
                queueSwipeState.tracking = true;
                queueSwipeState.lockedAxis = '';
            }, {
                passive: true
            });

            body.addEventListener('touchmove', (e) => {
                if (!queueSwipeState.tracking || !queueSwipeState.target || !e.touches || !e.touches[0]) return;
                const dx = e.touches[0].clientX - queueSwipeState.startX;
                const dy = e.touches[0].clientY - queueSwipeState.startY;
                if (!queueSwipeState.lockedAxis) {
                    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
                    queueSwipeState.lockedAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
                }
                if (queueSwipeState.lockedAxis !== 'x') return;
                const translate = clampNumber(dx, -96, 96);
                queueSwipeState.target.classList.add('swiping');
                queueSwipeState.target.style.transform = `translateX(${translate}px)`;
                queueSwipeState.target.classList.toggle('queue-peek-left', translate < -34);
                queueSwipeState.target.classList.toggle('queue-peek-right', translate > 34);
                queueSwipeState.lastX = e.touches[0].clientX;
                if (e.cancelable) e.preventDefault();
            }, {
                passive: false
            });

            const finishTouch = () => {
                if (!queueSwipeState.tracking || !queueSwipeState.target) return;
                const item = queueSwipeState.target;
                const index = Number(item.getAttribute('data-queue-index'));
                const delta = queueSwipeState.lastX - queueSwipeState.startX;
                item.classList.remove('swiping', 'queue-peek-left', 'queue-peek-right');
                item.style.transform = '';
                queueSwipeState.target = null;
                queueSwipeState.tracking = false;
                queueSwipeState.lockedAxis = '';

                if (!Number.isInteger(index) || index < 0) return;
                if (delta <= -88) {
                    window.removeFromQueue(index);
                } else if (delta >= 88) {
                    playFromQueue(index);
                }
            };

            body.addEventListener('touchend', finishTouch, {
                passive: true
            });
            body.addEventListener('touchcancel', finishTouch, {
                passive: true
            });
        }

        window.playFromQueue = async(i) => {
            if (!queue[i]) return;
            const [song] = queue.splice(i, 1);
            saveQueue();
            const previousSongFile = currentSong ? currentSong.file : null;
            if (isRepeat && previousSongFile && previousSongFile !== song.file) {
                isRepeat = false;
                localStorage.setItem('eq_repeat', 'false');
            }
            const played = await playSongByFile(song.file, true);
            if (!played) {
                const artistName = song.artistName || playerArtist.textContent || '';
                const previousCurrent = currentSong ? currentSong.file : '';
                currentSong = song;
                trackSongPlay(song.file);
                song.playCount = songPlayCounts[song.file] || 0;
                song.liked = likedSongs.has(song.file);
                song.downloaded = isDownloaded(song.file);
                song.lastPlayed = Date.now();
                posterEl.src = song.poster;
                playerTitle.textContent = song.title;
                playerArtist.textContent = artistName;
                syncExplicitBadges(song);
                updatePlayerLikeBtn(song.file);
                updatePlayerDlBtn();
                updateAmbientFromSong(song);
                try {
                    const src = await getAudioSrc('songs/' + song.file);
                    setPrimaryAudioSource(src);
                    await audio.play();
                    setPlayButtonIcons(false);
                } catch (e) {
                    currentPlaybackSource = 'network';
                    updatePlayerDlBtn();
                    showToast(isDownloaded(song.file) ? 'Offline copy is unavailable' : 'This queued song is not available offline');
                    scheduleSmartPreload('queue-change');
                    return;
                }
                if (isRepeat && previousCurrent && previousCurrent !== song.file) {
                    isRepeat = false;
                    localStorage.setItem('eq_repeat', 'false');
                }
                updateNowPlayingIndicator();
                savePlaybackMemory();
            }
            renderQueuePanel();
            syncPlaybackModeUI();
            updateFullPlayerUI();
            updateNowPlayingIndicator();
            scheduleSmartPreload('queue-change');
        };

        window.removeFromQueue = (i) => {
            if (!Number.isInteger(i) || i < 0 || i >= queue.length) return;
            queue.splice(i, 1);
            saveQueue();
            renderQueuePanel();
            scheduleSmartPreload('queue-change');
            showToast('Removed from queue');
        };

        window.clearQueue = () => {
            queue = [];
            saveQueue();
            renderQueuePanel();
            scheduleSmartPreload('queue-change');
            showToast('Queue cleared');
        };

        function setupSongRowSwipeGestures() {
            const area = document.getElementById('mainArea');
            if (!area || area.dataset.swipeBound === '1') return;
            area.dataset.swipeBound = '1';
            const state = {
                row: null,
                startX: 0,
                startY: 0,
                lastX: 0,
                tracking: false,
                axis: ''
            };

            const resolveRowSongFile = (rowEl) => {
                if (!rowEl) return '';
                const fromData = rowEl.getAttribute('data-file');
                if (fromData) return fromData;
                const rowId = rowEl.id || '';
                if (rowId.startsWith('row_')) {
                    const idx = Number(rowId.slice(4));
                    const song = Number.isInteger(idx) ? currentSongs[idx] : null;
                    if (song?.file) return song.file;
                }
                return '';
            };

            const onStart = (e) => {
                if (!e.touches || e.touches.length !== 1) return;
                const target = e.target;
                if (!(target instanceof Element)) return;
                if (target.closest('button') || target.closest('a') || target.closest('input')) return;
                const row = target.closest('.song-row, .playlist-song-row, .fav-song-row');
                if (!row) return;
                state.row = row;
                state.startX = e.touches[0].clientX;
                state.startY = e.touches[0].clientY;
                state.lastX = state.startX;
                state.tracking = true;
                state.axis = '';
            };

            const onMove = (e) => {
                if (!state.tracking || !state.row || !e.touches || !e.touches[0]) return;
                const dx = e.touches[0].clientX - state.startX;
                const dy = e.touches[0].clientY - state.startY;
                if (!state.axis) {
                    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
                    state.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
                }
                if (state.axis !== 'x') {
                    state.tracking = false;
                    return;
                }
                const shift = clampNumber(dx, -96, 96);
                state.row.classList.add('swiping');
                state.row.style.transform = `translateX(${shift}px)`;
                state.row.classList.toggle('queue-peek-right', shift > 32);
                state.row.classList.toggle('queue-peek-left', shift < -32);
                state.lastX = e.touches[0].clientX;
                if (e.cancelable) e.preventDefault();
            };

            const finish = () => {
                if (!state.row) return;
                const row = state.row;
                const delta = state.lastX - state.startX;
                const fileId = resolveRowSongFile(row);
                row.classList.remove('swiping', 'queue-peek-right', 'queue-peek-left');
                row.style.transform = '';
                state.row = null;
                state.tracking = false;
                state.axis = '';
                if (!fileId) return;
                if (delta >= 88) {
                    window.addSongToQueueByFile(fileId, false);
                } else if (delta <= -88) {
                    toggleLike(fileId);
                    refreshVisibleSongLists();
                }
            };

            area.addEventListener('touchstart', onStart, {
                passive: true
            });
            area.addEventListener('touchmove', onMove, {
                passive: false
            });
            area.addEventListener('touchend', finish, {
                passive: true
            });
            area.addEventListener('touchcancel', finish, {
                passive: true
            });
            area.addEventListener('contextmenu', (e) => {
                const target = e.target;
                if (!(target instanceof Element)) return;
                const row = target.closest('.song-row, .playlist-song-row, .fav-song-row');
                if (!row) return;
                if (target.closest('.song-more-btn, .ps-icon-btn, .fav-icon-btn')) return;
                e.preventDefault();
            });
        }

        
        function toggleLike(fileId,rowIndex) {
            if (likedSongs.has(fileId)) {
                likedSongs.delete(fileId);
                delete likedSongMeta[fileId];
            } else {
                likedSongs.add(fileId);
                likedSongMeta[fileId] = Date.now();
            }
            saveLiked();
            if (rowIndex !== undefined) refreshSongRows();
            updatePlayerLikeBtn(fileId);
            if (currentSong) updateFullPlayerUI();
        }
        window.togglePlayerLike = () => {
            if(!currentSong) return;
            toggleLike(currentSong.file);
            if (currentPlaylistId && document.getElementById('playlistSongsList')) renderPlaylistSongs(currentPlaylistId, false);
            if (document.getElementById('favSongsList')) refreshLikedDisplay();
        }
        function updatePlayerLikeBtn(f) { const btn=document.getElementById('playerLikeBtn'); setElementIcon(btn, likedSongs.has(f)?'heart':'heart-off'); btn.classList.toggle('liked',likedSongs.has(f)); }

        function showLikedSongs() { setNavActive('navFav'); setMobileBack(true); refreshLikedDisplay(); }

        function getFavSortLabel(type) {
            return getSortLabel(type);
        }

        function getLikedSongsBase() {
            const liked = [];
            let baseIndex = 0;
            for (const key in artists) {
                const artist = artists[key];
                artist.songs.forEach((song) => {
                    if (likedSongs.has(song.file)) {
                        liked.push({
                            ...song,
                            artistName: artist.name,
                            artist: artist.name,
                            artistKey: key,
                            addedAt: Number.isFinite(likedSongMeta[song.file]) ? likedSongMeta[song.file] : 0,
                            likedAt: Number.isFinite(likedSongMeta[song.file]) ? likedSongMeta[song.file] : 0,
                            liked: true,
                            downloaded: isDownloaded(song.file),
                            playCount: songPlayCounts[song.file] || 0,
                            __baseIndex: baseIndex
                        });
                    }
                    baseIndex++;
                });
            }
            return liked;
        }

        function getSortedLikedSongs(type = currentFavSortType) {
            return applySorting('liked', getLikedSongsBase(), type);
        }

        function updateFavSortUI() {
            updateSortUI('liked', currentFavSortType);
        }

        function favSongRowHTML(song, i, compact = true) {
            const playing = currentSong && currentSong.file === song.file && !audio.paused;
            const liked = likedSongs.has(song.file);
            if (!compact) {
                return `<div class="song-row${playing ? ' playing' : ''}" data-liked-row="1" data-file="${escH(song.file)}" onclick="playLikedSong(${i})"><div class="song-num">${playing ? '<div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>' : i + 1}</div><div class="song-row-info"><img src="${escH(song.poster)}" onerror="this.style.background='#282828'" loading="lazy"><div class="song-row-text"><h4>${songTitleHTML(song)}</h4><p>${escH(song.artistName || song.artist || '')}</p></div></div><div class="song-actions"><button class="like-btn${liked ? ' liked' : ''}" onclick="event.stopPropagation();toggleLikeFav('${escA(song.file)}')" title="${liked ? 'Unlike' : 'Like'}">${liked ? uiIcon('heart') : uiIcon('heart-off')}</button><button class="song-more-btn" onclick="event.stopPropagation();showSongRowActionsMenu(event,'${escA(song.file)}')" title="More options">${uiIcon('more-horizontal')}</button></div></div>`;
            }
            return `<div class="fav-song-row${playing ? ' playing' : ''}" data-liked-row="1" data-file="${escH(song.file)}" onclick="playLikedSong(${i})"><div class="fav-song-num">${playing ? '<div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>' : i + 1}</div><div class="fav-song-info"><img src="${escH(song.poster)}" onerror="this.style.background='#282828'" loading="lazy"><div class="fav-song-text"><h4>${songTitleHTML(song)}</h4><p>${escH(song.artistName || song.artist || '')}</p></div></div><div class="fav-song-actions"><button class="fav-icon-btn${liked ? ' liked' : ''}" title="${liked ? 'Unlike' : 'Like'}" onclick="event.stopPropagation();toggleLikeFav('${escA(song.file)}')">${liked ? uiIcon('heart') : uiIcon('heart-off')}</button><button class="fav-icon-btn" title="More options" onclick="event.stopPropagation();showSongRowActionsMenu(event,'${escA(song.file)}')">${uiIcon('more-horizontal')}</button></div></div>`;
        }

        function updateFavoritesPlayingState(autoScrollActive = false) {
            const list = document.getElementById('favSongsList');
            if (!list || !Array.isArray(window.__likedList)) return;
            const rows = list.querySelectorAll('[data-liked-row]');
            rows.forEach((row, i) => {
                const song = window.__likedList[i];
                const isPlaying = !!(song && currentSong && currentSong.file === song.file && !audio.paused);
                row.classList.toggle('playing', isPlaying);
                const num = row.querySelector('.fav-song-num, .song-num');
                if (!num) return;
                if (isPlaying) {
                    num.innerHTML = '<div class="eq-bars"><div class="eq-bar"></div><div class="eq-bar"></div><div class="eq-bar"></div></div>';
                } else {
                    num.textContent = String(i + 1);
                }
            });
        }

        function syncFavoritesPlaybackSource() {
            if (!Array.isArray(window.__likedList) || !window.__likedList.length || !currentSong) return;
            const idx = window.__likedList.findIndex((song) => song.file === currentSong.file);
            if (idx < 0) return;
            currentSongs = window.__likedList.map((song) => ({ ...song }));
            currentArtistKey = null;
            currentIndex = idx;
            currentSong = currentSongs[idx];
        }

        function closeFavSortSheet() {
            closeSortSheet('liked');
        }

        window.closeFavSortSheet = closeFavSortSheet;
        window.closeFavSortSheetOnOverlay = (e) => {
            if (e.target && e.target.dataset?.sortSheet === 'liked') closeFavSortSheet();
        };

        window.toggleFavSortSheet = () => {
            toggleSortSheet('liked');
        };

        function renderMobileLikedSongList(autoScrollActive = false) {
            const list = document.getElementById('favSongsList');
            if (!list) return;
            const compact = list.dataset.compact === '1';
            window.__likedList = getSortedLikedSongs(currentFavSortType);
            renderSortedList(list, window.__likedList.map((song, i) => favSongRowHTML(song, i, compact)).join(''), compact ? '.fav-song-row' : '.song-row', () => {
                renderLucideIcons(list);
                updateFavSortUI();
                updateFavoritesPlayingState(autoScrollActive);
            });
        }

        window.setFavSort = (type) => {
            setSortForScope('liked', type);
        };

        function refreshLikedDisplay() {
            const likedBase = getLikedSongsBase();
            const likedCount = likedBase.length;
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            const mainArea = document.getElementById('mainArea');
            if (isMobile) {
                const cover = likedBase[0]?.poster || '';
                mainArea.innerHTML = `
                <div class="fav-mobile-shell">
                    <div class="fav-mobile-header">
                        <div class="fav-mobile-cover">${cover ? `<img src="${escH(cover)}" onerror="this.style.background='#282828'" loading="lazy">` : uiIcon('heart')}</div>
                        <div class="fav-mobile-meta">
                            <div class="fav-mobile-kicker">Collection</div>
                            <div class="fav-mobile-title">Liked Songs</div>
                            <div class="fav-mobile-sub">${likedCount} song${likedCount !== 1 ? 's' : ''} • Personal Mix</div>
                        </div>
                    </div>
                    ${likedCount ? sortControlHTML('liked', currentFavSortType, SORT_SECTION_OPTIONS.liked, 'Sort Liked Songs') : ''}
                    <div class="fav-song-list">
                        ${likedCount ? '<div class="fav-song-header"><span>#</span><span>Title</span><span></span></div><div id="favSongsList" class="sort-song-list" data-compact="1"></div>' : `<div class="empty-state" style="padding:40px 0"><div class="emoji">${uiIcon('list-music')}</div><p>No favorites yet.</p></div>`}
                    </div>
                </div>`;
                renderLucideIcons(mainArea);
                if (likedCount) {
                    renderMobileLikedSongList(true);
                    syncFavoritesPlaybackSource();
                }
                return;
            }
            const html = `
            <div class="main-topbar"><div class="nav-arrows"><button class="nav-arrow-btn" onclick="loadArtists()">${uiIcon('chevron-left')}</button></div><div style="flex:1"><div style="font-size:1.2rem;font-weight:800">Favorites</div><div style="font-size:.72rem;color:var(--text2)">${likedCount} liked songs</div></div><div class="topbar-actions"><button class="topbar-menu-btn" onclick="openMobileDrawer()" title="Menu">${uiIcon('menu')}</button></div></div>
            <div class="songs-section" style="padding-top:20px">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:12px;flex-wrap:wrap">
                    <div class="fav-section-label" style="display:inline-flex;align-items:center;gap:6px">${uiIcon('heart')}<span>Liked Songs</span></div>
                </div>
                ${likedCount===0?`<div class="empty-state"><div class="emoji">${uiIcon('list-music')}</div><p>No favorites yet.</p></div>`:`${sortControlHTML('liked', currentFavSortType, SORT_SECTION_OPTIONS.liked, 'Sort Liked Songs')}<div class="songs-table-header"><span class="th">#</span><span class="th">Title</span><span class="th"></span></div><div id="favSongsList" class="sort-song-list" data-compact="0"></div>`}
            </div>`;
            mainArea.innerHTML = html;
            renderLucideIcons(mainArea);
            if (likedCount) {
                renderMobileLikedSongList(true);
                syncFavoritesPlaybackSource();
            }
        }

        window.playLikedSong = (i) => {
            const s = window.__likedList?.[i];
            if (!s) return;
            currentSongs = window.__likedList.map((song) => ({ ...song }));
            currentArtistKey = null;
            currentIndex = i;
            playSong(i, true);
            if (document.getElementById('favSongsList')) updateFavoritesPlayingState(true);
        };
        window.toggleLikeFav = (fileId) => {
            toggleLike(fileId);
            refreshLikedDisplay();
        };
        window.toggleFavDownload = async(btn, fileId) => {
            await handleDlBtn(btn, fileId);
            if (document.getElementById('favSongsList')) refreshLikedDisplay();
        };
        window.refreshLikedDisplay = refreshLikedDisplay;

        
        let searchIndexCache = null;
        const SEARCH_RESULT_LIMITS = { songs: 30, artists: 12, albums: 12, playlists: 12, genres: 12 };

        function normalizeSearchText(value) {
            return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[_\-]+/g, ' ').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
        }

        function searchTokens(query) {
            return normalizeSearchText(query).split(' ').filter(Boolean);
        }

        function boundedEditDistance(a, b, limit) {
            if (!a || !b) return Math.max(a.length, b.length);
            if (Math.abs(a.length - b.length) > limit) return limit + 1;
            let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
            for (let i = 1; i <= a.length; i++) {
                const curr = [i];
                let rowMin = curr[0];
                for (let j = 1; j <= b.length; j++) {
                    const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                    curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
                    rowMin = Math.min(rowMin, curr[j]);
                }
                if (rowMin > limit) return limit + 1;
                prev = curr;
            }
            return prev[b.length];
        }

        function searchMatchScore(fields, query) {
            const q = normalizeSearchText(query);
            if (!q) return null;
            const tokens = searchTokens(query);
            let best = null;
            fields.map(normalizeSearchText).filter(Boolean).forEach((field) => {
                if (field === q) best = best === null ? 0 : Math.min(best, 0);
                else if (field.startsWith(q)) best = best === null ? 1 : Math.min(best, 1);
                else if (field.includes(q) || tokens.every((token) => field.includes(token))) best = best === null ? 2 : Math.min(best, 2);
                else {
                    const limit = q.length < 5 ? 1 : q.length < 9 ? 2 : 3;
                    const fieldWords = field.split(' ');
                    const fuzzy = boundedEditDistance(field, q, limit) <= limit || tokens.every((token) => fieldWords.some((word) => boundedEditDistance(word, token, token.length < 5 ? 1 : 2) <= (token.length < 5 ? 1 : 2)));
                    if (fuzzy) best = best === null ? 3 : Math.min(best, 3);
                }
            });
            return best;
        }

        function highlightedText(value, query) {
            const text = String(value || '');
            const tokens = [...new Set(searchTokens(query))].filter((token) => token.length > 0).sort((a, b) => b.length - a.length);
            if (!tokens.length) return escH(text);
            const pattern = new RegExp(tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'gi');
            let html = '';
            let last = 0;
            text.replace(pattern, (match, offset) => {
                html += escH(text.slice(last, offset));
                html += `<span class="search-highlight">${escH(match)}</span>`;
                last = offset + match.length;
                return match;
            });
            return html + escH(text.slice(last));
        }

        function getSearchIndex() {
            if (searchIndexCache) return searchIndexCache;
            const songs = [];
            const artistResults = [];
            const albumMap = new Map();
            const genreMap = new Map();
            getArtistCatalogEntries().forEach((artist) => {
                const key = artist.key;
                artistResults.push({ type: 'artist', key, name: artist.name, image: artist.image, songCount: artist.songs.length, fields: [artist.name, artist.originalName].filter(Boolean) });
                artist.songs.forEach((song, index) => {
                    const album = deriveSongAlbum(song, artist.name);
                    const genre = String(song.genre || '').trim();
                    const normalizedSong = normalizeSongForSorting({ ...song, artistName: artist.name, artist: artist.name, artistKey: key, album, genre }, index, { scope: 'search', artistName: artist.name });
                    songs.push({ type: 'song', key, index, song: normalizedSong, artistName: artist.name, album, genre, fields: [song.title, artist.name, album, genre] });
                    const albumKey = `${normalizeSearchText(album)}|${normalizeSearchText(artist.name)}`;
                    if (!albumMap.has(albumKey)) albumMap.set(albumKey, { type: 'album', id: albumKey, name: album, artistName: artist.name, image: song.poster, songs: [], fields: [album, artist.name] });
                    albumMap.get(albumKey).songs.push({ ...normalizedSong, index });
                    if (genre) {
                        const genreKey = normalizeSearchText(genre);
                        if (!genreMap.has(genreKey)) genreMap.set(genreKey, { type: 'genre', id: genreKey, name: genre, songs: [], fields: [genre] });
                        genreMap.get(genreKey).songs.push({ ...normalizedSong, index });
                    }
                });
            });
            searchIndexCache = { songs, artists: artistResults, albums: [...albumMap.values()], genres: [...genreMap.values()] };
            return searchIndexCache;
        }

        function rankedSearchResults(items, query) {
            return items.map((item, order) => ({ ...item, score: searchMatchScore(item.fields, query), order }))
                .filter((item) => item.score !== null)
                .sort((a, b) => a.score - b.score || compareText(a.name || a.song?.title || '', b.name || b.song?.title || '') || a.order - b.order);
        }

        function playlistSearchResults(query) {
            return Object.keys(playlists).map((id, order) => {
                const pl = playlists[id];
                const songs = Array.isArray(pl?.songs) ? pl.songs : [];
                return { type: 'playlist', id, name: pl?.name || 'Playlist', songs, image: songs[0]?.poster || '', fields: [pl?.name || '', ...songs.slice(0, 8).map((song) => song.title || '')], order };
            }).map((item) => ({ ...item, score: searchMatchScore(item.fields, query) }))
                .filter((item) => item.score !== null)
                .sort((a, b) => a.score - b.score || compareText(a.name, b.name) || a.order - b.order);
        }

        function searchSongRowHTML(result, i, query) {
            const song = result.song;
            const liked = likedSongs.has(song.file);
            return `<div class="song-row" data-file="${escH(song.file)}" onclick="playSongByFile('${escA(song.file)}')"><div class="song-num">${i + 1}</div><div class="song-row-info"><img src="${escH(song.poster)}" onerror="this.style.background='#282828'" loading="lazy"><div class="song-row-text"><h4>${highlightedText(song.title, query)}</h4><p>${highlightedText(result.artistName, query)}${result.album ? ` • ${highlightedText(result.album, query)}` : ''}${result.genre ? ` • ${highlightedText(result.genre, query)}` : ''}</p></div></div><div class="song-actions"><button class="like-btn${liked ? ' liked' : ''}" onclick="event.stopPropagation();toggleLike('${escA(song.file)}')" title="${liked ? 'Unlike' : 'Like'}">${liked ? uiIcon('heart') : uiIcon('heart-off')}</button><button class="song-more-btn" onclick="event.stopPropagation();showSongRowActionsMenu(event,'${escA(song.file)}')" title="More options">${uiIcon('more-horizontal')}</button></div></div>`;
        }

        function searchArtistCardHTML(result, query) {
            return `<div class="artist-card" onclick="openArtist('${escA(result.key)}')"><div class="artist-card-img-wrap"><img src="${escH(result.image)}" onerror="this.style.background='#282828'" loading="lazy"><button class="card-play-btn" onclick="event.stopPropagation();playArtist('${escA(result.key)}')">${uiIcon('play')}</button></div><div class="artist-card-name">${highlightedText(result.name, query)}</div><div class="artist-card-count">${result.songCount} songs</div></div>`;
        }

        function searchAlbumCardHTML(result, query) {
            const firstSong = result.songs[0];
            return `<div class="artist-card" onclick="playSongByFile('${escA(firstSong.file)}')"><div class="artist-card-img-wrap"><img src="${escH(result.image)}" onerror="this.style.background='#282828'" loading="lazy"><button class="card-play-btn" onclick="event.stopPropagation();playSongByFile('${escA(firstSong.file)}')">${uiIcon('play')}</button></div><div class="artist-card-name">${highlightedText(result.name, query)}</div><div class="artist-card-count">${highlightedText(result.artistName, query)} • ${result.songs.length} tracks</div></div>`;
        }

        function searchPlaylistCardHTML(result, query) {
            const covers = result.songs.slice(0, 4).map((song) => song.poster);
            while (covers.length < 4) covers.push(null);
            return `<div class="playlist-card" onclick="openPlaylist('${escA(result.id)}')"><div class="playlist-card-cover">${covers.map((cover) => cover ? `<img src="${escH(cover)}" onerror="this.parentElement.style.background='var(--surface3)'">` : `<div class="cover-ph">${uiIcon('music-2')}</div>`).join('')}</div><div class="playlist-card-name">${highlightedText(result.name, query)}</div><div class="playlist-card-count">${result.songs.length} song${result.songs.length !== 1 ? 's' : ''}</div>${result.songs.length ? `<button class="playlist-card-play" onclick="event.stopPropagation();playPlaylistById('${escA(result.id)}')">${uiIcon('play')}</button>` : ''}</div>`;
        }

        function searchGenreCardHTML(result, query) {
            const firstSong = result.songs[0];
            return `<div class="artist-card" onclick="playSongByFile('${escA(firstSong.file)}')"><div class="artist-card-img-wrap"><img src="${escH(firstSong.poster)}" onerror="this.style.background='#282828'" loading="lazy"><button class="card-play-btn" onclick="event.stopPropagation();playSongByFile('${escA(firstSong.file)}')">${uiIcon('play')}</button></div><div class="artist-card-name">${highlightedText(result.name, query)}</div><div class="artist-card-count">${result.songs.length} tracks</div></div>`;
        }

        function searchSectionHTML(title, count, content, gridClass = '') {
            if (!count) return '';
            return `<div style="padding:20px 24px 0"><div class="section-title" style="margin-bottom:14px">${title}</div>${gridClass ? `<div class="${gridClass}" style="padding:0">${content}</div>` : content}</div>`;
        }

        
        function globalSearch() {
            const searchEl = document.getElementById('searchBar') || document.getElementById('desktopSearchBar'); if(!searchEl)return;
            const rawQuery = searchEl.value || '';
            const q = normalizeSearchText(rawQuery);
            const clr = document.getElementById('searchClear'); if(clr)clr.classList.toggle('visible',q.length>0);
            syncDesktopSearchValue(rawQuery);
            if(!q){syncDesktopSearchValue('');loadArtists();return;}
            setMobileBack(false);
            const index = getSearchIndex();
            const songResults = rankedSearchResults(index.songs, q).slice(0, SEARCH_RESULT_LIMITS.songs);
            const artistResults = rankedSearchResults(index.artists, q).slice(0, SEARCH_RESULT_LIMITS.artists);
            const albumResults = rankedSearchResults(index.albums, q).slice(0, SEARCH_RESULT_LIMITS.albums);
            const playlistResults = playlistSearchResults(q).slice(0, SEARCH_RESULT_LIMITS.playlists);
            const genreResults = rankedSearchResults(index.genres, q).slice(0, SEARCH_RESULT_LIMITS.genres);
            const total = songResults.length + artistResults.length + albumResults.length + playlistResults.length + genreResults.length;
            const mainArea = document.getElementById('mainArea');
            const topbarHTML = `<div class="main-topbar"><div class="nav-arrows"><button class="nav-arrow-btn" onclick="loadArtists()">${uiIcon('chevron-left')}</button></div><div class="search-box"><span class="search-icon">${uiIcon('search')}</span><input type="text" id="searchBar" value="${escH(rawQuery)}" placeholder="Search songs, artists, albums, playlists…" oninput="globalSearch()"><button class="search-clear visible" id="searchClear" onclick="clearSearch()">${uiIcon('x')}</button></div><div class="topbar-actions"><button class="topbar-menu-btn" onclick="openMobileDrawer()" title="Menu">${uiIcon('menu')}</button></div></div>`;
            mainArea.innerHTML = topbarHTML +
                searchSectionHTML('Songs', songResults.length, `<div class="songs-section" style="padding:0">${songResults.map((result, i) => searchSongRowHTML(result, i, rawQuery)).join('')}</div>`) +
                searchSectionHTML('Artists', artistResults.length, artistResults.map((result) => searchArtistCardHTML(result, rawQuery)).join(''), 'artists-grid') +
                searchSectionHTML('Albums', albumResults.length, albumResults.map((result) => searchAlbumCardHTML(result, rawQuery)).join(''), 'artists-grid') +
                searchSectionHTML('Playlists', playlistResults.length, playlistResults.map((result) => searchPlaylistCardHTML(result, rawQuery)).join(''), 'playlist-grid') +
                searchSectionHTML('Genres', genreResults.length, genreResults.map((result) => searchGenreCardHTML(result, rawQuery)).join(''), 'artists-grid') +
                (!total ? `<div class="empty-state"><div class="emoji">${uiIcon('search')}</div><p>No results found</p></div>` : '<div style="height:20px"></div>');
            renderLucideIcons(mainArea);
            const newInp = document.getElementById('searchBar'); if(newInp){newInp.focus();newInp.setSelectionRange(newInp.value.length,newInp.value.length);} initSearchClear();
            syncDesktopSearchValue(rawQuery);
        }

        function openArtistAndPlay(key,index) { const file=artists[key]?.songs?.[index]?.file || ''; currentArtistKey=key; openArtist(key); const sortedIndex=currentSongs.findIndex((song)=>song.file===file); playSong(sortedIndex>=0?sortedIndex:0,true); }

    
        const queueCountBadge = document.getElementById('queueCountBadge');
        const queueCountLabel = document.getElementById('queueCountLabel');
        const fsQueueBtn = document.getElementById('fsQueueBtn');
        const mobileDrawer = document.getElementById('mobileDrawer');
        const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
        const fsVisualizerCanvas = document.getElementById('fsVisualizer');

        const fullscreenPlayer = document.getElementById('fullscreenPlayer');
        const fsSheet = document.getElementById('fsSheet');
        const fsPoster = document.getElementById('fsPoster');
        const fsPosterGlow = document.getElementById('fsPosterGlow');
        const fsBackdrop = document.getElementById('fsBackdrop');
        const fsTitle = document.getElementById('fsTitle');
        const fsArtist = document.getElementById('fsArtist');
        const fsHeaderSong = document.getElementById('fsHeaderSong');
        const fsHeaderArtist = document.getElementById('fsHeaderArtist');
        const fsPlay = document.getElementById('fsPlay');
        const fsLikeBtn = document.getElementById('fsLikeBtn');
        const fsShuffle = document.getElementById('fsShuffle');
        const fsRepeat = document.getElementById('fsRepeat');
        const fsLyricsToggle = document.getElementById('fsLyricsToggle');
        const fsLyricsPanel = document.getElementById('fsLyricsPanel');
        const fsLyricsList = document.getElementById('fsLyricsList');
        const fsLyricsScroll = document.getElementById('fsLyricsScroll');
        const fsLyricTimestamp = document.getElementById('fsLyricTimestamp');
        const lyricsToggleBtn = document.getElementById('lyricsToggleBtn');
        const lyricsPanel = document.getElementById('lyricsPanel');
        const lyricsPanelBackdrop = document.getElementById('lyricsPanelBackdrop');
        const lyricsPanelBody = document.getElementById('lyricsPanelBody');
        const lyricsPanelSong = document.getElementById('lyricsPanelSong');
        const lyricsPanelArtist = document.getElementById('lyricsPanelArtist');
        const lyricsFollowBtn = document.getElementById('lyricsFollowBtn');
        const syncedLyricsCatalog = Object.create(null);
        const lrclibLyricsRequests = new Map();
        const ambientPaletteCache = new Map();
        const LYRICS_CACHE_KEY = 'falcon_lrclib_cache_v2';
        const MAX_LYRICS_CACHE_ENTRIES = 80;
        let lyricsCacheStore = {};

        let fullPlayerOpen = false;
        let fullPlayerCloseTimer = null;
        let fullPlayerSongToken = '';
        let fullPlayerLyricsRequestToken = '';
        let fullPlayerLyrics = [];
        let lyricLineEls = [];
        let activeLyricIndex = -1;
        let fullPlayerLyricsOpen = localStorage.getItem('eq_fs_lyrics_open') !== 'false';
        let lyricsPanelOpen = localStorage.getItem('eq_lyrics_panel_open') === 'true';
        let lyricsPanelFollow = localStorage.getItem('eq_lyrics_follow') !== 'false';
        let lyricsPanelLines = [];
        let lyricsPanelTimed = false;
        let lyricsPanelLineEls = [];
        let lyricsPanelActiveIndex = -1;
        let lyricsPanelRequestToken = '';
        let lyricsPanelManualUntil = 0;
        let lyricsPanelAutoWriteAt = 0;
        let lyricAutoFrame = 0;
        let lyricManualPauseUntil = 0;
        let lyricLastAutoWriteAt = 0;
        let lyricMeasureFrame = 0;
        let currentAmbientToken = '';
        let ambientCssPrimary = '200, 245, 66';
        let ambientCssSecondary = '78, 156, 255';
        let visualizerCtx = null;
        let visualizerAnalyser = null;
        let visualizerSource = null;
        let visualizerFreqData = null;
        let visualizerWaveData = null;
        let visualizerFrame = 0;
        let visualizerReady = false;
        const fullPlayerSwipe = {
            tracking: false,
            startY: 0,
            deltaY: 0
        };
        const queueSwipeState = {
            target: null,
            startX: 0,
            startY: 0,
            lastX: 0,
            tracking: false,
            lockedAxis: ''
        };

        function clampNumber(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }

        function debounce(fn, wait = 120) {
            let timer = 0;
            return (...args) => {
                clearTimeout(timer);
                timer = setTimeout(() => fn(...args), wait);
            };
        }

        function getMusicEnergy() {
            if (!visualizerReady || !visualizerAnalyser || !visualizerFreqData || audio.paused) return .08;
            try {
                visualizerAnalyser.getByteFrequencyData(visualizerFreqData);
                let sum = 0;
                const limit = Math.min(32, visualizerFreqData.length);
                for (let i = 0; i < limit; i++) sum += visualizerFreqData[i] || 0;
                return clampNumber((sum / Math.max(1, limit)) / 255, .08, .92);
            } catch (e) {
                return .08;
            }
        }

        function initAmbientParticles() {
            const canvas = document.getElementById('ambientParticles');
            if (!canvas || canvas.dataset.bound === '1') return;
            canvas.dataset.bound = '1';
            const ctx = canvas.getContext('2d', { alpha: true });
            if (!ctx) return;
            const lowPower = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
            const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || lowPower;
            const count = reduce ? 18 : (window.innerWidth < 760 ? 28 : 48);
            const particles = Array.from({ length: count }, () => ({
                x: Math.random(),
                y: Math.random(),
                r: 1.2 + Math.random() * 3.8,
                vx: -.00018 + Math.random() * .00036,
                vy: -.00016 + Math.random() * .00032,
                a: .14 + Math.random() * .28
            }));
            let frame = 0;
            let last = 0;
            const resize = () => {
                const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
                canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
                canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
                canvas.style.width = window.innerWidth + 'px';
                canvas.style.height = window.innerHeight + 'px';
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            };
            const draw = (now) => {
                frame = 0;
                if (document.hidden || reduce) {
                    document.body.classList.toggle('effects-paused', document.hidden);
                    return;
                }
                if (now - last < 50) {
                    frame = requestAnimationFrame(draw);
                    return;
                }
                last = now;
                const w = window.innerWidth;
                const h = window.innerHeight;
                const energy = getMusicEnergy();
                ctx.clearRect(0, 0, w, h);
                particles.forEach((p, i) => {
                    p.x = (p.x + p.vx * (1 + energy * 2.2) + 1) % 1;
                    p.y = (p.y + p.vy * (1 + energy * 1.6) + 1) % 1;
                    const rr = p.r * (1 + energy * .9);
                    const grad = ctx.createRadialGradient(p.x * w, p.y * h, 0, p.x * w, p.y * h, rr * 8);
                    const color = i % 3 === 0 ? ambientCssPrimary : (i % 3 === 1 ? ambientCssSecondary : '164, 95, 255');
                    grad.addColorStop(0, `rgba(${color}, ${p.a + energy * .2})`);
                    grad.addColorStop(1, `rgba(${color}, 0)`);
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(p.x * w, p.y * h, rr * 8, 0, Math.PI * 2);
                    ctx.fill();
                });
                frame = requestAnimationFrame(draw);
            };
            window.addEventListener('resize', debounce(resize, 180), { passive: true });
            document.addEventListener('visibilitychange', () => {
                document.body.classList.toggle('effects-paused', document.hidden);
                if (!document.hidden && !frame && !reduce) frame = requestAnimationFrame(draw);
            });
            resize();
            if (!reduce) frame = requestAnimationFrame(draw);
        }

        const shortcutItems = [
            ['Space', 'Play / Pause'],
            ['Left', 'Previous'],
            ['Right', 'Next'],
            ['Up', 'Volume +'],
            ['Down', 'Volume -'],
            ['Ctrl L', 'Focus Search'],
            ['Ctrl K', 'Command Palette'],
            ['Ctrl F', 'Search'],
            ['M', 'Mute'],
            ['S', 'Shuffle'],
            ['R', 'Repeat'],
            ['Q', 'Queue'],
            ['Esc', 'Close'],
            ['?', 'Shortcuts']
        ];

        function renderShortcutHelp() {
            const grid = document.getElementById('shortcutGrid');
            if (!grid || grid.dataset.rendered === '1') return;
            grid.dataset.rendered = '1';
            grid.innerHTML = shortcutItems.map(([key, label]) => `<div class="shortcut-row"><span>${escH(label)}</span><kbd>${escH(key)}</kbd></div>`).join('');
            renderLucideIcons(document.getElementById('shortcutOverlay'));
        }

        window.openShortcutHelp = () => {
            renderShortcutHelp();
            const overlay = document.getElementById('shortcutOverlay');
            if (!overlay) return;
            overlay.classList.add('open');
            overlay.setAttribute('aria-hidden', 'false');
        };

        window.closeShortcutHelp = (e) => {
            const overlay = document.getElementById('shortcutOverlay');
            if (!overlay) return;
            if (e && e.target !== overlay && !(e.target instanceof Element && e.target.closest('.shortcut-close'))) return;
            overlay.classList.remove('open');
            overlay.setAttribute('aria-hidden', 'true');
        };

        function focusSearchInput() {
            let input = document.querySelector('.search-box input');
            if (!input) {
                loadArtists();
                input = document.querySelector('.search-box input');
            }
            if (input) {
                input.focus();
                input.select?.();
            }
        }

        function closeTransientSurfaces() {
            closeDropdown();
            window.closeModal?.();
            window.closeLyricsPanel?.();
            window.closeFullPlayer?.();
            window.closeMobileDrawer?.();
            document.getElementById('shortcutOverlay')?.classList.remove('open');
            if (queuePanelOpen) toggleQueuePanel();
        }

        function initKeyboardShortcuts() {
            if (document.body.dataset.shortcutsBound === '1') return;
            document.body.dataset.shortcutsBound = '1';
            document.addEventListener('keydown', (e) => {
                const target = e.target instanceof Element ? e.target : null;
                const typing = target && target.closest('input, textarea, select, [contenteditable="true"]');
                const key = e.key;
                if (key === 'Escape') {
                    closeTransientSurfaces();
                    return;
                }
                if (typing && !(e.ctrlKey || e.metaKey)) return;
                if ((e.ctrlKey || e.metaKey) && (key.toLowerCase() === 'l' || key.toLowerCase() === 'f')) {
                    e.preventDefault();
                    focusSearchInput();
                    return;
                }
                if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === 'k') {
                    e.preventDefault();
                    openShortcutHelp();
                    showToast('Command palette ready');
                    return;
                }
                if (key === '?' || (e.shiftKey && key === '/')) {
                    e.preventDefault();
                    openShortcutHelp();
                    return;
                }
                if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
                if (key === ' ') {
                    e.preventDefault();
                    togglePlay();
                } else if (key === 'ArrowLeft') {
                    e.preventDefault();
                    previous();
                } else if (key === 'ArrowRight') {
                    e.preventDefault();
                    next();
                } else if (key === 'ArrowUp') {
                    e.preventDefault();
                    const v = clampNumber((parseFloat(volumeSlider.value) || 0) + .05, 0, 1);
                    volumeSlider.value = String(v);
                    volumeSlider.dispatchEvent(new Event('input'));
                } else if (key === 'ArrowDown') {
                    e.preventDefault();
                    const v = clampNumber((parseFloat(volumeSlider.value) || 0) - .05, 0, 1);
                    volumeSlider.value = String(v);
                    volumeSlider.dispatchEvent(new Event('input'));
                } else if (key.toLowerCase() === 'm') {
                    toggleMute();
                } else if (key.toLowerCase() === 's') {
                    toggleShuffle();
                } else if (key.toLowerCase() === 'r') {
                    toggleRepeat();
                } else if (key.toLowerCase() === 'q') {
                    toggleQueuePanel();
                }
            }, { passive: false });
        }

        function normalizeSongFile(fileId = '') {
            return String(fileId || '').replace(/\\/g, '/').trim().toLowerCase();
        }

        function getSongIdentity(song) {
            const title = String(song?.title || '').trim();
            const artistName = String(song?.artistName || (currentArtistKey ? getArtistDisplayNameByKey(currentArtistKey) : playerArtist.textContent) || '').trim();
            const file = normalizeSongFile(song?.file || '');
            return {
                title,
                artistName,
                file
            };
        }

        function getLyricsCacheKey(song) {
            const id = getSongIdentity(song);
            const parts = [id.file, id.artistName.toLowerCase(), id.title.toLowerCase()].filter(Boolean);
            return parts.join('|');
        }

        function loadLyricsCacheStore() {
            try {
                const raw = localStorage.getItem(LYRICS_CACHE_KEY);
                const parsed = raw ? JSON.parse(raw) : {};
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                    lyricsCacheStore = parsed;
                }
            } catch (e) {
                lyricsCacheStore = {};
            }
        }

        function saveLyricsCacheStore() {
            try {
                const entries = Object.entries(lyricsCacheStore).filter(([k, v]) => typeof k === 'string' && v && typeof v === 'object');
                entries.sort((a, b) => (b[1].savedAt || 0) - (a[1].savedAt || 0));
                const trimmed = entries.slice(0, MAX_LYRICS_CACHE_ENTRIES);
                lyricsCacheStore = Object.fromEntries(trimmed);
                localStorage.setItem(LYRICS_CACHE_KEY, JSON.stringify(lyricsCacheStore));
            } catch (e) {}
        }

        loadLyricsCacheStore();

        function parseLyricsTime(minutePart, secondPart, milliPart = '') {
            const mins = Number(minutePart);
            const secs = Number(secondPart);
            const millis = milliPart ? Number(`0.${String(milliPart).padEnd(3, '0').slice(0, 3)}`) : 0;
            if (!Number.isFinite(mins) || !Number.isFinite(secs) || !Number.isFinite(millis)) return NaN;
            return mins * 60 + secs + millis;
        }

        function parseSyncedLyrics(raw) {
            if (!raw) return [];
            const out = [];
            if (Array.isArray(raw)) {
                raw.forEach((item, idx) => {
                    if (typeof item === 'string') {
                        out.push({
                            time: idx * 4,
                            text: item.trim()
                        });
                        return;
                    }
                    if (!item || typeof item !== 'object') return;
                    const time = Number(item.time ?? item.t ?? item.seconds ?? item.sec ?? item.ms / 1000);
                    const text = String(item.text ?? item.line ?? item.lyric ?? '').trim();
                    if (Number.isFinite(time) && text) out.push({
                        time: Math.max(0, time),
                        text
                    });
                });
            } else if (typeof raw === 'string') {
                const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
                lines.forEach((line, idx) => {
                    const matches = [...line.matchAll(/\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g)];
                    const text = line.replace(/\[[^\]]+\]/g, '').trim();
                    if (!matches.length) {
                        if (text) out.push({
                            time: idx * 4,
                            text
                        });
                        return;
                    }
                    matches.forEach((m) => {
                        const t = parseLyricsTime(m[1], m[2], m[3] || '');
                        if (Number.isFinite(t) && text) out.push({
                            time: Math.max(0, t),
                            text
                        });
                    });
                });
            }
            return out.sort((a, b) => a.time - b.time).filter((line, idx, arr) => idx === 0 || line.time !== arr[idx - 1].time || line.text !== arr[idx - 1].text);
        }

        function resolveSyncedLyrics(song) {
            if (!song) return [];
            const embedded = parseSyncedLyrics(song.syncedLyrics || song.lyricsLrc || song.lrc || song.lyrics);
            if (embedded.length) return embedded;
            const fileKey = normalizeSongFile(song.file);
            if (fileKey && syncedLyricsCatalog[fileKey]) {
                const fromCatalog = parseSyncedLyrics(syncedLyricsCatalog[fileKey]);
                if (fromCatalog.length) return fromCatalog;
            }
            const cacheKey = getLyricsCacheKey(song);
            if (cacheKey && lyricsCacheStore[cacheKey]) {
                const cached = lyricsCacheStore[cacheKey];
                const parsed = parseSyncedLyrics(cached.syncedLyrics || cached.synced || cached.lrc || cached.plainLyrics || '');
                if (parsed.length) return parsed;
            }
            return [];
        }

        async function fetchLyricsFromLrclib(song) {
            const identity = getSongIdentity(song);
            if (!identity.title) return null;
            const params = new URLSearchParams({
                track_name: identity.title
            });
            if (identity.artistName) params.set('artist_name', identity.artistName);

            const directUrl = `https://lrclib.net/api/get?${params.toString()}`;
            const searchUrl = `https://lrclib.net/api/search?${params.toString()}`;

            let payload = null;
            try {
                const res = await fetch(directUrl, {
                    headers: {
                        Accept: 'application/json'
                    }
                });
                if (res.ok) {
                    payload = await res.json();
                }
            } catch (e) {}

            if (!payload) {
                try {
                    const res = await fetch(searchUrl, {
                        headers: {
                            Accept: 'application/json'
                        }
                    });
                    if (res.ok) {
                        const rows = await res.json();
                        if (Array.isArray(rows) && rows.length) {
                            payload = rows.find((row) => row && row.syncedLyrics) || rows[0];
                        }
                    }
                } catch (e) {}
            }

            if (!payload || typeof payload !== 'object') return null;
            const syncedText = payload.syncedLyrics || payload.synced || payload.lrc || '';
            const lines = parseSyncedLyrics(syncedText);
            const plainLyrics = String(payload.plainLyrics || '').trim();
            if (!lines.length && !plainLyrics && !payload.instrumental) return null;
            return {
                syncedLyrics: syncedText,
                plainLyrics,
                instrumental: !!payload.instrumental,
                savedAt: Date.now()
            };
        }

        async function loadSyncedLyrics(song) {
            if (!song) return [];
            const immediate = resolveSyncedLyrics(song);
            if (immediate.length) return immediate;

            const cacheKey = getLyricsCacheKey(song);
            if (!cacheKey) return [];
            if (lrclibLyricsRequests.has(cacheKey)) {
                try {
                    const existing = await lrclibLyricsRequests.get(cacheKey);
                    return parseSyncedLyrics(existing?.syncedLyrics || existing?.plainLyrics || '');
                } catch (e) {
                    return [];
                }
            }

            const pending = (async() => {
                const remote = await fetchLyricsFromLrclib(song);
                if (!remote) return null;
                lyricsCacheStore[cacheKey] = remote;
                const fileKey = normalizeSongFile(song.file);
                if (fileKey && remote.syncedLyrics) syncedLyricsCatalog[fileKey] = remote.syncedLyrics;
                saveLyricsCacheStore();
                return remote;
            })();

            lrclibLyricsRequests.set(cacheKey, pending);
            try {
                const result = await pending;
                return parseSyncedLyrics(result?.syncedLyrics || result?.plainLyrics || '');
            } catch (e) {
                return [];
            } finally {
                lrclibLyricsRequests.delete(cacheKey);
            }
        }

        function parseStaticLyrics(raw) {
            if (!raw || typeof raw !== 'string') return [];
            return raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((text, idx) => ({
                time: idx * 4,
                text
            }));
        }

        function hasTimestampedLyrics(raw) {
            return typeof raw === 'string' && /\[\d{1,2}:\d{2}(?:[.:]\d{1,3})?\]/.test(raw);
        }

        function setLyricsPanelState(title, message) {
            if (!lyricsPanelBody) return;
            lyricsPanelLines = [];
            lyricsPanelLineEls = [];
            lyricsPanelTimed = false;
            lyricsPanelActiveIndex = -1;
            lyricsPanelBody.innerHTML = `<div class="lyrics-state"><div><strong>${escH(title)}</strong><span>${escH(message)}</span></div></div>`;
        }

        function syncLyricsPanelShell() {
            if (lyricsPanelSong) lyricsPanelSong.textContent = currentSong?.title || 'Lyrics';
            if (lyricsPanelArtist) lyricsPanelArtist.textContent = currentSong ? (playerArtist.textContent || currentSong.artistName || 'Unknown Artist') : 'No song playing';
            if (lyricsPanel) lyricsPanel.classList.toggle('open', lyricsPanelOpen);
            if (lyricsPanelBackdrop) lyricsPanelBackdrop.classList.toggle('open', lyricsPanelOpen);
            if (lyricsToggleBtn) lyricsToggleBtn.classList.toggle('active', lyricsPanelOpen);
            if (lyricsPanel) lyricsPanel.setAttribute('aria-hidden', lyricsPanelOpen ? 'false' : 'true');
            document.body.classList.toggle('lyrics-panel-open', lyricsPanelOpen);
            if (lyricsFollowBtn) {
                lyricsFollowBtn.classList.toggle('active', lyricsPanelFollow);
                lyricsFollowBtn.setAttribute('aria-pressed', String(lyricsPanelFollow));
            }
        }

        function renderLyricsPanelLines(lines, timed) {
            if (!lyricsPanelBody) return;
            lyricsPanelLines = Array.isArray(lines) ? lines : [];
            lyricsPanelTimed = !!timed;
            lyricsPanelActiveIndex = -1;
            if (!lyricsPanelLines.length) {
                setLyricsPanelState('Lyrics unavailable', 'No lyrics are available for this track yet.');
                return;
            }
            lyricsPanelBody.innerHTML = `<div class="lyrics-lines">${lyricsPanelLines.map((line, idx) => `<button class="lyrics-line ${timed ? 'clickable' : ''}" data-lyrics-index="${idx}" ${timed ? `onclick="seekLyricsPanelLine(${line.time.toFixed(3)})"` : ''}>${escH(line.text || '...')}</button>`).join('')}</div>`;
            lyricsPanelLineEls = Array.from(lyricsPanelBody.querySelectorAll('.lyrics-line'));
            updateLyricsPanelPlayback(audio.currentTime || 0, true);
        }

        async function loadLyricsPanel(song) {
            if (!lyricsPanelBody) return;
            syncLyricsPanelShell();
            if (!song) {
                setLyricsPanelState('Lyrics', 'Play a song to see lyrics.');
                return;
            }
            const token = `${normalizeSongFile(song.file)}|${Date.now()}|${Math.random().toString(36).slice(2, 8)}`;
            lyricsPanelRequestToken = token;
            setLyricsPanelState('Loading lyrics', 'Finding the best lyrics for this track...');

            const embeddedRaw = song.syncedLyrics || song.lyricsLrc || song.lrc || song.lyrics || '';
            const embeddedTimed = parseSyncedLyrics(embeddedRaw);
            if (embeddedTimed.length && hasTimestampedLyrics(embeddedRaw)) {
                if (lyricsPanelRequestToken === token) renderLyricsPanelLines(embeddedTimed, true);
                return;
            }
            const embeddedStatic = parseStaticLyrics(embeddedRaw);
            if (embeddedStatic.length) {
                if (lyricsPanelRequestToken === token) renderLyricsPanelLines(embeddedStatic, false);
                return;
            }

            const cacheKey = getLyricsCacheKey(song);
            const cached = cacheKey ? lyricsCacheStore[cacheKey] : null;
            if (cached?.instrumental) {
                if (lyricsPanelRequestToken === token) setLyricsPanelState('Instrumental track', 'There are no lyrics for this song.');
                return;
            }
            const cachedTimedRaw = cached?.syncedLyrics || cached?.synced || cached?.lrc || '';
            const cachedTimed = parseSyncedLyrics(cachedTimedRaw);
            if (cachedTimed.length && hasTimestampedLyrics(cachedTimedRaw)) {
                if (lyricsPanelRequestToken === token) renderLyricsPanelLines(cachedTimed, true);
                return;
            }
            const cachedStatic = parseStaticLyrics(cached?.plainLyrics || '');
            if (cachedStatic.length) {
                if (lyricsPanelRequestToken === token) renderLyricsPanelLines(cachedStatic, false);
                return;
            }
            if (!navigator.onLine) {
                if (lyricsPanelRequestToken === token) setLyricsPanelState('Network error', 'Connect to the internet to load lyrics for this track.');
                return;
            }

            let remote = null;
            try {
                remote = await fetchLyricsFromLrclib(song);
            } catch (e) {
                if (lyricsPanelRequestToken === token) setLyricsPanelState('Network error', 'Lyrics could not be loaded right now.');
                return;
            }
            if (lyricsPanelRequestToken !== token) return;
            if (!remote) {
                setLyricsPanelState('Lyrics unavailable', 'No lyrics are available for this track yet.');
                return;
            }
            lyricsCacheStore[cacheKey] = remote;
            if (remote.syncedLyrics) syncedLyricsCatalog[normalizeSongFile(song.file)] = remote.syncedLyrics;
            saveLyricsCacheStore();
            if (remote.instrumental) {
                setLyricsPanelState('Instrumental track', 'There are no lyrics for this song.');
                return;
            }
            const remoteTimed = parseSyncedLyrics(remote.syncedLyrics || '');
            if (remoteTimed.length && hasTimestampedLyrics(remote.syncedLyrics || '')) {
                renderLyricsPanelLines(remoteTimed, true);
                return;
            }
            const remoteStatic = parseStaticLyrics(remote.plainLyrics || '');
            if (remoteStatic.length) {
                renderLyricsPanelLines(remoteStatic, false);
                return;
            }
            setLyricsPanelState('Lyrics unavailable', 'No lyrics are available for this track yet.');
        }

        function getLyricsPanelIndexAtTime(currentTime) {
            if (!lyricsPanelTimed || !lyricsPanelLines.length) return -1;
            let lo = 0;
            let hi = lyricsPanelLines.length - 1;
            let result = -1;
            while (lo <= hi) {
                const mid = (lo + hi) >> 1;
                if (lyricsPanelLines[mid].time <= currentTime) {
                    result = mid;
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
            return result;
        }

        function followLyricsPanelLine(index, force = false) {
            if (!lyricsPanelBody || !lyricsPanelLineEls[index] || !lyricsPanelFollow) return;
            if (!force && performance.now() < lyricsPanelManualUntil) return;
            const line = lyricsPanelLineEls[index];
            const maxScroll = Math.max(0, lyricsPanelBody.scrollHeight - lyricsPanelBody.clientHeight);
            const target = clampNumber(line.offsetTop + (line.offsetHeight / 2) - (lyricsPanelBody.clientHeight / 2), 0, maxScroll);
            lyricsPanelAutoWriteAt = performance.now();
            lyricsPanelBody.scrollTo({
                top: target,
                behavior: force ? 'auto' : 'smooth'
            });
        }

        function updateLyricsPanelPlayback(currentTime = audio.currentTime, force = false) {
            if (!lyricsPanelOpen || !lyricsPanelTimed || !lyricsPanelLineEls.length) return;
            const nextIndex = getLyricsPanelIndexAtTime((currentTime || 0) + 0.08);
            if (nextIndex !== lyricsPanelActiveIndex || force) {
                lyricsPanelActiveIndex = nextIndex;
                lyricsPanelLineEls.forEach((lineEl, idx) => {
                    lineEl.classList.toggle('active', idx === nextIndex);
                    lineEl.classList.toggle('past', nextIndex >= 0 && idx < nextIndex);
                    lineEl.classList.toggle('future', nextIndex < 0 || idx > nextIndex);
                });
                if (nextIndex >= 0) followLyricsPanelLine(nextIndex, force);
            }
        }

        window.seekLyricsPanelLine = (time) => {
            if (!Number.isFinite(time) || !audio.duration) return;
            audio.currentTime = clampNumber(time, 0, audio.duration);
            lyricsPanelManualUntil = performance.now() + 500;
            updateLyricsPanelPlayback(audio.currentTime, true);
        };

        window.openLyricsPanel = () => {
            lyricsPanelOpen = true;
            localStorage.setItem('eq_lyrics_panel_open', 'true');
            syncLyricsPanelShell();
            loadLyricsPanel(currentSong);
        };

        window.closeLyricsPanel = () => {
            lyricsPanelOpen = false;
            localStorage.setItem('eq_lyrics_panel_open', 'false');
            syncLyricsPanelShell();
        };

        window.toggleLyricsPanel = () => {
            if (lyricsPanelOpen) closeLyricsPanel();
            else openLyricsPanel();
        };

        window.toggleLyricsFollow = () => {
            lyricsPanelFollow = !lyricsPanelFollow;
            localStorage.setItem('eq_lyrics_follow', String(lyricsPanelFollow));
            syncLyricsPanelShell();
            if (lyricsPanelFollow) updateLyricsPanelPlayback(audio.currentTime || 0, true);
        };

        if (lyricsPanelBody && lyricsPanelBody.dataset.bound !== '1') {
            lyricsPanelBody.dataset.bound = '1';
            lyricsPanelBody.addEventListener('wheel', () => {
                if ((performance.now() - lyricsPanelAutoWriteAt) > 90) lyricsPanelManualUntil = performance.now() + 2600;
            }, { passive: true });
            lyricsPanelBody.addEventListener('touchstart', () => {
                lyricsPanelManualUntil = performance.now() + 3200;
            }, { passive: true });
            lyricsPanelBody.addEventListener('scroll', () => {
                if ((performance.now() - lyricsPanelAutoWriteAt) > 90) lyricsPanelManualUntil = performance.now() + 2200;
            }, { passive: true });
        }

        function rgbArrayToCss(rgb = [200, 245, 66]) {
            return rgb.map((v) => Math.max(0, Math.min(255, Math.round(v)))).join(', ');
        }

        function getLuma(rgb) {
            return (rgb[0] * 0.2126) + (rgb[1] * 0.7152) + (rgb[2] * 0.0722);
        }

        function mixRgb(a, b, amount = 0.5) {
            const t = clampNumber(amount, 0, 1);
            return [
                Math.round(a[0] + (b[0] - a[0]) * t),
                Math.round(a[1] + (b[1] - a[1]) * t),
                Math.round(a[2] + (b[2] - a[2]) * t)
            ];
        }

        async function extractAmbientPalette(imageSrc) {
            if (!imageSrc) {
                return {
                    primary: [200, 245, 66],
                    secondary: [78, 156, 255],
                    tertiary: [164, 95, 255]
                };
            }
            if (ambientPaletteCache.has(imageSrc)) return ambientPaletteCache.get(imageSrc);

            const palette = await new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.decoding = 'async';
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const size = 48;
                        canvas.width = size;
                        canvas.height = size;
                        const ctx = canvas.getContext('2d', {
                            willReadFrequently: true
                        });
                        if (!ctx) throw new Error('Canvas context unavailable');
                        ctx.drawImage(img, 0, 0, size, size);
                        const data = ctx.getImageData(0, 0, size, size).data;
                        let sumR = 0;
                        let sumG = 0;
                        let sumB = 0;
                        let count = 0;
                        const vibrant = [];
                        for (let i = 0; i < data.length; i += 16) {
                            const r = data[i];
                            const g = data[i + 1];
                            const b = data[i + 2];
                            const a = data[i + 3];
                            if (a < 80) continue;
                            const max = Math.max(r, g, b);
                            const min = Math.min(r, g, b);
                            const sat = max === 0 ? 0 : (max - min) / max;
                            const luma = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
                            if (luma < 18) continue;
                            sumR += r;
                            sumG += g;
                            sumB += b;
                            count += 1;
                            if (sat > 0.16 && luma > 35 && luma < 230) vibrant.push({
                                rgb: [r, g, b],
                                score: sat * 1.25 + (1 - Math.abs(144 - luma) / 144) * 0.55
                            });
                        }
                        const avg = count ? [sumR / count, sumG / count, sumB / count] : [100, 132, 80];
                        vibrant.sort((a, b) => b.score - a.score);
                        const primary = vibrant[0]?.rgb || mixRgb(avg, [200, 245, 66], 0.4);
                        const secondary = vibrant.find((row) => {
                            const [r, g, b] = row.rgb;
                            const dist = Math.abs(r - primary[0]) + Math.abs(g - primary[1]) + Math.abs(b - primary[2]);
                            return dist > 90;
                        })?.rgb || mixRgb(avg, [78, 156, 255], 0.55);
                        let tertiary = mixRgb(primary, secondary, 0.44);
                        if (getLuma(tertiary) > 185) tertiary = mixRgb(tertiary, [36, 26, 54], 0.38);
                        resolve({
                            primary: primary.map((v) => Math.round(v)),
                            secondary: secondary.map((v) => Math.round(v)),
                            tertiary: tertiary.map((v) => Math.round(v))
                        });
                    } catch (e) {
                        resolve({
                            primary: [200, 245, 66],
                            secondary: [78, 156, 255],
                            tertiary: [164, 95, 255]
                        });
                    }
                };
                img.onerror = () => resolve({
                    primary: [200, 245, 66],
                    secondary: [78, 156, 255],
                    tertiary: [164, 95, 255]
                });
                img.src = imageSrc;
            });

            ambientPaletteCache.set(imageSrc, palette);
            return palette;
        }

        function applyAmbientPalette(palette) {
            const safe = palette || {};
            const p1 = safe.primary || [200, 245, 66];
            const p2 = safe.secondary || [78, 156, 255];
            const p3 = safe.tertiary || [164, 95, 255];
            ambientCssPrimary = rgbArrayToCss(p1);
            ambientCssSecondary = rgbArrayToCss(p2);
            document.documentElement.style.setProperty('--ambient-rgb', ambientCssPrimary);
            document.documentElement.style.setProperty('--ambient-rgb-2', ambientCssSecondary);
            document.documentElement.style.setProperty('--ambient-rgb-3', rgbArrayToCss(p3));
            document.documentElement.style.setProperty('--theme-primary', `rgb(${ambientCssPrimary})`);
            document.documentElement.style.setProperty('--theme-secondary', `rgb(${ambientCssSecondary})`);
            document.documentElement.style.setProperty('--theme-accent', `rgb(${rgbArrayToCss(p3)})`);
            document.documentElement.style.setProperty('--accent', `rgb(${ambientCssPrimary})`);
            document.documentElement.style.setProperty('--accent2', `rgb(${rgbArrayToCss(mixRgb(p1, p2, .36))})`);
            document.documentElement.style.setProperty('--accent3', `rgba(${ambientCssPrimary}, .1)`);
            document.documentElement.style.setProperty('--accent-glow', `rgba(${ambientCssPrimary}, .24)`);
            document.documentElement.style.setProperty('--theme-surface', `rgba(${rgbArrayToCss(mixRgb(p1, [20, 20, 22], .84))}, .72)`);
            if (fullscreenPlayer) {
                fullscreenPlayer.style.setProperty('--fs-accent-rgb', ambientCssPrimary);
                fullscreenPlayer.style.setProperty('--fs-secondary-rgb', ambientCssSecondary);
            }
            const theme = document.querySelector('meta[name="theme-color"]');
            if (theme) {
                const darkMix = mixRgb(p1, [12, 12, 14], 0.72);
                theme.setAttribute('content', `rgb(${rgbArrayToCss(darkMix)})`);
            }
        }

        async function updateAmbientFromSong(song) {
            if (!song) return;
            const token = `${normalizeSongFile(song.file)}|${song.poster || ''}`;
            if (token && token === currentAmbientToken) return;
            currentAmbientToken = token;
            const palette = await extractAmbientPalette(song.poster || '');
            if (token !== currentAmbientToken) return;
            applyAmbientPalette(palette);
        }

        function getLyricIndexAtTime(currentTime) {
            if (!fullPlayerLyrics.length) return -1;
            let lo = 0;
            let hi = fullPlayerLyrics.length - 1;
            let result = -1;
            while (lo <= hi) {
                const mid = (lo + hi) >> 1;
                if (fullPlayerLyrics[mid].time <= currentTime) {
                    result = mid;
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
            return result;
        }

        function getLyricBlendState(currentTime) {
            const index = getLyricIndexAtTime((currentTime || 0) + 0.08);
            if (index < 0) {
                return {
                    index: -1,
                    next: 0,
                    mix: 0
                };
            }
            const next = Math.min(fullPlayerLyrics.length - 1, index + 1);
            const startTime = fullPlayerLyrics[index].time;
            const endTime = next === index ? (startTime + 4) : fullPlayerLyrics[next].time;
            const duration = Math.max(.22, endTime - startTime);
            const rawMix = next === index ? 0 : clampNumber(((currentTime || 0) - startTime) / duration, 0, 1);
            const mix = rawMix * rawMix * (3 - 2 * rawMix);
            return {
                index,
                next,
                mix
            };
        }

        function setFullPlayerEnergy() {
            if (!fullscreenPlayer) return;
            const playing = !!(currentSong && !audio.paused);
            const base = playing ? 0.56 : 0.24;
            const pulse = playing ? ((Math.sin(audio.currentTime * 2.3) + 1) / 2) : 0.1;
            const energy = Math.max(0.18, Math.min(0.98, base * 0.66 + pulse * 0.35));
            fullscreenPlayer.style.setProperty('--fs-energy', energy.toFixed(3));
        }

        let eqPanelOpen = false;
        let bassFilter, vocalFilter, trebleFilter;

        function toggleEqPanel() {
            showAudioSettings();
        }

        function setEqMode(mode) {
            const presets = {
                flat: [0, 0, 0],
                bass: [8, 0, -2],
                vocal: [-2, 8, 0],
                treble: [-4, 0, 8]
            };
            const [b, v, t] = presets[mode] || presets.flat;
            
            const bS = document.getElementById('bassSlider');
            const vS = document.getElementById('vocalSlider');
            const tS = document.getElementById('trebleSlider');
            
            if (bS) bS.value = b;
            if (vS) vS.value = v;
            if (tS) tS.value = t;
            
            updateFilters();
            
            // Update active preset button
            document.querySelectorAll('.eq-mode-btn').forEach(btn => {
                const onClick = btn.getAttribute('onclick');
                if (onClick && onClick.includes(`'${mode}'`)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            localStorage.setItem('falcon_eq_bass', b);
            localStorage.setItem('falcon_eq_vocal', v);
            localStorage.setItem('falcon_eq_treble', t);
        }

        function updateFilters() {
            const bS = document.getElementById('bassSlider');
            const vS = document.getElementById('vocalSlider');
            const tS = document.getElementById('trebleSlider');
            
            const b = bS ? parseFloat(bS.value) : 0;
            const v = vS ? parseFloat(vS.value) : 0;
            const t = tS ? parseFloat(tS.value) : 0;
            
            if (bassFilter && visualizerCtx) {
                bassFilter.gain.setTargetAtTime(b, visualizerCtx.currentTime, 0.05);
            }
            if (vocalFilter && visualizerCtx) {
                vocalFilter.gain.setTargetAtTime(v, visualizerCtx.currentTime, 0.05);
            }
            if (trebleFilter && visualizerCtx) {
                trebleFilter.gain.setTargetAtTime(t, visualizerCtx.currentTime, 0.05);
            }
            
            localStorage.setItem('falcon_eq_bass', b);
            localStorage.setItem('falcon_eq_vocal', v);
            localStorage.setItem('falcon_eq_treble', t);
        }

        function setupVisualizer() {
            if (visualizerReady || !fsVisualizerCanvas || !audio) return;
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            try {
                visualizerCtx = new AudioCtx();
                
                // Create Filters
                bassFilter = visualizerCtx.createBiquadFilter();
                bassFilter.type = 'lowshelf';
                bassFilter.frequency.value = 200;
                
                vocalFilter = visualizerCtx.createBiquadFilter();
                vocalFilter.type = 'peaking';
                vocalFilter.frequency.value = 1000;
                vocalFilter.Q.value = 1;
                
                trebleFilter = visualizerCtx.createBiquadFilter();
                trebleFilter.type = 'highshelf';
                trebleFilter.frequency.value = 3000;
                
                // Load saved values
                const b = parseFloat(localStorage.getItem('falcon_eq_bass') || '0');
                const v = parseFloat(localStorage.getItem('falcon_eq_vocal') || '0');
                const t = parseFloat(localStorage.getItem('falcon_eq_treble') || '0');
                
                bassFilter.gain.value = b;
                vocalFilter.gain.value = v;
                trebleFilter.gain.value = t;
                
                // Update slider UI
                const bS = document.getElementById('bassSlider');
                const vS = document.getElementById('vocalSlider');
                const tS = document.getElementById('trebleSlider');
                if (bS) bS.value = b;
                if (vS) vS.value = v;
                if (tS) tS.value = t;

                visualizerAnalyser = visualizerCtx.createAnalyser();
                visualizerAnalyser.fftSize = 256;
                visualizerAnalyser.smoothingTimeConstant = 0.84;
                
                visualizerSource = visualizerCtx.createMediaElementSource(audio);
                crossfadeMainGain = visualizerCtx.createGain();
                crossfadeFadeGain = visualizerCtx.createGain();
                crossfadeMainGain.gain.value = 1;
                crossfadeFadeGain.gain.value = 0;
                try {
                    crossfadeFadeSource = visualizerCtx.createMediaElementSource(audioFade);
                    crossfadeFadeSource.connect(crossfadeFadeGain);
                    crossfadeFadeGain.connect(bassFilter);
                } catch (fadeErr) {
                    crossfadeFadeSource = null;
                }
                
                // Chain: sources -> crossfade gains -> EQ -> analyser -> destination
                visualizerSource.connect(crossfadeMainGain);
                crossfadeMainGain.connect(bassFilter);
                bassFilter.connect(vocalFilter);
                vocalFilter.connect(trebleFilter);
                trebleFilter.connect(visualizerAnalyser);
                visualizerAnalyser.connect(visualizerCtx.destination);
                crossfadeEngineReady = !!(crossfadeMainGain && crossfadeFadeGain && crossfadeFadeSource);
                
                visualizerFreqData = new Uint8Array(visualizerAnalyser.frequencyBinCount);
                visualizerWaveData = new Uint8Array(visualizerAnalyser.fftSize);
                visualizerReady = true;
            } catch (e) {
                console.error("Audio Context Error:", e);
                visualizerReady = false;
                crossfadeEngineReady = false;
            }
        }

        function stopVisualizerLoop() {
            if (visualizerFrame) cancelAnimationFrame(visualizerFrame);
            visualizerFrame = 0;
        }

        function startVisualizerLoop() {
            if (visualizerFrame || !fsVisualizerCanvas) return;
            const canvas = fsVisualizerCanvas;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const draw = () => {
                visualizerFrame = requestAnimationFrame(draw);
                const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
                const cssW = canvas.clientWidth || 380;
                const cssH = canvas.clientHeight || 110;
                const targetW = Math.max(1, Math.round(cssW * dpr));
                const targetH = Math.max(1, Math.round(cssH * dpr));
                if (canvas.width !== targetW || canvas.height !== targetH) {
                    canvas.width = targetW;
                    canvas.height = targetH;
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (!fullPlayerOpen) return;
                if (!visualizerReady || !visualizerAnalyser || !visualizerFreqData || !visualizerWaveData) return;
                if (visualizerCtx?.state === 'suspended' && !audio.paused) {
                    visualizerCtx.resume().catch(() => {});
                }

                visualizerAnalyser.getByteFrequencyData(visualizerFreqData);
                visualizerAnalyser.getByteTimeDomainData(visualizerWaveData);

                const w = canvas.width;
                const h = canvas.height;
                const midY = h * 0.58;
                const bars = 40;
                const barW = w / bars;

                let energy = 0;
                for (let i = 0; i < bars; i += 1) {
                    const idx = Math.floor((i / bars) * visualizerFreqData.length);
                    const v = visualizerFreqData[idx] / 255;
                    energy += v;
                    const eased = Math.pow(v, 1.4);
                    const barH = (h * 0.66) * eased;
                    const x = i * barW + (barW * 0.14);
                    const y = midY - barH;
                    const grd = ctx.createLinearGradient(x, y, x, midY + 8);
                    grd.addColorStop(0, `rgba(${ambientCssPrimary}, .92)`);
                    grd.addColorStop(1, `rgba(${ambientCssSecondary}, .16)`);
                    ctx.fillStyle = grd;
                    const bw = Math.max(2, barW * 0.7);
                    ctx.fillRect(x, y, bw, barH + 2);
                }

                energy /= bars;
                fullscreenPlayer?.style.setProperty('--fs-energy', clampNumber(0.18 + energy * 0.9, 0.18, 0.98).toFixed(3));

                // Update EQ meter bars
                if (eqPanelOpen) {
                    const meterBars = document.querySelectorAll('.fx-eq-meter span');
                    meterBars.forEach((span, i) => {
                        const idx = Math.floor((i / meterBars.length) * visualizerFreqData.length);
                        const v = (visualizerFreqData[idx] || 0) / 255;
                        span.style.transform = `scaleY(${0.15 + v * 0.85})`;
                        span.style.opacity = (0.4 + v * 0.6).toFixed(2);
                    });
                }

                ctx.beginPath();
                for (let i = 0; i < visualizerWaveData.length; i += 1) {
                    const x = (i / (visualizerWaveData.length - 1)) * w;
                    const sample = (visualizerWaveData[i] - 128) / 128;
                    const y = midY + sample * (h * 0.12);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.strokeStyle = `rgba(${ambientCssPrimary}, .62)`;
                ctx.lineWidth = Math.max(1.2, dpr * 1.05);
                ctx.stroke();
            };

            visualizerFrame = requestAnimationFrame(draw);
        }

        function measureFullPlayerLyricsCenter() {
            if (!fsLyricsScroll || !fsLyricsList || !lyricLineEls.length) return;
            const firstHeight = lyricLineEls[0].getBoundingClientRect().height || 32;
            const pad = Math.max(52, (fsLyricsScroll.clientHeight / 2) - (firstHeight * 0.5) - 10);
            fsLyricsList.style.setProperty('--fs-lyrics-pad', `${pad.toFixed(1)}px`);
        }

        function scheduleFullPlayerLyricsMeasure(forceUpdate = false) {
            if (lyricMeasureFrame) cancelAnimationFrame(lyricMeasureFrame);
            lyricMeasureFrame = requestAnimationFrame(() => {
                lyricMeasureFrame = 0;
                measureFullPlayerLyricsCenter();
                if (forceUpdate) updateFullPlayerLyrics(audio.currentTime, true);
            });
        }

        function getCenteredLyricScrollTarget(currentTime) {
            if (!fsLyricsScroll || !lyricLineEls.length) return 0;
            const maxScroll = Math.max(0, fsLyricsScroll.scrollHeight - fsLyricsScroll.clientHeight);
            const blend = getLyricBlendState(currentTime);
            if (blend.index < 0) {
                const firstLine = lyricLineEls[0];
                if (!firstLine) return 0;
                const firstCenter = firstLine.offsetTop + (firstLine.offsetHeight / 2);
                return clampNumber(firstCenter - (fsLyricsScroll.clientHeight / 2), 0, maxScroll);
            }
            const currentLine = lyricLineEls[blend.index];
            const nextLine = lyricLineEls[blend.next] || currentLine;
            if (!currentLine) return fsLyricsScroll.scrollTop;
            const currentCenter = currentLine.offsetTop + (currentLine.offsetHeight / 2);
            const nextCenter = nextLine ? (nextLine.offsetTop + (nextLine.offsetHeight / 2)) : currentCenter;
            const blendedCenter = currentCenter + ((nextCenter - currentCenter) * blend.mix);
            return clampNumber(blendedCenter - (fsLyricsScroll.clientHeight / 2), 0, maxScroll);
        }

        function applyFullPlayerLyricClasses(index) {
            if (!lyricLineEls.length) return;
            lyricLineEls.forEach((lineEl, idx) => {
                const offset = idx - index;
                lineEl.classList.toggle('active', index >= 0 && idx === index);
                lineEl.classList.toggle('past', index >= 0 && idx < index);
                lineEl.classList.toggle('near', index >= 0 && Math.abs(offset) === 1);
            });
        }

        function pauseFullPlayerLyricMotion(ms = 1600) {
            lyricManualPauseUntil = performance.now() + ms;
        }

        function startFullPlayerLyricMotion() {
            if (lyricAutoFrame) return;
            const animate = () => {
                lyricAutoFrame = requestAnimationFrame(animate);
                if (!fullPlayerOpen || !fullscreenPlayer) return;
                setFullPlayerEnergy();
                if (!fullPlayerLyricsOpen || !fullPlayerLyrics.length || !fsLyricsScroll) return;
                const now = performance.now();
                if (now < lyricManualPauseUntil) return;
                const target = getCenteredLyricScrollTarget(audio.currentTime || 0);
                const current = fsLyricsScroll.scrollTop;
                const delta = target - current;
                if (Math.abs(delta) <= .24) {
                    if (Math.abs(delta) > .01) {
                        lyricLastAutoWriteAt = now;
                        fsLyricsScroll.scrollTop = target;
                    }
                    return;
                }
                const spring = window.matchMedia('(max-width: 768px)').matches ? .19 : .14;
                lyricLastAutoWriteAt = now;
                fsLyricsScroll.scrollTop = current + (delta * spring);
            };
            lyricAutoFrame = requestAnimationFrame(animate);
        }

        function stopFullPlayerLyricMotion() {
            if (lyricAutoFrame) cancelAnimationFrame(lyricAutoFrame);
            lyricAutoFrame = 0;
        }

        function commitFullPlayerLyrics(lines = [], scrollToCurrent = true) {
            if (!fsLyricsList) return;
            fullPlayerLyrics = Array.isArray(lines) ? lines : [];
            if (fsLyricsPanel) fsLyricsPanel.classList.toggle('has-lyrics', fullPlayerLyrics.length > 0);
            activeLyricIndex = -1;
            lyricLineEls = [];
            if (!fullPlayerLyrics.length) {
                fsLyricsList.innerHTML = '<p class="mfp-lyrics-empty">No synced lyrics for this track yet.</p>';
                if (fsLyricTimestamp) fsLyricTimestamp.textContent = fmt(audio.currentTime || 0);
                return;
            }
            fsLyricsList.innerHTML = fullPlayerLyrics.map((line, idx) => `<button class="mfp-lyric-line" data-lyric-index="${idx}" onclick="seekFullPlayerLyric(${line.time.toFixed(3)})">${escH(line.text || '...')}</button>`).join('');
            lyricLineEls = Array.from(fsLyricsList.querySelectorAll('.mfp-lyric-line'));
            scheduleFullPlayerLyricsMeasure(scrollToCurrent);
        }

        async function renderFullPlayerLyrics(song) {
            if (!fsLyricsList) return;
            const token = `${normalizeSongFile(song?.file || '')}|${Date.now()}|${Math.random().toString(36).slice(2, 8)}`;
            fullPlayerLyricsRequestToken = token;

            const localLines = resolveSyncedLyrics(song);
            if (localLines.length) {
                commitFullPlayerLyrics(localLines, true);
                return;
            }

            fsLyricsList.innerHTML = '<p class="mfp-lyrics-empty">Fetching synced lyrics…</p>';
            lyricLineEls = [];
            fullPlayerLyrics = [];
            const remoteLines = await loadSyncedLyrics(song);
            if (fullPlayerLyricsRequestToken !== token) return;
            commitFullPlayerLyrics(remoteLines, true);
        }

        function updateFullPlayerLyrics(currentTime = audio.currentTime, force = false) {
            if (fsLyricTimestamp) fsLyricTimestamp.textContent = fmt(currentTime || 0);
            if (!fullPlayerLyrics.length || !lyricLineEls.length) return;
            const nextIndex = getLyricIndexAtTime((currentTime || 0) + 0.08);
            if (nextIndex !== activeLyricIndex || force) {
                activeLyricIndex = nextIndex;
                applyFullPlayerLyricClasses(activeLyricIndex);
            }
            if (force && fsLyricsScroll && fullPlayerLyricsOpen) {
                const target = getCenteredLyricScrollTarget(currentTime || 0);
                lyricLastAutoWriteAt = performance.now();
                fsLyricsScroll.scrollTop = target;
            }
        }

        window.seekFullPlayerLyric = (time) => {
            if (!Number.isFinite(time) || !audio.duration) return;
            audio.currentTime = clampNumber(time, 0, audio.duration);
            updateFullPlayerLyrics(audio.currentTime, true);
            pauseFullPlayerLyricMotion(280);
        };

        function setFullPlayerPlaybackState(isPlaying) {
            if (!fullscreenPlayer) return;
            fullscreenPlayer.classList.toggle('playing', !!isPlaying);
            if (isPlaying && visualizerCtx?.state === 'suspended') {
                visualizerCtx.resume().catch(() => {});
            }
            setFullPlayerEnergy();
        }

        if (fsLyricsScroll && fsLyricsScroll.dataset.motionBound !== '1') {
            fsLyricsScroll.dataset.motionBound = '1';
            fsLyricsScroll.addEventListener('touchstart', () => pauseFullPlayerLyricMotion(2200), {
                passive: true
            });
            fsLyricsScroll.addEventListener('wheel', () => pauseFullPlayerLyricMotion(1600), {
                passive: true
            });
            fsLyricsScroll.addEventListener('scroll', () => {
                if ((performance.now() - lyricLastAutoWriteAt) < 70) return;
                pauseFullPlayerLyricMotion(1600);
            }, {
                passive: true
            });
        }

        window.addEventListener('resize', () => {
            if (!fullPlayerOpen) return;
            scheduleFullPlayerLyricsMeasure(true);
        });

        window.toggleFullLyricsPanel = () => {
            if (!fullscreenPlayer) return;
            fullPlayerLyricsOpen = !fullscreenPlayer.classList.contains('lyrics-open');
            fullscreenPlayer.classList.toggle('lyrics-open', fullPlayerLyricsOpen);
            localStorage.setItem('eq_fs_lyrics_open', String(fullPlayerLyricsOpen));
            if (fsLyricsToggle) {
                setElementIcon(fsLyricsToggle, fullPlayerLyricsOpen ? 'list-music' : 'list');
                fsLyricsToggle.setAttribute('title', fullPlayerLyricsOpen ? 'Hide lyrics focus' : 'Show lyrics focus');
                fsLyricsToggle.setAttribute('aria-label', fullPlayerLyricsOpen ? 'Hide lyrics focus' : 'Show lyrics focus');
            }
            if (fullPlayerLyricsOpen) {
                scheduleFullPlayerLyricsMeasure(true);
                pauseFullPlayerLyricMotion(220);
            }
        };

        window.openFullPlayer = () => {
            if (!currentSong || !fullscreenPlayer) return;
            clearTimeout(fullPlayerCloseTimer);
            fullscreenPlayer.classList.remove('closing');
            fullscreenPlayer.classList.add('active');
            fullscreenPlayer.classList.toggle('lyrics-open', fullPlayerLyricsOpen);
            fullscreenPlayer.setAttribute('aria-hidden', 'false');
            document.body.classList.add('fs-player-open');
            fullPlayerOpen = true;
            updateFullPlayerUI();
            scheduleFullPlayerLyricsMeasure(true);
            startFullPlayerLyricMotion();
            setupVisualizer();
            if (visualizerCtx?.state === 'suspended') visualizerCtx.resume().catch(() => {});
            startVisualizerLoop();
        };

        window.closeFullPlayer = (immediate = false) => {
            if (!fullscreenPlayer) return;
            clearTimeout(fullPlayerCloseTimer);
            fullPlayerOpen = false;
            stopFullPlayerLyricMotion();
            stopVisualizerLoop();
            document.body.classList.remove('fs-player-open');
            if (immediate) {
                fullscreenPlayer.classList.remove('active', 'closing', 'playing');
                fullscreenPlayer.setAttribute('aria-hidden', 'true');
                fullscreenPlayer.style.opacity = '';
                if (fsSheet) {
                    fsSheet.style.transform = '';
                    fsSheet.style.transition = '';
                }
                return;
            }
            fullscreenPlayer.classList.add('closing');
            fullscreenPlayer.style.opacity = '';
            fullPlayerCloseTimer = setTimeout(() => {
                fullscreenPlayer.classList.remove('active', 'closing');
                fullscreenPlayer.setAttribute('aria-hidden', 'true');
                if (fsSheet) {
                    fsSheet.style.transform = '';
                    fsSheet.style.transition = '';
                }
            }, 360);
        };

        function updateFullPlayerUI(forceLyricsRefresh = false) {
            if (!currentSong || !fullscreenPlayer) return;
            const songPoster = currentSong.poster || '';
            const songArtist = currentArtistKey ? getArtistDisplayNameByKey(currentArtistKey) : (currentSong.artistName || playerArtist.textContent || 'Unknown Artist');
            const songTitle = currentSong.title || 'Unknown';
            if (fsPoster) fsPoster.src = songPoster;
            if (fsPosterGlow) fsPosterGlow.src = songPoster;
            if (fsBackdrop) fsBackdrop.src = songPoster;
            if (fsTitle) fsTitle.textContent = songTitle;
            if (fsArtist) fsArtist.textContent = songArtist;
            if (fsHeaderSong) fsHeaderSong.textContent = songTitle;
            if (fsHeaderArtist) fsHeaderArtist.textContent = songArtist;
            syncExplicitBadges(currentSong);
            if (fsPlay) setElementIcon(fsPlay, audio.paused ? 'play' : 'pause');
            if (fsLikeBtn) setElementIcon(fsLikeBtn, likedSongs.has(currentSong.file) ? 'heart' : 'heart-off');
            if (fsLikeBtn) fsLikeBtn.classList.toggle('liked', likedSongs.has(currentSong.file));
            if (fsQueueBtn) fsQueueBtn.classList.toggle('active', queuePanelOpen);
            if (fsShuffle) fsShuffle.classList.toggle('active', isShuffle);
            if (fsRepeat) fsRepeat.classList.toggle('active', isRepeat > 0);
            if (fsLyricsToggle) {
                setElementIcon(fsLyricsToggle, fullPlayerLyricsOpen ? 'list-music' : 'list');
                fsLyricsToggle.setAttribute('title', fullPlayerLyricsOpen ? 'Hide lyrics focus' : 'Show lyrics focus');
                fsLyricsToggle.setAttribute('aria-label', fullPlayerLyricsOpen ? 'Hide lyrics focus' : 'Show lyrics focus');
            }
            const nextToken = `${normalizeSongFile(currentSong.file)}|${songPoster}`;
            if (forceLyricsRefresh || nextToken !== fullPlayerSongToken) {
                fullPlayerSongToken = nextToken;
                renderFullPlayerLyrics(currentSong);
            } else {
                updateFullPlayerLyrics(audio.currentTime, true);
            }
            if (fsLyricsPanel) fsLyricsPanel.classList.toggle('has-lyrics', fullPlayerLyrics.length > 0);
            updateAmbientFromSong({
                ...currentSong,
                artistName: songArtist
            });
            setFullPlayerPlaybackState(!audio.paused);
            if (fullPlayerOpen) startFullPlayerLyricMotion();
        }

        window.toggleFullPlayerLike = () => {
            if (!currentSong) return;
            toggleLike(currentSong.file);
            updateFullPlayerUI();
            if (currentPlaylistId && document.getElementById('playlistSongsList')) renderPlaylistSongs(currentPlaylistId, false);
            if (document.getElementById('favSongsList')) refreshLikedDisplay();
        };

        function startDragFullPlayer(e) {
            const track = document.getElementById('fsProgressTrack');
            if (!track) return;
            isDragging = true;
            activeDragTrack = track;
            track.classList.add('dragging');
            seekFromClientX(track, getClientX(e));
            if (e.cancelable) e.preventDefault();
        }

        function handleFullPlayerSwipeStart(e) {
            if (!fullPlayerOpen || !fullscreenPlayer || !fsSheet) return;
            if (!window.matchMedia('(max-width: 900px)').matches) return;
            if (!e.touches || e.touches.length !== 1) return;
            const target = e.target;
            if (!(target instanceof Element)) return;
            if (target.closest('.mfp-progress-track') || target.closest('button')) return;
            const inLyricsScroll = target.closest('.mfp-lyrics-scroll');
            if (inLyricsScroll && fsLyricsScroll && fsLyricsScroll.scrollTop > 0) return;
            fullPlayerSwipe.tracking = true;
            fullPlayerSwipe.startY = e.touches[0].clientY;
            fullPlayerSwipe.deltaY = 0;
        }

        function handleFullPlayerSwipeMove(e) {
            if (!fullPlayerSwipe.tracking || !fullscreenPlayer || !fsSheet || !e.touches || !e.touches[0]) return;
            const delta = Math.max(0, e.touches[0].clientY - fullPlayerSwipe.startY);
            fullPlayerSwipe.deltaY = delta;
            if (delta <= 0) return;
            if (e.cancelable) e.preventDefault();
            fsSheet.style.transition = 'none';
            fsSheet.style.transform = `translateY(${delta}px)`;
            fullscreenPlayer.style.opacity = String(Math.max(0.38, 1 - delta / 360));
        }

        function handleFullPlayerSwipeEnd() {
            if (!fullPlayerSwipe.tracking || !fullscreenPlayer || !fsSheet) return;
            const delta = fullPlayerSwipe.deltaY;
            fullPlayerSwipe.tracking = false;
            fullPlayerSwipe.deltaY = 0;
            fsSheet.style.transition = '';
            fsSheet.style.transform = '';
            fullscreenPlayer.style.opacity = '';
            if (delta > 120) closeFullPlayer();
        }

        if (fsSheet && !fsSheet.dataset.swipeBound) {
            fsSheet.dataset.swipeBound = '1';
            fsSheet.addEventListener('touchstart', handleFullPlayerSwipeStart, {
                passive: true
            });
            fsSheet.addEventListener('touchmove', handleFullPlayerSwipeMove, {
                passive: false
            });
            fsSheet.addEventListener('touchend', handleFullPlayerSwipeEnd, {
                passive: true
            });
            fsSheet.addEventListener('touchcancel', handleFullPlayerSwipeEnd, {
                passive: true
            });
        }

        if (fullscreenPlayer && !fullscreenPlayer.dataset.dismissBound) {
            fullscreenPlayer.dataset.dismissBound = '1';
            fullscreenPlayer.addEventListener('click', (e) => {
                if (!(e.target instanceof Element)) return;
                if (e.target.closest('.mfp-sheet')) return;
                closeFullPlayer();
            });
        }

      
        audio.addEventListener('loadedmetadata', () => {
            if (!currentSong?.file || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
            songDurationMeta[currentSong.file] = Math.round(audio.duration);
            if (currentSong) currentSong.duration = songDurationMeta[currentSong.file];
            saveSongDurationMeta();
            scheduleCrossfadeAuto('loadedmetadata');
        });

        audio.addEventListener('timeupdate',()=>{ 
            if (!audio.paused && visualizerCtx?.state === 'suspended') resumeAudioContext('timeupdate');
            const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
            const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
            if(duration > 0){
                const percent = (current / duration) * 100;
                progressBar.style.width = percent + '%'; 
                const fsProgressBar = document.getElementById('fsProgressBar');
                if(fsProgressBar) fsProgressBar.style.width = percent + '%';
                document.getElementById('duration').textContent = fmt(duration);
                const fsDuration = document.getElementById('fsDuration');
                if(fsDuration) fsDuration.textContent = fmt(duration);
            }
            document.getElementById('currentTime').textContent = fmt(current); 
            const fsCurrentTime = document.getElementById('fsCurrentTime');
            if(fsCurrentTime) fsCurrentTime.textContent = fmt(current);
            updateMiniPlayerProgress(current, duration);
            updateFullPlayerLyrics(current);
            updateLyricsPanelPlayback(current);
            setFullPlayerEnergy();
            const now = performance.now();
            if (current > 0 && (now - lastPlaybackSaveAt) > 14000) {
                lastPlaybackSaveAt = now;
                savePlaybackMemory();
            }
        });
        audio.addEventListener('ended',()=>{ stopCrossfadeTimers(); if(!isRepeat) next(); });
        audio.addEventListener('play',()=>{ 
            setPlayButtonIcons(false);
            if(currentArtistKey) updateArtistPlayingState(false);
            if(currentPlaylistId && document.getElementById('playlistSongsList')) updatePlaylistPlayingState(false);
            if(document.getElementById('favSongsList')) updateFavoritesPlayingState(false);
            setupVisualizer();
            resumeAudioContext('play-event');
            if (fullPlayerOpen) startVisualizerLoop();
            setFullPlayerPlaybackState(true);
            updateFullPlayerLyrics(audio.currentTime, true);
            updateNowPlayingIndicator();
            updateMiniPlayer();
            scheduleCrossfadeAuto('play');
        });
        audio.addEventListener('pause',()=>{ 
            setPlayButtonIcons(true);
            if (!crossfadeTransitionActive) {
                if (crossfadeTimer) {
                    clearTimeout(crossfadeTimer);
                    crossfadeTimer = null;
                }
            }
            if ((performance.now() > crossfadePauseSuppressUntil) && !audioFade.paused) {
                stopCrossfadeTimers();
                releaseAudioObjectUrl(audioFade.src);
                audioFade.pause();
                audioFade.removeAttribute('src');
                audioFade.load();
            }
            if(currentArtistKey) updateArtistPlayingState(false);
            if(currentPlaylistId && document.getElementById('playlistSongsList')) updatePlaylistPlayingState(false);
            if(document.getElementById('favSongsList')) updateFavoritesPlayingState(false);
            setFullPlayerPlaybackState(false);
            savePlaybackMemory();
            updateNowPlayingIndicator();
            updateMiniPlayer();
        });
        audio.addEventListener('playing', () => resumeAudioContext('playing-event'));
        audio.addEventListener('canplay', () => resumeAudioContext('canplay-event'));
        audio.addEventListener('seeked', () => scheduleCrossfadeAuto('seeked'));
        audio.addEventListener('seeking', () => {
            if (crossfadeTimer) {
                clearTimeout(crossfadeTimer);
                crossfadeTimer = null;
            }
        });
        volumeSlider.addEventListener('input',()=>{ const nextVolume=+volumeSlider.value; audio.volume=nextVolume; if(audioFade.src)audioFade.volume=nextVolume; isMuted=nextVolume===0; localStorage.setItem('eq_volume',nextVolume); updateMiniPlayer(); });
        window.addEventListener('beforeunload',()=>savePlaybackMemory());
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) pageFrozen = false;
            if (!audio.paused) resumeAudioContext('visibilitychange');
        });
        window.addEventListener('pagehide', () => {
            if (!audio.paused) resumeAudioContext('pagehide');
        });
        window.addEventListener('pageshow', () => {
            pageFrozen = false;
            if (!audio.paused) resumeAudioContext('pageshow');
        });
        document.addEventListener('freeze', () => {
            pageFrozen = true;
            if (!audio.paused) resumeAudioContext('freeze');
        });
        document.addEventListener('resume', () => {
            pageFrozen = false;
            if (!audio.paused) resumeAudioContext('resume');
        });

        if('mediaSession' in navigator){ navigator.mediaSession.setActionHandler('play',()=>audio.play().then(()=>resumeAudioContext('media-session-play')).catch(()=>{})); navigator.mediaSession.setActionHandler('pause',()=>audio.pause()); navigator.mediaSession.setActionHandler('nexttrack',()=>next()); navigator.mediaSession.setActionHandler('previoustrack',()=>previous()); navigator.mediaSession.setActionHandler('seekto',(d)=>{if(d.seekTime)audio.currentTime=d.seekTime;}); }

        window.openMobileDrawer = () => {
            if (!mobileDrawer || !mobileDrawerBackdrop) return;
            mobileDrawer.classList.add('open');
            mobileDrawerBackdrop.classList.add('open');
            mobileDrawer.setAttribute('aria-hidden', 'false');
            document.body.classList.add('drawer-open');
        };

        window.closeMobileDrawer = () => {
            if (!mobileDrawer || !mobileDrawerBackdrop) return;
            mobileDrawer.classList.remove('open');
            mobileDrawerBackdrop.classList.remove('open');
            mobileDrawer.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('drawer-open');
        };

        if (mobileDrawer && !mobileDrawer.dataset.bound) {
            mobileDrawer.dataset.bound = '1';
            mobileDrawer.addEventListener('click', (e) => {
                if (!(e.target instanceof Element)) return;
                if (e.target.closest('.mobile-drawer-link')) closeMobileDrawer();
            });
        }

   
        window.showMobileUserMenu = () => {
            // Show simple options: signed in as X + sign out
            const name = document.getElementById('userDisplayNameMain')?.textContent || 'User';
            if(confirm(`Signed in as ${name}\n\nSign out?`)) signOut();
        };

        /* -- Audio Engine -- */
        let audioEngine = {
            bands: [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000],
            filters: [],
            preamp: null,
            compressor: null,
            limiter: null,
            reverb: null,
            reverbGain: null,
            delay: null,
            delayGain: null,
            panner: null,
            ready: false,
            vizMode: 'bars'
        };

        const AUDIO_PRESETS = {
            'Flat': [0,0,0,0,0,0,0,0,0,0],
            'Rock': [4,3,2,0,-1,-1,0,1,2,3],
            'Pop': [-1,0,1,2,3,3,2,1,0,-1],
            'Hip Hop': [5,4,2,0,-1,-1,0,1,2,4],
            'Rap': [4,3,1,0,1,2,1,0,2,3],
            'Punjabi Bass': [8,7,4,1,0,-1,-2,-1,2,4],
            'EDM': [6,5,2,0,2,3,1,0,3,5],
            'Trap': [7,6,3,0,-2,-3,0,2,4,6],
            'Dance': [5,4,2,0,2,3,2,0,2,4],
            'Club': [4,3,1,0,2,2,1,0,1,2],
            'Bass Boost': [7,6,4,2,0,0,0,0,0,0],
            'Extreme Bass': [12,10,7,4,1,0,-1,-2,-1,0],
            'Treble Boost': [0,0,0,0,0,0,2,5,8,10],
            'Vocal Boost': [-2,-2,-1,0,2,4,4,2,0,-1],
            'Podcast': [-3,-2,-1,1,3,4,3,1,0,-2],
            'Classical': [3,2,1,0,0,0,1,2,2,3],
            'Jazz': [2,1,0,1,2,2,1,0,1,2],
            'Acoustic': [2,2,1,0,1,2,2,1,2,3],
            'Cinema': [4,2,0,0,0,0,0,1,3,5],
            'Gaming': [5,3,1,0,0,1,2,3,4,5],
            'Night Mode': [-4,-3,-2,-1,0,0,-1,-2,-3,-4],
            'Loudness': [5,3,0,0,0,0,0,0,3,5]
        };

        function saveCustomPreset() {
            const name = prompt("Enter a name for your custom preset:");
            if (!name) return;
            const gains = audioEngine.filters.map(f => f.gain.value);
            const customPresets = JSON.parse(localStorage.getItem('as_custom_presets') || '{}');
            customPresets[name] = gains;
            localStorage.setItem('as_custom_presets', JSON.stringify(customPresets));
            showToast(`Preset "${name}" saved`);
            if (document.getElementById('as-presets')?.classList.contains('active')) renderAudioPage();
        }

        function getAudioPresets() {
            const custom = JSON.parse(localStorage.getItem('as_custom_presets') || '{}');
            return { ...AUDIO_PRESETS, ...custom };
        }

        function createReverb() {
            if (!visualizerCtx) return;
            const length = visualizerCtx.sampleRate * 2;
            const impulse = visualizerCtx.createBuffer(2, length, visualizerCtx.sampleRate);
            for (let i = 0; i < 2; i++) {
                const channel = impulse.getChannelData(i);
                for (let j = 0; j < length; j++) {
                    channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 2);
                }
            }
            const convolver = visualizerCtx.createConvolver();
            convolver.buffer = impulse;
            return convolver;
        }

        function setupAudioEngine() {
            if (audioEngine.ready || !visualizerCtx) return;
            try {
                const ctx = visualizerCtx;
                audioEngine.preamp = ctx.createGain();
                audioEngine.preamp.gain.value = parseFloat(localStorage.getItem('as_preamp') || '1');
                audioEngine.filters = audioEngine.bands.map(freq => {
                    const filter = ctx.createBiquadFilter();
                    filter.type = 'peaking';
                    filter.frequency.value = freq;
                    filter.Q.value = 1.4;
                    const saved = localStorage.getItem(`as_eq_${freq}`);
                    filter.gain.value = saved ? parseFloat(saved) : 0;
                    return filter;
                });
                audioEngine.compressor = ctx.createDynamicsCompressor();
                audioEngine.compressor.threshold.value = parseFloat(localStorage.getItem('as_comp_threshold') || '-24');
                audioEngine.compressor.ratio.value = parseFloat(localStorage.getItem('as_comp_ratio') || '12');
                audioEngine.reverb = createReverb();
                audioEngine.reverbGain = ctx.createGain();
                audioEngine.reverbGain.gain.value = parseFloat(localStorage.getItem('as_reverb') || '0');
                audioEngine.delay = ctx.createDelay(5.0);
                audioEngine.delay.delayTime.value = 0.3;
                audioEngine.delayGain = ctx.createGain();
                audioEngine.delayGain.gain.value = parseFloat(localStorage.getItem('as_delay') || '0');
                audioEngine.panner = ctx.createStereoPanner();
                audioEngine.panner.pan.value = parseFloat(localStorage.getItem('as_pan') || '0');
                let lastNode = crossfadeMainGain || visualizerSource;
                if (!lastNode) return;
                try { lastNode.disconnect(); } catch (e) {}
                try { if (crossfadeFadeGain) crossfadeFadeGain.disconnect(); } catch (e) {}
                lastNode.connect(audioEngine.preamp);
                if (crossfadeFadeGain) crossfadeFadeGain.connect(audioEngine.preamp);
                lastNode = audioEngine.preamp;
                audioEngine.filters.forEach(filter => { lastNode.connect(filter); lastNode = filter; });
                lastNode.connect(audioEngine.compressor);
                audioEngine.compressor.connect(audioEngine.reverb);
                audioEngine.reverb.connect(audioEngine.reverbGain);
                audioEngine.reverbGain.connect(audioEngine.panner);
                audioEngine.compressor.connect(audioEngine.delay);
                audioEngine.delay.connect(audioEngine.delayGain);
                audioEngine.delayGain.connect(audioEngine.panner);
                audioEngine.compressor.connect(audioEngine.panner);
                audioEngine.panner.connect(visualizerAnalyser);
                visualizerAnalyser.connect(ctx.destination);
                audioEngine.ready = true;
                startAudioSuiteViz();
            } catch (e) { console.error("Audio Engine Init Error:", e); }
        }

        let asVizFrame = 0;
        function startAudioSuiteViz() {
            if (asVizFrame) cancelAnimationFrame(asVizFrame);
            const canvas = document.getElementById('as-viz-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const draw = () => {
                asVizFrame = requestAnimationFrame(draw);
                if (!visualizerReady) return;
                const w = canvas.width = canvas.clientWidth * 2;
                const h = canvas.height = canvas.clientHeight * 2;
                ctx.clearRect(0,0,w,h);
                visualizerAnalyser.getByteFrequencyData(visualizerFreqData);
                visualizerAnalyser.getByteTimeDomainData(visualizerWaveData);
                if (audioEngine.vizMode === 'bars') {
                    const bars = 64; const barW = w / bars;
                    for (let i = 0; i < bars; i++) {
                        const v = visualizerFreqData[i] / 255;
                        ctx.fillStyle = `rgba(200, 245, 66, ${0.4 + v * 0.6})`;
                        ctx.fillRect(i * barW, h, barW - 2, -v * h * 0.8);
                    }
                } else if (audioEngine.vizMode === 'wave') {
                    ctx.beginPath(); ctx.strokeStyle = '#c8f542'; ctx.lineWidth = 4;
                    for (let i = 0; i < visualizerWaveData.length; i++) {
                        const x = (i / visualizerWaveData.length) * w;
                        const y = (visualizerWaveData[i] / 255) * h;
                        if (i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                    }
                    ctx.stroke();
                } else {
                    const centerX = w / 2, centerY = h / 2, radius = Math.min(w,h) * 0.2;
                    ctx.beginPath(); ctx.strokeStyle = '#c8f542'; ctx.lineWidth = 3;
                    for (let i = 0; i < 360; i++) {
                        const rad = i * Math.PI / 180;
                        const idx = Math.floor((i / 360) * visualizerFreqData.length);
                        const v = visualizerFreqData[idx] / 255;
                        const r = radius + v * radius * 0.8;
                        const x = centerX + Math.cos(rad) * r;
                        const y = centerY + Math.sin(rad) * r;
                        if (i === 0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
                    }
                    ctx.closePath(); ctx.stroke();
                }
            };
            draw();
        }

        function setVizMode(mode) {
            audioEngine.vizMode = mode;
            document.querySelectorAll('#as-visualizer .as-card').forEach(c => {
                c.classList.toggle('active', c.textContent.toLowerCase().includes(mode));
            });
        }

        function updateEffect(effect, val) {
            const v = parseFloat(val);
            if (effect === 'reverb' && audioEngine.reverbGain) {
                audioEngine.reverbGain.gain.setTargetAtTime(v, visualizerCtx.currentTime, 0.05);
                localStorage.setItem('as_reverb', v);
            } else if (effect === 'delay' && audioEngine.delayGain) {
                audioEngine.delayGain.gain.setTargetAtTime(v, visualizerCtx.currentTime, 0.05);
                localStorage.setItem('as_delay', v);
            }
        }

        function updateEQBand(index, value) {
            if (!audioEngine.filters[index]) return;
            const val = parseFloat(value);
            audioEngine.filters[index].gain.setTargetAtTime(val, visualizerCtx.currentTime, 0.05);
            const el = document.getElementById(`eq-db-${index}`);
            if (el) el.textContent = val.toFixed(1) + 'dB';
            localStorage.setItem(`as_eq_${audioEngine.bands[index]}`, val);
        }

        function applyAudioPreset(name) {
            const allPresets = getAudioPresets();
            const gains = allPresets[name];
            if (!gains) return;
            gains.forEach((gain, i) => {
                if (audioEngine.filters[i]) {
                    audioEngine.filters[i].gain.setTargetAtTime(gain, visualizerCtx.currentTime, 0.1);
                    const slider = document.querySelectorAll('.eq-slider-vertical')[i];
                    if (slider) slider.value = gain;
                    const dbLabel = document.getElementById(`eq-db-${i}`);
                    if (dbLabel) dbLabel.textContent = gain.toFixed(1) + 'dB';
                    localStorage.setItem(`as_eq_${audioEngine.bands[i]}`, gain);
                }
            });
            localStorage.setItem('as_active_preset', name);
            document.querySelectorAll('#as-presets .as-card').forEach(c => {
                const title = c.querySelector('.as-card-title')?.textContent;
                c.classList.toggle('active', title === name);
            });
        }

        function resetEQ() { applyAudioPreset('Flat'); }

        function updatePreamp(val) {
            const v = parseFloat(val);
            if (audioEngine.preamp) audioEngine.preamp.gain.setTargetAtTime(v, visualizerCtx.currentTime, 0.05);
            const el = document.getElementById('preamp-val');
            if (el) el.textContent = v.toFixed(2) + 'x';
            localStorage.setItem('as_preamp', v);
        }

        function updatePan(val) {
            const v = parseFloat(val);
            if (audioEngine.panner) audioEngine.panner.pan.setTargetAtTime(v, visualizerCtx.currentTime, 0.05);
            const el = document.getElementById('pan-val');
            if (el) el.textContent = v.toFixed(1);
            localStorage.setItem('as_pan', v);
        }

        function updateCompressor(param, val) {
            const v = parseFloat(val);
            if (audioEngine.compressor && audioEngine.compressor[param]) audioEngine.compressor[param].setTargetAtTime(v, visualizerCtx.currentTime, 0.05);
        }

        function updateStats() {
            if (!visualizerCtx) return;
            const sr = document.getElementById('stat-sr'), st = document.getElementById('stat-state'), lt = document.getElementById('stat-latency'), peak = document.getElementById('stat-peak');
            if (sr) sr.textContent = visualizerCtx.sampleRate + ' Hz';
            if (st) st.textContent = visualizerCtx.state.charAt(0).toUpperCase() + visualizerCtx.state.slice(1);
            if (lt) lt.textContent = (visualizerCtx.baseLatency || 0).toFixed(4) * 1000 + 'ms';
            const updatePeak = () => {
                if (!visualizerReady || !peak) return;
                let max = 0; for (let i = 0; i < visualizerWaveData.length; i++) { const v = Math.abs(visualizerWaveData[i] - 128) / 128; if (v > max) max = v; }
                peak.textContent = max.toFixed(2);
                if (document.getElementById('as-stats')?.classList.contains('active')) requestAnimationFrame(updatePeak);
            };
            updatePeak();
        }

        function renderAudioPage() {
            setNavActive('navAudio'); setMobileBack(true);
            const mainArea = document.getElementById('mainArea'); if (!mainArea) return;
            const allPresets = getAudioPresets();
            mainArea.innerHTML = `
                <div class="audio-suite-container">
                    <div class="as-header"><div class="premium-dashboard-kicker">Studio Grade</div><h1 class="premium-dashboard-title">Audio Suite</h1><p class="premium-dashboard-sub">Master your sound with professional-grade processing and real-time analytics.</p></div>
                    <div class="as-tabs"><div class="as-tab active" data-target="eq">Equalizer</div><div class="as-tab" data-target="presets">Presets</div><div class="as-tab" data-target="effects">Effects</div><div class="as-tab" data-target="visualizer">Visualizer</div><div class="as-tab" data-target="advanced">Advanced</div><div class="as-tab" data-target="stats">Statistics</div></div>
                    <div class="as-content active" id="as-eq"><div class="eq-grid">${audioEngine.bands.map((freq, i) => `<div class="eq-band"><input type="range" class="eq-slider-vertical" min="-15" max="15" step="0.5" value="${audioEngine.filters[i]?.gain.value || 0}" oninput="updateEQBand(${i}, this.value)"><span class="eq-label-freq">${freq >= 1000 ? (freq/1000) + 'kHz' : freq + 'Hz'}</span><span class="eq-label-db" id="eq-db-${i}">${(audioEngine.filters[i]?.gain.value || 0).toFixed(1)}dB</span></div>`).join('')}</div><div style="display:flex; gap:15px; justify-content:center;"><button class="btn btn-outline" onclick="resetEQ()">Reset EQ</button><button class="btn btn-accent" onclick="saveCustomPreset()">Save Custom</button></div></div>
                    <div class="as-content" id="as-presets"><div class="as-grid">${Object.keys(allPresets).map(name => `<div class="as-card ${localStorage.getItem('as_active_preset') === name ? 'active' : ''}" onclick="applyAudioPreset('${name}')"><div class="as-card-icon">${uiIcon('music')}</div><div class="as-card-title">${name}</div></div>`).join('')}</div></div>
                    <div class="as-content" id="as-effects"><div class="as-grid"><div class="as-card"><div class="as-card-title">Preamp (Gain)</div><input type="range" min="0" max="2" step="0.05" value="${audioEngine.preamp?.gain.value || 1}" oninput="updatePreamp(this.value)"><span id="preamp-val">${(audioEngine.preamp?.gain.value || 1).toFixed(2)}x</span></div><div class="as-card"><div class="as-card-title">Stereo Pan</div><input type="range" min="-1" max="1" step="0.1" value="${audioEngine.panner?.pan.value || 0}" oninput="updatePan(this.value)"><span id="pan-val">${(audioEngine.panner?.pan.value || 0).toFixed(1)}</span></div><div class="as-card"><div class="as-card-title">Reverb (Space)</div><input type="range" min="0" max="1" step="0.05" value="${localStorage.getItem('as_reverb') || 0}" oninput="updateEffect('reverb', this.value)"></div><div class="as-card"><div class="as-card-title">Delay (Echo)</div><input type="range" min="0" max="1" step="0.05" value="${localStorage.getItem('as_delay') || 0}" oninput="updateEffect('delay', this.value)"></div><div class="as-card wide"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px"><div class="as-card-title">Crossfade</div><span id="crossfadeValue" style="font-size:.82rem;font-weight:900;color:var(--accent)">Off</span></div><input id="crossfadeSlider" type="range" min="0" max="12" step="1" value="${crossfadeSeconds}" oninput="setCrossfadeSeconds(this.value)"><div style="font-size:.78rem;color:var(--text2);line-height:1.45">Blend the end of one song into the beginning of the next.</div></div></div></div>
                    <div class="as-content" id="as-visualizer"><div class="viz-container"><canvas id="as-viz-canvas"></canvas></div><div class="as-grid" style="margin-top:20px"><div class="as-card ${audioEngine.vizMode==='bars'?'active':''}" onclick="setVizMode('bars')">Spectrum Bars</div><div class="as-card ${audioEngine.vizMode==='wave'?'active':''}" onclick="setVizMode('wave')">Waveform</div><div class="as-card ${audioEngine.vizMode==='circle'?'active':''}" onclick="setVizMode('circle')">Circular</div></div></div>
                    <div class="as-content" id="as-advanced"><div class="as-grid"><div class="as-card"><div class="as-card-title">Compressor Threshold</div><input type="range" min="-60" max="0" step="1" value="${audioEngine.compressor?.threshold.value || -24}" oninput="updateCompressor('threshold', this.value)"></div><div class="as-card"><div class="as-card-title">Compressor Ratio</div><input type="range" min="1" max="20" step="1" value="${audioEngine.compressor?.ratio.value || 12}" oninput="updateCompressor('ratio', this.value)"></div></div></div>
                    <div class="as-content" id="as-stats"><div class="stats-box"><div class="stats-row"><span class="stats-label">Sample Rate</span><span class="stats-value" id="stat-sr">44100 Hz</span></div><div class="stats-row"><span class="stats-label">Channels</span><span class="stats-value">2 (Stereo)</span></div><div class="stats-row"><span class="stats-label">Context State</span><span class="stats-value" id="stat-state">Running</span></div><div class="stats-row"><span class="stats-label">Audio Latency</span><span class="stats-value" id="stat-latency">0ms</span></div><div class="stats-row"><span class="stats-label">Peak Level</span><span class="stats-value" id="stat-peak">0.00</span></div><div class="stats-row"><span class="stats-label">Audio Engine</span><span class="stats-value">FalconX Pro v3.0</span></div></div></div>
                </div>
            `;
            initAudioSuiteTabs(); setupAudioEngine(); updateStats(); updateCrossfadeSettingUI(); renderLucideIcons(mainArea);
        }

        function initAudioSuiteTabs() {
            const tabs = document.querySelectorAll('.as-tab');
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    const target = tab.dataset.target;
                    document.querySelectorAll('.as-content').forEach(c => c.classList.remove('active'));
                    document.getElementById(`as-${target}`).classList.add('active');
                });
            });
        }

        function renderStatsPage() {
            setNavActive('navStats'); setMobileBack(true);
            const mainArea = document.getElementById('mainArea');
            const songPool = buildLibrarySongPool();
            const totalSongs = songPool.length;
            const totalArtists = getArtistCatalogEntries().length;
            const favCount = likedSongs.size;
            const mostPlayed = [...songPool].filter(s => s.playCount > 0).sort((a, b) => b.playCount - a.playCount).slice(0, 5);
            let totalSec = 0; Object.entries(songPlayCounts).forEach(([file, count]) => { const duration = songDurationMeta[file] || 210; totalSec += duration * count; });
            const listenMins = Math.floor(totalSec / 60); const listenHrs = (totalSec / 3600).toFixed(1);

            mainArea.innerHTML = `
            <div class="main-topbar">
                <div class="nav-arrows"><button class="nav-arrow-btn" onclick="loadArtists()">${uiIcon('chevron-left')}</button></div>
                <div style="flex:1"><div style="font-size:1.2rem;font-weight:800">Stats Dashboard</div></div>
                <div class="topbar-actions"><button class="topbar-menu-btn" onclick="openMobileDrawer()" title="Menu">${uiIcon('menu')}</button></div>
            </div>
            <div class="premium-dashboard">
                <div class="premium-dashboard-hero"><div><div class="premium-dashboard-kicker">Personal Insights</div><div class="premium-dashboard-title">Your Music Journey</div><p class="premium-dashboard-sub">Explore your listening habits and library statistics.</p></div></div>
                <div class="stats-grid">
                    <div class="stat-card"><div class="stat-label">Total Songs</div><div class="stat-value">${totalSongs}</div><div class="stat-note">Across all artists</div></div>
                    <div class="stat-card"><div class="stat-label">Total Artists</div><div class="stat-value">${totalArtists}</div><div class="stat-note">In your library</div></div>
                    <div class="stat-card"><div class="stat-label">Listening Time</div><div class="stat-value">${listenHrs}h</div><div class="stat-note">${listenMins} total minutes</div></div>
                    <div class="stat-card"><div class="stat-label">Favorites</div><div class="stat-value">${favCount}</div><div class="stat-note">Songs you loved</div></div>
                </div>
                <div class="chart-grid">
                    <div class="chart-card"><div class="chart-title">${uiIcon('bar-chart-3')} Most Played Songs</div><div class="recent-list">${mostPlayed.length ? mostPlayed.map(s => `<div class="recent-item" onclick="playSongByFile('${escA(s.file)}')"><img src="${escH(s.poster)}" onerror="this.style.background='var(--surface3)'"><div class="recent-text"><div style="font-size:.82rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escH(s.title)}</div><div style="font-size:.68rem;color:var(--text2)">${escH(s.artistName)}</div></div><div style="font-size:.75rem;font-weight:800;color:var(--accent)">${s.playCount} plays</div></div>`).join('') : '<div class="empty-state" style="padding:20px 0"><p>No plays tracked yet.</p></div>'}</div></div>
                    <div class="chart-card"><div class="chart-title">${uiIcon('history')} Recently Played</div><div class="recent-list">${continueListening.length ? continueListening.slice(0, 5).map(s => `<div class="recent-item" onclick="playFromHistory('${escA(s.file)}','${escA(s.artistKey || '')}')"><img src="${escH(s.poster)}" onerror="this.style.background='var(--surface3)'"><div class="recent-text"><div style="font-size:.82rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escH(s.title)}</div><div style="font-size:.68rem;color:var(--text2)">${escH(s.artistName)}</div></div><div style="opacity:.4">${uiIcon('play')}</div></div>`).join('') : '<div class="empty-state" style="padding:20px 0"><p>No recent history.</p></div>'}</div></div>
                </div>
            </div>`;
            renderLucideIcons(mainArea);
        }

        function fmt(s) { return Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'); }
        function setMobileBack(show) { const b=document.getElementById('mobileBackBtn'); if(b)b.classList.toggle('hidden',!show); }
        function syncMobileNavActive(tab) { const nav = document.getElementById('mobileNav'); if (!nav) return; nav.querySelectorAll('.mnav-btn').forEach((btn) => { btn.classList.toggle('active', btn.dataset.tab === tab); }); }
        function setNavActive(id) { document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active')); const e=document.getElementById(id); if(e)e.classList.add('active'); if (id === 'navFav') syncMobileNavActive('fav'); else if (id === 'navPlaylists' || id === 'navDownloads') syncMobileNavActive('library'); else if (id === 'navStats') syncMobileNavActive('stats'); else if (id === 'navAudio') syncMobileNavActive('audio'); else syncMobileNavActive('home'); }
        function setSidebarActive(key) { document.querySelectorAll('.artist-item').forEach(e=>e.classList.remove('active')); const e=document.getElementById('sb_'+key); if(e){e.classList.add('active');} }
        function escH(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
        function escA(s) { return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'"); }
        let toastTimer; function showToast(msg) { const t=document.getElementById('toast'); t.textContent=msg; t.style.opacity='1'; clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.style.opacity='0',2200); }

        function setupMobileNav() {
            const nav = document.getElementById('mobileNav'); if (!nav || nav.dataset.bound === '1') return; nav.dataset.bound = '1';
            nav.addEventListener('click', (e) => {
                const btn = e.target.closest('.mnav-btn'); if (!btn) return;
                nav.querySelectorAll('.mnav-btn').forEach((b) => b.classList.remove('active')); btn.classList.add('active');
                const tab = btn.dataset.tab;
                if (tab === 'home') loadArtists();
                else if (tab === 'search') { loadArtists(); syncMobileNavActive('search'); setTimeout(() => document.querySelector('.search-box input')?.focus(), 60); }
                else if (tab === 'fav') showLikedSongs();
                else if (tab === 'library') showPlaylists();
                else if (tab === 'stats') renderStatsPage();
                else if (tab === 'audio') renderAudioPage();
            });
        }
        document.addEventListener('DOMContentLoaded', setupMobileNav);

        function registerFalconServiceWorker() {
            if (!('serviceWorker' in navigator)) return;
            const register = () => {
                navigator.serviceWorker.register('sw.js').then((registration) => {
                    if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                    registration.update().catch(() => {});
                }).catch((err) => {
                    console.warn('Service worker registration failed:', err);
                });
            };
            if (document.readyState === 'complete') register();
            else window.addEventListener('load', register, { once: true });
        }

        window.playSong = playSong; window.next = next; window.previous = previous; window.togglePlay = togglePlay; window.toggleShuffle = toggleShuffle; window.toggleRepeat = toggleRepeat; window.toggleMute = toggleMute;
        window.toggleQueuePanel = toggleQueuePanel; window.addToQueue = addToQueue; window.openArtist = openArtist; window.loadArtists = loadArtists; window.showLikedSongs = showLikedSongs; window.showDownloads = showDownloads; window.showPlaylists = showPlaylists; window.refreshLikedDisplay = refreshLikedDisplay;
        window.playArtist = playArtist; window.shuffleArtist = shuffleArtist; window.toggleLike = toggleLike; window.globalSearch = globalSearch; window.toggleEqPanel = () => renderAudioPage(); window.setEqMode = (mode) => applyAudioPreset(mode.charAt(0).toUpperCase() + mode.slice(1));
        window.renderStatsPage = renderStatsPage; window.renderAudioPage = renderAudioPage; window.setVizMode = setVizMode; window.updateEffect = updateEffect; window.updateEQBand = updateEQBand; window.applyAudioPreset = applyAudioPreset; window.resetEQ = resetEQ; window.updatePreamp = updatePreamp; window.updatePan = updatePan; window.updateCompressor = updateCompressor; window.saveCustomPreset = saveCustomPreset; window.setCrossfadeSeconds = setCrossfadeSeconds;

        // -- INIT --
        initLucideSystem();
        buildSidebar();
        loadArtists();
        loadPlaybackMemory();
        syncLyricsPanelShell();
        if (lyricsPanelOpen) loadLyricsPanel(currentSong);
        loadDlQueue();
        dlQueue.forEach((item) => renderDpItem(item));
        renderQueuePanel();
        setupQueuePanelInteractions();
        setupSongRowSwipeGestures();
        initMiniPlayerDrag();
        initAmbientParticles();
        initKeyboardShortcuts();
        updateMiniPlayer();
        updateQueueIndicators();
        updateDpStats();
        if (dlQueue.some((item) => item.status === 'queued') && !dlPaused) processQueue();
        if (currentSong) updateAmbientFromSong(currentSong);
        registerFalconServiceWorker();

        if(!('caches' in window)){ console.warn('Cache API not available.'); document.querySelectorAll('.dl-btn,.player-dl-btn,.dl-queue-btn').forEach(el=>el.style.display='none'); }

        const playerSongEl = document.querySelector('.player-song');
        if (playerSongEl && playerSongEl.dataset.fullscreenBound !== '1') {
            playerSongEl.dataset.fullscreenBound = '1';
            playerSongEl.addEventListener('click', (e) => {
                if (!(e.target instanceof Element)) return;
                if (e.target.closest('button, input, .player-poster')) return;
                if (currentSong) openFullPlayer();
            });
        }

      
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            if (lyricsPanelOpen) closeLyricsPanel();
            if (fullPlayerOpen) closeFullPlayer();
            if (mobileDrawer?.classList.contains('open')) closeMobileDrawer();
            if (queuePanelOpen) closeQueuePanel();
            if (typeof closeAppearance === 'function') closeAppearance();
        });
