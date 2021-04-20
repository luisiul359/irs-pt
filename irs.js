var ano = 2020;
const debug = false;

// https://dre.pt/home/-/dre/117942337/details/maximized
// https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/diplomas_legislativos/Documents/Portaria_27_2020.pdf
var IAS = ano===2019 ? 435.76 : 438.81;

// Mínimo de Existência
// https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs70.aspx
var minimoExistencia = 1.5 * 14 * IAS;

// https://app.parlamento.pt/webutils/docs/doc.pdf?Path=6148523063446f764c304653546d56304c334e706447567a4c31684a566b784652793950525338794d4449784d6a41794d4445774d544976554545764f57457859324d324e444d745a6a557a595330304d7a63314c546c6b59546b744e57566c5a6d4934595452685932466d4c6e426b5a673d3d&Fich=9a1cc643-f53a-4375-9da9-5eefb8a4acaf.pdf&Inline=true
var minimoExistenciaIL = 14*700;

// Salário mínimo nacional
// https://dre.pt/home/-/dre/117503933/details/maximized
// https://dre.pt/home/-/dre/126365738/details/maximized
var salarioMinimo = ano===2019 ? 600 * 14 : 635 * 14;

// Valor mínimo de Deduçōes Específicas
// Página 8: https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/Folhetos_informativos/Documents/IRS_folheto_2019.pdf
const minDeducaoEspecifica = 4104;

// Ponto 4 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs70.aspx
var thresholdIRS = Math.max(minimoExistencia, salarioMinimo);

// https://app.parlamento.pt/webutils/docs/doc.pdf?Path=6148523063446f764c304653546d56304c334e706447567a4c31684a566b784652793950525338794d4449784d6a41794d4445774d544976554545764f57457859324d324e444d745a6a557a595330304d7a63314c546c6b59546b744e57566c5a6d4934595452685932466d4c6e426b5a673d3d&Fich=9a1cc643-f53a-4375-9da9-5eefb8a4acaf.pdf&Inline=true
var thresholdIRSIL = Math.max(minimoExistenciaIL, salarioMinimo);

// https://iniciativaliberal.pt/legislativas2019/propostas/taxa-irs-15/
const isencaoMensalIL = 650;

// Escalões IRS
// 2019
// https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/ra/Pages/irs68ra_202003.aspx
// 2020
// https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs68.aspx
//
// Incluindo escalōes adicionais de solidariedade (mesmo em ambos os anos)
// https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs68a.aspx
if (ano===2019) {
  var escalao0 = {valor:   7091, percentagem: 0.145, escalao: 0};
  var escalao1 = {valor:  10700, percentagem: 0.230, escalao: 1};
  var escalao2 = {valor:  20261, percentagem: 0.285, escalao: 2};
  var escalao3 = {valor:  25000, percentagem: 0.350, escalao: 3};
  var escalao4 = {valor:  36856, percentagem: 0.370, escalao: 4};
  // €80,000 e não €80,882 devido aos escalōes adicionais de solidariedade
  var escalao5 = {valor:  80000, percentagem: 0.450, escalao: 5};
  var escalao6 = {valor:  80640, percentagem: 0.475, escalao: 6};
  var escalao7 = {valor: 250000, percentagem: 0.505, escalao: 7};
  var escalao8 = {valor: 250000, percentagem: 0.530, escalao: 8};
} else {
  var escalao0 = {valor:   7112, percentagem: 0.145, escalao: 0};
  var escalao1 = {valor:  10732, percentagem: 0.230, escalao: 1};
  var escalao2 = {valor:  20322, percentagem: 0.285, escalao: 2};
  var escalao3 = {valor:  25075, percentagem: 0.350, escalao: 3};
  var escalao4 = {valor:  36967, percentagem: 0.370, escalao: 4};
  // €80,000 e não €80,882 devido aos escalōes adicionais de solidariedade
  var escalao5 = {valor:  80000, percentagem: 0.450, escalao: 5};
  var escalao6 = {valor:  80882, percentagem: 0.475, escalao: 6};
  var escalao7 = {valor: 250000, percentagem: 0.505, escalao: 7};
  var escalao8 = {valor: 250000, percentagem: 0.530, escalao: 8};
}

// value format
const formato = '0,0.00';
const formato2 = '0,0';

// TODO:
// Ponto 1 d) do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78d.aspx
// PPRs


function carregarEscaloesIRS() {
  if (ano===2019) {
    escalao0 = {valor:   7091, percentagem: 0.145, escalao: 0};
    escalao1 = {valor:  10700, percentagem: 0.230, escalao: 1};
    escalao2 = {valor:  20261, percentagem: 0.285, escalao: 2};
    escalao3 = {valor:  25000, percentagem: 0.350, escalao: 3};
    escalao4 = {valor:  36856, percentagem: 0.370, escalao: 4};
    // €80,000 e não €80,882 devido aos escalōes adicionais de solidariedade
    escalao5 = {valor:  80000, percentagem: 0.450, escalao: 5};
    escalao6 = {valor:  80640, percentagem: 0.475, escalao: 6};
    escalao7 = {valor: 250000, percentagem: 0.505, escalao: 7};
    escalao8 = {valor: 250000, percentagem: 0.530, escalao: 8};
  } else {
    escalao0 = {valor:   7112, percentagem: 0.145, escalao: 0};
    escalao1 = {valor:  10732, percentagem: 0.230, escalao: 1};
    escalao2 = {valor:  20322, percentagem: 0.285, escalao: 2};
    escalao3 = {valor:  25075, percentagem: 0.350, escalao: 3};
    escalao4 = {valor:  36967, percentagem: 0.370, escalao: 4};
    // €80,000 e não €80,882 devido aos escalōes adicionais de solidariedade
    escalao5 = {valor:  80000, percentagem: 0.450, escalao: 5};
    escalao6 = {valor:  80882, percentagem: 0.475, escalao: 6};
    escalao7 = {valor: 250000, percentagem: 0.505, escalao: 7};
    escalao8 = {valor: 250000, percentagem: 0.530, escalao: 8};
  }

  IAS = ano===2019 ? 435.76 : 438.81;
  minimoExistencia = 1.5 * 14 * IAS;
  salarioMinimo = ano===2019 ? 600 * 14 : 635 * 14;
  thresholdIRS = Math.max(minimoExistencia, salarioMinimo);
}


