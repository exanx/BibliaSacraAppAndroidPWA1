const BIBLE_BOOKS = {
    "Old Testament": { "Genesis": 50, "Exodus": 40, "Leviticus": 27, "Numbers": 36, "Deuteronomy": 34, "Joshua": 24, "Judges": 21, "Ruth": 4, "1 Samuel": 31, "2 Samuel": 24, "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36, "Ezra": 10, "Nehemiah": 13, "Tobit": 14, "Judith": 16, "Esther": 16, "1 Maccabees": 16, "2 Maccabees": 15, "Job": 42, "Psalms": 150, "Proverbs": 31, "Ecclesiastes": 12, "Song of Solomon": 8, "Wisdom": 19, "Sirach": 51, "Isaiah": 66, "Jeremiah": 52, "Lamentations": 5, "Baruch": 6, "Ezekiel": 48, "Daniel": 14, "Hosea": 14, "Joel": 3, "Amos": 9, "Obadiah": 1, "Jonah": 4, "Micah": 7, "Nahum": 3, "Habakkuk": 3, "Zephaniah": 3, "Haggai": 2, "Zechariah": 14, "Malachi": 4 },
    "New Testament": { "Matthew": 28, "Mark": 16, "Luke": 24, "John": 21, "Acts": 28, "Romans": 16, "1 Corinthians": 16, "2 Corinthians": 13, "Galatians": 6, "Ephesians": 6, "Philippians": 4, "Colossians": 4, "1 Thessalonians": 5, "2 Thessalonians": 3, "1 Timothy": 6, "2 Timothy": 4, "Titus": 3, "Philemon": 1, "Hebrews": 13, "James": 5, "1 Peter": 5, "2 Peter": 3, "1 John": 5, "2 John": 1, "3 John": 1, "Jude": 1, "Revelation": 22 }
};

const flatBible = [];
Object.keys(BIBLE_BOOKS).forEach(testament => { Object.keys(BIBLE_BOOKS[testament]).forEach(book => { for(let i=1; i<=BIBLE_BOOKS[testament][book]; i++) flatBible.push({book, chapter: i.toString()}); }); });

const bookAliases = {
    "gen": "Genesis", "ge": "Genesis", "ex": "Exodus", "exod": "Exodus", "lev": "Leviticus", "lv": "Leviticus", 
    "num": "Numbers", "nm": "Numbers", "deut": "Deuteronomy", "dt": "Deuteronomy", "josh": "Joshua", "jos": "Joshua",
    "judg": "Judges", "jdg": "Judges", "jg": "Judges", "ru": "Ruth", "1 sam": "1 Samuel", "1 sm": "1 Samuel", "2 sam": "2 Samuel", "2 sm": "2 Samuel",
    "1 kgs": "1 Kings", "1 ki": "1 Kings", "2 kgs": "2 Kings", "2 ki": "2 Kings", "1 chron": "1 Chronicles", "1 chr": "1 Chronicles", "2 chron": "2 Chronicles", "2 chr": "2 Chronicles",
    "ezr": "Ezra", "neh": "Nehemiah", "tob": "Tobit", "jdt": "Judith", "est": "Esther", "esth": "Esther", "1 mac": "1 Maccabees", "1 macc": "1 Maccabees", "2 mac": "2 Maccabees", "2 macc": "2 Maccabees",
    "jb": "Job", "ps": "Psalms", "psalm": "Psalms", "psa": "Psalms", "pss": "Psalms", "prov": "Proverbs", "prv": "Proverbs",
    "eccl": "Ecclesiastes", "ecc": "Ecclesiastes", "song": "Song of Solomon", "cant": "Song of Solomon", "sos": "Song of Solomon",
    "wis": "Wisdom", "sir": "Sirach", "ecclus": "Sirach", "isa": "Isaiah", "is": "Isaiah", "jer": "Jeremiah", 
    "lam": "Lamentations", "bar": "Baruch", "ezek": "Ezekiel", "ez": "Ezekiel", "dan": "Daniel", "dn": "Daniel", "hos": "Hosea",
    "jl": "Joel", "am": "Amos", "ob": "Obadiah", "obad": "Obadiah", "jon": "Jonah", "mic": "Micah", "na": "Nahum", "nah": "Nahum", 
    "hab": "Habakkuk", "zeph": "Zephaniah", "hag": "Haggai", "zech": "Zechariah", "mal": "Malachi",
    "matt": "Matthew", "mt": "Matthew", "mk": "Mark", "mrk": "Mark", "lk": "Luke", "jn": "John", "act": "Acts", 
    "rom": "Romans", "rm": "Romans", "1 cor": "1 Corinthians", "1 co": "1 Corinthians", "2 cor": "2 Corinthians", "2 co": "2 Corinthians",
    "gal": "Galatians", "eph": "Ephesians", "phil": "Philippians", "col": "Colossians", "1 thess": "1 Thessalonians", "1 th": "1 Thessalonians", "2 thess": "2 Thessalonians", "2 th": "2 Thessalonians",
    "1 tim": "1 Timothy", "1 tm": "1 Timothy", "2 tim": "2 Timothy", "2 tm": "2 Timothy", "tit": "Titus", "ti": "Titus", "phlm": "Philemon", "heb": "Hebrews", "jas": "James", "jm": "James", 
    "1 pet": "1 Peter", "1 pt": "1 Peter", "2 pet": "2 Peter", "2 pt": "2 Peter", "1 jn": "1 John", "2 jn": "2 John", "3 jn": "3 John", "jud": "Jude", "rev": "Revelation", "rv": "Revelation", "apoc": "Revelation"
};

const localDB = {
    db: null,
    async init() {
        if (this.db) return;
        return new Promise((resolve, reject) => {
            const req = indexedDB.open('SanctaBibliaDB', 2);
            req.onupgradeneeded = e => { const db = e.target.result; if (!db.objectStoreNames.contains('store')) db.createObjectStore('store'); };
            req.onsuccess = e => { this.db = e.target.result; resolve(); }; req.onerror = e => reject(e.target.error);
        });
    },
    async get(key) { await this.init(); return new Promise((resolve, reject) => { const req = this.db.transaction('store', 'readonly').objectStore('store').get(key); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); }); },
    async set(key, val) { await this.init(); return new Promise((resolve, reject) => { const req = this.db.transaction('store', 'readwrite').objectStore('store').put(val, key); req.onsuccess = () => resolve(); req.onerror = () => reject(req.error); }); },
    async remove(key) { await this.init(); return new Promise((resolve, reject) => { const req = this.db.transaction('store', 'readwrite').objectStore('store').delete(key); req.onsuccess = () => resolve(); req.onerror = () => reject(req.error); }); }
};

const THEME_PRESETS = {
    default_light: { theme: 'light', bg: null, text: null },
    dim: { theme: 'dark', bg: '#1c1c1e', text: '#e5e5ea' },
    sepia: { theme: 'light', bg: '#f4ecd8', text: '#5b4636' },
    mocha: { theme: 'dark', bg: '#292524', text: '#d6d3d1' },
    oled: { theme: 'dark', bg: '#000000', text: '#d1d5db' },
    navy: { theme: 'dark', bg: '#0f172a', text: '#e2e8f0' },
    parchment: { theme: 'light', bg: '#fdf6e3', text: '#657b83' },
    gruvbox: { theme: 'dark', bg: '#282828', text: '#ebdbb2' },
    nord: { theme: 'dark', bg: '#121212', text: '#c9c9c9' },
    dracula: { theme: 'dark', bg: '#282a36', text: '#f8f8f2' },
    rosewater: { theme: 'light', bg: '#fff0f5', text: '#4a0e4e' }
};

const scriptureDisplay = document.getElementById('scripture-display'), initialMessage = document.getElementById('initial-message'), versionSubtitle = document.getElementById('version-subtitle');
const selectionTooltip = document.getElementById('selection-tooltip');
const mobileSidebarContainer = document.getElementById('mobile-sidebar-container'), mobileSidebarOverlay = document.getElementById('mobile-sidebar-overlay'), openMobileSidebarBtn = document.getElementById('open-mobile-sidebar-btn-floating'), closeMobileSidebarBtn = document.getElementById('close-mobile-sidebar-btn');
const quoteModal = document.getElementById('quote-modal'), closeQuoteModalBtn = document.getElementById('close-quote-modal-btn'), quoteBookSelect = document.getElementById('quote-book-select'), quoteChapterSelect = document.getElementById('quote-chapter-select'), quoteVerseFromEl = document.getElementById('quote-verse-from'), quoteVerseToEl = document.getElementById('quote-verse-to'), quoteFontSelect = document.getElementById('quote-font-select'), generateAndDownloadBtn = document.getElementById('generate-and-download-btn'), quoteLoader = document.getElementById('quote-loader');
const highlightPopupContainer = document.getElementById('highlight-popup-container'), highlightsModal = document.getElementById('highlights-modal'), closeHighlightsModalBtn = document.getElementById('close-highlights-modal-btn'), highlightsContent = document.getElementById('highlights-content'), highlightsCategoryFilter = document.getElementById('highlights-category-filter');
const mainScrollArea = document.getElementById('main-scroll-area');
const gridModal = document.getElementById('grid-modal'), gridBookView = document.getElementById('grid-book-view'), gridChapterView = document.getElementById('grid-chapter-view'), gridModalTitle = document.getElementById('grid-modal-title'), gridBackBtn = document.getElementById('grid-back-btn'), closeGridModalBtn = document.getElementById('close-grid-modal-btn');
const loginModal = document.getElementById('login-modal'), closeLoginModalBtn = document.getElementById('close-login-modal-btn'), googleLoginBtn = document.getElementById('google-login-btn'), emailLoginBtn = document.getElementById('email-login-btn'), emailSignupBtn = document.getElementById('email-signup-btn'), emailInput = document.getElementById('email-input'), passwordInput = document.getElementById('password-input'), authError = document.getElementById('auth-error');
const dictModal = document.getElementById('dict-modal'), closeDictModalBtn = document.getElementById('close-dict-modal-btn');
const settingsModal = document.getElementById('settings-modal'), closeSettingsModalBtn = document.getElementById('close-settings-modal-btn');
const topSentinel = document.getElementById('top-sentinel'), bottomSentinel = document.getElementById('bottom-sentinel');

let selectedPexelsImageUrl = null;
let unsubscribeSync = null;

// In-Memory State
let currentUser = null;
let currentFontSize = 1.125, currentLineRatio = 1.75, currentFontFamily = 'Inter', currentIsBold = false, currentContentWidth = 100, currentAccentColor = { color: '#4f46e5', hover: '#4338ca', glow: 'rgba(79,70,229,0.3)' }, currentCustomBg = null, currentCustomText = null;
let currentTranslationName = '';
let customBibles = [];
let customFonts = [];
let currentRefMode = 'dict';
let settingsUpdatedAt = 0;

let highlights = {}, categories = {}, bookmarks = {}, lastRead = { book: 'Genesis', chapter: '1', verse: '1', timestamp: 0 }, staticBookData = {};

