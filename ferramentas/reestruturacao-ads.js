// Reestruturação da campanha para o site novo (arnslauro.com.br) — gerado por Claude, nov/2026
var CAMPANHA = 'Psicologia Existencial - Curitiba/SP';
var B = 'https://arnslauro.com.br';
var NOVOS = {
 "Luto e perdas": {
  "url": "https://arnslauro.com.br/luto",
  "p1": "luto",
  "p2": "online",
  "kw": [
   "\"como lidar com o luto\"",
   "\"terapia do luto\"",
   "\"terapia para luto\"",
   "\"psicologo para luto\"",
   "\"psicólogo para luto\"",
   "\"como superar o luto\"",
   "\"apoio psicologico luto\"",
   "\"luto antecipatório\"",
   "\"como lidar com a perda\"",
   "[terapia do luto online]"
  ],
  "h": [
   "Como Lidar com o Luto",
   "Terapia do Luto Online",
   "Psicólogo para Luto",
   "Apoio na Perda de Quem Ama",
   "Não Atravesse o Luto Sozinho",
   "Primeira Conversa Sem Custo",
   "Atendimento Online",
   "Psicólogo CRP 08/49039",
   "O Luto Tem Seu Próprio Tempo",
   "Saudade, Culpa e Despedida",
   "Logoterapia e Sentido",
   "Agende pelo WhatsApp"
  ],
  "d": [
   "Um espaço seguro para sentir a dor, dar lugar à saudade e seguir vivendo com sentido.",
   "Psicoterapia online para quem perdeu alguém querido. Primeira conversa sem custo.",
   "Perdas recentes ou antigas e luto antecipatório: atendimento online semanal.",
   "Psicólogo com base na logoterapia de Viktor Frankl. Agende pelo WhatsApp."
  ]
 },
 "Término e relacionamentos": {
  "url": "https://arnslauro.com.br/relacionamentos",
  "p1": "termino",
  "p2": "relacionamento",
  "kw": [
   "\"como superar um término\"",
   "\"como superar um termino\"",
   "\"fim de relacionamento\"",
   "\"superar término\"",
   "\"dependência emocional\"",
   "\"dependencia emocional\"",
   "\"terapia para dependência emocional\"",
   "\"psicólogo para relacionamento\"",
   "\"como superar uma separação\"",
   "\"terapia pós término\""
  ],
  "h": [
   "Como Superar um Término",
   "Psicólogo Para Relacionamentos",
   "Dependência Emocional",
   "Terapia Após o Fim da Relação",
   "Volte a Se Encontrar",
   "Primeira Conversa Sem Custo",
   "Atendimento Online",
   "Psicólogo CRP 08/49039",
   "Os Mesmos Padrões de Novo?",
   "Terapia Individual e de Casal",
   "Agende pelo WhatsApp"
  ],
  "d": [
   "O fim de uma relação mexe com tudo. A terapia ajuda a atravessar e a se reencontrar.",
   "Término, dependência emocional ou conflitos: psicoterapia online com acolhimento.",
   "Entenda seus padrões e construa vínculos mais saudáveis. Primeira conversa sem custo.",
   "Atendimento individual e de casal, online. Agende sua conversa pelo WhatsApp."
  ]
 },
 "Novo diagnóstico": {
  "url": "https://arnslauro.com.br/novo-diagnostico",
  "p1": "diagnostico",
  "p2": "apoio",
  "kw": [
   "\"como lidar com o diagnóstico\"",
   "\"apoio psicológico doença crônica\"",
   "\"psicólogo para doença crônica\"",
   "\"como lidar com doença autoimune\"",
   "\"apoio emocional câncer\"",
   "\"psicólogo para pacientes com câncer\"",
   "\"como lidar com doença celíaca\"",
   "\"doença celíaca psicólogo\"",
   "\"familiar com câncer como lidar\"",
   "\"psicólogo para familiares de pacientes\""
  ],
  "h": [
   "Um Novo Diagnóstico?",
   "Apoio Emocional na Doença",
   "Psicólogo Para Doença Crônica",
   "Para Pacientes e Familiares",
   "Adaptação Após o Diagnóstico",
   "Doença Celíaca e Autoimunes",
   "Primeira Conversa Sem Custo",
   "Atendimento Online",
   "Psicólogo CRP 08/49039",
   "Cuide da Parte Emocional",
   "Agende pelo WhatsApp"
  ],
  "d": [
   "Quando uma doença muda a rotina e as relações, a terapia ajuda a atravessar a mudança.",
   "Apoio psicológico online para quem recebeu um diagnóstico e para seus familiares.",
   "Complementa o acompanhamento médico: cuida do luto, do medo e da vida social.",
   "Primeira conversa de 20 minutos sem custo. Agende pelo WhatsApp."
  ]
 }
};
var EXTRAS_SENTIDO = ['"crise existencial"', '"vazio existencial"'];