function rendimentoColectavel(rendimentoAnualBruto) {

  // Contribuições: TSU trabalhador (Contribuição para a Segurança Social)
  // Págia 2: http://www.seg-social.pt/documents/10152/16175054/Taxas_Contributivas_2019.pdf/5ea23f5f-e7c4-400f-958b-4ff12c41ca0e
  // Assumindo a taxa para "Trabalhadores em geral"
  var tsuTrabalhador = rendimentoAnualBruto * 0.11;

  // Deduçōes Específicas
  // Página 8: https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/Folhetos_informativos/Documents/IRS_folheto_2019.pdf
  var deducaoEspecifica = Math.max(minDeducaoEspecifica, tsuTrabalhador)

  var rendimentoColectavel = rendimentoAnualBruto - deducaoEspecifica

  return [Math.max(0, rendimentoColectavel), deducaoEspecifica];
}


function calcularColetaTotal(rendimentoColectavel, escaloes, escalao0, ultimoEscalao) {

  // Obter a coleta do primeiro escalao
  var escalao = escalao0;
  var coletaTotal = Math.min(rendimentoColectavel, escalao0.valor) * escalao0.percentagem;

  for (var i = 1; i < escaloes.length; i++) {
    var escalaoAnterior = escaloes[i-1];
    var escalaoActual = escaloes[i];

    // Obter a parcela do rendimento que se encontra no escalao actual
    var rendimentoNoEscalaoAtual = Math.min(rendimentoColectavel-escalaoAnterior.valor, escalaoActual.valor-escalaoAnterior.valor)

    if (rendimentoNoEscalaoAtual > 0) {
      escalao = escalaoActual;
    }

    // somar a respectiva coleta
    coletaTotal += Math.max(0, rendimentoNoEscalaoAtual) * escalaoActual.percentagem;
  }

  // Somar a coleta acima do ultimo escalao
  rendimentoNoEscalaoAtual = Math.max(0, rendimentoColectavel-ultimoEscalao.valor);
  coletaTotal += rendimentoNoEscalaoAtual * ultimoEscalao.percentagem;

  if (rendimentoNoEscalaoAtual > 0) {
    escalao = ultimoEscalao;
  }

  return [coletaTotal, escalao];
}


function calcularColetaLiquida(rendimentoAnualBruto, rendimentoAnualBrutoSujeito, coletaTotal, quoeficienteFamiliar, threshold) {

  // Se receber menos do que o Mínimo de Existência ou do que o Salário Mínimo,
  // a diferença é deduzida na coleta total
  // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs70.aspx
  if (rendimentoAnualBruto - coletaTotal < threshold*quoeficienteFamiliar) {
    return Math.max(0, rendimentoAnualBrutoSujeito - threshold);
  } else {
    return Math.max(0, coletaTotal/quoeficienteFamiliar);
  }
}


function calcularDeducoesColeta(rendimentoColectavel, quoeficienteFamiliar, ascendentes, dependentes3Menos, dependentes3Mais, estadoCivil, tributacaoSeparado,
  despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
  despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses)
  {

  // Pontos 1, 2 e 3 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78a.aspx
  var valorDependente3Menos = 726;
  var valorDependente3Mais = 600;
  var valorDependente3MenosExtra = (300-126); // retirar a parcela que já se encontra em "valorDependente3Menos"
  var valorAscendente = ascendentes===1 ? 635 : 525;

  var deducoesDependentesAscendentes = dependentes3Menos*valorDependente3Menos +
                                       dependentes3Mais*valorDependente3Mais +
                                       (ano===2020 ? Math.max(0, dependentes3Menos-1)*valorDependente3MenosExtra : 0) +
                                       ascendentes*valorAscendente;
  if ((estadoCivil==='Casado/Unido de facto') && tributacaoSeparado) {
    deducoesDependentesAscendentes = deducoesDependentesAscendentes / 2;
  }

  // Ponto 1 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78b.aspx
  // por cada sujeito passivo
  var deducoesDespesasGerais = Math.min(0.35*despesasGerais, 250*quoeficienteFamiliar);
  // Ponto 9 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78b.aspx
  if ((estadoCivil==='Solteiro, divorciado, viúvo ou separado judicialmente') && (dependentes3Menos+dependentes3Mais)>=1) {
    deducoesDespesasGerais = Math.min(0.45*despesasGerais, 335);
  }

  // Ponto 1 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78c.aspx
  var deducoesSaude = Math.min(0.15*despesasSaude, 1000);

  // Ponto 1 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78d.aspx
  var deducoesEducacao = Math.min(0.30*despesasEducacao, 800);

  // Ponto 1 e 4 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78e.aspx
  if (rendimentoColectavel<=escalao0.valor) {
    // a) Para contribuintes que tenham um rendimento coletável igual ou inferior ao valor do primeiro escalão do n.º 1 do artigo 68.º, um montante de € 800;
    var threshold = 800;
  } else if ((rendimentoColectavel>escalao0.valor) && (rendimentoColectavel<=30000)) {
    // b) Para contribuintes que tenham um rendimento coletável superior ao valor do primeiro escalão do n.º 1 do artigo 68.º e igual ou inferior a € 30 000, o limite resultante da aplicação da seguinte fórmula:
    var normalization = (30000-rendimentoColectavel) / (30000-escalao0.valor);
    var threshold = 502 + (800-502) * normalization;
  } else {
    // c) Para contribuintes que tenham um rendimento coletável superior ao valor do último escalão do n.º 1 do artigo 68.º, o montante de € 1 000.
    var threshold = 502;
  }

  var deducoesHabitacao = Math.min(0.15*despesasHabitacao, threshold);

  // Ponto 1 e 3 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78f.aspx
  var despesasIva = despesasAutomoveis+despesasMotociclos+despesasRestauracao+despesasCabeleireiros+despesasVeterinario;
  // Assumindo que todas as faturas têm IVA a 23%.
  var deducoesIva = Math.min(0.23/1.23*despesasIva*0.15, 250) + 0.23/1.23*despesasPasses;

  // Ponto 1 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs83a.aspx
  var deducoesPensoesAlimentos = 0.20*despesasPensoesAlimentos;

  // Ponto 1 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs84.aspx
  var deducoesLares = Math.min(0.25*despesasLares, 403.75);

  // Ponto 3 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78.aspx
  var restantesDeducoes = deducoesSaude + deducoesEducacao + deducoesHabitacao + deducoesPensoesAlimentos + deducoesIva + deducoesLares;

  if (debug) {
    console.log('deducoesDependentesAscendentes', deducoesDependentesAscendentes);
    console.log('deducoesDespesasGerais', deducoesDespesasGerais);
    console.log('deducoesSaude', deducoesSaude);
    console.log('deducoesEducacao', deducoesEducacao);
    console.log('deducoesHabitacao', deducoesHabitacao);
    console.log('deducoesPensoesAlimentos', deducoesPensoesAlimentos);
    console.log('deducoesIva', deducoesIva);
    console.log('deducoesLares', deducoesLares);
  }

  return [deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes];
}


