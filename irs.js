const ano = 2019;

// https://dre.pt/home/-/dre/117942337/details/maximized
// https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/diplomas_legislativos/Documents/Portaria_27_2020.pdf
const IAS = ano===2019 ? 435.76 : 438.81;

// Mínimo de Existência
// https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs70.aspx
const minimoExistencia = 1.5 * 14 * IAS;

// Salário mínimo nacional
// https://dre.pt/home/-/dre/117503933/details/maximized
// https://dre.pt/home/-/dre/126365738/details/maximized
const salarioMinimo = ano===2019 ? 600 * 14 : 635 * 14;

// Valor mínimo de Deduçōes Específicas
// Página 8: https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/Folhetos_informativos/Documents/IRS_folheto_2019.pdf
const minDeducaoEspecifica = 4104;

// Ponto 4 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs70.aspx
const thresholdIRS = Math.max(minimoExistencia, salarioMinimo);

// https://iniciativaliberal.pt/legislativas2019/propostas/taxa-irs-15/
const isencaoMensalIL = 650;

// Escalões IRS
// 2019
// https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/ra/Pages/irs68ra_202003.aspx
// 2020
// https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs68.aspx
//
// Incluindo escalōes adicionais de solidariedade (mesma em ambos os anos)
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


function rendimentoColectavel(rendimentoAnualBruto) {

  // Contribuições: TSU trabalhador (Contribuição para a Segurança Social)
  // Págia 2: http://www.seg-social.pt/documents/10152/16175054/Taxas_Contributivas_2019.pdf/5ea23f5f-e7c4-400f-958b-4ff12c41ca0e
  // Assumindo a taxa para "Trabalhadores em geral"
  var tsuTrabalhador = rendimentoAnualBruto * 0.11;

  // Deduçōes Específicas
  // Página 8: https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/Folhetos_informativos/Documents/IRS_folheto_2019.pdf
  var deducaoEspecifica = Math.max(minDeducaoEspecifica, tsuTrabalhador)

  // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs22.aspx
  var rendimentoColectavel = rendimentoAnualBruto - deducaoEspecifica

  return [Math.max(0, rendimentoColectavel), deducaoEspecifica];
}


function calcularColetaTotal(rendimentoColectavel) {

  // calcular o IRS progressivamente
  var escaloes = [escalao0, escalao1, escalao2, escalao3, escalao4,
                  escalao5, escalao6, escalao7];

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
  rendimentoNoEscalaoAtual = Math.max(0, rendimentoColectavel-escalao8.valor);
  coletaTotal += rendimentoNoEscalaoAtual * escalao8.percentagem;

  if (rendimentoNoEscalaoAtual > 0) {
    escalao = escalao8;
  }

  return [coletaTotal, escalao];
}


function calcularColetaLiquida(rendimentoAnualBruto, rendimentoAnualBrutoSujeito, coletaTotal, quoeficienteFamiliar) {

  // Se receber menos do que o Mínimo de Existência ou do que o Salário Mínimo,
  // a diferença é deduzida na coleta total
  // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs70.aspx
  if (rendimentoAnualBruto - coletaTotal < thresholdIRS*quoeficienteFamiliar) {
    return Math.max(0, rendimentoAnualBrutoSujeito - thresholdIRS);
  } else {
    return Math.max(0, coletaTotal/quoeficienteFamiliar);
  }
}


function calcularDeducoesColeta(rendimentoColectavel, quoeficienteFamiliar,
  despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
  despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses)
{

  // TODO
  // Artigo 78.º-A
  // Artigo 78.º-B - 9 - No caso de famílias monoparentais, a dedução prevista no n.º 1 é de 45 % do valor suportado por qualquer membro do agregado familiar, com o limite global de (euro) 335.
  // PPRs

  // Ponto 1 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78b.aspx
  // por cada sujeito passivo
  var deducoesDespesasGerais = Math.min(0.35*despesasGerais, 250*quoeficienteFamiliar);

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
  var deducoesIva = Math.min(0.23/1.23*despesasIva*0.15 + 0.23/1.23*despesasPasses, 250);

  // Ponto 1 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs83a.aspx
  var deducoesPensoesAlimentos = 0.20*despesasPensoesAlimentos;

  // Ponto 1 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs84.aspx
  var deducoesLares = Math.min(0.25*despesasLares, 403.75);

  var restantesDeducoes = deducoesSaude + deducoesEducacao + deducoesHabitacao + deducoesPensoesAlimentos + deducoesIva + deducoesLares;

  console.log('deducoesDespesasGerais', deducoesDespesasGerais);
  console.log('deducoesSaude', deducoesSaude);
  console.log('deducoesEducacao', deducoesEducacao);
  console.log('deducoesHabitacao', deducoesHabitacao);
  console.log('deducoesPensoesAlimentos', deducoesPensoesAlimentos);
  console.log('deducoesIva', deducoesIva);
  console.log('deducoesLares', deducoesLares);

  return [deducoesDespesasGerais, restantesDeducoes/quoeficienteFamiliar];
}