let toastTimeout, currentHighlightsCategory = null, currentHighlightsSearch = '';
let isFetching = false, oldestIndex = -1, newestIndex = -1;
const loaderHTML = `<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4 opacity-80"></div><p class="text-xs font-semibold tracking-wider uppercase text-gray-400">Loading...</p>`;

function hexToRgb(hex) { let r = 0, g = 0, b = 0; if (hex.length === 7) { r = parseInt(hex.substring(1, 3), 16); g = parseInt(hex.substring(3, 5), 16); b = parseInt(hex.substring(5, 7), 16); } return { r, g, b }; }
function generateAccentVariants(hex) { const { r, g, b } = hexToRgb(hex); return { color: hex, hover: `#${Math.floor(r*0.8).toString(16).padStart(2,'0')}${Math.floor(g*0.8).toString(16).padStart(2,'0')}${Math.floor(b*0.8).toString(16).padStart(2,'0')}`, glow: `rgba(${r}, ${g}, ${b}, 0.3)` }; }
function showToast(message) { const toast = document.getElementById('toast-notification'); toast.textContent = message; clearTimeout(toastTimeout); toast.classList.add('show'); toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000); }
function updateSelectionText(book, chapter) { document.querySelectorAll('.current-selection-text').forEach(el => el.textContent = `${book} ${chapter}`); }
function toggleMobileSidebar(show) { mobileSidebarContainer.classList.toggle('sidebar-closed-left', !show); }

// --- V2 CLOUD SYNC & LOCAL DATA ENGINE --- //

async function saveToLocalDB() {
    const dataToSave = { 
        settings: buildSettingsObject(), 
        highlights, 
        categories, 
        bookmarks, 
        lastRead 
    }; 
    await localDB.set('bible_data', dataToSave); 
}

async function pushToCloud(updates) {
    if (!currentUser) return;
    try {
        // updates is an object containing exact paths. e.g. { "highlights.Gen 1:1": { color, updatedAt } }
        await window.firebase.setDoc(
            window.firebase.doc(window.firebase.db, "users", currentUser.uid), 
            updates, 
            { merge: true }
        );
    } catch (err) {
        console.error("Cloud push queued/failed:", err);
    }
}

function buildSettingsObject() {
    return {
        translation: document.querySelector('.translation-select').value,
        fontSize: currentFontSize,
        lineRatio: currentLineRatio,
        fontFamily: currentFontFamily,
        isBold: currentIsBold,
        contentWidth: currentContentWidth,
        accentColor: currentAccentColor,
        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        customBibles,
        customFonts,
        customBg: currentCustomBg,
        customText: currentCustomText,
        updatedAt: settingsUpdatedAt
    };
}

function saveSettings() {
    settingsUpdatedAt = Date.now();
    saveToLocalDB();
    pushToCloud({ settings: buildSettingsObject() });
}

function applyLoadedSettings(s, skipSave = false) {
    if (s.customBibles) customBibles = s.customBibles;
    if (s.customFonts) customFonts = s.customFonts;
    
    injectCustomFonts();
    updateTranslationDropdowns(); renderCustomBiblesList();
    updateFontDropdowns(); updateQuoteFontDropdown(); renderCustomFontsList();
    
    if (s.translation) { document.querySelectorAll('.translation-select').forEach(el => el.value = s.translation); }
    if (s.fontSize) { currentFontSize = s.fontSize; changeFontSize(0, true); } 
    if (s.lineRatio) applyLineSpacing(s.lineRatio, true); 
    if (s.isBold !== undefined) applyFontWeight(s.isBold, true); 
    if (s.contentWidth !== undefined) applyContentWidth(s.contentWidth, true); 
    if (s.accentColor) applyAccentColor(s.accentColor, true); 
    if (s.fontFamily) applyFontFamily(s.fontFamily, true); 
    if (s.theme) applyTheme(s.theme, true); 
    applyCustomColors(s.customBg || null, s.customText || null, true);
    
    if (!skipSave) {
        settingsUpdatedAt = s.updatedAt || Date.now();
        saveToLocalDB();
    }
}

function migrateDataStructures(data) {
    // V1 to V2 Migration: Arrays to Granular Objects
    if (Array.isArray(data.bookmarks)) {
        const newB = {};
        data.bookmarks.forEach(ref => newB[ref] = { updatedAt: Date.now() });
        data.bookmarks = newB;
    }
    if (Array.isArray(data.categories)) {
        const newC = {};
        data.categories.forEach(cat => newC[cat] = { updatedAt: Date.now() });
        data.categories = newC;
    }
    // Add timestamps to legacy highlights
    if (data.highlights) {
        Object.values(data.highlights).forEach(h => { if (!h.updatedAt) h.updatedAt = Date.now(); });
    }
    return data;
}

function smartMerge(cloudData) {
    let cloudUpdates = {};
    let uiNeedsUpdate = false;

    const mergeEntityMap = (localMap, cloudMap, pathPrefix) => {
        if (!cloudMap) return;
        
        // Merge cloud to local
        for (const key in cloudMap) {
            const cItem = cloudMap[key];
            const lItem = localMap[key];
            
            if (cItem && !cItem.updatedAt) cItem.updatedAt = 0;
            if (lItem && !lItem.updatedAt) lItem.updatedAt = 0;

            if (!lItem || cItem.updatedAt > lItem.updatedAt) {
                localMap[key] = cItem;
                uiNeedsUpdate = true;
            } else if (lItem.updatedAt > cItem.updatedAt) {
                cloudUpdates[`${pathPrefix}.${key}`] = lItem;
            }
        }
        
        // Push strictly-local missing items to cloud
        for (const key in localMap) {
            if (!cloudMap[key]) {
                cloudUpdates[`${pathPrefix}.${key}`] = localMap[key];
            }
        }
    };

    mergeEntityMap(highlights, cloudData.highlights, 'highlights');
    mergeEntityMap(bookmarks, cloudData.bookmarks, 'bookmarks');
    mergeEntityMap(categories, cloudData.categories, 'categories');

    // Merge Settings
    if (cloudData.settings) {
        const cSet = cloudData.settings;
        if (!cSet.updatedAt) cSet.updatedAt = 0;
        if (cSet.updatedAt > settingsUpdatedAt) {
            applyLoadedSettings(cSet, true); // apply but don't resave yet
            settingsUpdatedAt = cSet.updatedAt;
            uiNeedsUpdate = true;
        } else if (settingsUpdatedAt > cSet.updatedAt) {
            cloudUpdates['settings'] = buildSettingsObject();
        }
    } else {
        cloudUpdates['settings'] = buildSettingsObject();
    }

    // Merge LastRead
    if (cloudData.lastRead) {
        const cLR = cloudData.lastRead;
        if (cLR.timestamp > lastRead.timestamp) {
            lastRead = cLR;
            updateSelectionText(lastRead.book, lastRead.chapter);
            uiNeedsUpdate = true;
        } else if (lastRead.timestamp > cLR.timestamp) {
            cloudUpdates['lastRead'] = lastRead;
        }
    } else {
        cloudUpdates['lastRead'] = lastRead;
    }

    if (Object.keys(cloudUpdates).length > 0) {
        pushToCloud(cloudUpdates); 
    }
    
    if (uiNeedsUpdate) {
        saveToLocalDB();
        renderHighlights();
        
        // Refresh reading view if it matches the screen
        if (document.querySelector('.chapter-heading')) {
            const currentBook = document.querySelector('.chapter-heading').dataset.book;
            const currentChapter = document.querySelector('.chapter-heading').dataset.chapter;
            if (currentBook !== lastRead.book || currentChapter !== lastRead.chapter) {
                loadChapter(lastRead.book, lastRead.chapter, 'clear', lastRead.verse);
            } else {
                // Just re-render active chapter to show newly merged highlights/bookmarks
                loadChapter(lastRead.book, lastRead.chapter, 'clear');
            }
        }
    }
}

async function loadDataFromLocalDB() { 
    let data = await localDB.get('bible_data'); 
    if (data) {
        data = migrateDataStructures(data);
        highlights = data.highlights || {}; 
        categories = data.categories || {}; 
        bookmarks = data.bookmarks || {};
        if (data.settings) applyLoadedSettings(data.settings, true);
        if (data.lastRead) { lastRead = data.lastRead; updateSelectionText(lastRead.book, lastRead.chapter); }
    } else { 
        updateTranslationDropdowns(); 
        updateFontDropdowns(); 
        updateQuoteFontDropdown();
        applyTranslation('drb', true); 
    } 
}

async function exportData() { const data = await localDB.get('bible_data') || {}; const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `SanctaBiblia_Backup_${new Date().toISOString().split('T')[0]}.json`; a.click(); URL.revokeObjectURL(url); showToast("Data exported!"); }
function triggerImport() { document.getElementById('import-file-input').click(); }
document.getElementById('import-file-input').addEventListener('change', (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = async (event) => { try { const data = migrateDataStructures(JSON.parse(event.target.result)); smartMerge(data); showToast("Data imported & synced!"); } catch (err) { showToast("Invalid backup file."); } e.target.value = ''; }; reader.readAsText(file); });

function updateAuthUI(user) {
    const { auth } = window.firebase || {}; 
    const authBtns = document.querySelectorAll('.auth-management-btn');
    
    if (user) { 
        currentUser = user; 
        authBtns.forEach(btn => { 
            btn.textContent = `Logout (${user.email})`; 
            btn.className = 'auth-management-btn w-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-colors font-medium py-2.5 px-4 rounded-lg text-sm'; 
            btn.onclick = () => {
                auth.signOut().then(() => {
                    // On logout, explicitly clear local storage to prevent data bleed
                    localStorage.clear();
                    indexedDB.deleteDatabase("SanctaBibliaDB");
                    window.location.reload();
                });
            }; 
        }); 
        loginModal.classList.add('hidden'); 
        
        // Initialize V2 Real-Time Cloud Listener
        unsubscribeSync = window.firebase.onSnapshot(
            window.firebase.doc(window.firebase.db, "users", currentUser.uid), 
            (doc) => {
                if (doc.exists()) {
                    smartMerge(doc.data());
                } else {
                    // First time login - Push everything up
                    smartMerge({});
                }
            },
            (error) => {
                console.error("Firestore sync error", error);
            }
        );

    } else { 
        if (unsubscribeSync) unsubscribeSync();
        currentUser = null; 
        authBtns.forEach(btn => { 
            btn.textContent = 'Login / Sign Up'; 
            btn.className = 'auth-management-btn w-full btn-secondary font-medium py-2.5 px-4 rounded-lg text-sm'; 
            btn.onclick = () => { loginModal.classList.remove('hidden'); authError.classList.add('hidden'); }; 
        }); 
        loadDataFromLocalDB(); 
    }
}
function showAuthError(message) { authError.textContent = message; authError.classList.remove('hidden'); }