function limitarDeducoesColeta(deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes, escalao, rendimentoColectavel, dependentes, tributacaoSeparado) {
  // Ponto 7 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78.aspx

  if (escalao==0) {
    // a) Para contribuintes que tenham um rendimento coletável igual ou inferior ao valor do 1.º escalão do n.º 1 artigo 68.º, sem limite;
    var threshold = Number.POSITIVE_INFINITY;
  } else if (escalao<=6) {
    // b) Para contribuintes que tenham um rendimento coletável superior ao valor do 1.º escalão e igual ou inferior ao valor do último escalão do n.º 1 do artigo 68.º, o limite resultante da aplicação da seguinte fórmula:
    var normalization = (escalao6.valor-rendimentoColectavel) / (escalao6.valor-escalao0.valor);
    var threshold = 1000 + (2500-1000) * normalization;
  } else {
    // c) Para contribuintes que tenham um rendimento coletável superior ao valor do último escalão do n.º 1 do artigo 68.º, o montante de € 1 000.
    var threshold = 1000;
  }

  // Ponto 14 a) do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78.aspx
  if (tributacaoSeparado) {
    threshold = threshold / 2;
  }

  // Ponto 8 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78.aspx
  if (dependentes>=3) {
    threshold = threshold * (1 + 0.05 * dependentes)
  }

  return Math.min(restantesDeducoes, threshold) + deducoesDependentesAscendentes + deducoesDespesasGerais;
}


function abaixoMinimoExistencia(rendimentoAnualBruto, rendimentoColectavel, dependentes, tributacaoSeparado) {
  // Pontos 1 e 4 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs70.aspx
  if(rendimentoAnualBruto < minimoExistencia) {
    return true;
  }

  // Pontos 2 e 3 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs70.aspx
  if(dependentes === 3 || dependentes === 4) {
    var minimo = tributacaoSeparado ? 11320/2 : 11320;
    if(rendimentoColectavel <= minimo) {
      return true;
    }
  } else if(dependentes >= 5) {
    var minimo = tributacaoSeparado ? 15560/2 : 15560;
    if(rendimentoColectavel <= minimo) {
      return true;
    }
  }

  return false
}