function limitarDeducoesColeta(deducoesDespesasGerais, restantesDeducoes, escalao, rendimentoColectavel) {

  if (escalao==0) {
    // a) Para contribuintes que tenham um rendimento coletável igual ou inferior ao valor do 1.º escalão do n.º 1 artigo 68.º, sem limite;
    var threshold = Number.POSITIVE_INFINITY;
  } else if (escalao<=6) {
    // b) Para contribuintes que tenham um rendimento coletável superior ao valor do 1.º escalão e igual ou inferior ao valor do último escalão do n.º 1 do artigo 68.º, o limite resultante da aplicação da seguinte fórmula:
    var normalization = (escalao6.valor-rendimentoColectavel) / (escalao6.valor-escalao0.valor)
    var threshold = 1000 + (2500-1000) * normalization
  } else {
    // c) Para contribuintes que tenham um rendimento coletável superior ao valor do último escalão do n.º 1 do artigo 68.º, o montante de € 1 000.
    var threshold =  1000;
  }

  // TODO
  // 8 - Nos agregados com três ou mais dependentes a seu cargo, os limites previstos no número anterior são majorados em 5 % por cada dependente ou afilhado civil que não seja sujeito passivo do IRS.

  return Math.min(restantesDeducoes, threshold) + deducoesDespesasGerais;
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

  if ((estadoCivil==='Casado/Unido de facto') && (tributacao==='Separado')) {

    var [coletaTotalA, escalaoA] = calcularColetaTotal(rendimentoColectavelA);
    var [coletaTotalB, escalaoB] = calcularColetaTotal(rendimentoColectavelB);
    var coletaTotal = coletaTotalA + coletaTotalB;
    var taxa = `${numeral(escalaoA.percentagem*100).format('0,0.0')}% | ${numeral(escalaoB.percentagem*100).format('0,0.0')}%`;

    var coletaLiquidaA = calcularColetaLiquida(rendimentoAnualBrutoA, rendimentoAnualBrutoA, coletaTotalA, 1);
    var coletaLiquidaB = calcularColetaLiquida(rendimentoAnualBrutoB, rendimentoAnualBrutoB, coletaTotalB, 1);
    var coletaLiquida = coletaLiquidaA + coletaLiquidaB;

    // Garantir que a coleta liquida não é superior à total
    coletaLiquida = Math.min(coletaLiquida, coletaTotal);

    // Ponto 7 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78.aspx
    var [deducoesDespesasGeraisA, restantesDeducoesA] = calcularDeducoesColeta(rendimentoColectavelA, 1,
      despesasGerais/2, despesasSaude/2, despesasEducacao/2, despesasHabitacao/2, despesasLares/2, despesasPensoesAlimentos/2,
      despesasAutomoveis/2, despesasMotociclos/2, despesasRestauracao/2, despesasCabeleireiros/2, despesasVeterinario/2, despesasPasses/2
    );
    var [deducoesDespesasGeraisB, restantesDeducoesB] = calcularDeducoesColeta(rendimentoColectavelB, 1,
      despesasGerais/2, despesasSaude/2, despesasEducacao/2, despesasHabitacao/2, despesasLares/2, despesasPensoesAlimentos/2,
      despesasAutomoveis/2, despesasMotociclos/2, despesasRestauracao/2, despesasCabeleireiros/2, despesasVeterinario/2, despesasPasses/2
    );

    var deducoesColetaA = limitarDeducoesColeta(deducoesDespesasGeraisA, restantesDeducoesA, escalaoA.escalao, rendimentoColectavelA);
    var deducoesColetaB = limitarDeducoesColeta(deducoesDespesasGeraisB, restantesDeducoesB, escalaoB.escalao, rendimentoColectavelB);

    // Deduçōes à Coleta
    // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78.aspx
    coletaLiquida = coletaLiquida - deducoesColetaA - deducoesColetaB;

    // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs70.aspx
    if(rendimentoAnualBrutoA < minimoExistencia) {
      coletaLiquida = 0 + (rendimentoAnualBrutoB < minimoExistencia ? 0 : coletaLiquidaB);
    }

    console.log('rendimentoColectavelA', rendimentoColectavelA);
    console.log('rendimentoColectavelB', rendimentoColectavelB);
    console.log('coletaTotalA', coletaTotalA);
    console.log('coletaTotalB', coletaTotalB);
    console.log('deducoesColetaA', deducoesColetaA);
    console.log('deducoesColetaB', deducoesColetaB);
    console.log('coletaLiquida', coletaLiquida);
  } else {
    // situações
    // estadoCivil==='Solteiro, divorciado, viúvo ou separado judicialmente'
    // (estadoCivil==='Casado/Unido de facto') && (tributacao==='Conjunto')

    var rendimentoAnualBrutoTotal = rendimentoAnualBrutoA + rendimentoAnualBrutoB;

    // Quoeficiente Familiar
    // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs69.aspx
    var quoeficienteFamiliar = (tributacao==='Conjunto') && (rendimentoB > 0) ? 2 : 1;

    // Ponto 1 do // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs69.aspx
    var rendimentoColectavelFinal = (rendimentoColectavelA + rendimentoColectavelB) / quoeficienteFamiliar;

    var [coletaTotal, escalao] = calcularColetaTotal(rendimentoColectavelFinal);
    var taxa = `${numeral(escalao.percentagem*100).format('0,0.0')}%`;

    // Ponto 3 do // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs69.aspx
    coletaTotal = coletaTotal * quoeficienteFamiliar;

    var coletaLiquida = calcularColetaLiquida(rendimentoAnualBrutoTotal, rendimentoAnualBrutoA, coletaTotal, quoeficienteFamiliar) +
                        (rendimentoB>0 ? calcularColetaLiquida(rendimentoAnualBrutoTotal, rendimentoAnualBrutoB, coletaTotal, quoeficienteFamiliar): 0);
    // Garantir que a coleta liquida não é superior à total
    coletaLiquida = Math.min(coletaLiquida, coletaTotal);

    // Ponto 7 do https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78.aspx
    var [deducoesDespesasGerais, restantesDeducoes] = calcularDeducoesColeta(rendimentoColectavelFinal, quoeficienteFamiliar,
      despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
      despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses
    );

    var deducoesColeta = limitarDeducoesColeta(deducoesDespesasGerais, restantesDeducoes, escalao.escalao, rendimentoColectavelFinal);

    // Deduçōes à Coleta
    coletaLiquida = coletaLiquida - deducoesColeta;

    // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs70.aspx
    if(rendimentoAnualBrutoTotal < minimoExistencia) {
      coletaLiquida = 0;
    }

    console.log('rendimentoAnualBrutoTotal', rendimentoAnualBrutoTotal);
    console.log('rendimentoColectavelA', rendimentoColectavelA);
    console.log('rendimentoColectavelB', rendimentoColectavelB);
    console.log('rendimentoColectavelFinal', rendimentoColectavelFinal);
    console.log('quoeficienteFamiliar', quoeficienteFamiliar);
    console.log('coletaTotal', coletaTotal);
    console.log('deducoesColeta', deducoesColeta);
    console.log('coletaLiquida', coletaLiquida);
  }

  // https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs95.aspx
  // Não há lugar a cobrança ou reembolso quando, em virtude de liquidação, ainda que adicional, reforma ou revogação de liquidação, a importância a cobrar seja inferior a (euro) 25 ou a importância a restituir seja inferior a (euro) 10.
  var irs = Math.max(0, coletaLiquida);

  console.log('IRS', irs);

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

  // TODO
  // Por cada filho, o patamar de isenção individual subiria 200€ para cada progenitor.
  // No caso de famílias monoparentais esse valor seria duplicado.
  // Por exemplo, uma mãe solteira com dois filhos ficaria isenta até aos 1450€.

  var irs = Math.max(
    0,
    (rendimentoAnualBrutoA + rendimentoAnualBrutoB - valorIsencao) * 0.15
  );

  console.log('IRS_IL', irs);

  return irs
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

  return [rendTrabalhador, rendEstado]

}