let selectedBookForGrid = null;
function openGridModal() { gridModal.classList.remove('hidden'); showBookGrid(); }
function showBookGrid() {
    gridBookView.classList.replace('slide-left', 'slide-center'); gridChapterView.classList.replace('slide-center', 'slide-right');
    gridModalTitle.textContent = "Select Book"; gridBackBtn.classList.add('opacity-0', 'pointer-events-none');
    const otGrid = document.getElementById('ot-grid'), ntGrid = document.getElementById('nt-grid');
    
    const createBtn = (book) => `<button class="glass-input p-2 rounded-lg font-medium text-xs text-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${book === lastRead.book ? 'ring-1 ring-primary text-primary dark:bg-primary/10' : ''}" onclick="selectGridBook('${book}')">${book}</button>`;
    otGrid.innerHTML = Object.keys(BIBLE_BOOKS["Old Testament"]).map(createBtn).join('');
    ntGrid.innerHTML = Object.keys(BIBLE_BOOKS["New Testament"]).map(createBtn).join('');
}
window.selectGridBook = (book) => {
    selectedBookForGrid = book; gridBookView.classList.replace('slide-center', 'slide-left'); gridChapterView.classList.replace('slide-right', 'slide-center');
    gridModalTitle.textContent = book; gridBackBtn.classList.remove('opacity-0', 'pointer-events-none');
    const chapterGrid = document.getElementById('chapter-grid'); let chapterCount = BIBLE_BOOKS["Old Testament"][book] || BIBLE_BOOKS["New Testament"][book]; let html = '';
    for(let i=1; i<=chapterCount; i++) html += `<button class="glass-input py-3 rounded-lg font-medium text-sm text-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${(book === lastRead.book && i == lastRead.chapter) ? 'bg-primary text-white border-primary dark:bg-primary dark:border-primary' : ''}" onclick="selectGridChapter(${i})">${i}</button>`;
    chapterGrid.innerHTML = html;
};
window.selectGridChapter = (chapter) => { 
    lastRead = { book: selectedBookForGrid, chapter: chapter.toString(), verse: '1', timestamp: Date.now() };
    saveToLocalDB(); pushToCloud({ lastRead });
    
    updateSelectionText(selectedBookForGrid, chapter.toString()); 
    gridModal.classList.add('hidden'); 
    loadChapter(selectedBookForGrid, chapter.toString(), 'clear'); 
};

let scrollTimeout;
mainScrollArea.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (initialMessage.style.display !== 'none') return;
        
        const verses = document.querySelectorAll('.verse-paragraph');
        let topVerse = null;
        const offset = window.innerWidth < 1024 ? 70 : 100; 
        
        for (let i = 0; i < verses.length; i++) {
            if (verses[i].getBoundingClientRect().top >= offset) {
                topVerse = verses[i];
                break;
            }
        }
        
        if (topVerse) {
            const ref = topVerse.dataset.verseRef;
            const match = ref.match(/(.*?)\s+(\d+):(\d+)/);
            if (match) {
                const b = match[1], c = match[2], v = match[3];
                if (lastRead.book !== b || lastRead.chapter !== c || lastRead.verse !== v) {
                    lastRead = { book: b, chapter: c, verse: v, timestamp: Date.now() };
                    updateSelectionText(b, c);
                    saveToLocalDB(); pushToCloud({ lastRead });
                }
            }
        }
    }, 300);
});

const infiniteObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !isFetching && initialMessage.style.display === 'none') {
            if (entry.target.id === 'bottom-sentinel' && newestIndex < flatBible.length - 1) { const next = flatBible[newestIndex + 1]; loadChapter(next.book, next.chapter, 'next'); } 
            else if (entry.target.id === 'top-sentinel' && oldestIndex > 0) { const prev = flatBible[oldestIndex - 1]; loadChapter(prev.book, prev.chapter, 'prev'); }
        }
    });
}, { root: mainScrollArea, rootMargin: '300px' });

function injectCustomFonts() {
    customFonts.forEach(font => {
        const id = `custom-font-${font.replace(/\s+/g, '-')}`;
        if (!document.getElementById(id)) {
            const link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}&display=swap`;
            document.head.appendChild(link);
        }
    });
}

function updateFontDropdowns() {
    document.querySelectorAll('.font-family-select').forEach(select => {
        const currentVal = select.value || currentFontFamily;
        let html = `
            <optgroup label="Sans-Serif">
                <option value="Inter">Inter (Modern)</option>
                <option value="Roboto">Roboto (Clean)</option>
                <option value="Open Sans">Open Sans (Neutral)</option>
                <option value="Lato">Lato (Warm)</option>
                <option value="Nunito">Nunito (Rounded)</option>
                <option value="Quicksand">Quicksand (Soft)</option>
            </optgroup>
            <optgroup label="Serif">
                <option value="Lora">Lora (Elegant)</option>
                <option value="Merriweather">Merriweather (Readable)</option>
                <option value="Tinos">Tinos (Classic)</option>
                <option value="Crimson Pro">Crimson Pro (Traditional)</option>
                <option value="Playfair Display">Playfair (Display)</option>
            </optgroup>
        `;
        if (customFonts.length > 0) {
            html += `<optgroup label="Custom Google Fonts">`;
            customFonts.forEach(font => {
                html += `<option value="${font}">${font}</option>`;
            });
            html += `</optgroup>`;
        }
        select.innerHTML = html;
        if (select.querySelector(`option[value="${currentVal}"]`)) {
            select.value = currentVal;
        } else {
            select.value = 'Inter';
            currentFontFamily = 'Inter';
        }
    });
}

function updateQuoteFontDropdown() {
    const select = document.getElementById('quote-font-select');
    if(!select) return;
    const currentVal = select.value;
    let html = `
        <optgroup label="Sans-Serif">
            <option value="Inter">Inter</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
            <option value="Lato">Lato</option>
            <option value="Nunito">Nunito</option>
            <option value="Quicksand">Quicksand</option>
        </optgroup>
        <optgroup label="Serif">
            <option value="Lora">Lora</option>
            <option value="Merriweather">Merriweather</option>
            <option value="Tinos">Tinos</option>
            <option value="Crimson Pro">Crimson Pro</option>
            <option value="Playfair Display">Playfair</option>
        </optgroup>
        <optgroup label="Handwriting">
            <option value="Caveat">Caveat</option>
        </optgroup>
    `;
    if (customFonts.length > 0) {
        html += `<optgroup label="Custom Google Fonts">`;
        customFonts.forEach(font => {
            html += `<option value="${font}">${font}</option>`;
        });
        html += `</optgroup>`;
    }
    select.innerHTML = html;
    if (select.querySelector(`option[value="${currentVal}"]`)) {
        select.value = currentVal;
    }
}

function renderCustomFontsList() {
    document.querySelectorAll('.custom-fonts-list').forEach(list => {
        list.innerHTML = '';
        customFonts.forEach(font => {
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center glass-input p-2 rounded-lg';
            div.innerHTML = `
                <span class="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate pr-2" style="font-family: '${font}', sans-serif;">${font}</span>
                <button class="text-red-500 hover:text-red-600 transition-colors p-1" onclick="removeCustomFont('${font}')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            `;
            list.appendChild(div);
        });
    });
}

window.removeCustomFont = (fontToRemove) => {
    customFonts = customFonts.filter(f => f !== fontToRemove);
    const id = `custom-font-${fontToRemove.replace(/\s+/g, '-')}`;
    const link = document.getElementById(id);
    if (link) link.remove();
    
    if (currentFontFamily === fontToRemove) applyFontFamily('Inter');
    
    updateFontDropdowns();
    updateQuoteFontDropdown();
    renderCustomFontsList();
    saveSettings();
};

function updateTranslationDropdowns() {
    document.querySelectorAll('.translation-select, #translation-select-quote').forEach(select => {
        const currentVal = select.value;
        let html = `
            <option value="drb" data-name="Douay-Rheims Bible" data-short="DRV" data-base-url="https://exanx.github.io/bible-json/DRB-73-Books">Douay-Rheims Bible</option>
            <option value="cpdv" data-name="Catholic Public Domain Version" data-short="CPDV" data-base-url="https://exanx.github.io/bible-json/CPDV-73-Books">Catholic Public Domain</option>
            <option value="web" data-name="World English Bible: Catholic Edition" data-short="WEBC">World English Bible (CE)</option>
            <option value="kjv" data-name="King James Version (Deuterocanon)" data-short="KJV/D">King James Version (w/ DC)</option>
        `;
        if (customBibles.length > 0) {
            html += `<optgroup label="Custom Bibles">`;
            customBibles.forEach(cb => {
                html += `<option value="custom_${cb.id}" data-name="${cb.name}" data-short="${cb.name}" data-base-url="${cb.url}">${cb.name}</option>`;
            });
            html += `</optgroup>`;
        }
        select.innerHTML = html;
        if (select.querySelector(`option[value="${currentVal}"]`)) select.value = currentVal;
        else select.value = 'drb';
    });
}

function renderCustomBiblesList() {
    document.querySelectorAll('.custom-bibles-list').forEach(list => {
        list.innerHTML = '';
        customBibles.forEach(cb => {
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center glass-input p-2 rounded-lg';
            div.innerHTML = `
                <span class="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate pr-2">${cb.name}</span>
                <button class="text-red-500 hover:text-red-600 transition-colors p-1" onclick="removeCustomBible('${cb.id}')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            `;
            list.appendChild(div);
        });
    });
}

window.removeCustomBible = (id) => {
    customBibles = customBibles.filter(cb => cb.id !== id);
    saveSettings();
    updateTranslationDropdowns();
    renderCustomBiblesList();
    const currentTranslation = document.querySelector('.translation-select').value;
    if (currentTranslation === `custom_${id}`) {
        applyTranslation('drb');
    }
};

