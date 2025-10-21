import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

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

// Sélectionne toutes les cases de la page
const checkboxes = document.querySelectorAll('input[type="checkbox"][data-key]');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text'); // 👈 affichage du pourcentage

// --- Fonction pour mettre à jour la barre de progression globale ---
async function updateGlobalProgressBar() {
  try {
    const snapshot = await get(ref(db, 'checkboxes'));
    if (snapshot.exists()) {
      const all = snapshot.val();

      // On ne prend que les cases 1 → 48
      const filteredKeys = Object.keys(all).filter(k => {
        const num = parseInt(k.replace('case', ''));
        return num >= 1 && num <= 48;
      });

      const filteredValues = filteredKeys.map(k => all[k]);
      const total = filteredValues.length;
      const checkedCount = filteredValues.filter(v => v === true).length;
      const percent = total > 0 ? (checkedCount / total) * 100 : 0;

      // Met à jour la barre et le texte
      if (progressBar) progressBar.style.width = percent + "%";
      if (progressText) progressText.textContent = `${percent.toFixed(0)}%`;
    }
  } catch (err) {
    console.error("Erreur de mise à jour de la barre :", err);
  }
}

// --- Charger les cases depuis Firebase ---
async function loadCheckboxes() {
  const dbRef = ref(db);
  for (const cb of checkboxes) {
    const key = cb.dataset.key;
    try {
      const snapshot = await get(child(dbRef, 'checkboxes/' + key));
      if (snapshot.exists()) {
        cb.checked = snapshot.val();
        if (cb.checked) cb.parentElement.classList.add('checked');
      }
    } catch (error) {
      console.error("Erreur de chargement Firebase :", error);
    }
  }
  updateGlobalProgressBar();
}

// --- Quand une case change ---
checkboxes.forEach(cb => {
  cb.addEventListener('change', async () => {
    const key = cb.dataset.key;
    await set(ref(db, 'checkboxes/' + key), cb.checked);
    if (cb.checked) cb.parentElement.classList.add('checked');
    else cb.parentElement.classList.remove('checked');
    updateGlobalProgressBar();
  });
});

// --- Charger au démarrage ---
loadCheckboxes();