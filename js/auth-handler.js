import { auth } from './firebase-config.js';
import { 
    onAuthStateChanged, 
    signOut,
    deleteUser 
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

/**
 * Extrai o primeiro e o último nome de um nome completo.
 * @param {string} fullName O nome completo (ex: "Thalita Martins da Silva")
 * @returns {string} O primeiro e o último nome (ex: "Thalita Silva")
 */
function getPrimeiroUltimoNome(fullName) {
    if (!fullName) {
        return 'Meu Perfil'; // Retorno padrão se não houver nome
    }
    
    // Remove espaços extras no início/fim e divide o nome por espaços
    const parts = fullName.trim().split(' ');
    
    if (parts.length === 0) {
        return 'Meu Perfil';
    }
    
    // Se tiver só um nome (ex: "Thalita"), retorna ele
    if (parts.length === 1) {
        return parts[0]; 
    }
    
    // Retorna o primeiro (parts[0]) e o último (parts[parts.length - 1])
    return `${parts[0]} ${parts[parts.length - 1]}`;
}


document.addEventListener('DOMContentLoaded', () => {
    
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const profileIcon = loggedInView ? loggedInView.querySelector('.profile-icon') : null; 
    
    const userNameDisplay = document.getElementById('user-name');
    const userEmailDisplay = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');
    
    // --- LÓGICA DOS MODAIS ---

    // 1. Pega os elementos dos Modais
    const confirmDeleteModalEl = document.getElementById('confirmDeleteModal');
    const messageModalEl = document.getElementById('messageModal');
    const messageModalBody = document.getElementById('messageModalBody');
    const messageModalLabel = document.getElementById('messageModalLabel');
    const confirmDeleteButton = document.getElementById('confirm-delete-button');

    let confirmDeleteModal, messageModal;

    // 2. Cria as instâncias dos Modais do Bootstrap
    if (confirmDeleteModalEl) {
        confirmDeleteModal = new bootstrap.Modal(confirmDeleteModalEl);
    }
    if (messageModalEl) {
        messageModal = new bootstrap.Modal(messageModalEl);
    }

    // Flag para sabermos se devemos redirecionar após fechar o modal
    let deleteSuccess = false;

    // 3. Função helper para mostrar o modal de mensagem
    function showModalMessage(title, message) {
        if (messageModalBody && messageModalLabel && messageModal) {
            messageModalLabel.textContent = title;
            messageModalBody.innerHTML = message; // Usamos .innerHTML para formatar o erro
            messageModal.show();
        } else {
            // Fallback para alert caso algo dê muito errado
            alert(message);
        }
    }

    // 4. Adiciona listener para o evento 'hidden' (modal fechado)
    // Se a exclusão foi um sucesso (deleteSuccess == true), redireciona
    if (messageModalEl) {
        messageModalEl.addEventListener('hidden.bs.modal', () => {
            if (deleteSuccess) {
                deleteSuccess = false; // Reseta a flag
                window.location.href = 'index.html'; // Redireciona para a home
            }
        });
    }

    // --- FIM DA LÓGICA DOS MODAIS ---


    onAuthStateChanged(auth, (user) => {
        if (user) {
            // ----- USUÁRIO LOGADO -----
            if (loggedOutView) loggedOutView.style.display = 'none'; 
            if (loggedInView) loggedInView.style.display = 'block'; 

            let initial = 'P';
            if (user.displayName) {
                initial = user.displayName.charAt(0).toUpperCase();
            } else if (user.email) {
                initial = user.email.charAt(0).toUpperCase();
            }
            if (profileIcon) profileIcon.innerHTML = `<span class="profile-initial">${initial}</span>`;

            if (userNameDisplay) userNameDisplay.textContent = getPrimeiroUltimoNome(user.displayName);
            if (userEmailDisplay) userEmailDisplay.textContent = user.email;

            // Configura o botão de Logout
            if (logoutButton) {
                logoutButton.replaceWith(logoutButton.cloneNode(true));
                document.getElementById('logout-button').addEventListener('click', (e) => {
                    e.preventDefault();
                    signOut(auth).then(() => {
                        window.location.href = 'index.html';
                    }).catch((error) => {
                        console.error("Erro ao fazer logout: ", error);
                    });
                });
            }

            // 5. Configura o botão de EXCLUIR CONTA (que está dentro do modal)
            if (confirmDeleteButton) {
                // Remove listener antigo para evitar duplicidade
                const newConfirmDeleteButton = confirmDeleteButton.cloneNode(true);
                confirmDeleteButton.parentNode.replaceChild(newConfirmDeleteButton, confirmDeleteButton);

                newConfirmDeleteButton.addEventListener('click', async () => {
                    // 1. Esconde o modal de confirmação
                    if (confirmDeleteModal) {
                        confirmDeleteModal.hide();
                    }

                    // 2. Tenta excluir o usuário
                    try {
                        await deleteUser(user);
                        
                        // 3. Sucesso: Seta a flag e chama o modal de mensagem
                        deleteSuccess = true;
                        showModalMessage("Sucesso", "Sua conta foi excluída.");
                    
                    } catch (error) {
                        // 4. Erro: Mostra o modal de mensagem com o erro
                        console.error("Erro ao excluir conta: ", error);
                        deleteSuccess = false;
                        let errorMessage = "";

                        if (error.code === 'auth/requires-recent-login') {
                            errorMessage = "<strong>Erro:</strong> Esta operação é sensível e requer autenticação recente.<br><br>Por favor, faça logout e login novamente antes de tentar excluir sua conta.";
                        } else {
                            errorMessage = "Ocorreu um erro inesperado ao excluir sua conta: " + error.message;
                        }
                        showModalMessage("Erro ao Excluir Conta", errorMessage);
                    }
                });
            }

        } else {
            // ----- USUÁRIO DESLOGADO -----
            if (loggedOutView) loggedOutView.style.display = 'block'; 
            if (loggedInView) loggedInView.style.display = 'none'; 
        }
    });
});