async function fetchChapterHTML(book, chapter) {
    const translation = document.querySelector('.translation-select').value; 
    const selectedOption = document.querySelector(`.translation-select option[value="${translation}"]`); 
    let data;
    
    const baseUrl = selectedOption.dataset.baseUrl;
    if (baseUrl) {
        const bookUrl = `${baseUrl}/${encodeURIComponent(book)}.json`;
        try {
            if (!staticBookData[bookUrl]) { 
                const response = await fetch(bookUrl); 
                if (!response.ok) throw new Error("Not Found"); 
                staticBookData[bookUrl] = await response.json(); 
            }
            const bookData = staticBookData[bookUrl]; 
            
            let chapterVerses = [];
            if (bookData.chapters && Array.isArray(bookData.chapters)) {
                const chapObj = bookData.chapters.find(c => c.chapter.toString() === chapter.toString());
                if (!chapObj || !chapObj.verses) throw new Error("Chapter missing");
                chapterVerses = chapObj.verses.map(v => ({ verse: v.verse.toString(), text: v.text }));
            } else {
                if (!bookData[chapter]) throw new Error("Chapter missing");
                chapterVerses = Object.keys(bookData[chapter]).filter(key => !isNaN(key)).map(v => ({ verse: v, text: bookData[chapter][v] }));
            }
            
            data = { reference: `${book} ${chapter}`, translation_name: selectedOption.dataset.name, verses: chapterVerses };
        } catch (e) {
            throw new Error(`This book or chapter is not available in ${selectedOption.dataset.name}.`);
        }
    } else { 
        const res = await fetch(`https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=${translation}`); 
        if (!res.ok) throw new Error("API Error"); 
        data = await res.json(); 
    }
    
    currentTranslationName = data.translation_name; 
    versionSubtitle.textContent = currentTranslationName; 
    document.getElementById('mobile-version-subtitle').textContent = currentTranslationName;
    
    const chapterHighlights = {}, chapterBookmarks = {}; const prefix = `${book} ${chapter}:`;
    for (const ref in highlights) { 
        if (highlights[ref].deleted) continue;
        if (ref.startsWith(prefix)) { const [start, end] = ref.substring(prefix.length).split('-').map(Number); for (let i = start; i <= (end || start); i++) chapterHighlights[i] = highlights[ref].color; } 
    }
    for (const ref in bookmarks) { 
        if (bookmarks[ref].deleted) continue;
        if (ref.startsWith(prefix)) { const [start, end] = ref.substring(prefix.length).split('-').map(Number); for (let i = start; i <= (end || start); i++) chapterBookmarks[i] = true; } 
    }

    let versesHtml = '<div class="space-y-1">';
    data.verses.forEach(v => { 
        const hlClass = chapterHighlights[v.verse] ? `highlight-${chapterHighlights[v.verse]}` : ''; 
        const bmClass = chapterBookmarks[v.verse] ? 'bookmark-visual' : ''; 
        const cleanedText = v.text.replace(/\n/g, ' ').trim();

        versesHtml += `<p class="verse-paragraph ${hlClass} ${bmClass}" data-verse-ref="${prefix}${v.verse}"><sup class="verse-num" title="Verse Actions">${v.verse}</sup> ${cleanedText}</p>`; 
    });
    versesHtml += '</div>';
    return `<h2 class="chapter-heading text-3xl font-bold mt-8 mb-6 pb-2 text-gray-900 dark:text-white tracking-tight" data-book="${book}" data-chapter="${chapter}">${data.reference}</h2>` + versesHtml;
}

function setReferenceTab(mode) {
    currentRefMode = mode;
    const tabDict = document.getElementById('tab-dict');
    const tabWiki = document.getElementById('tab-wiki');
    
    if (mode === 'dict') {
        tabDict.className = 'flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors bg-primary text-white shadow-sm';
        tabWiki.className = 'flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors btn-secondary';
    } else {
        tabWiki.className = 'flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors bg-primary text-white shadow-sm';
        tabDict.className = 'flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors btn-secondary';
    }
}

function openReferenceModal(mode, word = '') {
    setReferenceTab(mode);
    const input = document.getElementById('reference-search-input');
    const modal = document.getElementById('dict-modal');
    modal.classList.remove('hidden');
    
    if (word) {
        input.value = word;
        lookupReferenceWord(word);
    } else {
        input.focus();
    }
}

async function lookupReferenceWord(word) {
    const cleanWord = word.replace(/[^a-zA-Z\s\-']/g, '').trim().toLowerCase();
    const dictContent = document.getElementById('dict-content');
    
    if(!cleanWord) {
        dictContent.innerHTML = `<div class="text-center py-6 text-gray-500 text-sm">Please enter a valid word.</div>`;
        return;
    }
    
    dictContent.innerHTML = `<div class="flex justify-center py-8"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>`;

    let html = '';

    if (currentRefMode === 'dict') {
        try {
            const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`);
            if (dictRes.ok) {
                const data = await dictRes.json();
                const meanings = data[0].meanings.slice(0, 3);
                html = `<h4 class="text-lg font-bold text-gray-900 dark:text-white capitalize mb-4">${cleanWord}</h4>` + meanings.map(m => `
                    <div class="mb-4">
                        <span class="inline-block text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md mb-2">${m.partOfSpeech}</span>
                        <ul class="list-disc pl-5 text-sm text-gray-700 dark:text-gray-300 space-y-1.5">
                            ${m.definitions.slice(0, 3).map(d => `<li>${d.definition}</li>`).join('')}
                        </ul>
                    </div>
                `).join('');
            }
        } catch(e) { console.error('Dict error', e); }
        
        if (!html) html = `<div class="text-center py-6 text-gray-500 text-sm">No dictionary definition found for "${cleanWord}".</div>`;
        
    } else if (currentRefMode === 'wiki') {
        try {
            const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanWord)}`);
            if (wikiRes.ok) {
                const data = await wikiRes.json();
                if (data.type !== 'disambiguation' && data.extract) {
                    html = `
                        <h4 class="text-lg font-bold text-gray-900 dark:text-white capitalize mb-4">${data.title || cleanWord}</h4>
                        <div class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
                            ${data.thumbnail ? `<img src="${data.thumbnail.source}" class="w-full max-h-48 object-cover rounded-lg mb-3 border border-gray-200 dark:border-white/10">` : ''}
                            <p>${data.extract}</p>
                            <a href="${data.content_urls.desktop.page}" target="_blank" class="inline-flex items-center gap-1 mt-2 text-primary hover:underline font-semibold text-xs uppercase tracking-wider">Read more on Wikipedia <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>
                        </div>
                    `;
                }
            }
        } catch(e) { console.error('Wiki error', e); }
        
        if (!html) html = `<div class="text-center py-6 text-gray-500 text-sm">No Wikipedia article found for "${cleanWord}".</div>`;
    }

    dictContent.innerHTML = html;
}

async function loadChapter(book, chapter, direction = 'clear', targetVerse = null) {
    if (isFetching) return; isFetching = true;
    const targetIndex = flatBible.findIndex(b => b.book === book && b.chapter === chapter); if (targetIndex === -1) { isFetching = false; return; }

    if (direction === 'clear') { if(initialMessage) initialMessage.style.display = 'none'; scriptureDisplay.innerHTML = `<div class="text-center py-20">${loaderHTML}</div>`; toggleMobileSidebar(false); } 
    else if (direction === 'next') { bottomSentinel.innerHTML = `<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>`; bottomSentinel.classList.remove('opacity-0'); } 
    else if (direction === 'prev') { topSentinel.innerHTML = `<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>`; topSentinel.classList.remove('opacity-0'); }

    try {
        const html = await fetchChapterHTML(book, chapter); const wrapper = document.createElement('div'); wrapper.className = 'chapter-wrapper relative pb-16 pt-4'; wrapper.innerHTML = html; 
        
        wrapper.querySelectorAll('[data-verse-ref]').forEach(el => el.addEventListener('click', showHighlightPopup));
        
        if (direction === 'clear') { 
            scriptureDisplay.innerHTML = ''; 
            scriptureDisplay.appendChild(wrapper); 
            
            if (targetVerse) {
                setTimeout(() => {
                    const el = document.querySelector(`[data-verse-ref="${book} ${chapter}:${targetVerse}"]`);
                    if (el) {
                        el.scrollIntoView({ behavior: 'auto', block: 'center' });
                        el.style.transition = 'background-color 0.5s ease';
                        el.style.backgroundColor = 'var(--color-primary-glow)';
                        setTimeout(() => el.style.backgroundColor = '', 3000);
                    }
                    else mainScrollArea.scrollTop = 0;
                }, 50);
            } else {
                mainScrollArea.scrollTop = 0; 
            }
            
            oldestIndex = targetIndex; 
            newestIndex = targetIndex; 
        } 
        else if (direction === 'next') { scriptureDisplay.appendChild(wrapper); newestIndex = targetIndex; } 
        else if (direction === 'prev') { const oldScrollHeight = mainScrollArea.scrollHeight; const oldScrollTop = mainScrollArea.scrollTop; scriptureDisplay.insertAdjacentElement('afterbegin', wrapper); const newScrollHeight = mainScrollArea.scrollHeight; mainScrollArea.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight); oldestIndex = targetIndex; }

        const loadedChapters = scriptureDisplay.querySelectorAll('.chapter-wrapper');
        if (loadedChapters.length > 5) {
            if (direction === 'next') { const first = loadedChapters[0]; const h = first.getBoundingClientRect().height; first.remove(); mainScrollArea.scrollTop -= h; oldestIndex++; } 
            else if (direction === 'prev') { const last = loadedChapters[loadedChapters.length - 1]; last.remove(); newestIndex--; }
        }
    } catch (err) { if(direction === 'clear') scriptureDisplay.innerHTML = `<div class="text-center p-6 bg-red-50 dark:bg-red-500/10 rounded-xl mt-4"><p class="text-red-500 text-sm">${err.message}</p></div>`; } 
    finally { bottomSentinel.classList.add('opacity-0'); bottomSentinel.innerHTML = ''; topSentinel.classList.add('opacity-0'); topSentinel.innerHTML = ''; setTimeout(() => { isFetching = false; }, 50); }
}

async function parseAndFetchVerse(inputString) {
    if (!inputString) return; let input = inputString.toLowerCase().trim().replace(/\s+/g, ' ');
    const fullNames = Object.keys(BIBLE_BOOKS["Old Testament"]).concat(Object.keys(BIBLE_BOOKS["New Testament"])); const searchKeys = [...fullNames.map(n => n.toLowerCase()), ...Object.keys(bookAliases)].sort((a, b) => b.length - a.length);
    let foundBook = null, remainingString = '';
    for (const key of searchKeys) { if (input.startsWith(key)) { const nextChar = input.charAt(key.length); if (!nextChar || nextChar === ' ' || !isNaN(nextChar)) { foundBook = bookAliases[key] || fullNames.find(n => n.toLowerCase() === key); remainingString = input.substring(key.length).trim(); break; } } }
    if (!foundBook) return showToast("Book not found.");
    let chapter = '1', verse = null; if (remainingString) { const parts = remainingString.match(/^(\d+)(?:[\s:.-]+(\d+))?/); if (!parts) return showToast("Invalid format."); chapter = parts[1]; if (parts[2]) verse = parts[2]; }
    const chapterCount = BIBLE_BOOKS["Old Testament"][foundBook] || BIBLE_BOOKS["New Testament"][foundBook]; if (parseInt(chapter) > chapterCount || parseInt(chapter) < 1) return showToast(`Chapter ${chapter} does not exist in ${foundBook}.`);
    updateSelectionText(foundBook, chapter); document.querySelectorAll('.direct-verse-input').forEach(i => i.value = ''); toggleMobileSidebar(false); 
    
    await loadChapter(foundBook, chapter, 'clear', verse);
}

