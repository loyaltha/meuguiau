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

//traduzir os erros do firebase para o usuário
function traduzirErroFirebase(errorCode) {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'Este e-mail já está em uso. Tente fazer login ou use outro e-mail.';
        case 'auth/weak-password':
            return 'A senha deve ter pelo menos 6 caracteres.';
        case 'auth/invalid-email':
            return 'O formato do e-mail é inválido. Verifique e tente novamente.';
        case 'auth/wrong-password':
            return 'Senha incorreta. Tente novamente.';
        case 'auth/user-not-found':
            return 'Não encontramos uma conta com este e-mail. Verifique se digitou corretamente.';
        case 'auth/missing-password':
            return 'Por favor, insira sua senha.';
        case 'auth/too-many-requests':
            return 'Muitas tentativas de login falharam. Tente novamente mais tarde.';
        default:
            return 'Ocorreu um erro inesperado. Tente novamente.';
    }
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
        showMessage(traduzirErroFirebase(error.code));
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
        showMessage(traduzirErroFirebase(error.code));
      }
    });
}