function calcularIRS(rendimentoA, rendimentoB, estadoCivil, tributacao, ascendentes, dependentes3Menos, dependentes3Mais,
  despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
  despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses)
  {

  // ter a certeza que este rendimento é 0 nesta condição
  if (estadoCivil==='Solteiro, divorciado, viúvo ou separado judicialmente') {
    rendimentoB = 0;
  }

  // Estamos a pedir o salário bruto mensal considerando 14 meses
  var rendimentoAnualBrutoA = rendimentoA * 14;
  var rendimentoAnualBrutoB = rendimentoB * 14;

  // Rendimento Colectável
  var [rendimentoColectavelA, deducaoEspecificaA] = rendimentoColectavel(rendimentoAnualBrutoA);
  var [rendimentoColectavelB, deducaoEspecificaB] = rendimentoColectavel(rendimentoAnualBrutoB);
  var deducoesEspecificas = deducaoEspecificaA + (rendimentoB>0 ? deducaoEspecificaB: 0);

  // calcular o IRS progressivamente
  var escaloes = [escalao0, escalao1, escalao2, escalao3, escalao4,
                  escalao5, escalao6, escalao7];

  if ((estadoCivil==='Casado/Unido de facto') && (tributacao==='Separado')) {

    var [coletaTotalA, escalaoA] = calcularColetaTotal(rendimentoColectavelA, escaloes, escalao0, escalao8);
    var [coletaTotalB, escalaoB] = calcularColetaTotal(rendimentoColectavelB, escaloes, escalao0, escalao8);
    var coletaTotal = coletaTotalA + coletaTotalB;
    var taxa = `${numeral(escalaoA.percentagem*100).format('0,0.0')}% | ${numeral(escalaoB.percentagem*100).format('0,0.0')}%`;

    var coletaLiquidaA = calcularColetaLiquida(rendimentoAnualBrutoA, rendimentoAnualBrutoA, coletaTotalA, 1, thresholdIRS);
    var coletaLiquidaB = calcularColetaLiquida(rendimentoAnualBrutoB, rendimentoAnualBrutoB, coletaTotalB, 1, thresholdIRS);

    // Garantir que a coleta liquida não é superior à total
    coletaLiquidaA = Math.min(coletaLiquidaA, coletaTotalA);
    coletaLiquidaB = Math.min(coletaLiquidaB, coletaTotalB);

    // Ponto 7 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78.aspx
    // Estamos a assumir que cada sujeito passivo foi responsável por 50% de cada despesa
    var [deducoesDespesasGeraisA, deducoesDependentesAscendentesA, restantesDeducoesA] = calcularDeducoesColeta(
      rendimentoColectavelA, 1, ascendentes, dependentes3Menos, dependentes3Mais, estadoCivil, true,
      despesasGerais/2, despesasSaude/2, despesasEducacao/2, despesasHabitacao/2, despesasLares/2, despesasPensoesAlimentos/2,
      despesasAutomoveis/2, despesasMotociclos/2, despesasRestauracao/2, despesasCabeleireiros/2, despesasVeterinario/2, despesasPasses/2
    );
    var [deducoesDespesasGeraisB, deducoesDependentesAscendentesB, restantesDeducoesB] = calcularDeducoesColeta(
      rendimentoColectavelB, 1, ascendentes, dependentes3Menos, dependentes3Mais, estadoCivil, true,
      despesasGerais/2, despesasSaude/2, despesasEducacao/2, despesasHabitacao/2, despesasLares/2, despesasPensoesAlimentos/2,
      despesasAutomoveis/2, despesasMotociclos/2, despesasRestauracao/2, despesasCabeleireiros/2, despesasVeterinario/2, despesasPasses/2
    );

    var deducoesColetaA = limitarDeducoesColeta(deducoesDespesasGeraisA, deducoesDependentesAscendentesA, restantesDeducoesA, escalaoA.escalao, rendimentoColectavelA, dependentes3Menos+dependentes3Mais, true);
    var deducoesColetaB = limitarDeducoesColeta(deducoesDespesasGeraisB, deducoesDependentesAscendentesB, restantesDeducoesB, escalaoB.escalao, rendimentoColectavelB, dependentes3Menos+dependentes3Mais, true);

    // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs70.aspx
    var abaixoExistenciaA = abaixoMinimoExistencia(rendimentoAnualBrutoA, rendimentoColectavelA, dependentes3Menos+dependentes3Mais, true);
    if (abaixoExistenciaA) {
      deducoesColetaA = Math.min(deducoesColetaA, coletaTotalA);
    }
    var abaixoExistenciaB = abaixoMinimoExistencia(rendimentoAnualBrutoB, rendimentoColectavelB, dependentes3Menos+dependentes3Mais, true);
    if (abaixoExistenciaB) {
      deducoesColetaB = Math.min(deducoesColetaB, coletaTotalB);
    }

    // Deduçōes à Coleta
    // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78.aspx
    var deducoesColeta = deducoesColetaA + deducoesColetaB;
    var coletaLiquida = (abaixoExistenciaA ? 0 : (coletaLiquidaA - Math.min(coletaLiquidaA,deducoesColetaA))) + (abaixoExistenciaB ? 0 : (coletaLiquidaB - Math.min(coletaLiquidaB,deducoesColetaB)));

    if (debug) {
      console.log('rendimentoColectavelA', rendimentoColectavelA);
      console.log('rendimentoColectavelB', rendimentoColectavelB);
      console.log('coletaTotalA', coletaTotalA);
      console.log('coletaTotalB', coletaTotalB);
      console.log('deducoesColetaA', deducoesColetaA);
      console.log('deducoesColetaB', deducoesColetaB);
      console.log('coletaLiquida', coletaLiquida);
    }
  } else {
    // situações
    // estadoCivil==='Solteiro, divorciado, viúvo ou separado judicialmente'
    // (estadoCivil==='Casado/Unido de facto') && (tributacao==='Conjunto')

    var rendimentoAnualBrutoTotal = rendimentoAnualBrutoA + rendimentoAnualBrutoB;

    // Quoeficiente Familiar
    // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs69.aspx
    var quoeficienteFamiliar = (tributacao==='Conjunto') && (estadoCivil==='Casado/Unido de facto') ? 2 : 1;

    // Ponto 1 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs69.aspx
    var rendimentoColectavelFinal = (rendimentoColectavelA + rendimentoColectavelB) / quoeficienteFamiliar;

    var [coletaTotal, escalao] = calcularColetaTotal(rendimentoColectavelFinal, escaloes, escalao0, escalao8);
    var taxa = `${numeral(escalao.percentagem*100).format('0,0.0')}%`;

    // Ponto 3 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs69.aspx
    coletaTotal = coletaTotal * quoeficienteFamiliar;

    var coletaLiquida = calcularColetaLiquida(rendimentoAnualBrutoTotal, rendimentoAnualBrutoA, coletaTotal, quoeficienteFamiliar, thresholdIRS) +
                        (rendimentoB>0 ? calcularColetaLiquida(rendimentoAnualBrutoTotal, rendimentoAnualBrutoB, coletaTotal, quoeficienteFamiliar, thresholdIRS): 0);

    // Garantir que a coleta liquida não é superior à total
    coletaLiquida = Math.min(coletaLiquida, coletaTotal);

    // Ponto 7 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78.aspx
    var [deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes] = calcularDeducoesColeta(
      rendimentoColectavelFinal, quoeficienteFamiliar, ascendentes, dependentes3Menos, dependentes3Mais, estadoCivil, false,
      despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
      despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses
    );

    var deducoesColeta = limitarDeducoesColeta(deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes, escalao.escalao, rendimentoColectavelFinal, dependentes3Menos+dependentes3Mais, false);

    // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs70.aspx
    var abaixoExistencia = abaixoMinimoExistencia(rendimentoAnualBrutoTotal, rendimentoColectavelFinal, dependentes3Menos+dependentes3Mais, false);
    if (abaixoExistencia) {
      deducoesColeta = Math.min(deducoesColeta, coletaTotal);
    }

    // Deduçōes à Coleta
    coletaLiquida = abaixoExistencia ? 0 : (coletaLiquida - Math.min(coletaLiquida, deducoesColeta));

    if (debug) {
      console.log('rendimentoAnualBrutoTotal', rendimentoAnualBrutoTotal);
      console.log('rendimentoColectavelA', rendimentoColectavelA);
      console.log('rendimentoColectavelB', rendimentoColectavelB);
      console.log('rendimentoColectavelFinal', rendimentoColectavelFinal);
      console.log('quoeficienteFamiliar', quoeficienteFamiliar);
      console.log('coletaTotal', coletaTotal);
      console.log('deducoesColeta', deducoesColeta);
      console.log('coletaLiquida', coletaLiquida);
    }
  }

  var irs = Math.max(0, coletaLiquida);

  if (debug) {
    console.log('IRS', irs);
  }

  return [deducoesEspecificas, rendimentoColectavelA + rendimentoColectavelB, taxa, coletaTotal, deducoesColeta, irs];
}