function applyLineSpacing(ratio, skipSave = false) { currentLineRatio = ratio; document.documentElement.style.setProperty('--line-height-ratio', ratio); document.querySelectorAll('.line-spacing-btn').forEach(btn => { if (parseFloat(btn.dataset.ratio) === parseFloat(ratio)) { btn.classList.add('text-primary'); btn.classList.remove('text-gray-400'); } else { btn.classList.remove('text-primary'); btn.classList.add('text-gray-400'); } }); if(!skipSave) saveSettings(); }
function changeFontSize(amount, skipSave = false) { currentFontSize = Math.max(0.875, Math.min(1.75, currentFontSize + amount)); document.documentElement.style.setProperty('--font-size-base', `${currentFontSize}rem`); if(!skipSave) saveSettings(); }
function applyFontFamily(fontName, skipSave = false) { currentFontFamily = fontName; document.documentElement.style.setProperty('--font-family-base', `"${fontName}"`); document.querySelectorAll('.font-family-select').forEach(el => el.value = fontName); if(!skipSave) saveSettings(); }
function applyFontWeight(isBold, skipSave = false) { currentIsBold = isBold; document.documentElement.style.setProperty('--font-weight-base', isBold ? '600' : '400'); document.querySelectorAll('.font-weight-toggle').forEach(btn => btn.classList.toggle('text-gray-800', isBold)); document.querySelectorAll('.font-weight-toggle').forEach(btn => btn.classList.toggle('dark:text-white', isBold)); if(!skipSave) saveSettings(); }
function applyContentWidth(width, skipSave = false) { currentContentWidth = width; document.documentElement.style.setProperty('--content-width', width); document.querySelectorAll('.content-width-slider').forEach(slider => slider.value = width); if(!skipSave) saveSettings(); }

function applyCustomColors(bg, text, skipSave = false) {
    currentCustomBg = bg; currentCustomText = text;
    if (bg) document.body.style.setProperty('--custom-bg', bg); else document.body.style.removeProperty('--custom-bg');
    if (text) document.body.style.setProperty('--custom-text', text); else document.body.style.removeProperty('--custom-text');
    document.querySelectorAll('.custom-bg-picker').forEach(el => el.value = bg || (document.documentElement.classList.contains('dark') ? '#000000' : '#f9fafb'));
    document.querySelectorAll('.custom-text-picker').forEach(el => el.value = text || (document.documentElement.classList.contains('dark') ? '#e5e5e5' : '#111827'));
    if(!skipSave) saveSettings();
}

function applyTheme(theme, skipSave = false) { 
    document.documentElement.classList.toggle('dark', theme === 'dark'); 
    document.querySelectorAll('.theme-icon-light').forEach(el => el.classList.toggle('hidden', theme === 'dark')); 
    document.querySelectorAll('.theme-icon-dark').forEach(el => el.classList.toggle('hidden', theme !== 'dark')); 
    document.querySelectorAll('.theme-text').forEach(el => el.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode'); 
    if (!currentCustomBg) document.querySelectorAll('.custom-bg-picker').forEach(el => el.value = theme === 'dark' ? '#000000' : '#f9fafb');
    if (!currentCustomText) document.querySelectorAll('.custom-text-picker').forEach(el => el.value = theme === 'dark' ? '#e5e5e5' : '#111827');
    if(!skipSave) saveSettings(); 
}

function applyTranslation(value, skipSave = false) { 
    document.querySelectorAll('.translation-select').forEach(el => el.value = value); 
    if(!skipSave) { 
        if(lastRead.book) loadChapter(lastRead.book, lastRead.chapter, 'clear', lastRead.verse); 
        saveSettings(); 
    } 
}
function applyAccentColor(accentObj, skipSave = false) { currentAccentColor = accentObj; document.documentElement.style.setProperty('--color-primary', accentObj.color); document.documentElement.style.setProperty('--color-primary-hover', accentObj.hover); document.documentElement.style.setProperty('--color-primary-glow', accentObj.glow); let foundStandard = false; document.querySelectorAll('.accent-picker').forEach(btn => { const isActive = btn.dataset.color === accentObj.color; btn.classList.toggle('active', isActive); if (isActive) foundStandard = true; }); document.querySelectorAll('.custom-accent-container').forEach(container => { container.classList.toggle('active', !foundStandard); const input = container.querySelector('.custom-accent-picker'); if (input && accentObj.color.length === 7) input.value = accentObj.color; }); if(!skipSave) saveSettings(); }

function populateBooks(selectElement) { selectElement.innerHTML = ''; Object.keys(BIBLE_BOOKS).forEach(testament => { const optgroup = document.createElement('optgroup'); optgroup.label = testament; Object.keys(BIBLE_BOOKS[testament]).forEach(bookName => { const option = document.createElement('option'); option.value = bookName; option.textContent = bookName; optgroup.appendChild(option); }); selectElement.appendChild(optgroup); }); }
function populateChapters(bookSelect, chapterSelect) { const book = bookSelect.value; let chapterCount = BIBLE_BOOKS["Old Testament"][book] || BIBLE_BOOKS["New Testament"][book] || 1; chapterSelect.innerHTML = ''; for (let i = 1; i <= chapterCount; i++) { const option = document.createElement('option'); option.value = i; option.textContent = `Chapter ${i}`; chapterSelect.appendChild(option); } }
function openQuoteModal(defaultBook, defaultChapter, defaultFrom, defaultTo) { populateBooks(quoteBookSelect); quoteBookSelect.value = defaultBook || lastRead.book; populateChapters(quoteBookSelect, quoteChapterSelect); if(defaultChapter) quoteChapterSelect.value = defaultChapter; quoteVerseFromEl.value = defaultFrom || ''; quoteVerseToEl.value = defaultTo || ''; document.getElementById('translation-select-quote').value = document.querySelector('.translation-select').value || 'drb'; quoteModal.classList.remove('hidden'); }

async function searchPexels() {
    const query = document.getElementById('pexels-search-input').value.trim();
    if (!query) return;
    const resultsContainer = document.getElementById('pexels-results');
    resultsContainer.innerHTML = '<div class="text-xs text-gray-500 py-4 w-full text-center animate-pulse">Searching Pexels...</div>';
    resultsContainer.classList.remove('hidden');
    try {
        const res = await fetch(`https://pexels-apikey.exanxlk.workers.dev/?query=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        resultsContainer.innerHTML = '';
        if (data.photos.length === 0) { resultsContainer.innerHTML = '<div class="text-xs text-gray-500 py-4 w-full text-center">No images found.</div>'; return; }
        data.photos.forEach(photo => {
            const img = document.createElement('img');
            img.src = photo.src.tiny;
            img.dataset.largeSrc = photo.src.large2x;
            img.className = 'w-16 h-24 object-cover rounded-md cursor-pointer border-2 border-transparent hover:border-primary flex-shrink-0 transition-all';
            img.onclick = () => {
                document.querySelectorAll('#pexels-results img').forEach(i => i.classList.replace('border-primary', 'border-transparent'));
                img.classList.replace('border-transparent', 'border-primary');
                selectedPexelsImageUrl = img.dataset.largeSrc;
                document.getElementById('clear-bg-image-btn').classList.remove('hidden');
            };
            resultsContainer.appendChild(img);
        });
    } catch (err) { resultsContainer.innerHTML = `<div class="text-[10px] text-red-500 py-2">Error connecting to Pexels. Please try again.</div>`; }
}

async function generateAndDownloadQuote() {
    const verseFrom = quoteVerseFromEl.value, verseTo = quoteVerseToEl.value || verseFrom; if (!verseFrom) return showToast('Enter start verse.');
    const generateBtn = document.getElementById('generate-and-download-btn'); quoteLoader.classList.remove('hidden'); generateBtn.disabled = true;
    const book = quoteBookSelect.value, chapter = quoteChapterSelect.value; const verseRange = verseFrom === verseTo ? verseFrom : `${verseFrom}-${verseTo}`;
    try {
        let verseText = '', refText = '', shortVersionName = ''; const translationSelect = document.getElementById('translation-select-quote'); const translation = translationSelect.value; const selectedOption = translationSelect.options[translationSelect.selectedIndex];
        const baseUrl = selectedOption.dataset.baseUrl;
        
        if (baseUrl) {
            const bookUrl = `${baseUrl}/${encodeURIComponent(book)}.json`;
            if (!staticBookData[bookUrl]) {
                const res = await fetch(bookUrl);
                if(!res.ok) throw new Error("Book not available in this translation.");
                staticBookData[bookUrl] = await res.json();
            }
            const bookData = staticBookData[bookUrl]; 
            
            let versesToQuote = [];
            if (bookData.chapters && Array.isArray(bookData.chapters)) {
                const chapObj = bookData.chapters.find(c => c.chapter.toString() === chapter.toString());
                if (!chapObj || !chapObj.verses) throw new Error("Chapter missing.");
                for (let i = parseInt(verseFrom); i <= parseInt(verseTo); i++) {
                    const vObj = chapObj.verses.find(v => v.verse.toString() === i.toString());
                    if (vObj) versesToQuote.push(vObj.text);
                }
            } else {
                const chapterData = bookData[chapter]; 
                if (!chapterData) throw new Error("Chapter missing.");
                for (let i = parseInt(verseFrom); i <= parseInt(verseTo); i++) {
                    if (chapterData[i]) versesToQuote.push(chapterData[i]); 
                }
            }
            if (versesToQuote.length === 0) throw new Error("Verses missing.");
            
            verseText = versesToQuote.join(' '); shortVersionName = selectedOption.dataset.short || selectedOption.dataset.name; refText = `— ${book} ${chapter}:${verseRange} (${shortVersionName})`;
        } else { 
            const data = await (await fetch(`https://bible-api.com/${encodeURIComponent(book)}+${chapter}:${verseRange}?translation=${translation}`)).json(); 
            verseText = data.verses.map(v => v.text.replace(/\n/g, ' ').trim()).join(' '); shortVersionName = selectedOption.dataset.short || selectedOption.dataset.name; refText = `— ${data.reference} (${shortVersionName})`; 
        }
        await downloadCanvasQuote({ text: verseText, ref: refText, fileName: `${book.replace(/\s+/g, '_')}_${chapter}_${verseRange}.png` }); quoteLoader.classList.add('hidden');
    } catch (error) { quoteLoader.textContent = error.message; quoteLoader.classList.add('text-red-500'); } finally { generateBtn.disabled = false; }
}

async function downloadCanvasQuote(quoteData) {
    const { text, ref, fileName } = quoteData; const selectedFont = quoteFontSelect.value; const canvasWidth = 1200, maxCanvasHeight = 1600, minCanvasHeight = 1200, padding = 100, textMaxWidth = canvasWidth - (padding * 2);
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
    try { await document.fonts.load(`italic 60px "${selectedFont}"`); await document.fonts.load(`40px Inter`); await document.fonts.load(`20px Inter`); } catch (err) {}
    let verseFontSize = 65, refFontSize = 35, verseLineHeight, verseFont, totalContentHeight, finalLines = [];
    while (verseFontSize >= 25) {
        verseLineHeight = verseFontSize * 1.5; verseFont = `italic ${verseFontSize}px "${selectedFont}"`; ctx.font = verseFont;
        const words = text.split(' '); let line = ''; finalLines = [];
        for(let n = 0; n < words.length; n++) { const testLine = line + words[n] + ' '; if (ctx.measureText(testLine).width > textMaxWidth && n > 0) { finalLines.push(line); line = words[n] + ' '; } else line = testLine; }
        finalLines.push(line); totalContentHeight = (finalLines.length * verseLineHeight) + (refFontSize * 1.5) + 80; 
        if (totalContentHeight + (padding * 2) <= maxCanvasHeight) break; verseFontSize -= 3; refFontSize = Math.max(20, refFontSize - 1.5); 
    }
    canvas.width = canvasWidth; canvas.height = Math.max(minCanvasHeight, Math.min(maxCanvasHeight, totalContentHeight + (padding * 2)));
    
    const bgColor = document.getElementById('quote-bg-color').value;
    
    if (selectedPexelsImageUrl) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error("Failed to load background image."));
            img.src = selectedPexelsImageUrl;
        });
        
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio  = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width*ratio) / 2;
        const centerShift_y = (canvas.height - img.height*ratio) / 2;
        
        ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width*ratio, img.height*ratio);
        
        const hex = bgColor.replace('#', '');
        const r = parseInt(hex.substring(0,2), 16) || 0;
        const g = parseInt(hex.substring(2,4), 16) || 0;
        const b = parseInt(hex.substring(4,6), 16) || 0;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.65)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const hex = bgColor.replace('#', ''); const r = parseInt(hex.substring(0,2), 16)||0, g = parseInt(hex.substring(2,4), 16)||0, b = parseInt(hex.substring(4,6), 16)||0;
    const refColor = (0.2126 * r + 0.7152 * g + 0.0722 * b) < 128 ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'; 
    ctx.textAlign = 'center'; ctx.textBaseline = 'top'; let startY = (canvas.height - totalContentHeight) / 2; ctx.font = verseFont; ctx.fillStyle = document.getElementById('quote-text-color').value;
    for(let i = 0; i < finalLines.length; i++) { ctx.fillText(finalLines[i].trim(), canvas.width / 2, startY); startY += verseLineHeight; }
    startY += 60; ctx.font = `500 ${refFontSize}px Inter`; ctx.fillStyle = refColor; ctx.fillText(ref, canvas.width / 2, startY);
    ctx.font = '500 20px Inter'; ctx.fillText('bibliasacra.web.app', canvas.width / 2, canvas.height - 40);
    const link = document.createElement('a'); link.download = fileName; link.href = canvas.toDataURL('image/png'); link.click();
}

