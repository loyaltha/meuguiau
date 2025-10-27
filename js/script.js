// 1. Importações do Firebase
import { db } from './firebase-config.js'; // Importa do seu firebase-config.js
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// 2. Função para exibir os estabelecimentos (MODIFICADA para Bootstrap)
function exibirEstabelecimentos(lista) {
  const container = document.getElementById("cards");
  container.innerHTML = ""; 

  if (lista.length === 0) {
    // Usa classes do Bootstrap para a mensagem
    container.innerHTML = "<div class='col-12'><p class='text-center fs-5 text-muted'>Nenhum estabelecimento encontrado.</p></div>";
    return;
  }

  lista.forEach(estab => {
    // Cria a coluna do grid do Bootstrap
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6"; // 3 por linha em telas grandes, 2 em médias

    // Cria a estrutura do card do Bootstrap
    col.innerHTML = `
      <div class="card">
        <div class="card-body text-center p-4">
          <h5 class="card-title mb-2">${estab.nome}</h5>
          <p class="card-text">${estab.categoria} - ${estab.cidade}</p>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// 3. Função para BUSCAR os dados do Firebase
async function buscarEFiltrarEstabelecimentos() {
  const filtro = document.getElementById("filtro").value;
  const container = document.getElementById("cards");
  container.innerHTML = "<div class='col-12 text-center'><p class='fs-5 text-muted'>Carregando...</p></div>";

  const colecaoRef = collection(db, "estabelecimentos");
  let consulta;

  if (filtro === "todos") {
    consulta = colecaoRef;
  } else {
    // Busca apenas onde a categoria é igual ao filtro
    consulta = query(colecaoRef, where("categoria", "==", filtro));
  }

  try {
    const querySnapshot = await getDocs(consulta);
    const estabelecimentos = querySnapshot.docs.map(doc => doc.data());
    exibirEstabelecimentos(estabelecimentos);
  } catch (error) {
    console.error("Erro ao buscar dados: ", error);
    container.innerHTML = "<div class='col-12'><p class='text-center fs-5 text-danger'>Erro ao carregar dados.</p></div>";
  }
}

// 4. Eventos
// Adiciona o "ouvinte" para o filtro
document.getElementById("filtro").addEventListener("change", buscarEFiltrarEstabelecimentos);

// Exibe todos ao carregar a página
window.onload = () => {
  buscarEFiltrarEstabelecimentos();
};