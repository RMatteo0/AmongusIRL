<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// --- CONFIGURATION FIREBASE ---
// Remplace par tes valeurs exactes
const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "TON_PROJET.firebaseapp.com",
  databaseURL: "https://TON_PROJET-default-rtdb.firebaseio.com",
  projectId: "TON_PROJET",
  storageBucket: "TON_PROJET.appspot.com",
  messagingSenderId: "XXX",
  appId: "XXX"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

// --- GESTION DES CASES ---
document.querySelectorAll('.checkable input').forEach(cb => {
  const key = cb.dataset.key;

  // Charger l'état depuis Firebase au chargement
  get(child(dbRef, 'cases/' + key)).then(snapshot => {
    if(snapshot.exists() && snapshot.val() === true) {
      cb.checked = true;
      cb.parentElement.classList.add('checked');
    }
    updateProgressBar(); // met à jour la barre après chargement
  }).catch(err => console.error(err));

  // Listener pour détecter le changement
  cb.addEventListener('change', () => {
    if(cb.checked) cb.parentElement.classList.add('checked');
    else cb.parentElement.classList.remove('checked');

    // Sauvegarde dans Firebase
    set(ref(db, 'cases/' + key), cb.checked)
      .then(() => console.log(`Case ${key} sauvegardée : ${cb.checked}`))
      .catch(err => console.error(err));

    updateProgressBar(); // mise à jour de la barre
  });
});

// --- BARRE DE PROGRESSION ---
function updateProgressBar() {
  const checkboxes = document.querySelectorAll('.checkable input');
  const total = checkboxes.length;
  let checkedCount = 0;

  checkboxes.forEach(cb => {
    if(cb.checked) checkedCount++;
  });

  const percent = (checkedCount / total) * 100;
  const progressBar = document.getElementById('progress-bar');
  if(progressBar) progressBar.style.width = percent + '%';
}
</script>