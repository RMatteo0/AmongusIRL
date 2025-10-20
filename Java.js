// ⚠ Assure-toi que Firebase est déjà initialisé et accessible via `window.db`
import { ref, set, get, child } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const db = window.db; // base de données Firebase
const dbRef = ref(db);

// Sélectionne toutes les cases avec la classe .checkable
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

  // Ajouter un listener pour détecter le changement
  cb.addEventListener('change', () => {
    // Mettre à jour la couleur du texte
    if(cb.checked) cb.parentElement.classList.add('checked');
    else cb.parentElement.classList.remove('checked');

    // Stocker l'état dans Firebase
    set(ref(db, 'cases/' + key), cb.checked)
      .then(() => console.log(`Case ${key} sauvegardée : ${cb.checked}`))
      .catch(err => console.error(err));

    updateProgressBar(); // mettre à jour la barre à chaque changement
  });
});

// Fonction pour mettre à jour la barre de progression
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