const axios = require('axios');

// Configuração
const API_URL = 'http://localhost:3000/api';
const API_KEY = 'your-api-key-here'; // Usando a chave da configuração

// Headers para as requisições
const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY
};

// Dados das equipes fictícias
const teams = [
  {
    name: 'Equipe de Vendas',
    teamType: 'Corretores'
  },
  {
    name: 'Equipe de Cadastro',
    teamType: 'Cadastro'
  },
  {
    name: 'Equipe Jurídica',
    teamType: 'Jurídico'
  },
  {
    name: 'Equipe de Atendimento',
    teamType: 'Atendimento'
  },
  {
    name: 'Equipe Administrativa',
    teamType: 'Administrativo'
  }
];

// Dados dos membros fictícios (serão preenchidos com os IDs das equipes criadas)
const members = [
  {
    name: 'Ricardo Oliveira',
    email: 'ricardo.oliveira@exemplo.com',
    phone: '+5511987654321',
    isLeader: true,
    teamId: '' // Será preenchido com o ID da equipe de Vendas
  },
  {
    name: 'Amanda Silva',
    email: 'amanda.silva@exemplo.com',
    phone: '+5511976543210',
    isLeader: false,
    teamId: '' // Será preenchido com o ID da equipe de Vendas
  },
  {
    name: 'Marcos Santos',
    email: 'marcos.santos@exemplo.com',
    phone: '+5511965432109',
    isLeader: false,
    teamId: '' // Será preenchido com o ID da equipe de Vendas
  },
  {
    name: 'Carla Ferreira',
    email: 'carla.ferreira@exemplo.com',
    phone: '+5511954321098',
    isLeader: true,
    teamId: '' // Será preenchido com o ID da equipe de Cadastro
  },
  {
    name: 'Paulo Mendes',
    email: 'paulo.mendes@exemplo.com',
    phone: '+5511943210987',
    isLeader: false,
    teamId: '' // Será preenchido com o ID da equipe de Cadastro
  },
  {
    name: 'Juliana Costa',
    email: 'juliana.costa@exemplo.com',
    phone: '+5511932109876',
    isLeader: true,
    teamId: '' // Será preenchido com o ID da equipe Jurídica
  },
  {
    name: 'Roberto Alves',
    email: 'roberto.alves@exemplo.com',
    phone: '+5511921098765',
    isLeader: false,
    teamId: '' // Será preenchido com o ID da equipe Jurídica
  },
  {
    name: 'Fernanda Lima',
    email: 'fernanda.lima@exemplo.com',
    phone: '+5511910987654',
    isLeader: true,
    teamId: '' // Será preenchido com o ID da equipe de Atendimento
  },
  {
    name: 'Marcelo Souza',
    email: 'marcelo.souza@exemplo.com',
    phone: '+5511909876543',
    isLeader: false,
    teamId: '' // Será preenchido com o ID da equipe de Atendimento
  },
  {
    name: 'Luciana Martins',
    email: 'luciana.martins@exemplo.com',
    phone: '+5511898765432',
    isLeader: true,
    teamId: '' // Será preenchido com o ID da equipe Administrativa
  }
];

// Função para criar equipes
async function createTeams() {
  console.log('Criando equipes...');
  
  const createdTeams = [];
  
  try {
    for (const team of teams) {
      try {
        const response = await axios.post(`${API_URL}/teams`, team, { headers });
        
        if (response.status === 201 && response.data.success) {
          console.log(`Equipe ${team.name} criada com sucesso!`);
          createdTeams.push(response.data.data);
        } else {
          console.error(`Erro ao criar equipe ${team.name}:`, response.data);
        }
      } catch (error) {
        // Se a equipe já existe (conflito), apenas log e continua
        if (error.response && error.response.status === 409) {
          console.warn(`Equipe ${team.name} já existe. Pulando...`);
        } else {
          console.error(`Erro ao criar equipe ${team.name}:`, error.response?.data || error.message);
        }
      }
    }
    
    console.log('Processo de criação de equipes concluído!');
    return createdTeams;
  } catch (error) {
    console.error('Erro geral ao criar equipes:', error.message);
    return [];
  }
}

// Função para criar membros
async function createMembers(createdTeams) {
  console.log('Criando membros...');
  
  // Preencher os IDs das equipes nos membros
  members[0].teamId = members[1].teamId = members[2].teamId = createdTeams[0].id; // Equipe de Vendas
  members[3].teamId = members[4].teamId = createdTeams[1].id; // Equipe de Cadastro
  members[5].teamId = members[6].teamId = createdTeams[2].id; // Equipe Jurídica
  members[7].teamId = members[8].teamId = createdTeams[3].id; // Equipe de Atendimento
  members[9].teamId = createdTeams[4].id; // Equipe Administrativa
  
  try {
    for (const member of members) {
      try {
        const response = await axios.post(`${API_URL}/members`, member, { headers });
        
        if (response.status === 201 && response.data.success) {
          console.log(`Membro ${member.name} criado com sucesso!`);
        } else {
          console.error(`Erro ao criar membro ${member.name}:`, response.data);
        }
      } catch (error) {
        // Se o membro já existe (conflito), apenas log e continua
        if (error.response && error.response.status === 409) {
          console.warn(`Membro ${member.name} já existe. Pulando...`);
        } else {
          console.error(`Erro ao criar membro ${member.name}:`, error.response?.data || error.message);
        }
      }
    }
    
    console.log('Processo de criação de membros concluído!');
    return true;
  } catch (error) {
    console.error('Erro geral ao criar membros:', error.message);
    return false;
  }
}

// Função principal para executar o seed
async function seedTeamsAndMembers() {
  console.log('Iniciando população de equipes e membros...');
  
  // Criar equipes
  const createdTeams = await createTeams();
  
  if (createdTeams.length === 0) {
    console.error('Falha ao criar equipes. Abortando processo.');
    return;
  }
  
  // Criar membros
  const membersCreated = await createMembers(createdTeams);
  
  if (!membersCreated) {
    console.error('Falha ao criar membros. Abortando processo.');
    return;
  }
  
  console.log('Dados de equipes e membros populados com sucesso!');
  console.log(`- ${createdTeams.length} equipes criadas`);
  console.log(`- ${members.length} membros criados`);
}

// Executar o script
seedTeamsAndMembers().catch(error => {
  console.error('Erro durante a execução do script:', error);
});
