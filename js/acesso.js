// acesso.js

import { auth } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile // IMPORTADO
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const loginForm = document.getElementById('login-form');
const cadastroForm = document.getElementById('cadastro-form');
const messageContainer = document.getElementById('message-container');

// Função para exibir mensagens na página
function showMessage(message, type = 'danger') {
    if (!messageContainer) return;
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    messageContainer.innerHTML = alertHTML;
}

// Lógica de Cadastro no Firebase
if (cadastroForm) {
    cadastroForm.addEventListener('submit', async (e) => {
      e.preventDefault(); 
      const nome = document.getElementById('cadastro-nome').value;
      const email = document.getElementById('cadastro-email').value;
      const senha = document.getElementById('cadastro-senha').value;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        
        // ADICIONADO: Atualiza o perfil do usuário recém-criado com o nome
        await updateProfile(userCredential.user, {
            displayName: nome
        });

        console.log("Usuário cadastrado e perfil atualizado!", userCredential.user);
        
        showMessage(`Usuário ${nome} cadastrado com sucesso! Redirecionando...`, 'success');

        setTimeout(() => {
            window.location.href = 'index.html'; 
        }, 2000); // Espera 2 segundos antes de redirecionar

      } catch (error) {
        console.error("Erro ao cadastrar: ", error.message);
        showMessage(error.message); // Mostra o erro do Firebase
      }
    });
}

// Lógica de Login no Firebase
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault(); 
      const email = document.getElementById('login-email').value;
      const senha = document.getElementById('login-senha').value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        console.log("Usuário logado!", userCredential.user);

        showMessage('Login bem-sucedido! Redirecionando...', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000); // Espera 2 segundos antes de redirecionar

      } catch (error) {
        console.error("Erro ao logar: ", error.message);
        showMessage(error.message); // Mostra o erro do Firebase
      }
    });
}