function getVerseRangeText() {
    const fromVerse = parseInt(document.getElementById('popup-verse-from').value), toVerse = parseInt(document.getElementById('popup-verse-to').value);
    const book = highlightPopupContainer.dataset.currentBook, chapter = highlightPopupContainer.dataset.currentChapter;
    if (isNaN(fromVerse) || isNaN(toVerse) || fromVerse > toVerse) return { text: '', reference: '' };
    let verses = []; for (let i = fromVerse; i <= toVerse; i++) { const el = document.querySelector(`[data-verse-ref="${book} ${chapter}:${i}"]`); if (el) verses.push(el.textContent.replace(/^\d+/, '').trim()); }
    return { text: verses.join(' '), reference: `${book} ${chapter}:${fromVerse === toVerse ? fromVerse : `${fromVerse}-${toVerse}`}` };
}

function showHighlightPopup(e) {
    if (window.getSelection().toString().trim().length > 0) return; 
    if (!e.target.closest('.verse-num')) return; 
    
    const verseRef = e.currentTarget.dataset.verseRef; const [, book, chapter, verseStr] = verseRef.match(/(.*?)\s+(\d+):(\d+)/); const verse = parseInt(verseStr);
    highlightPopupContainer.dataset.currentBook = book; highlightPopupContainer.dataset.currentChapter = chapter;
    const fromInput = document.getElementById('popup-verse-from'), toInput = document.getElementById('popup-verse-to'); fromInput.value = verse; toInput.value = verse;
    const noteInput = document.getElementById('highlight-note-input');
    let foundHighlight = null, foundRef = ''; const prefix = `${book} ${chapter}:`;
    
    for (const ref in highlights) { 
        if (highlights[ref].deleted) continue;
        if (ref.startsWith(prefix)) { 
            const [startStr, endStr] = ref.substring(prefix.length).split('-'); 
            const start = parseInt(startStr), end = endStr ? parseInt(endStr) : start; 
            if (verse >= start && verse <= end) { foundHighlight = highlights[ref]; fromInput.value = start; toInput.value = end; foundRef = ref; break; } 
        } 
    }
    highlightPopupContainer.dataset.originalRef = foundRef; updateVerseRefDisplay(); highlightPopupContainer.classList.remove('hidden');
    noteInput.value = foundHighlight?.note || ''; 
    populateCategorySelect(document.getElementById('highlight-category-select'), foundHighlight?.category);
    document.querySelectorAll('#highlight-popup .color-swatch').forEach(swatch => { swatch.classList.remove('selected'); if (foundHighlight && swatch.dataset.color === foundHighlight.color) swatch.classList.add('selected'); });
}

function updateVerseRefDisplay() {
    const book = highlightPopupContainer.dataset.currentBook, chapter = highlightPopupContainer.dataset.currentChapter, fromVerse = document.getElementById('popup-verse-from').value, toVerse = document.getElementById('popup-verse-to').value;
    if (!book || !chapter || !fromVerse || !toVerse) return;
    const newRef = `${book} ${chapter}:${parseInt(fromVerse) === parseInt(toVerse) ? fromVerse : `${fromVerse}-${toVerse}`}`;
    document.getElementById('highlight-verse-ref-display').textContent = newRef; 
    document.getElementById('bookmark-btn-text').textContent = (bookmarks[newRef] && !bookmarks[newRef].deleted) ? 'Remove' : 'Bookmark';
}

function hideHighlightPopup() { highlightPopupContainer.classList.add('hidden'); }

function saveHighlight() {
    const fromVerse = parseInt(document.getElementById('popup-verse-from').value), toVerse = parseInt(document.getElementById('popup-verse-to').value); if (isNaN(fromVerse) || isNaN(toVerse) || fromVerse > toVerse) return;
    const book = highlightPopupContainer.dataset.currentBook, chapter = highlightPopupContainer.dataset.currentChapter, originalRef = highlightPopupContainer.dataset.originalRef;
    const note = document.getElementById('highlight-note-input').value, category = document.getElementById('highlight-category-select').value, color = document.querySelector('#highlight-popup .color-swatch.selected')?.dataset.color || 'yellow';
    const newRef = `${book} ${chapter}:${fromVerse === toVerse ? fromVerse : `${fromVerse}-${toVerse}`}`;
    const firstVerseDOM = document.querySelector(`[data-verse-ref="${book} ${chapter}:${fromVerse}"]`); const verseText = firstVerseDOM ? firstVerseDOM.textContent.replace(/^\d+/, '').trim() : '';
    
    let updates = {};
    if (originalRef && originalRef !== newRef) {
        highlights[originalRef] = { deleted: true, updatedAt: Date.now() };
        updates[`highlights.${originalRef}`] = highlights[originalRef];
    }
    highlights[newRef] = { color, note, category, verseText, updatedAt: Date.now() };
    updates[`highlights.${newRef}`] = highlights[newRef];
    
    pushToCloud(updates);
    saveToLocalDB();
    
    hideHighlightPopup(); loadChapter(lastRead.book, lastRead.chapter, 'clear', lastRead.verse);
}

function removeHighlight() { 
    const originalRef = highlightPopupContainer.dataset.originalRef; 
    if (originalRef) {
        highlights[originalRef] = { deleted: true, updatedAt: Date.now() };
        pushToCloud({ [`highlights.${originalRef}`]: highlights[originalRef] });
        saveToLocalDB();
    }
    hideHighlightPopup(); loadChapter(lastRead.book, lastRead.chapter, 'clear', lastRead.verse);
}

function resetSettings() {
    if(confirm('Reset appearance and typography settings to default?')) {
        currentFontSize = 1.125;
        document.documentElement.style.setProperty('--font-size-base', `${currentFontSize}rem`);
        applyLineSpacing(1.75, true);
        applyFontFamily('Inter', true);
        applyFontWeight(false, true);
        applyContentWidth(100, true);
        applyCustomColors(null, null, true);
        applyAccentColor({ color: '#4f46e5', hover: '#4338ca', glow: 'rgba(79,70,229,0.3)' }, true);
        applyTheme('dark', true);
        document.querySelectorAll('.theme-preset-select').forEach(sel => sel.value = 'custom');
        
        saveSettings();
        showToast('Settings reset to default');
    }
}

async function resetApp() { 
    if (confirm('Erase all local & synced data and restore factory settings?')) { 
        if (currentUser) await window.firebase.setDoc(window.firebase.doc(window.firebase.db, "users", currentUser.uid), {}); 
        localStorage.clear();
        indexedDB.deleteDatabase("SanctaBibliaDB");
        window.location.reload(); 
    } 
}

function populateCategorySelect(selectEl, selectedCategory) { 
    selectEl.innerHTML = '<option value="">Uncategorized</option>'; 
    Object.keys(categories).filter(c => !categories[c].deleted).sort().forEach(cat => { 
        const option = document.createElement('option'); option.value = cat; option.textContent = cat; 
        if (cat === selectedCategory) option.selected = true; selectEl.appendChild(option); 
    }); 
}
function addCategory() { 
    const input = document.getElementById('new-category-input'); const newCategory = input.value.trim(); 
    if (newCategory && (!categories[newCategory] || categories[newCategory].deleted)) { 
        categories[newCategory] = { updatedAt: Date.now() };
        saveToLocalDB(); pushToCloud({ [`categories.${newCategory}`]: categories[newCategory] });
        populateCategorySelect(document.getElementById('highlight-category-select'), newCategory); 
    } 
    input.value = ''; 
}

async function loadAndScrollToHighlight(ref) {
    document.getElementById('highlights-modal').classList.add('hidden'); const parts = ref.match(/(.*?)\s+(\d+):(\d+)/); if (!parts) return;
    updateSelectionText(parts[1], parts[2]); 
    await loadChapter(parts[1], parts[2], 'clear', parts[3]);
}