function calcularIRS_IL(rendimentoA, rendimentoB, dependentes, estadoCivil) {

  // https://iniciativaliberal.pt/legislativas2019/propostas/taxa-irs-15/

  // ter a certeza que este rendimento é 0 nesta condição
  if (estadoCivil==='Solteiro, divorciado, viúvo ou separado judicialmente') {
    rendimentoB = 0;
  }

  // Estamos a pedir o salário bruto mensal considerando 14 meses
  var rendimentoAnualBrutoA = rendimentoA * 14;
  var rendimentoAnualBrutoB = rendimentoB * 14;

  var sujeitosPassivos = rendimentoB > 0 ? 2 : 1;

  // Ponto C.6 do https://iniciativaliberal.pt/legislativas2019/propostas/taxa-irs-15/
  var valorIsencao = isencaoMensalIL * 14 * sujeitosPassivos;

  // Ponto D.5 do https://iniciativaliberal.pt/legislativas2019/propostas/taxa-irs-15/
  var isencaoMensalILExtra = rendimentoB > 0 ? 200 : 400;
  valorIsencao += isencaoMensalILExtra * dependentes * 14 * sujeitosPassivos;

  // Ponto C.1 do https://iniciativaliberal.pt/legislativas2019/propostas/taxa-irs-15/
  var irs = Math.max(
    0,
    (rendimentoAnualBrutoA + rendimentoAnualBrutoB - valorIsencao) * 0.15
  );

  if (debug) {
    console.log('IRS_IL', irs);
  }

  return irs
}


function calcularDeducoesColeta_IL_3escaloes(dependentes3Menos, dependentes3Mais, estadoCivil, tributacaoSeparado,
  despesasPensoesAlimentos)
  {

  var valorDependentes = 5600;

  var deducoesDependentes = dependentes3Menos*valorDependentes +
                            dependentes3Mais*valorDependentes;
  if ((estadoCivil==='Casado/Unido de facto') && tributacaoSeparado) {
    deducoesDependentes = deducoesDependentes / 2;
  }

  // Ponto 1 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs83a.aspx
  var deducoesPensoesAlimentos = 0.20*despesasPensoesAlimentos;

  if (debug) {
    console.log('deducoesDependentes', deducoesDependentes);
    console.log('deducoesPensoesAlimentos', deducoesPensoesAlimentos);
  }

  return deducoesDependentes + deducoesPensoesAlimentos;
}


function calcularIRS_IL_3escaloes(rendimentoA, rendimentoB, estadoCivil, tributacao, dependentes3Menos, dependentes3Mais,despesasPensoesAlimentos) {

  // https://app.parlamento.pt/webutils/docs/doc.pdf?Path=6148523063446f764c304653546d56304c334e706447567a4c31684a566b784652793950525338794d4449784d6a41794d4445774d544976554545764f57457859324d324e444d745a6a557a595330304d7a63314c546c6b59546b744e57566c5a6d4934595452685932466d4c6e426b5a673d3d&Fich=9a1cc643-f53a-4375-9da9-5eefb8a4acaf.pdf&Inline=true

  // ter a certeza que este rendimento é 0 nesta condição
  if (estadoCivil==='Solteiro, divorciado, viúvo ou separado judicialmente') {
    rendimentoB = 0;
  }

  // Estamos a pedir o salário bruto mensal considerando 14 meses
  var rendimentoAnualBrutoA = rendimentoA * 14;
  var rendimentoAnualBrutoB = rendimentoB * 14;

  var ilescalao0 = {valor:   9800, percentagem: 0.000, escalao: 0};
  var ilescalao1 = {valor:  50000, percentagem: 0.150, escalao: 1};
  var ilescalao2 = {valor:  50000, percentagem: 0.275, escalao: 2};

  // calcular o IRS progressivamente
  var escaloes = [ilescalao0, ilescalao1];

  if ((estadoCivil==='Casado/Unido de facto') && (tributacao==='Separado')) {
    var [coletaTotalA, escalaoA] = calcularColetaTotal(rendimentoAnualBrutoA, escaloes, ilescalao0, ilescalao2);
    var [coletaTotalB, escalaoB] = calcularColetaTotal(rendimentoAnualBrutoB, escaloes, ilescalao0, ilescalao2);
    var coletaTotal = coletaTotalA + coletaTotalB;
    var taxa = `${numeral(escalaoA.percentagem*100).format('0,0.0')}% | ${numeral(escalaoB.percentagem*100).format('0,0.0')}%`;

    var coletaLiquidaA = calcularColetaLiquida(rendimentoAnualBrutoA, rendimentoAnualBrutoA, coletaTotal, 1, thresholdIRSIL);
    var coletaLiquidaB = calcularColetaLiquida(rendimentoAnualBrutoB, rendimentoAnualBrutoB, coletaTotal, 1, thresholdIRSIL);

    // Garantir que a coleta liquida não é superior à total
    coletaLiquidaA = Math.min(coletaLiquidaA, coletaTotalA);
    coletaLiquidaB = Math.min(coletaLiquidaB, coletaTotalB);

    // Ponto 7 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78.aspx
    var deducoesColetaA = calcularDeducoesColeta_IL_3escaloes(dependentes3Menos, dependentes3Mais, estadoCivil, true, despesasPensoesAlimentos/2);
    var deducoesColetaB = calcularDeducoesColeta_IL_3escaloes(dependentes3Menos, dependentes3Mais, estadoCivil, true, despesasPensoesAlimentos/2);

    // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs70.aspx
    var abaixoExistenciaA = rendimentoAnualBrutoA < minimoExistenciaIL;
    if (abaixoExistenciaA) {
      deducoesColetaA = Math.min(deducoesColetaA, coletaTotalA);
    }
    var abaixoExistenciaB = rendimentoAnualBrutoB < minimoExistenciaIL;
    if (abaixoExistenciaB) {
      deducoesColetaB = Math.min(deducoesColetaB, coletaTotalB);
    }

    // Deduçōes à Coleta
    // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78.aspx
    var deducoesColeta = deducoesColetaA + deducoesColetaB;
    var coletaLiquida = (abaixoExistenciaA ? 0 : (coletaLiquidaA - Math.min(coletaLiquidaA,deducoesColetaA))) + (abaixoExistenciaB ? 0 : (coletaLiquidaB - Math.min(coletaLiquidaB,deducoesColetaB)));

    if (debug) {
      console.log('rendimentoAnualBrutoA', rendimentoAnualBrutoA);
      console.log('rendimentoAnualBrutoB', rendimentoAnualBrutoB);
      console.log('coletaTotalA', coletaTotalA);
      console.log('coletaTotalB', coletaTotalB);
      console.log('deducoesColetaA', deducoesColetaA);
      console.log('deducoesColetaB', deducoesColetaB);
      console.log('coletaLiquida', coletaLiquida);
    }
  } else {
    var rendimentoAnualBrutoTotal = rendimentoAnualBrutoA + rendimentoAnualBrutoB;

    // Quoeficiente Familiar
    // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs69.aspx
    var quoeficienteFamiliar = (tributacao==='Conjunto') && (estadoCivil==='Casado/Unido de facto') ? 2 : 1;

    // Ponto 1 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs69.aspx
    var rendimentoFinal = rendimentoAnualBrutoTotal / quoeficienteFamiliar;

    var [coletaTotal, escalao] = calcularColetaTotal(rendimentoFinal, escaloes, ilescalao0, ilescalao2);
    var taxa = `${numeral(escalao.percentagem*100).format('0,0.0')}%`;

    // Ponto 3 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs69.aspx
    coletaTotal = coletaTotal * quoeficienteFamiliar;

    var coletaLiquida = calcularColetaLiquida(rendimentoAnualBrutoTotal, rendimentoAnualBrutoA, coletaTotal, quoeficienteFamiliar, thresholdIRSIL) +
                        (rendimentoB>0 ? calcularColetaLiquida(rendimentoAnualBrutoTotal, rendimentoAnualBrutoB, coletaTotal, quoeficienteFamiliar, thresholdIRSIL): 0);

    // Garantir que a coleta liquida não é superior à total
    coletaLiquida = Math.min(coletaLiquida, coletaTotal);

    // Ponto 7 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78.aspx
    var deducoesColeta = calcularDeducoesColeta_IL_3escaloes(
      dependentes3Menos, dependentes3Mais, estadoCivil, false, despesasPensoesAlimentos
    );

    // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs70.aspx
    var abaixoExistencia = rendimentoAnualBrutoTotal < minimoExistenciaIL;
    if (abaixoExistencia) {
      deducoesColeta = Math.min(deducoesColeta, coletaTotal);
    }

    // Deduçōes à Coleta
    coletaLiquida = abaixoExistencia ? 0 : (coletaLiquida - Math.min(coletaLiquida, deducoesColeta));

    if (debug) {
      console.log('rendimentoAnualBrutoTotal', rendimentoAnualBrutoTotal);
      console.log('quoeficienteFamiliar', quoeficienteFamiliar);
      console.log('coletaTotal', coletaTotal);
      console.log('deducoesColeta', deducoesColeta);
      console.log('coletaLiquida', coletaLiquida);
    }
  }

  var irs = Math.max(0, coletaLiquida);

  if (debug) {
    console.log('IRS_IL_3escaloes', irs);
  }

  return irs;
}


