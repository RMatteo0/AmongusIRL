import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  onValue
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// --- CONFIG FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyB5SveP0dDPE6gOJYGcATSJjJIkpVegBAI",
  authDomain: "amongus-irl-ae832.firebaseapp.com",
  databaseURL: "https://amongus-irl-ae832-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "amongus-irl-ae832",
  storageBucket: "amongus-irl-ae832.firebasestorage.app",
  messagingSenderId: "190130772923",
  appId: "1:190130772923:web:5202db1cd62f775f77029e"
};

// --- INITIALISATION FIREBASE ---
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Sélectionne toutes les cases présentes sur la page et éléments UI
const checkboxes = document.querySelectorAll('input[type="checkbox"][data-key]');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text'); // si présent

// Fonction qui calcule le pourcentage sur les clés 1→42 et met à jour UI
function applyGlobalProgress(allObj) {
  const all = allObj || {};
  const filteredKeys = Object.keys(all).filter(k => {
    const m = k.match(/(\d+)$/);
    if (!m) return false;
    const num = parseInt(m[1], 10);
    return num >= 1 && num <= 42;
  });

  const filteredValues = filteredKeys.map(k => all[k]);
  const total = filteredKeys.length;
  const checkedCount = filteredValues.filter(v => v === true).length;
  const percent = total > 0 ? (checkedCount / total) * 100 : 0;

  if (progressBar) progressBar.style.width = percent + "%";

  if (progressText) {
    if (percent >= 100) {
      progressText.textContent = "Les Crewmates ont gagné !";

      // 🔊 Joue le son de victoire (une seule fois)
      const winSound = document.getElementById("win-sound");
      if (winSound && !winSound.dataset.played) {
        winSound.play().catch(err => console.warn("Lecture du son bloquée :", err));
        winSound.dataset.played = "true"; // évite de rejouer plusieurs fois
      }

    } else {
      progressText.textContent = `${percent.toFixed(0)}%`;
      const winSound = document.getElementById("win-sound");
      if (winSound) delete winSound.dataset.played; // réinitialise si on repasse sous 100%
    }
  }
}

// Met à jour l'état des checkboxes visibles à partir de allObj
function applyCheckboxStatesToPage(allObj) {
  for (const cb of checkboxes) {
    const key = cb.dataset.key;
    if (!key) continue;
    const val = allObj && Object.prototype.hasOwnProperty.call(allObj, key) ? allObj[key] : false;
    cb.checked = !!val;
    if (cb.checked) cb.parentElement.classList.add('checked');
    else cb.parentElement.classList.remove('checked');
  }
}

// Écoute en temps réel toute la collection 'checkboxes'
const allRef = ref(db, 'checkboxes');
onValue(allRef, (snapshot) => {
  const allObj = snapshot.exists() ? snapshot.val() : {};
  // met à jour la barre globale
  applyGlobalProgress(allObj);
  // met à jour les cases visibles sur la page
  applyCheckboxStatesToPage(allObj);
}, (err) => {
  console.error("Listener Firebase error:", err);
});

// Lors d'un changement local, écrire dans Firebase (le listener mettra à jour les autres pages)
checkboxes.forEach(cb => {
  cb.addEventListener('change', async () => {
    const key = cb.dataset.key;
    if (!key) return;
    try {
      await set(ref(db, 'checkboxes/' + key), cb.checked);
      // pas besoin d'appeler applyGlobalProgress ici : le onValue le fera après l'écriture
    } catch (err) {
      console.error("Erreur écriture Firebase :", err);
    }
  });
});