function renderHighlights() {
    const allTags = new Set(); 
    Object.values(highlights).forEach(h => { if (!h.deleted && h.category) allTags.add(h.category); });
    const tagsContainer = document.getElementById('highlights-category-filter'); 
    tagsContainer.innerHTML = `<button class="tag-btn ${!currentHighlightsCategory ? 'selected' : ''} btn-secondary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full" data-category="all">All</button>`;
    
    [...allTags].sort().forEach(tag => { tagsContainer.innerHTML += `<button class="tag-btn ${currentHighlightsCategory === tag ? 'selected' : ''} btn-secondary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full" data-category="${tag}">${tag}</button>`; });
    tagsContainer.querySelectorAll('.tag-btn').forEach(btn => btn.addEventListener('click', (e) => { currentHighlightsCategory = e.target.dataset.category === 'all' ? null : e.target.dataset.category; renderHighlights(); }));

    const activeHighlights = Object.keys(highlights).filter(r => !highlights[r].deleted);

    if (activeHighlights.length === 0) { highlightsContent.innerHTML = `<p class="text-gray-400 text-sm text-center py-10">No highlights found.</p>`; return; }
    const groupedByBook = {}; const searchTerm = currentHighlightsSearch.toLowerCase();
    
    for (const ref of activeHighlights) {
        const highlight = highlights[ref]; 
        if (currentHighlightsCategory && highlight.category !== currentHighlightsCategory) continue;
        const textToSearch = `${ref} ${highlight.note || ''} ${highlight.verseText || ''} ${highlight.category || ''}`.toLowerCase();
        if (searchTerm && !textToSearch.includes(searchTerm)) continue;
        const book = ref.substring(0, ref.lastIndexOf(' ')); if (!groupedByBook[book]) groupedByBook[book] = []; groupedByBook[book].push(ref);
    }
    
    if (Object.keys(groupedByBook).length === 0) { highlightsContent.innerHTML = `<p class="text-gray-400 text-sm text-center py-10">No results match.</p>`; return; }

    let html = '';
    for (const book in groupedByBook) {
        html += `<h3 class="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mt-6 mb-3 ml-1">${book}</h3>`;
        groupedByBook[book].sort((a, b) => { const aParts = a.match(/:(\d+)/), bParts = b.match(/:(\d+)/); return (aParts ? parseInt(aParts[1]) : 0) - (bParts ? parseInt(bParts[1]) : 0); }).forEach(ref => {
            const highlight = highlights[ref]; const storedVerseText = highlight.verseText || 'Read chapter to view.'; const catHtml = highlight.category ? `<span class="bg-gray-100 dark:bg-white/5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-gray-500">${highlight.category}</span>` : '';
            html += `
                <div class="mb-4 p-4 border-l-2 border-${highlight.color}-400 glass-input rounded-r-xl highlight-card" data-ref="${ref}">
                    <div class="flex justify-between items-center mb-1">
                        <p class="text-xs font-bold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-primary transition-colors load-highlight-ref">${ref}</p>
                        ${catHtml}
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 cursor-pointer load-highlight-ref line-clamp-2">${storedVerseText}</p>
                    
                    <div class="note-container border-t border-gray-100 dark:border-white/10 pt-3 mt-2">
                        <div class="note-view-mode ${highlight.note ? '' : 'hidden'} group relative bg-gray-50 dark:bg-black/20 rounded-lg p-3 border border-gray-200 dark:border-white/5">
                            <div class="prose prose-sm dark:prose-invert max-w-none text-sm note-content">
                                ${marked.parse(highlight.note || '')}
                            </div>
                            <button class="edit-note-btn absolute top-2 right-2 p-1.5 bg-white dark:bg-zinc-800 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-primary border border-gray-200 dark:border-white/10" data-ref="${ref}" title="Edit Note">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                        </div>
                        
                        <button class="add-note-btn ${highlight.note ? 'hidden' : 'flex'} items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors" data-ref="${ref}">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Add Note
                        </button>

                        <div class="note-edit-mode hidden flex-col gap-2">
                            <textarea class="note-textarea glass-input w-full p-3 rounded-lg text-sm outline-none resize-y min-h-[80px]" data-ref="${ref}" placeholder="Write your note here (Markdown supported)...">${highlight.note || ''}</textarea>
                            <div class="flex gap-2 justify-end">
                                <button class="cancel-note-btn px-3 py-1.5 rounded-md text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" data-ref="${ref}">Cancel</button>
                                <button class="save-note-btn px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-white hover:bg-primary-hover transition-colors shadow-sm" data-ref="${ref}">Save</button>
                            </div>
                        </div>
                    </div>
                </div>`;
        });
    }
    highlightsContent.innerHTML = html;
}