function calcularRendLiquido(rendimentoA, rendimentoB, pagarIRS) {

  // Estamos a pedir o salário bruto mensal considerando 14 meses
  var rendimentoAnualBrutoA = rendimentoA * 14;
  var rendimentoAnualBrutoB = rendimentoB * 14;
  var rendimentoAnualBruto = rendimentoAnualBrutoA + rendimentoAnualBrutoB;

  // Contribuições: TSU trabalhador (Quota parte da contribuição para a Segurança Social)
  //                TSU empresa     (Quota parte da contribuição para a Segurança Social)
  // Págia 2: http://www.seg-social.pt/documents/10152/16175054/Taxas_Contributivas_2019.pdf/5ea23f5f-e7c4-400f-958b-4ff12c41ca0e
  // Assumindo a taxa para "Trabalhadores em geral"
  var tsuTrabalhador = rendimentoAnualBruto * 0.11;
  var tsuEmpresa = rendimentoAnualBruto * 0.2375;

  // Quanto vai cair na conta do(s) sujeito(s) passivo(s)
  var rendTrabalhador = rendimentoAnualBruto - pagarIRS - tsuTrabalhador;

  // Quanto vai para o Estado
  var rendEstado = pagarIRS + tsuTrabalhador + tsuEmpresa;

  // Pago pela empresa
  var pagoEmpresa = rendimentoAnualBruto + tsuEmpresa;

  return [rendTrabalhador, rendEstado, pagoEmpresa]

}