function main() {
  var camp = AdsApp.campaigns().withCondition("Name = '" + CAMPANHA + "'").get().next();

  // 1) Pausa o grupo de busca genérica
  var it = camp.adGroups().withCondition("Name CONTAINS 'Busca direta'").get();
  while (it.hasNext()) { var g = it.next(); g.pause(); Logger.log('Grupo pausado: ' + g.getName()); }

  // 2) Grupos existentes passam a levar para a página temática
  urlsDoGrupo(camp, 'Sentido de vida', B + '/logoterapia');
  urlsDoGrupo(camp, 'Dores da exaust', B + '/logoterapia?tema=esgotamento');

  // 3) Duas palavras novas no grupo de sentido, com o título de crise existencial
  var sentido = grupo(camp, 'Sentido de vida');
  for (var i = 0; i < EXTRAS_SENTIDO.length; i++) {
    var op = sentido.newKeywordBuilder().withText(EXTRAS_SENTIDO[i]).withFinalUrl(B + '/logoterapia?tema=crise').build();
    log('Palavra ' + EXTRAS_SENTIDO[i], op);
  }

  // 4) Grupos novos com palavras e anúncio responsivo
  for (var nome in NOVOS) {
    var d = NOVOS[nome];
    var ag = grupo(camp, nome);
    if (!ag) {
      var gop = camp.newAdGroupBuilder().withName(nome).withStatus('ENABLED').build();
      log('Grupo ' + nome, gop);
      if (!gop.isSuccessful()) continue;
      ag = gop.getResult();
    }
    for (var k = 0; k < d.kw.length; k++) {
      log('  palavra ' + d.kw[k], ag.newKeywordBuilder().withText(d.kw[k]).withFinalUrl(d.url).build());
    }
    var hs = [], ds = [];
    for (var h = 0; h < d.h.length; h++) hs.push({ text: d.h[h] });
    for (var x = 0; x < d.d.length; x++) ds.push({ text: d.d[x] });
    var aop = ag.newAd().responsiveSearchAdBuilder()
      .withHeadlines(hs).withDescriptions(ds)
      .withPath1(d.p1).withPath2(d.p2).withFinalUrl(d.url).build();
    log('  anúncio de ' + nome, aop);
  }
}

function grupo(camp, parte) {
  var it = camp.adGroups().withCondition("Name CONTAINS '" + parte + "'").withCondition("Status != REMOVED").get();
  return it.hasNext() ? it.next() : null;
}

function urlsDoGrupo(camp, parte, url) {
  var ag = grupo(camp, parte);
  if (!ag) { Logger.log('Grupo não encontrado: ' + parte); return; }
  var kws = ag.keywords().withCondition("Status != REMOVED").get(), n = 0;
  while (kws.hasNext()) { kws.next().urls().setFinalUrl(url); n++; }
  Logger.log(ag.getName() + ': ' + n + ' palavras agora levam para ' + url);
}

function log(rotulo, op) {
  if (op.isSuccessful()) Logger.log('OK  ' + rotulo);
  else Logger.log('ERRO ' + rotulo + ': ' + op.getErrors().join('; '));
}