window.onload = async () => {
    updateFontDropdowns();
    updateQuoteFontDropdown();

    const sidebarTemplate = document.getElementById('sidebar-content-template');
    document.getElementById('desktop-sidebar-controls').append(sidebarTemplate.content.cloneNode(true));
    document.getElementById('mobile-sidebar-controls').append(sidebarTemplate.content.cloneNode(true));
    
    document.querySelectorAll('.open-grid-modal-btn').forEach(btn => btn.addEventListener('click', openGridModal));
    document.getElementById('grid-back-btn').addEventListener('click', showBookGrid); closeGridModalBtn.addEventListener('click', () => gridModal.classList.add('hidden'));

    const inputs = document.querySelectorAll('.direct-verse-input');
    document.querySelectorAll('.direct-verse-search-btn').forEach(btn => btn.addEventListener('click', (e) => parseAndFetchVerse(e.target.parentElement.querySelector('.direct-verse-input').value)));
    inputs.forEach(input => { input.addEventListener('keypress', e => { if (e.key === 'Enter') parseAndFetchVerse(e.target.value); }); input.addEventListener('input', e => inputs.forEach(i => { if (i !== e.target) i.value = e.target.value; })); });
    
    document.querySelectorAll('.font-increase').forEach(btn => btn.addEventListener('click', () => changeFontSize(0.125))); document.querySelectorAll('.font-decrease').forEach(btn => btn.addEventListener('click', () => changeFontSize(-0.125)));
    document.querySelectorAll('.line-spacing-btn').forEach(btn => btn.addEventListener('click', (e) => applyLineSpacing(e.currentTarget.dataset.ratio))); document.querySelectorAll('.font-weight-toggle').forEach(btn => btn.addEventListener('click', () => applyFontWeight(!currentIsBold)));
    document.querySelectorAll('.content-width-slider').forEach(slider => { slider.addEventListener('input', (e) => applyContentWidth(e.target.value, true)); slider.addEventListener('change', (e) => applyContentWidth(e.target.value, false)); });
    document.querySelectorAll('.theme-toggle').forEach(btn => btn.addEventListener('click', () => applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark'))); document.querySelectorAll('.font-family-select').forEach(sel => sel.addEventListener('change', (e) => applyFontFamily(e.target.value)));
    
    document.querySelectorAll('.theme-preset-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
            const preset = THEME_PRESETS[e.target.value];
            if (preset) {
                applyTheme(preset.theme, true);
                applyCustomColors(preset.bg, preset.text, false);
            }
        });
    });

    document.querySelectorAll('.custom-bg-picker').forEach(picker => { 
        const updater = (e) => { applyCustomColors(e.target.value, currentCustomText, false); document.querySelectorAll('.theme-preset-select').forEach(sel => sel.value = 'custom'); }; 
        picker.addEventListener('input', updater); picker.addEventListener('change', updater); 
    });
    document.querySelectorAll('.custom-text-picker').forEach(picker => { 
        const updater = (e) => { applyCustomColors(currentCustomBg, e.target.value, false); document.querySelectorAll('.theme-preset-select').forEach(sel => sel.value = 'custom'); }; 
        picker.addEventListener('input', updater); picker.addEventListener('change', updater); 
    });
    document.querySelectorAll('.reset-colors-btn').forEach(btn => { 
        btn.addEventListener('click', () => { applyCustomColors(null, null, false); document.querySelectorAll('.theme-preset-select').forEach(sel => sel.value = 'custom'); }); 
    });
    
    document.querySelectorAll('.accent-picker').forEach(btn => btn.addEventListener('click', (e) => applyAccentColor({ color: e.target.dataset.color, hover: e.target.dataset.hover, glow: e.target.dataset.glow }))); document.querySelectorAll('.custom-accent-picker').forEach(picker => { const updater = (e) => applyAccentColor(generateAccentVariants(e.target.value)); picker.addEventListener('input', updater); picker.addEventListener('change', updater); });

    document.querySelectorAll('.add-custom-font-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const container = e.target.closest('div.flex');
            const input = container.querySelector('.custom-font-name');
            let fontName = input.value.trim();
            
            if (!fontName) return showToast("Please enter a font name.");
            if (customFonts.includes(fontName)) return showToast("Font already added.");
            
            customFonts.push(fontName);
            input.value = '';
            
            injectCustomFonts();
            updateFontDropdowns();
            updateQuoteFontDropdown();
            renderCustomFontsList();
            saveSettings();
            
            applyFontFamily(fontName);
            showToast("Custom font added!");
        });
    });

    document.querySelectorAll('.export-data-btn').forEach(btn => btn.addEventListener('click', exportData)); document.querySelectorAll('.import-data-btn').forEach(btn => btn.addEventListener('click', triggerImport)); 
    document.querySelectorAll('.reset-settings-btn').forEach(btn => btn.addEventListener('click', resetSettings));
    document.querySelectorAll('.reset-app-btn').forEach(btn => btn.addEventListener('click', resetApp));
    document.querySelectorAll('.translation-select').forEach(sel => sel.addEventListener('change', e => applyTranslation(e.target.value)));
    
    document.querySelectorAll('.open-settings-modal-btn').forEach(btn => btn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
        if (window.innerWidth < 1024) toggleMobileSidebar(false);
    }));
    closeSettingsModalBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));

    document.querySelectorAll('.custom-bible-help-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const content = e.target.closest('.pt-5').querySelector('.custom-bible-help-content');
            content.classList.toggle('hidden');
        });
    });

    document.querySelectorAll('.add-custom-bible-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const container = e.target.closest('div.space-y-2');
            const nameInput = container.querySelector('.custom-bible-name');
            const urlInput = container.querySelector('.custom-bible-url');
            
            const name = nameInput.value.trim();
            let url = urlInput.value.trim();
            
            if (!name || !url) return showToast("Please enter a name and URL");
            if (url.endsWith('/')) url = url.slice(0, -1);
            
            customBibles.push({ id: Date.now().toString(), name: name, url: url });
            nameInput.value = ''; urlInput.value = '';
            
            saveSettings();
            showToast("Custom Bible added!");
        });
    });

    document.querySelectorAll('.open-highlights-modal-btn-sidebar').forEach(btn => btn.addEventListener('click', () => { currentHighlightsCategory = null; currentHighlightsSearch = ''; document.getElementById('highlights-search').value = ''; renderHighlights(); highlightsModal.classList.remove('hidden'); }));
    document.getElementById('open-highlights-mobile-btn').addEventListener('click', () => { renderHighlights(); highlightsModal.classList.remove('hidden'); }); closeHighlightsModalBtn.addEventListener('click', () => highlightsModal.classList.add('hidden'));

    const bookmarksModal = document.getElementById('bookmarks-modal');
    document.querySelectorAll('.open-bookmarks-modal-btn').forEach(btn => btn.addEventListener('click', () => {
        const bmContent = document.getElementById('bookmarks-content'); bmContent.innerHTML = '';
        const activeBookmarks = Object.keys(bookmarks).filter(b => !bookmarks[b].deleted);
        
        if (activeBookmarks.length === 0) bmContent.innerHTML = '<p class="text-gray-400 text-sm text-center py-6">No bookmarks yet.</p>';
        else activeBookmarks.forEach(ref => {
            const b = document.createElement('div'); b.className = 'glass-input p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors';
            b.innerHTML = `<span class="font-semibold text-sm text-gray-800 dark:text-gray-200">${ref}</span><svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`;
            b.onclick = () => { loadAndScrollToHighlight(ref); bookmarksModal.classList.add('hidden'); toggleMobileSidebar(false); }; bmContent.appendChild(b);
        }); bookmarksModal.classList.remove('hidden');
    })); document.getElementById('close-bookmarks-modal-btn').addEventListener('click', () => bookmarksModal.classList.add('hidden'));

    document.querySelectorAll('.open-quote-modal-btn').forEach(btn => btn.addEventListener('click', () => openQuoteModal())); closeQuoteModalBtn.addEventListener('click', () => quoteModal.classList.add('hidden')); generateAndDownloadBtn.addEventListener('click', generateAndDownloadQuote); quoteBookSelect.addEventListener('change', () => populateChapters(quoteBookSelect, quoteChapterSelect));
    
    document.querySelectorAll('.open-dict-modal-btn').forEach(btn => btn.addEventListener('click', () => { toggleMobileSidebar(false); openReferenceModal('dict'); }));
    document.querySelectorAll('.open-wiki-modal-btn').forEach(btn => btn.addEventListener('click', () => { toggleMobileSidebar(false); openReferenceModal('wiki'); }));
    
    document.getElementById('tab-dict').addEventListener('click', () => { setReferenceTab('dict'); const val = document.getElementById('reference-search-input').value; if(val) lookupReferenceWord(val); });
    document.getElementById('tab-wiki').addEventListener('click', () => { setReferenceTab('wiki'); const val = document.getElementById('reference-search-input').value; if(val) lookupReferenceWord(val); });
    
    document.getElementById('reference-search-btn').addEventListener('click', () => { const val = document.getElementById('reference-search-input').value; if(val) lookupReferenceWord(val); });
    document.getElementById('reference-search-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') { const val = document.getElementById('reference-search-input').value; if(val) lookupReferenceWord(val); } });
    
    closeDictModalBtn.addEventListener('click', () => dictModal.classList.add('hidden'));

    document.getElementById('pexels-search-btn').addEventListener('click', searchPexels);
    document.getElementById('pexels-search-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') searchPexels(); });
    document.getElementById('clear-bg-image-btn').addEventListener('click', () => { selectedPexelsImageUrl = null; document.querySelectorAll('#pexels-results img').forEach(i => i.classList.replace('border-primary', 'border-transparent')); document.getElementById('clear-bg-image-btn').classList.add('hidden'); });

    document.getElementById('popup-verse-from').addEventListener('input', updateVerseRefDisplay); document.getElementById('popup-verse-to').addEventListener('input', updateVerseRefDisplay);
    document.getElementById('copy-verse-btn').addEventListener('click', () => { const { text, reference } = getVerseRangeText(); if (text) navigator.clipboard.writeText(`"${text}" — ${reference} (${currentTranslationName})`).then(() => showToast('Copied!')); });
    document.getElementById('share-verse-btn').addEventListener('click', () => { const { text, reference } = getVerseRangeText(); if (text && navigator.share) navigator.share({ title: reference, text: `"${text}" — ${reference} (${currentTranslationName})` }); });
    
    document.getElementById('bookmark-verse-btn').addEventListener('click', () => {
        const { reference } = getVerseRangeText(); if (!reference) return;
        
        if (bookmarks[reference] && !bookmarks[reference].deleted) { 
            bookmarks[reference] = { deleted: true, updatedAt: Date.now() }; 
            showToast('Bookmark removed'); 
            document.getElementById('bookmark-btn-text').textContent = 'Bookmark'; 
        } else { 
            bookmarks[reference] = { updatedAt: Date.now() }; 
            showToast('Bookmarked!'); 
            document.getElementById('bookmark-btn-text').textContent = 'Remove'; 
        }
        
        pushToCloud({ [`bookmarks.${reference}`]: bookmarks[reference] });
        saveToLocalDB(); 
        
        loadChapter(lastRead.book, lastRead.chapter, 'clear', lastRead.verse); hideHighlightPopup();
    });
    
    document.getElementById('quote-verse-btn').addEventListener('click', () => { hideHighlightPopup(); openQuoteModal(highlightPopupContainer.dataset.currentBook, highlightPopupContainer.dataset.currentChapter, document.getElementById('popup-verse-from').value, document.getElementById('popup-verse-to').value); });
    document.getElementById('highlight-popup').addEventListener('click', (e) => { if (e.target.closest('.color-swatch')) { document.querySelectorAll('#highlight-popup .color-swatch').forEach(sw => sw.classList.remove('selected')); e.target.closest('.color-swatch').classList.add('selected'); } });
    document.getElementById('save-highlight-btn').addEventListener('click', saveHighlight); document.getElementById('remove-highlight-btn').addEventListener('click', removeHighlight); document.getElementById('close-highlight-popup').addEventListener('click', hideHighlightPopup); document.getElementById('add-category-btn').addEventListener('click', addCategory);

    document.getElementById('highlights-search').addEventListener('input', (e) => { currentHighlightsSearch = e.target.value; renderHighlights(); });
    
    highlightsContent.addEventListener('click', e => {
        const editBtn = e.target.closest('.edit-note-btn');
        const addBtn = e.target.closest('.add-note-btn');
        const saveBtn = e.target.closest('.save-note-btn');
        const cancelBtn = e.target.closest('.cancel-note-btn');
        const loadRef = e.target.closest('.load-highlight-ref');

        if (loadRef && !e.target.closest('.note-container')) {
            loadAndScrollToHighlight(e.target.closest('.highlight-card').dataset.ref);
            return;
        }
        
        if (editBtn || addBtn) {
            const container = (editBtn || addBtn).closest('.note-container');
            container.querySelector('.note-view-mode').classList.add('hidden');
            if(addBtn) addBtn.classList.add('hidden');
            
            const editMode = container.querySelector('.note-edit-mode');
            editMode.classList.remove('hidden');
            editMode.classList.add('flex');
            
            const textarea = container.querySelector('.note-textarea');
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
            return;
        }

        if (cancelBtn) {
            const ref = cancelBtn.dataset.ref;
            const container = cancelBtn.closest('.note-container');
            const editMode = container.querySelector('.note-edit-mode');
            editMode.classList.add('hidden');
            editMode.classList.remove('flex');
            
            if (highlights[ref] && highlights[ref].note) {
                container.querySelector('.note-view-mode').classList.remove('hidden');
                container.querySelector('.note-textarea').value = highlights[ref].note;
            } else {
                container.querySelector('.add-note-btn').classList.remove('hidden');
                container.querySelector('.add-note-btn').classList.add('flex');
                container.querySelector('.note-textarea').value = '';
            }
            return;
        }

        if (saveBtn) {
            const ref = saveBtn.dataset.ref;
            const container = saveBtn.closest('.note-container');
            const text = container.querySelector('.note-textarea').value.trim();
            
            if (highlights[ref]) {
                highlights[ref].note = text;
                highlights[ref].updatedAt = Date.now();
                
                pushToCloud({ [`highlights.${ref}`]: highlights[ref] });
                saveToLocalDB();
                
                renderHighlights();
                showToast('Note saved');
            }
            return;
        }
    });

    document.addEventListener('click', (e) => { if (!document.getElementById('highlight-popup-container').contains(e.target) && !e.target.closest('[data-verse-ref]') && !e.target.closest('#selection-tooltip')) hideHighlightPopup(); });

    openMobileSidebarBtn.addEventListener('click', () => toggleMobileSidebar(true)); closeMobileSidebarBtn.addEventListener('click', () => toggleMobileSidebar(false)); mobileSidebarOverlay.addEventListener('click', () => toggleMobileSidebar(false));

    closeLoginModalBtn.addEventListener('click', () => loginModal.classList.add('hidden'));
    const { auth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } = window.firebase || {};
    if(auth) {
        googleLoginBtn.addEventListener('click', () => signInWithPopup(auth, new GoogleAuthProvider()).catch(err => showAuthError(err.message)));
        emailLoginBtn.addEventListener('click', () => signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value).catch(err => showAuthError(err.message)));
        emailSignupBtn.addEventListener('click', () => createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value).catch(err => showAuthError(err.message)));
        
        onAuthStateChanged(auth, user => updateAuthUI(user));
    }

    infiniteObserver.observe(topSentinel); infiniteObserver.observe(bottomSentinel);
    
    let selectionTimeout;
    document.addEventListener('selectionchange', () => {
        clearTimeout(selectionTimeout);
        selectionTimeout = setTimeout(() => {
            const selection = window.getSelection();
            const text = selection.toString().trim();

            if (text && text.length > 0 && text.length <= 100 && dictModal.classList.contains('hidden')) {
                const range = selection.getRangeAt(0);
                const container = range.commonAncestorContainer;
                const readingArea = document.getElementById('scripture-display');
                
                if (readingArea && readingArea.contains(container.nodeType === 1 ? container : container.parentNode)) {
                    selectionTooltip.dataset.word = text;
                    const rect = range.getBoundingClientRect();
                    
                    selectionTooltip.style.left = `${rect.left + (rect.width / 2)}px`;
                    selectionTooltip.style.top = `${rect.top - 12}px`;
                    
                    selectionTooltip.classList.remove('hidden');
                    void selectionTooltip.offsetWidth;
                    selectionTooltip.classList.remove('opacity-0', 'pointer-events-none');
                    return;
                }
            }
            selectionTooltip.classList.add('opacity-0', 'pointer-events-none');
            setTimeout(() => { if (selectionTooltip.classList.contains('opacity-0')) selectionTooltip.classList.add('hidden'); }, 200);
        }, 150);
    });

    selectionTooltip.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const text = selectionTooltip.dataset.word;
        if (text) {
            openReferenceModal(currentRefMode || 'dict', text);
            window.getSelection().removeAllRanges();
            selectionTooltip.classList.add('opacity-0', 'pointer-events-none', 'hidden');
        }
    });

    document.addEventListener('mousedown', (e) => {
        if (e.target !== selectionTooltip && !selectionTooltip.contains(e.target)) {
            if (window.getSelection().isCollapsed) {
                selectionTooltip.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(() => { if (selectionTooltip.classList.contains('opacity-0')) selectionTooltip.classList.add('hidden'); }, 200);
            }
        }
    });

    await localDB.init(); 
    await loadDataFromLocalDB(); 
    updateSelectionText(lastRead.book, lastRead.chapter);
    
    if (initialMessage.style.display !== 'none') {
        loadChapter(lastRead.book, lastRead.chapter, 'clear', lastRead.verse);
    }

    document.querySelectorAll('.pwa-install-btn').forEach(btn => {
        btn.addEventListener('click', triggerInstallFlow);
    });
};

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
});

window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    showToast("Biblia Sacra installed!");
});

async function triggerInstallFlow() {
    if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        if (outcome === 'accepted') {
            showToast("Installing Biblia Sacra...");
        }
        deferredInstallPrompt = null;
    } else {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        if (isStandalone) {
            showToast("App is already installed!");
        } else {
            const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
            if (isIOS) {
                showToast("iOS: Tap Share > Add to Home Screen");
            } else {
                showToast("Android: Tap menu (⋮) > Install app");
            }
        }
    }
}

if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(e => console.log('SW error:', e)); }); }