function atualizarTabelaIRS(irsActual, irsIL, irsIL3e, rendimentoA, rendimentoB, estadoCivil,
  tributacao, ascendentes, dependentes, deducoesEspecificas, rendimentoColectavel,
  taxa, coletaTotal, deducoesColeta, valorTrabalhador, valorEstado)
{

  // ter a certeza que este rendimento é 0 nesta condição
  if (estadoCivil==='Solteiro, divorciado, viúvo ou separado judicialmente') {
    rendimentoB = 0;
  }

  var rendimentoAnual = (rendimentoA+rendimentoB)*14;

  // Resumo das opções escolhidas
  var p_summary = $('#summary');
  var pRendimento = estadoCivil==='Casado/Unido de facto' ? `${numeral(rendimentoA).format(formato)}€ + ${numeral(rendimentoB).format(formato)}€` : `${numeral(rendimentoA).format(formato)}€`;
  var pEstadoCivilTributacao = estadoCivil==='Casado/Unido de facto' ? `Casado | ${tributacao}` : 'Solteiro';
  var pAscendetes = ascendentes===0 ? 'Sem ascendentes' : `${ascendentes} ascendente(s)`;
  var pDependentes = dependentes===0 ? 'Sem dependentes' : `${dependentes} dependente(s)`;
  p_summary.text(`${pRendimento} | ${pEstadoCivilTributacao} | ${pDependentes} | ${pAscendetes}`);

  // Onde irá aparecer o rendimento anual bruto
  var span_rendimento = $('#rendimento')
  var fRendimentoAnual = numeral(rendimentoAnual).format(formato);
  span_rendimento.text(`${fRendimentoAnual}€`);

  // Onde irá aparecer o valor que o trabalhador recebe
  var span_valorTrabalhador = $('#valorTrabalhador');
  var fValorTrabalhador = numeral(valorTrabalhador).format(formato);
  span_valorTrabalhador.text(`${fValorTrabalhador}€`);

  // Onde irá aparecer o valor para o Estado
  var span_valorEstado = $('#valorEstado');
  var fValorEstado = numeral(valorEstado).format(formato);
  span_valorEstado.text(`${fValorEstado}€`);

  // Onde irá aparecer o valor de IRS segundo o actual sistema
  var span_irsAtual = $('#irsAtual');
  var fIrsAtual = numeral(irsActual).format(formato);
  span_irsAtual.text(`${fIrsAtual}€`);

  // Detalhes do cálculo de IRS do actual Sistema
  var span_deducoesEspecificas = $('#deducoesEspecificas')
  span_deducoesEspecificas.text(`${numeral(deducoesEspecificas).format(formato)}€`);

  var span_rendimentoColectavel = $('#rendimentoColectavel')
  span_rendimentoColectavel.text(`${numeral(rendimentoColectavel).format(formato)}€`);

  var span_taxa = $('#taxa')
  span_taxa.text(taxa);

  var span_coletaTotal = $('#coletaTotal')
  span_coletaTotal.text(`${numeral(coletaTotal).format(formato)}€`);

  var span_deducoesColeta = $('#deducoesColeta')
  span_deducoesColeta.text(`${numeral(deducoesColeta).format(formato)}€`);

  var span_coletaLiquida = $('#coletaLiquida')
  span_coletaLiquida.text(`${numeral(fIrsAtual).format(formato)}€`);

  // Onde irá aparecer o valor de IRS segundo a proposta da IL
  var span_irsIL = $('#irsIL');
  var fIrsIL = numeral(irsIL).format(formato);
  span_irsIL.text(`${fIrsIL}€`);

  // Onde irá aparecer o valor de IRS segundo a proposta da IL de 2 escalões
  var span_irsIL3e = $('#irsIL3e');
  var fIrsIL3e = numeral(irsIL3e).format(formato);
  span_irsIL3e.text(`${fIrsIL3e}€`);

  // Diferença entre o IRS do actual sistema e da proposta da IL
  var span_diff = $('#diff');
  var diff = irsActual - irsIL;
  var fDiff = numeral(diff).format(formato);
  if (diff<0) {
    span_diff.removeClass('bg-secondary');
    span_diff.removeClass('bg-success');
    span_diff.addClass('bg-danger');
    span_diff.text(`${fDiff}€`);
  } else {
    span_diff.removeClass('bg-secondary');
    span_diff.removeClass('bg-danger');
    span_diff.addClass('bg-success');
    span_diff.text(`${fDiff}€`);
  }

}


function pad(value) {
  var v = numeral(value).format(formato2);

  return v.padStart(9-v.length, "|").replaceAll("|", "&nbsp;");
}


function atualizarTabelaRendimentos(rendimentoBase, irsActualBase, valorTrabalhadorBase, valorEstadoBase, pagoEmpresaBase,
  rendimentoA, rendimentoB, estadoCivil, tributacao, ascendentes, dependentes3Menos, dependentes3Mais,
  despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
  despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses)
  {

    $("#tabelaRendimentos").empty()

    $("#tabelaRendimentos").append(`
      <thead>
        <tr>
          <th scope="colgroup" rowspan="2" class="text-center align-middle">Mensal</th>
          <th scope="colgroup" rowspan="2" colspan="2" class="text-center align-middle">Rendimento Anual Bruto</th>
          <th scope="col" colspan="2" rowspan="2" class="text-center align-middle" data-toggle="tooltip" data-placement="top" data-container="body" title="A contar com a TSU da empresa">Empresa pagou</th>
          <th scope="col" colspan="4" class="text-center align-middle">Você recebe</th>
          <th scope="col" colspan="4" class="text-center align-middle">Estado recebe</th>
        </tr>
        <tr>
          <th scope="col" colspan="2" class="text-center align-middle">Sistema Actual</th>
          <th scope="col" colspan="2" class="text-center align-middle">Com a IL</th>
          <th scope="col" colspan="2" class="text-center align-middle">Sistema Actual</th>
          <th scope="col" colspan="2" class="text-center align-middle">Com a IL</th>
        </tr>
      </thead>`
    );

    var tbody = '';

    [0, 50, 100, 200, 300].forEach(incremento => {

      var rendA = rendimentoA + incremento;
      var rendB = rendimentoB > 0 ? rendimentoB + incremento : 0;

      var irsActual = calcularIRS(
        rendA, rendB, estadoCivil, tributacao, ascendentes, dependentes3Menos, dependentes3Mais,
        despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
        despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses
      )[5];

      var irsIL = calcularIRS_IL(
        rendA, rendB, dependentes3Menos + dependentes3Mais, estadoCivil
      );

      var [valorTrabalhador, valorEstado, pagoEmpresa] = calcularRendLiquido(rendA, rendB, irsActual);
      var [valorTrabalhadorIL, valorEstadoIL, pagoEmpresaIL] = calcularRendLiquido(rendA, rendB, irsIL);

      var d1 = valorTrabalhadorIL-valorTrabalhadorBase;
      var d2 = valorEstadoIL-valorEstadoBase;

      tbody = tbody + `
          <tr>
            <td class="text-right">+${pad(incremento)}€</td>

            <td class="text-right">${pad((rendA+rendB)*14)}€</td>
            <td class="text-right text-muted"><small>+${pad((rendA+rendB)*14-rendimentoBase)}€</small></td>

            <td class="text-right">${pad(pagoEmpresa)}€</td>
            <td class="text-right text-muted"><small>+${pad(pagoEmpresa-pagoEmpresaBase)}€</small></td>

            <td class="text-right">${pad(valorTrabalhador)}€</td>
            <td class="text-right text-muted"><small>+${pad(valorTrabalhador-valorTrabalhadorBase)}€</small></td>

            <td class="text-right">${pad(valorTrabalhadorIL)}€</td>
            <td class="text-right text-muted"><small>${d1 >= 0 ? '+' : '-'}${pad(Math.abs(d1))}€</small></td>

            <td class="text-right">${pad(valorEstado)}€</td>
            <td class="text-right text-muted"><small>+${pad(valorEstado-valorEstadoBase)}€</small></td>

            <td class="text-right">${pad(valorEstadoIL)}€</td>
            <td class="text-right text-muted"><small>${d2 >= 0 ? '+' : '-'}${pad(Math.abs(d2))}€</small></td>
          </tr>`
      ;

    });

    $("#tabelaRendimentos").append(`<tbody>${tbody}</tbody>`).hide();
}


