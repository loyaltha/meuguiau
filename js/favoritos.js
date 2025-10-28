import { db, auth } from './firebase-config.js';
import { collection, getDocs, query, where, doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const container = document.getElementById("cards-favoritos");

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuário está logado, carregar seus favoritos
        loadFavorites(user.uid);
    } else {
        // Usuário não está logado, redirecionar para o login
        container.innerHTML = "<div class='col-12 text-center'><p class='fs-5 text-muted'>Você precisa estar logado para ver seus favoritos. Redirecionando...</p></div>";
        setTimeout(() => {
            window.location.href = 'acesso.html';
        }, 2500);
    }
});

async function loadFavorites(userId) {
    try {
        // 1. Buscar a lista de IDs de favoritos do usuário
        const q = query(collection(db, "favorites"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            container.innerHTML = "<div class='col-12 text-center'><p class='fs-5 text-muted'>Você ainda não favoritou nenhum local.</p></div>";
            return;
        }

        const estabIds = querySnapshot.docs.map(doc => doc.data().establishmentId);
        
        container.innerHTML = ""; // Limpa o "Carregando..."

        // 2. Buscar os detalhes de cada estabelecimento favoritado
        for (const id of estabIds) {
            const estabRef = doc(db, "estabelecimentos", id);
            const docSnap = await getDoc(estabRef);

            if (docSnap.exists()) {
                const estab = { id: docSnap.id, ...docSnap.data() };
                displayFavoriteCard(estab);
            }
        }
    } catch (error) {
        console.error("Erro ao carregar favoritos: ", error);
        container.innerHTML = "<div class='col-12 text-center'><p class='fs-5 text-danger'>Ocorreu um erro ao carregar seus favoritos.</p></div>";
    }
}

function displayFavoriteCard(estab) {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6";

    // O ícone aqui já vem preenchido (bi-heart-fill)
    col.innerHTML = `
      <div class="card">
        <span class="favorite-icon bi bi-heart-fill favorited" data-id="${estab.id}" title="Remover dos Favoritos"></span>
        <div class="card-body text-center p-4">
          <h5 class="card-title mb-2">${estab.nome}</h5>
          <p class="card-text">${estab.categoria} - ${estab.cidade}</p>
        </div>
      </div>
    `;
    container.appendChild(col);
}

// 3. Adicionar lógica para remover favorito
container.addEventListener("click", async (e) => {
    if (!e.target.classList.contains('favorite-icon')) {
        return;
    }

    const user = auth.currentUser;
    if (!user) return; // Segurança extra

    const icon = e.target;
    const estabId = icon.dataset.id;
    const userId = user.uid;
    const docId = `${userId}_${estabId}`; // Chave composta

    try {
        // Remover do Firestore
        await deleteDoc(doc(db, "favorites", docId));
        
        // Remover o card da tela
        const cardElement = icon.closest('.col-lg-4');
        cardElement.remove();

        // Verificar se a lista ficou vazia
        if (container.children.length === 0) {
            container.innerHTML = "<div class='col-12 text-center'><p class='fs-5 text-muted'>Você ainda não favoritou nenhum local.</p></div>";
        }

    } catch (error) {
        console.error("Erro ao remover favorito: ", error);
        alert("Ocorreu um erro ao remover o favorito.");
    }
});
