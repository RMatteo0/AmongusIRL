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

// --- RÉCUPÉRATION DES CHECKBOXES ---
const checkboxes = document.querySelectorAll('input[type="checkbox"][data-key]');
const progressBar = document.getElementById('progress-bar');

// Fonction qui met à jour la barre
function updateProgressBar() {
  const total = checkboxes.length;
  const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
  const percent = total > 0 ? (checked / total) * 100 : 0;
  if (progressBar) progressBar.style.width = percent + "%";
}

// Charger l'état des cases depuis Firebase
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
  updateProgressBar();
}

// Sauvegarder quand une case change
checkboxes.forEach(cb => {
  cb.addEventListener('change', async () => {
    const key = cb.dataset.key;
    await set(ref(db, 'checkboxes/' + key), cb.checked);
    if (cb.checked) cb.parentElement.classList.add('checked');
    else cb.parentElement.classList.remove('checked');
    updateProgressBar();
  });
});

// Charger au démarrage
loadCheckboxes();