function main() {

    // Obter os valores inseridos pelo utilizador no formulário
    var rendimentoA = Number($("#rendA").val());
    // Quando não há rendimento fica com 0
    var rendimentoB = Number($("#rendB").val());
    var estadoCivil = $("#estadoCivil option:selected").text();
    var tributacao = $("#tributacao option:selected").text();
    var ascendentes = Number($("#ascendentes").val());
    var dependentes3Menos = Number($("#dependentes3menos").val());
    // Maior ou igual
    var dependentes3Mais = Number($("#dependentes3mais").val());

    // Deduçōes à coleta - quando não há valor fica com 0
    var despesasGerais = Number($("#despesasGerais").val());
    var despesasSaude = Number($("#despesasSaude").val());
    var despesasEducacao = Number($("#despesasEducacao").val());
    var despesasHabitacao = Number($("#despesasHabitacao").val());
    var despesasLares = Number($("#despesasLares").val());
    var despesasPensoesAlimentos = Number($("#despesasPensoesAlimentos").val());
    var despesasAutomoveis = Number($("#despesasAutomoveis").val());
    var despesasMotociclos = Number($("#despesasMotociclos").val());
    var despesasRestauracao = Number($("#despesasRestauracao").val());
    var despesasCabeleireiros = Number($("#despesasCabeleireiros").val());
    var despesasVeterinario = Number($("#despesasVeterinario").val());
    var despesasPasses = Number($("#despesasPasses").val());

    // ter a certeza que este rendimento é 0 nesta condição
    if (estadoCivil==='Solteiro, divorciado, viúvo ou separado judicialmente') {
      rendimentoB = 0;
    }

    //ano = Number($("#anoCivil").val());
    //carregarEscaloesIRS();

    var [deducoesEspecificas, rendimentoColectavel, taxa, coletaTotal, deducoesColeta, irsActual] = calcularIRS(
      rendimentoA, rendimentoB, estadoCivil, tributacao, ascendentes, dependentes3Menos, dependentes3Mais,
      despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
      despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses
    );

    var irsIL = calcularIRS_IL(
      rendimentoA, rendimentoB, dependentes3Menos + dependentes3Mais, estadoCivil
    );

    var irsIL3e = calcularIRS_IL_3escaloes(
      rendimentoA, rendimentoB, estadoCivil, tributacao, dependentes3Menos, dependentes3Mais,despesasPensoesAlimentos
    );

    var [valorTrabalhador, valorEstado, pagoEmpresa] = calcularRendLiquido(rendimentoA, rendimentoB, irsActual);

    atualizarTabelaIRS(
      irsActual, irsIL, irsIL3e, rendimentoA, rendimentoB, estadoCivil, tributacao, ascendentes, dependentes3Menos + dependentes3Mais,
      deducoesEspecificas, rendimentoColectavel, taxa, coletaTotal, deducoesColeta, valorTrabalhador, valorEstado
    );

    atualizarTabelaRendimentos(
      (rendimentoA+rendimentoB)*14, irsActual, valorTrabalhador, valorEstado, pagoEmpresa,
      rendimentoA, rendimentoB, estadoCivil, tributacao, ascendentes, dependentes3Menos, dependentes3Mais,
      despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
      despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses
    );

}

/*
function changeVideo(btn,ep) {
  $('.btnVideos').each(function(i, obj) {
    $(obj).removeClass('btnVideosHover');
  });
  $(btn).toggleClass('btnVideosHover');

  if (ep===1) {
    $('#video').attr('src', 'https://www.youtube.com/embed/up0Gfd5c0cM');
    $('#descVideo').text('Video 1');
  } else if (ep===2) {
    $('#video').attr('src', 'https://www.youtube.com/embed/2nBGppKe1z4');
    $('#descVideo').text('Video 2');
  } else if (ep===3) {
    $('#video').attr('src', 'https://www.youtube.com/embed/OERxKenLIo8');
    $('#descVideo').text('Video 3');
  } else if (ep===4) {

  } else {

  }

}
*/


(function () {
  'use strict'

  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation')

    // Disabling form submissions if there are invalid fields
    // and prevent submission to keep the values
    Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        } else {
          if ($(form).attr('id') === "formIRS") {
            main();
          } else {
            $("#tabelaRendimentos").show();
          }
          // Avoid form from resetting the selected values
          event.preventDefault();
        }
        form.classList.add('was-validated');
      }, false)
    });

    // Enable / disable options
    $('#estadoCivil').change(function(){
      if($(this).val() === 'Casado/Unido de facto') {
        $('#rendB').prop('disabled',false);
        $('#tributacao').prop('disabled',false);
      } else {
        $('#rendB').prop('disabled',true);
        $('#tributacao').prop('disabled',true);
      }
    });

    // enable tooltips
    $('input').tooltip();
    $('[data-toggle="tooltip"]').tooltip();

    // auto collapse the navbar
    $('#navbarCollapse a').click(function(){
      $('#navbarCollapse').collapse('hide');
    });
  }, false)
}())
