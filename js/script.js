// 1. Importações do Firebase
import { db, auth } from './firebase-config.js'; // Importa 'auth'
import { collection, getDocs, query, where, doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js"; // Importa 'onAuthStateChanged'

// 2. Variáveis globais para guardar estado de login
let userFavorites = new Set();
let currentUser = null;

// --- LÓGICA DO MODAL DE LOGIN (NOVO) ---

// 3. Variáveis globais para o modal
let loginPromptModal;
let loginPromptModalEl;
const loginPromptModalBody = document.getElementById('messageModalBody');
const loginPromptModalLabel = document.getElementById('messageModalLabel');

// 4. Inicializar o modal e seu listener
document.addEventListener('DOMContentLoaded', () => {
    loginPromptModalEl = document.getElementById('messageModal');
    if (loginPromptModalEl) {
        loginPromptModal = new bootstrap.Modal(loginPromptModalEl);

        // Adiciona um listener que roda QUANDO o modal é fechado
        loginPromptModalEl.addEventListener('hidden.bs.modal', () => {
            // Verificamos se o modal foi fechado após o aviso de login
            if (loginPromptModalBody.dataset.redirect === 'true') {
                loginPromptModalBody.dataset.redirect = 'false'; // Reseta a flag
                window.location.href = 'acesso.html'; // Redireciona
            }
        });
    }
});

// 5. Função helper para mostrar o modal de prompt de login
function showLoginPromptModal(title, message) {
    if (loginPromptModalBody && loginPromptModalLabel && loginPromptModal) {
        loginPromptModalLabel.textContent = title;
        loginPromptModalBody.innerHTML = message;
        // Seta uma "flag" no elemento do modal para sabermos que devemos redirecionar
        loginPromptModalBody.dataset.redirect = 'true';
        loginPromptModal.show();
    } else {
        // Fallback caso algo dê errado
        alert(message);
        window.location.href = 'acesso.html';
    }
}

// --- FIM DA LÓGICA DO MODAL ---


// 6. Lógica de Autenticação (Carrega favoritos e estabelecimentos)
onAuthStateChanged(auth, async (user) => {
    currentUser = user; // Guarda o usuário atual
    if (user) {
        // Usuário está logado. Buscar seus favoritos.
        const q = query(collection(db, "favorites"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        userFavorites = new Set(querySnapshot.docs.map(doc => doc.data().establishmentId));
    } else {
        // Usuário está deslogado.
        userFavorites = new Set();
    }
    // Após saber o status de login e favoritos, buscar e exibir os estabelecimentos
    buscarEFiltrarEstabelecimentos(); 
});


// 7. Função para exibir os estabelecimentos (Sem alterações)
function exibirEstabelecimentos(lista) {
  const container = document.getElementById("cards");
  container.innerHTML = ""; 

  if (lista.length === 0) {
    container.innerHTML = "<div class='col-12'><p class='text-center fs-5 text-muted'>Nenhum estabelecimento encontrado.</p></div>";
    return;
  }

  lista.forEach(estab => {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6";

    const isFavorited = userFavorites.has(estab.id);
    const iconClass = isFavorited ? 'bi-heart-fill favorited' : 'bi-heart';
    const iconTitle = isFavorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos';

    col.innerHTML = `
      <div class="card">
        <span class="favorite-icon bi ${iconClass}" data-id="${estab.id}" title="${iconTitle}"></span>
        <div class="card-body text-center p-4">
          <h5 class="card-title mb-2">${estab.nome}</h5>
          <p class="card-text">${estab.categoria} - ${estab.cidade}</p>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// 8. Função para BUSCAR os dados (Sem alterações)
async function buscarEFiltrarEstabelecimentos() {
  const filtro = document.getElementById("filtro").value;
  const container = document.getElementById("cards");
  container.innerHTML = "<div class='col-12 text-center'><p class='fs-5 text-muted'>Carregando...</p></div>";

  const colecaoRef = collection(db, "estabelecimentos");
  let consulta;

  if (filtro === "todos") {
    consulta = colecaoRef;
  } else {
    consulta = query(colecaoRef, where("categoria", "==", filtro));
  }

  try {
    const querySnapshot = await getDocs(consulta);
    const estabelecimentos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    exibirEstabelecimentos(estabelecimentos);
  } catch (error) {
    console.error("Erro ao buscar dados: ", error);
    container.innerHTML = "<div class='col-12'><p class='text-center fs-5 text-danger'>Erro ao carregar dados.</p></div>";
  }
}

// 9. Eventos
document.getElementById("filtro").addEventListener("change", buscarEFiltrarEstabelecimentos);

// Evento de clique para favoritar (MODIFICADO)
document.getElementById("cards").addEventListener("click", async (e) => {
    // Verifica se o clique foi no ícone
    if (!e.target.classList.contains('favorite-icon')) {
        return;
    }

    // 1. Verificar se está logado
    if (!currentUser) {
        // NÃO ESTÁ LOGADO: Chama o modal e para a execução
        showLoginPromptModal(
            "Acesso Necessário",
            "Faça login ou cadastre-se para favoritar locais."
        );
        return;
    }

    // 2. ESTÁ LOGADO: processar o clique
    const icon = e.target;
    const estabId = icon.dataset.id;
    const userId = currentUser.uid;
    const docId = `${userId}_${estabId}`;

    try {
        if (userFavorites.has(estabId)) {
            // --- Lógica para DESFAVORITAR ---
            await deleteDoc(doc(db, "favorites", docId));
            userFavorites.delete(estabId); 
            // *** LINHA CORRIGIDA (removi o "V" daqui) ***
            icon.classList.remove('bi-heart-fill', 'favorited');
            icon.classList.add('bi-heart');
            icon.title = 'Adicionar aos Favoritos';
        } else {
            // --- Lógica para FAVORITAR ---
            await setDoc(doc(db, "favorites", docId), { userId, establishmentId: estabId });
            userFavorites.add(estabId);
            icon.classList.remove('bi-heart');
            icon.classList.add('bi-heart-fill', 'favorited');
            icon.title = 'Remover dos Favoritos';
        }
    } catch (error) {
        console.error("Erro ao favoritar/desfavoritar:", error);
        alert("Ocorreu um erro. Tente novamente.");
    }
});