function atualizarTabelaIRS(irsActual, irsIL, rendimentoA, rendimentoB, estadoCivil,
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
  var pRendimento = rendimentoB > 0 ? `${numeral(rendimentoA).format(formato)}€ + ${numeral(rendimentoB).format(formato)}€` : `${numeral(rendimentoA).format(formato)}€`;
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

    var [deducoesEspecificas, rendimentoColectavel, taxa, coletaTotal, deducoesColeta, irsActual] = calcularIRS(
      rendimentoA, rendimentoB, estadoCivil, tributacao, ascendentes, dependentes3Menos, dependentes3Mais,
      despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
      despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses
    )

    var irsIL = calcularIRS_IL(
      rendimentoA, rendimentoB, dependentes3Menos + dependentes3Mais, estadoCivil
    )

    var [valorTrabalhador, valorEstado] = calcularRendLiquido(rendimentoA, rendimentoB, irsActual)

    atualizarTabelaIRS(
      irsActual, irsIL, rendimentoA, rendimentoB, estadoCivil, tributacao, ascendentes, dependentes3Menos + dependentes3Mais,
      deducoesEspecificas, rendimentoColectavel, taxa, coletaTotal, deducoesColeta, valorTrabalhador, valorEstado
    )

}


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
          main();
          // Avoid form from resetting the selected values
          event.preventDefault()
        }
        form.classList.add('was-validated')
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

    // eneable tooltips
    $('input').tooltip();
    $('[data-toggle="tooltip"]').tooltip();
  }, false)
}())
