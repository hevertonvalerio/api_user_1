const axios = require('axios');
const bcrypt = require('bcrypt');

// Configuração
const API_URL = 'http://localhost:3000/api';
const API_KEY = 'your-api-key-here'; // Usando a chave da configuração

// Headers para as requisições
const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY
};

// Dados dos usuários fictícios
const users = [
  {
    name: 'João Silva',
    email: 'joao.silva@exemplo.com',
    password: 'Senha@123',
    phone: '+5511987654321',
    userTypeId: 1 // Admin
  },
  {
    name: 'Maria Oliveira',
    email: 'maria.oliveira@exemplo.com',
    password: 'Senha@456',
    phone: '+5511976543210',
    userTypeId: 2 // Gerente
  },
  {
    name: 'Pedro Santos',
    email: 'pedro.santos@exemplo.com',
    password: 'Senha@789',
    phone: '+5511965432109',
    userTypeId: 3 // Corretor
  },
  {
    name: 'Ana Costa',
    email: 'ana.costa@exemplo.com',
    password: 'Senha@012',
    phone: '+5511954321098',
    userTypeId: 3 // Corretor
  },
  {
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@exemplo.com',
    password: 'Senha@345',
    phone: '+5511943210987',
    userTypeId: 4 // Usuário
  },
  {
    name: 'Juliana Pereira',
    email: 'juliana.pereira@exemplo.com',
    password: 'Senha@678',
    phone: '+5511932109876',
    userTypeId: 4 // Usuário
  },
  {
    name: 'Roberto Almeida',
    email: 'roberto.almeida@exemplo.com',
    password: 'Senha@901',
    phone: '+5511921098765',
    userTypeId: 2 // Gerente
  },
  {
    name: 'Fernanda Lima',
    email: 'fernanda.lima@exemplo.com',
    password: 'Senha@234',
    phone: '+5511910987654',
    userTypeId: 3 // Corretor
  },
  {
    name: 'Marcelo Souza',
    email: 'marcelo.souza@exemplo.com',
    password: 'Senha@567',
    phone: '+5511909876543',
    userTypeId: 4 // Usuário
  },
  {
    name: 'Luciana Martins',
    email: 'luciana.martins@exemplo.com',
    password: 'Senha@890',
    phone: '+5511898765432',
    userTypeId: 4 // Usuário
  }
];

// Função para criar usuários
async function createUsers() {
  console.log('Criando usuários...');
  
  try {
    for (const user of users) {
      try {
        const response = await axios.post(`${API_URL}/users`, user, { headers });
        
        if (response.status === 201 && response.data.success) {
          console.log(`Usuário ${user.name} criado com sucesso!`);
        } else {
          console.error(`Erro ao criar usuário ${user.name}:`, response.data);
        }
      } catch (error) {
        // Se o usuário já existe (conflito), apenas log e continua
        if (error.response && error.response.status === 409) {
          console.warn(`Usuário ${user.name} já existe. Pulando...`);
        } else {
          console.error(`Erro ao criar usuário ${user.name}:`, error.response?.data || error.message);
        }
      }
    }
    
    console.log('Processo de criação de usuários concluído!');
    return true;
  } catch (error) {
    console.error('Erro geral ao criar usuários:', error.message);
    return false;
  }
}

// Função principal para executar o seed
async function seedUsers() {
  console.log('Iniciando população de usuários...');
  
  // Criar usuários
  const usersCreated = await createUsers();
  
  if (!usersCreated) {
    console.error('Falha ao criar usuários. Abortando processo.');
    return;
  }
  
  console.log('Dados de usuários populados com sucesso!');
  console.log(`- ${users.length} usuários criados ou já existentes`);
}

// Executar o script
seedUsers().catch(error => {
  console.error('Erro durante a execução do script:', error);
});
