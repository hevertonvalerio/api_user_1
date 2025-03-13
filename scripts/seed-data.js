const axios = require('axios');

// Configuração
const API_URL = 'http://localhost:3000/api';
const API_KEY = 'your-api-key-here'; // Usando a chave da configuração

// Headers para as requisições
const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': API_KEY
};

// Dados dos bairros de São Paulo
const neighborhoods = [
  // Zona Norte
  { name: 'Santana', city: 'São Paulo' },
  { name: 'Vila Guilherme', city: 'São Paulo' },
  // Zona Sul
  { name: 'Moema', city: 'São Paulo' },
  { name: 'Vila Mariana', city: 'São Paulo' },
  // Zona Oeste
  { name: 'Pinheiros', city: 'São Paulo' },
  { name: 'Perdizes', city: 'São Paulo' }
];

// Dados das regiões de São Paulo
const regions = [
  { name: 'Zona Norte', neighborhoods: ['Santana', 'Vila Guilherme'] },
  { name: 'Zona Sul', neighborhoods: ['Moema', 'Vila Mariana'] },
  { name: 'Zona Oeste', neighborhoods: ['Pinheiros', 'Perdizes'] },
  { name: 'Zona Leste', neighborhoods: [] } // Sem bairros associados inicialmente
];

// Armazenar IDs dos bairros criados
const neighborhoodIds = {};

// Função para criar bairros em lote
async function createNeighborhoods() {
  console.log('Criando bairros...');
  
  try {
    // Criar bairros individualmente para ter controle dos IDs
    for (const neighborhood of neighborhoods) {
      const response = await axios.post(`${API_URL}/neighborhoods`, neighborhood, { headers });
      
      if (response.status === 201 && response.data.success) {
        console.log(`Bairro ${neighborhood.name} criado com sucesso!`);
        neighborhoodIds[neighborhood.name] = response.data.data.id;
      } else {
        console.error(`Erro ao criar bairro ${neighborhood.name}:`, response.data);
      }
    }
    
    console.log('Todos os bairros foram criados com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao criar bairros:', error.response?.data || error.message);
    return false;
  }
}

// Função para criar regiões
async function createRegions() {
  console.log('Criando regiões...');
  
  try {
    for (const region of regions) {
      // Obter IDs dos bairros associados a esta região
      const neighborhood_ids = region.neighborhoods.map(name => neighborhoodIds[name]).filter(id => id);
      
      // Criar região com bairros associados
      const regionData = {
        name: region.name,
        neighborhood_ids
      };
      
      const response = await axios.post(`${API_URL}/regions`, regionData, { headers });
      
      if (response.status === 201 && response.data.success) {
        console.log(`Região ${region.name} criada com sucesso com ${neighborhood_ids.length} bairros!`);
      } else {
        console.error(`Erro ao criar região ${region.name}:`, response.data);
      }
    }
    
    console.log('Todas as regiões foram criadas com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao criar regiões:', error.response?.data || error.message);
    return false;
  }
}

// Função principal para executar o seed
async function seedData() {
  console.log('Iniciando população de dados...');
  
  // Criar bairros primeiro
  const neighborhoodsCreated = await createNeighborhoods();
  
  if (!neighborhoodsCreated) {
    console.error('Falha ao criar bairros. Abortando processo.');
    return;
  }
  
  // Depois criar regiões com associações aos bairros
  const regionsCreated = await createRegions();
  
  if (!regionsCreated) {
    console.error('Falha ao criar regiões.');
    return;
  }
  
  console.log('Dados populados com sucesso!');
  console.log('Resumo:');
  console.log(`- ${Object.keys(neighborhoodIds).length} bairros criados`);
  console.log(`- ${regions.length} regiões criadas`);
}

// Executar o script
seedData().catch(error => {
  console.error('Erro durante a execução do script:', error);
});
