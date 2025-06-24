// Estrutura de dados: array de objetos
const estabelecimentos = [
  // Restaurantes / Alimentação
  { nome: "Chalé Restaurante", categoria: "Alimentação", cidade: "Uberaba" },
  { nome: "Toca da Tábua", categoria: "Alimentação", cidade: "Uberaba" },
  { nome: "D’Gust Refeições e Massas", categoria: "Alimentação", cidade: "Uberaba" },
  { nome: "Giraffas Uberaba", categoria: "Alimentação", cidade: "Uberaba" },
  { nome: "Bello Sabore", categoria: "Alimentação", cidade: "Uberaba" },
  { nome: "Fornace Pizzas e Massas", categoria: "Alimentação", cidade: "Uberaba" },
  { nome: "Restaurante Tabu", categoria: "Alimentação", cidade: "Uberaba" },
  { nome: "Bar Latife", categoria: "Alimentação", cidade: "Uberaba" },
  { nome: "Madero Container", categoria: "Alimentação", cidade: "Uberaba" },
  { nome: "Santa Brasa", categoria: "Alimentação", cidade: "Uberaba" },
  { nome: "Churrascaria Cupim Grill", categoria: "Alimentação", cidade: "Uberaba" },
  { nome: "Bar e Restaurante Choperia do Mário", categoria: "Alimentação", cidade: "Uberaba" },

  // Roupas
  { nome: "Loja Mundo Fashion", categoria: "Roupas", cidade: "Uberaba" },
  { nome: "Boutique Estilo Urbano", categoria: "Roupas", cidade: "Uberaba" },
  { nome: "Moderna Store", categoria: "Roupas", cidade: "Uberaba" },
  { nome: "Jeans & Cia", categoria: "Roupas", cidade: "Uberaba" },
  { nome: "Roupa Certa", categoria: "Roupas", cidade: "Uberaba" },
  { nome: "Donna Chic Boutique", categoria: "Roupas", cidade: "Uberaba" },

  // Mercado / Supermercado
  { nome: "Carrefour Uberaba", categoria: "Mercado", cidade: "Uberaba" },
  { nome: "SuperMaxi", categoria: "Mercado", cidade: "Uberaba" },
  { nome: "Zebu Carnes Supermercados", categoria: "Mercado", cidade: "Uberaba" },
  { nome: "Supermercado NBC", categoria: "Mercado", cidade: "Uberaba" },
  { nome: "Pioneiro Supermercados", categoria: "Mercado", cidade: "Uberaba" },
  { nome: "Mercado Municipal de Uberaba", categoria: "Mercado", cidade: "Uberaba" },

  // Beleza
  { nome: "K&S Beleza Unissex", categoria: "Beleza", cidade: "Uberaba" },
  { nome: "Beleza & Moda", categoria: "Beleza", cidade: "Uberaba" },
  { nome: "Studio Beleza Pura", categoria: "Beleza", cidade: "Uberaba" },
  { nome: "Espaço Glamour", categoria: "Beleza", cidade: "Uberaba" },
  { nome: "Salão Harmonia", categoria: "Beleza", cidade: "Uberaba" },
  { nome: "Núcleo da Beleza", categoria: "Beleza", cidade: "Uberaba" },

  // Artigos Diversos (papelaria)
  { nome: "Papelaria Leopoldino", categoria: "Artigos Diversos", cidade: "Uberaba" },
  { nome: "Papelaria Estados Unidos", categoria: "Artigos Diversos", cidade: "Uberaba" },
  { nome: "Papelaria São Benedito", categoria: "Artigos Diversos", cidade: "Uberaba" },

  // Turismo / Pontos turísticos
  { nome: "Museu dos Dinossauros", categoria: "Turismo", cidade: "Uberaba" },
  { nome: "Memorial Chico Xavier", categoria: "Turismo", cidade: "Uberaba" },
  { nome: "Museu do Zebu", categoria: "Turismo", cidade: "Uberaba" },
  { nome: "Parque das Acácias", categoria: "Turismo", cidade: "Uberaba" },
  { nome: "Parque Jacarandá", categoria: "Turismo", cidade: "Uberaba" },
  { nome: "Parque Ecológico Mata do Ipê", categoria: "Turismo", cidade: "Uberaba" },
  { nome: "Catedral Metropolitana de Uberaba", categoria: "Turismo", cidade: "Uberaba" },
  { nome: "Igreja Santa Rita / Museu de Arte Sacra", categoria: "Turismo", cidade: "Uberaba" },
  { nome: "Shopping Uberaba", categoria: "Turismo", cidade: "Uberaba" },
  { nome: "Praça Pôr do Sol", categoria: "Turismo", cidade: "Uberaba" }
];

// Função para exibir os estabelecimentos
function exibirEstabelecimentos(lista) {
  const container = document.getElementById("cards");
  container.innerHTML = ""; // limpa a lista

  if (lista.length === 0) {
    container.innerHTML = "<p>Nenhum estabelecimento encontrado.</p>";
    return;
  }

  lista.forEach(estab => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${estab.nome}</h3>
      <p>${estab.categoria} - ${estab.cidade}</p>
    `;
    container.appendChild(card);
  });
}

// Função para filtrar os estabelecimentos
function filtrarEstabelecimentos() {
  const filtro = document.getElementById("filtro").value;
  if (filtro === "todos") {
    exibirEstabelecimentos(estabelecimentos);
  } else {
    const filtrados = estabelecimentos.filter(e => e.categoria === filtro);
    exibirEstabelecimentos(filtrados);
  }
}

// Exibe todos ao carregar a página
window.onload = () => exibirEstabelecimentos(estabelecimentos);
