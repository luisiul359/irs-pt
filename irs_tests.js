// Very dummy test suite in native javascript
//
// just copy paste to the browser console

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

function withinMarginError(value, expected, epsilon=1) {
    return Math.abs(value-expected) < epsilon;
}

const casado = 'Casado/Unido de facto';
const solteiro = 'Solteiro, divorciado, viúvo ou separado judicialmente';
const tributacaoConjunto = 'Conjunto';
const tributacaoSeparado = 'Separado';

// confirmar alteracao do minimo de existencia com +3 dependentes

if (ano===2019) {
  // solteiro
  var tests = [
    // [rendimento, valor obtido pelo simulador da pwc - similar ao simulador do Portal das Finanças]
    [  500,      0.00],
    [  550,      0.00],
    [  635,      0.00],
    [  650,      0.00],
    [  675,    299.04],
    [  700,    649.04],
    [ 1200,   2427.13],
    [ 1500,   3624.13],
    [ 2000,   5855.49],
    [ 2200,   6869.27],
    [ 2800,   9900.31],
    [ 3000,  10864.33],
    [ 3500,  13667.83],
    [ 4000,  16471.33],
    [ 5750,  26283.58],
    [ 6430,  30099.29],
    [ 6500,  30523.87],
    [ 8000,  39962.32],
    [12285,  66924.83],
    [25000, 148468.92]
  ];
  tests.forEach(test => {
    // há pequenas diferenças de arredondamentos, daí estarmos a garantir um erro máximo de 1€
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        test[1]
      ),
      `Solteiro + Separado + ${test[0]}`
    );

    // diferente tributacao. Quando apenas temos 1 sujeito passivo a tributacao devia ser irrelevante
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoConjunto,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        test[1]
      ),
      `Solteiro + Conjunto + ${test[0]}`
    );

    // Com rendimento do sujeito passivo B. Devia ser ignorado quando o estado civil é "Solteiro"
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=1000,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        test[1]
      ),
      `Não está a ignorar o sujeito passivo B quando Separado + ${test[0]}`
    );
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=1000,
          estadoCivil=solteiro,
          tributacao=tributacaoConjunto,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        test[1]
      ),
      `Não está a ignorar o sujeito passivo B quando Conjunto + ${test[0]}`
    );
  });

  // casado + tributacao conjunta
  var tests = [
    // [rendimento A, redimento B, valor obtido pelo simulador do Portal das Finanças - o simulador da PWC aparenta estar errado quando é necessário considerar o Mínimo de Existência]
    [   500,   100,      0.00],
    [   500,   500,      0.00],
    [   750,   500,   1347.34],
    [  1000,   500,   1854.84],
    [   635,   635,      0.00],
    [   650,   635,      0.00],
    [   675,   635,    299.04],
    [   700,   635,    649.04],
    [   900,   635,   1925.89],
    [  1000,   635,   2171.39],
    [  1000,  1000,   3346,68],
    [  1500,  1000,   5253.26],
    [  2500,  1500,  11710.98],
    [  2500,  2000,  14256.54],  // 37%
    [  3500,  2500,  21614.36],  // 45%
    [  7000,  5000,  55370.66],  // 45%
    [  7025,  5000,  55510.84],  // 45%
    [  7500,  5000,  58174.16],  // 45%
    [  7500,  5400,  60435.31],  // 47.5%
    [  9000,  9000,  92509.24],  // 50.5%
    [ 15000, 15000, 168016.84],  // 50.5%
    [ 25000, 25000, 296937.84]   // 53%
  ];
  tests.forEach(test => {
    // há pequenas diferenças de arredondamentos, daí estarmos a garantir um erro máximo de 1€
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=test[1],
          estadoCivil=casado,
          tributacao=tributacaoConjunto,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        test[2]
      ),
      `Casado + Conjunto + ${test[0]} + ${test[1]}`
    );
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[1],
          rendimentoB=test[0],
          estadoCivil=casado,
          tributacao=tributacaoConjunto,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        test[2]
      ),
      `Casado + Conjunto + ${test[1]} + ${test[0]}`
    );
  });

  // casado + tributacao separada
  var tests = [
    // [rendimento A, redimento B, valor obtido pelo simulador do Portal das Finanças]
    [   500,   100,      0.00],
    [   500,   500,      0.00],
    [   750,   500,   1347.34],
    [  1000,   500,   1854.84],
    [   635,   635,      0.00],
    [   650,   635,      0.00],
    [   675,   635,    299.04],
    [   700,   635,    649.04],
    [   900,   635,   1925.89],
    [  1000,   635,   2171.39],
    [  1000,  1000,   3346,68],
    [  1500,  1000,   5253.26],
    [  2500,  1500,  11710.98],
    [  2500,  2000,  14256.54],
    [  3500,  2500,  21614.36],
    [  7000,  5000,  55370.66],
    [  7025,  5000,  55510.84],
    [  7500,  5000,  58174.16],
    [  7500,  5400,  60435.31],
    [  9000,  9000,  92509.24],
    [ 15000, 15000, 168016.84],
    [ 25000, 25000, 296937.84]
  ];
  tests.forEach(test => {
    // há pequenas diferenças de arredondamentos, daí estarmos a garantir um erro máximo de 1€

    // sem dependentes e sem ascendentes o IRS final deve ser igual à soma dos IRSs individuais
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=test[1],
          estadoCivil=casado,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5] +
        calcularIRS(
          rendimentoA=test[1],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5]
      ),
      `Casado + Separado + ${test[0]} + ${test[1]}`
    );
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[1],
          rendimentoB=test[0],
          estadoCivil=casado,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5] +
        calcularIRS(
          rendimentoA=test[1],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5]
      ),
      `Casado + Separado + ${test[1]} + ${test[0]}`
    );
  });

  // deduçōes à coleta
  // valores obtido pelo simulador do Portal das Finanças
  //   de notar que despesas gerais e de IVA não dá para fazer override,
  //   visto serem obtidas automaticamento do e-fatura

  // dependentes com menos de 3 anos
  assert(
    withinMarginError(
      calcularDeducoesColeta(0, 1, 0, 1, 0, false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
      726
    ),
    `Deduçōes 1 dependente <= 3 anos + conjunto`
  );
  assert(
    withinMarginError(
      calcularDeducoesColeta(0, 1, 0, 1, 0, true, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
      726/2
    ),
    `Deduçōes 1 dependente <= 3 anos + separado`
  );
  assert(
    withinMarginError(
      calcularDeducoesColeta(0, 1, 0, 2, 0, false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
      726*2
    ),
    `Deduçōes 2 dependentes <= 3 anos + conjunto`
  );
  assert(
    withinMarginError(
      calcularDeducoesColeta(0, 1, 0, 2, 0, true, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
      726*2/2
    ),
    `Deduçōes 2 dependentes <= 3 anos + separado`
  );

  // solteiro com deduçōes à coleta

  // todas as deduçōes à coleta menos habitação
  assert(
    withinMarginError(
      calcularIRS(
        rendimentoA=1000,
        rendimentoB=0,
        estadoCivil=solteiro,
        tributacao=tributacaoSeparado,
        ascendentes=0,
        dependentes3Menos=0,
        dependentes3Mais=0,
        0,100,100,0,100,100,0,0,0,0,0,0
      )[5],
      1583.35
    ),
    `Solteiro + deduçōes à coleta + todas - habitação`
  );
  // deduçōes à coleta - habitação
  var res = calcularIRS(
    rendimentoA=500,
    rendimentoB=0,
    estadoCivil=solteiro,
    tributacao=tributacaoSeparado,
    ascendentes=0,
    dependentes3Menos=0,
    dependentes3Mais=0,
    0,0,0,100,0,0,0,0,0,0,0,0
  );
  assert(
    withinMarginError(res[5],0),
    `Solteiro + deduçōes à coleta + habitação 1 + IRS`
  );
  assert(
    withinMarginError(res[4],15),
    `Solteiro + deduçōes à coleta + habitação 1 + valor coleta`
  );
  var res = calcularIRS(
    rendimentoA=500,
    rendimentoB=0,
    estadoCivil=solteiro,
    tributacao=tributacaoSeparado,
    ascendentes=0,
    dependentes3Menos=0,
    dependentes3Mais=0,
    0,0,0,100000,0,0,0,0,0,0,0,0
  );
  assert(
    withinMarginError(res[5],0),
    `Solteiro + deduçōes à coleta + habitação 2 + IRS`
  );
  assert(
    withinMarginError(res[4],800),
    `Solteiro + deduçōes à coleta + habitação 2 + valor coleta max`
  );
  var res = calcularIRS(
    rendimentoA=14562/14,
    rendimentoB=0,
    estadoCivil=solteiro,
    tributacao=tributacaoSeparado,
    ascendentes=0,
    dependentes3Menos=0,
    dependentes3Mais=0,
    0,0,0,100000,0,0,0,0,0,0,0,0
  );
  assert(
    withinMarginError(res[5],1046.4),
    `Solteiro + deduçōes à coleta + habitação 3 + IRS`
  );
  assert(
    withinMarginError(res[4],756.2),
    `Solteiro + deduçōes à coleta + habitação 3 + valor coleta max`
  );
  var res = calcularIRS(
    rendimentoA=10000,
    rendimentoB=0,
    estadoCivil=solteiro,
    tributacao=tributacaoSeparado,
    ascendentes=0,
    dependentes3Menos=0,
    dependentes3Mais=0,
    0,100000,0,100000,0,0,0,0,0,0,0,0
  );
  assert(
    withinMarginError(res[5],51546.92),
    `Solteiro + deduçōes à coleta + habitação 4 + IRS`
  );
  assert(
    withinMarginError(res[4],1000),
    `Solteiro + deduçōes à coleta + habitação 4 + valor coleta max`
  );
  var res = calcularIRS(
    rendimentoA=2000,
    rendimentoB=0,
    estadoCivil=solteiro,
    tributacao=tributacaoSeparado,
    ascendentes=0,
    dependentes3Menos=0,
    dependentes3Mais=0,
    0,100000,100000,100000,0,0,0,0,0,0,0,0
  );
  assert(
    withinMarginError(res[5],3698.22),
    `Solteiro + deduçōes à coleta + habitação 5 + IRS`
  );
  assert(
    withinMarginError(res[4],2157.27),
    `Solteiro + deduçōes à coleta + habitação 5 + valor coleta max`
  );

  // casado + tributacao conjunta com deduçōes à coleta

  // todas as deduçōes à coleta menos habitação
  assert(
    withinMarginError(
      calcularIRS(
        rendimentoA=1000,
        rendimentoB=1000,
        estadoCivil=casado,
        tributacao=tributacaoConjunto,
        ascendentes=0,
        dependentes3Menos=0,
        dependentes3Mais=0,
        0,100,100,0,100,100,0,0,0,0,0,0
      )[5],
      3256.68
    ),
    `Casado + Conjunto + deduçōes à coleta + todas - habitação`
  );
  // deduçōes à coleta - habitação
  var res = calcularIRS(
    rendimentoA=1000,
    rendimentoB=1000,
    estadoCivil=casado,
    tributacao=tributacaoConjunto,
    ascendentes=0,
    dependentes3Menos=0,
    dependentes3Mais=0,
    0,0,0,100,0,0,0,0,0,0,0,0
  );
  assert(
    withinMarginError(res[5],3331.68),
    `Casado + Conjunto + deduçōes à coleta + habitação 1 + IRS`
  );
  assert(
    withinMarginError(res[4],15),
    `Casado + Conjunto + deduçōes à coleta + habitação 1 + valor coleta`
  );
  var res = calcularIRS(
    rendimentoA=500,
    rendimentoB=500,
    estadoCivil=casado,
    tributacao=tributacaoConjunto,
    ascendentes=0,
    dependentes3Menos=0,
    dependentes3Mais=0,
    0,0,0,100000,0,0,0,0,0,0,0,0
  );
  assert(
    withinMarginError(res[5],0),
    `Casado + Conjunto + deduçōes à coleta + habitação 2 + IRS`
  );
  assert(
    withinMarginError(res[4],800),
    `Casado + Conjunto + deduçōes à coleta + habitação 2 + valor coleta max`
  );
  var res = calcularIRS(
    rendimentoA=1000,
    rendimentoB=1000,
    estadoCivil=casado,
    tributacao=tributacaoConjunto,
    ascendentes=0,
    dependentes3Menos=0,
    dependentes3Mais=0,
    0,0,0,100000,0,0,0,0,0,0,0,0
  );
  assert(
    withinMarginError(res[5],2583.17),
    `Casado + Conjunto + deduçōes à coleta + habitação 3 + IRS`
  );
  assert(
    withinMarginError(res[4],763.51),
    `Casado + Conjunto + deduçōes à coleta + habitação 3 + valor coleta max`
  );
  var res = calcularIRS(
    rendimentoA=10000,
    rendimentoB=10000,
    estadoCivil=casado,
    tributacao=tributacaoConjunto,
    ascendentes=0,
    dependentes3Menos=0,
    dependentes3Mais=0,
    0,100000,0,100000,0,0,0,0,0,0,0,0
  );
  assert(
    withinMarginError(res[5],104093.84),
    `Casado + Conjunto + deduçōes à coleta + habitação 4 + IRS`
  );
  assert(
    withinMarginError(res[4],1000),
    `Casado + Conjunto + deduçōes à coleta + habitação 4 + valor coleta max`
  );
  var res = calcularIRS(
    rendimentoA=1000,
    rendimentoB=1000,
    estadoCivil=casado,
    tributacao=tributacaoConjunto,
    ascendentes=0,
    dependentes3Menos=0,
    dependentes3Mais=0,
    0,100000,100000,100000,0,0,0,0,0,0,0,0
  );
  assert(
    withinMarginError(res[5],903.89),
    `Casado + Conjunto + deduçōes à coleta + habitação 5 + IRS`
  );
  assert(
    withinMarginError(res[4],2442.79), // no portal das finanças deu 2373.9, mas não percebi como. No simulador da PwC dá igual a nós
    `Casado + Conjunto + deduçōes à coleta + habitação 5 + valor coleta max`
  );
  var res = calcularIRS(
    rendimentoA=10000,
    rendimentoB=10000,
    estadoCivil=casado,
    tributacao=tributacaoConjunto,
    ascendentes=0,
    dependentes3Menos=0,
    dependentes3Mais=3,
    0,100000,0,100000,0,0,0,0,0,0,0,0
  );
  assert(
    withinMarginError(res[5],102143.85),
    `Casado + Conjunto + deduçōes à coleta + habitação 6 + IRS`
  );
  assert(
    withinMarginError(res[4],1000*1.15+3*600),
    `Casado + Conjunto + deduçōes à coleta + habitação 6 + valor coleta max`
  );

  // casado + tributacao separada com deduçōes à coleta
  // sem dependentes e sem ascendentes o IRS final deve ser igual à soma dos IRSs individuais
  // notar que nas parcelas dos IRSs individuais estamos a colocar 50% de cada despesa

  // todas as deduçōes à coleta menos habitação
  assert(
    withinMarginError(
      calcularIRS(
        rendimentoA=1500,
        rendimentoB=1000,
        estadoCivil=casado,
        tributacao=tributacaoSeparado,
        ascendentes=0,
        dependentes3Menos=0,
        dependentes3Mais=0,
        0,100,100,0,100,100,0,0,0,0,0,0
      )[5],
      calcularIRS(
        rendimentoA=1500,
        rendimentoB=0,
        estadoCivil=solteiro,
        tributacao=tributacaoSeparado,
        ascendentes=0,
        dependentes3Menos=0,
        dependentes3Mais=0,
        0,100/2,100/2,0,100/2,100/2,0,0,0,0,0,0
      )[5] +
      calcularIRS(
        rendimentoA=1000,
        rendimentoB=0,
        estadoCivil=solteiro,
        tributacao=tributacaoSeparado,
        ascendentes=0,
        dependentes3Menos=0,
        dependentes3Mais=0,
        0,100/2,100/2,0,100/2,100/2,0,0,0,0,0,0
      )[5]
    ),
    `Casado + Separado + deduçōes à coleta + todas - habitação 1`
  );
  assert(
    withinMarginError(
      calcularIRS(
        rendimentoA=1000,
        rendimentoB=1500,
        estadoCivil=casado,
        tributacao=tributacaoSeparado,
        ascendentes=0,
        dependentes3Menos=0,
        dependentes3Mais=0,
        0,100,100,0,100,100,0,0,0,0,0,0
      )[5],
      calcularIRS(
        rendimentoA=1500,
        rendimentoB=0,
        estadoCivil=solteiro,
        tributacao=tributacaoSeparado,
        ascendentes=0,
        dependentes3Menos=0,
        dependentes3Mais=0,
        0,100/2,100/2,0,100/2,100/2,0,0,0,0,0,0
      )[5] +
      calcularIRS(
        rendimentoA=1000,
        rendimentoB=0,
        estadoCivil=solteiro,
        tributacao=tributacaoSeparado,
        ascendentes=0,
        dependentes3Menos=0,
        dependentes3Mais=0,
        0,100/2,100/2,0,100/2,100/2,0,0,0,0,0,0
      )[5]
    ),
    `Casado + Separado + deduçōes à coleta + todas - habitação 2`
  );
  // deduçōes à coleta - testar máximo por agregado
  assert(
    withinMarginError(
      calcularIRS(
        rendimentoA=10000,
        rendimentoB=10000,
        estadoCivil=casado,
        tributacao=tributacaoSeparado,
        ascendentes=0,
        dependentes3Menos=0,
        dependentes3Mais=0,
        0,100000,0,100000,0,0,0,0,0,0,0,0
      )[4],
      1000
    ),
    `Casado + Separado + deduçōes à coleta + todas - habitação max`
  );

  // limites deduçōes à coleta
  var [deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes] = calcularDeducoesColeta(escalao0.valor, 1, 0, 0, 0, false, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  assert(
    withinMarginError(
      limitarDeducoesColeta(deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes, escalao0.escalao, 0, 0, false),
      deducoesDespesasGerais+restantesDeducoes
    ),
    `Limites deduçōes à coleta 1 normal`
  );
  var [deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes] = calcularDeducoesColeta(escalao0.valor, 1, 0, 0, 0, false, 10000000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  assert(
    withinMarginError(
      limitarDeducoesColeta(deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes, escalao0.escalao, 0, 0, false),
      deducoesDespesasGerais+restantesDeducoes
    ),
    `Limites deduçōes à coleta 1 sem limite`
  );
  var [deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes] = calcularDeducoesColeta(0, 1, 0, 0, 0, false, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  assert(
    withinMarginError(
      limitarDeducoesColeta(deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes, escalao4.escalao, 30000, 0, false),
      deducoesDespesasGerais+restantesDeducoes
    ),
    `Limites deduçōes à coleta 2 normal`
  );
  var [deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes] = calcularDeducoesColeta(0, 1, 0, 0, 0, false, 10000, 10000, 10000, 10000, 10000, 0, 0, 0, 0, 0, 0, 0);
  assert(
    withinMarginError(
      limitarDeducoesColeta(deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes, escalao4.escalao, 30000, 0, false),
      deducoesDespesasGerais+2032.78
    ),
    `Limites deduçōes à coleta 2 acima`
  );

  // deduçōes à coleta com dependentes

  // solteiro
  //var filhos = [3,4,5,6,7];
  //filhos.forEach(dependentes => {
  //  assert(
  //    withinMarginError(
  //      calcularIRS(
  //        rendimentoA=750,
  //        rendimentoB=0,
  //        estadoCivil=solteiro,
  //        tributacao=tributacaoSeparado,
  //        ascendentes=0,
  //        dependentes3Menos=dependentes,
  //        dependentes3Mais=0,
  //        0,0,0,0,0,0,0,0,0,0,0,0
  //      )[5],
  //      0
  //    ),
  //    `Solteiro + dependentes ${dependentes}+ abaixo do mínimo de existência`
  //  );
  //});
  // casado + tributacao conjunta
  //var filhos = [3,4,5,6,7];
  //filhos.forEach(dependentes => {
  //  assert(
  //    withinMarginError(
  //      calcularIRS(
  //        rendimentoA=750,
  //        rendimentoB=1300,
  //        estadoCivil=casado,
  //        tributacao=tributacaoConjunto,
  //        ascendentes=0,
  //        dependentes3Menos=dependentes,
  //        dependentes3Mais=0,
  //        0,0,0,0,0,0,0,0,0,0,0,0
  //      )[5],
  //      0
  //    ),
  //    `Casado + Conjunto + dependentes ${dependentes}+ abaixo do mínimo de existência`
  //  );
  //});
  // casado + tributacao separada


}

if (ano===2020) {
  // solteiro
  var tests = [
    // [rendimento, valor obtido pelo simulador da pwc - aparenta estar errado quando é necessário considerar o Mínimo de Existência]
    [  500,      0.00],
    [  550,      0.00],
    [  635,      0.00],
    [  650,      0.00],
    [  675,    234.99],
    [  700,    584.99],
    [ 1200,   2423.56],
    [ 1500,   3620.56],
    [ 2000,   5847.97],
    [ 2200,   6860.25],
    [ 2800,   9891.29],
    [ 3000,  10846.46],
    [ 3500,  13649.96],
    [ 4000,  16453.46],
    [ 5750,  26265.71],
    [ 6430,  30081.42],
    [ 6500,  30498.74],
    [ 8000,  39937.19],
    [12285,  66899.70],
    [25000, 148443.79]
  ];
  tests.forEach(test => {
    // há pequenas diferenças de arredondamentos, daí estarmos a garantir um erro máximo de 1€
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        test[1]
      ),
      `Solteiro + Separado + ${test[0]}`
    );

    // diferente tributacao. Quando apenas temos 1 sujeito passivo a tributacao devia ser irrelevante
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoConjunto,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        test[1]
      ),
      `Solteiro + Conjunto + ${test[0]}`
    );

    // Com rendimento do sujeito passivo B. Devia ser ignorado quando o estado civil é "Solteiro"
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=1000,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        test[1]
      ),
      `Não está a ignorar o sujeito passivo B quando Separado + ${test[0]}`
    );
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=1000,
          estadoCivil=solteiro,
          tributacao=tributacaoConjunto,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        test[1]
      ),
      `Não está a ignorar o sujeito passivo B quando Conjunto + ${test[0]}`
    );
  });

  // casado + tributacao conjunta
  var tests = [
    // [rendimento A, redimento B, valor obtido pelo simulador da pwc - o simulador da PWC aparenta estar errado quando é necessário considerar o Mínimo de Existência]
    [   500,   100,      0.00],
    [   500,   500,      0.00],
    [   750,   500,   1284.99],
    [  1000,   500,   1854.84],
    [   635,   635,      0.00],
    [   650,   635,      0.00],
    [   675,   635,    234.99],
    [   700,   635,    584.99],
    [   900,   635,   1925.90],
    [  1000,   635,   2167.77],
    [  1000,  1000,   3343.07],
    [  1500,  1000,   5246.11],
    [  2500,  1500,  11695.93],
    [  2500,  2000,  14238.49],  // 37%
    [  3500,  2500,  21578.63],  // 45%
    [  7000,  5000,  55334.93],  // 45%
    [  7025,  5000,  55475.11],  // 45%
    [  7500,  5000,  58138.43],  // 45%
    [  7500,  5400,  60399.58],  // 47.5%
    [  9000,  9000,  92458.99],  // 50.5%
    [ 15000, 15000, 167966.59],  // 50.5%
    [ 25000, 25000, 296887.59]   // 53%
  ];
  tests.forEach(test => {
    // há pequenas diferenças de arredondamentos, daí estarmos a garantir um erro máximo de 1€
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=test[1],
          estadoCivil=casado,
          tributacao=tributacaoConjunto,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        test[2]
      ),
      `Casado + Conjunto + ${test[0]} + ${test[1]}`
    );
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[1],
          rendimentoB=test[0],
          estadoCivil=casado,
          tributacao=tributacaoConjunto,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        test[2]
      ),
      `Casado + Conjunto + ${test[1]} + ${test[0]}`
    );
  });

  // casado + tributacao separada
  var tests = [
    // [rendimento A, redimento B, valor obtido pelo simulador da pwc - o simulador da PWC aparenta estar errado quando é necessário considerar o Mínimo de Existência]
    [   500,   100,      0.00],
    [   500,   500,      0.00],
    [   750,   500,   1284.99],
    [  1000,   500,   1854.84],
    [   635,   635,      0.00],
    [   650,   635,      0.00],
    [   675,   635,    234.99],
    [   700,   635,    584.99],
    [   900,   635,   1925.90],
    [  1000,   635,   2167.77],
    [  1000,  1000,   3343.07],
    [  1500,  1000,   5246.11],
    [  2500,  1500,  11695.93],
    [  2500,  2000,  14238.49],
    [  3500,  2500,  21578.63],
    [  7000,  5000,  55334.93],
    [  7025,  5000,  55475.11],
    [  7500,  5000,  58138.43],
    [  7500,  5400,  60399.58],
    [  9000,  9000,  92458.99],
    [ 15000, 15000, 167966.59],
    [ 25000, 25000, 296887.59]
  ];
  tests.forEach(test => {
    // há pequenas diferenças de arredondamentos, daí estarmos a garantir um erro máximo de 1€

    // sem dependentes e sem ascendentes o IRS final deve ser igual à soma dos IRSs individuais
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=test[1],
          estadoCivil=casado,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5] +
        calcularIRS(
          rendimentoA=test[1],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5]
      ),
      `Casado + Separado + ${test[0]} + ${test[1]}`
    );
    assert(
      withinMarginError(
        calcularIRS(
          rendimentoA=test[1],
          rendimentoB=test[0],
          estadoCivil=casado,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5],
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5] +
        calcularIRS(
          rendimentoA=test[1],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0,
          0,0,0,0,0,0,0,0,0,0,0,0
        )[5]
      ),
      `Casado + Separado + ${test[1]} + ${test[0]}`
    );
  });

  // deduçōes à coleta
  // valores obtido pelo simulador do Portal das Finanças
  //   de notar que despesas gerais e de IVA não dá para fazer override,
  //   visto serem obtidas automaticamento do e-fatura

  // limites deduçōes à coleta
  var [deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes] = calcularDeducoesColeta(escalao0.valor, 1, 0, 0, 0, false, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  assert(
    withinMarginError(
      limitarDeducoesColeta(deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes, escalao0.escalao, 0, 0, false),
      deducoesDespesasGerais+restantesDeducoes
    ),
    `Limites deduçōes à coleta 1 normal`
  );
  var [deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes] = calcularDeducoesColeta(escalao0.valor, 1, 0, 0, 0, false, 10000000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  assert(
    withinMarginError(
      limitarDeducoesColeta(deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes, escalao0.escalao, 0, 0, false),
      deducoesDespesasGerais+restantesDeducoes
    ),
    `Limites deduçōes à coleta 1 sem limite`
  );
  var [deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes] = calcularDeducoesColeta(0, 1, 0, 0, 0, false, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
  assert(
    withinMarginError(
      limitarDeducoesColeta(deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes, escalao4.escalao, 30000, 0, false),
      deducoesDespesasGerais+restantesDeducoes
    ),
    `Limites deduçōes à coleta 2 normal`
  );
  var [deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes] = calcularDeducoesColeta(0, 1, 0, 0, 0, false, 10000, 10000, 10000, 10000, 10000, 0, 0, 0, 0, 0, 0, 0);
  assert(
    withinMarginError(
      limitarDeducoesColeta(deducoesDespesasGerais, deducoesDependentesAscendentes, restantesDeducoes, escalao4.escalao, 30000, 0, false),
      deducoesDespesasGerais+2034.61
    ),
    `Limites deduçōes à coleta 2 acima`
  );

  // deduçōes à coleta com dependentes com menos de 3 anos
  assert(
    withinMarginError(
      calcularDeducoesColeta(0, 1, 0, 1, 0, false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
      726
    ),
    `Deduçōes 1 dependente <= 3 anos + conjunto`
  );
  assert(
    withinMarginError(
      calcularDeducoesColeta(0, 1, 0, 1, 0, true, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
      726/2
    ),
    `Deduçōes 1 dependente <= 3 anos + separado`
  );
  assert(
    withinMarginError(
      calcularDeducoesColeta(0, 1, 0, 2, 0, false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
      726+900
    ),
    `Deduçōes 2 dependentes <= 3 anos + conjunto`
  );
  assert(
    withinMarginError(
      calcularDeducoesColeta(0, 1, 0, 2, 0, true, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
      (726+900)/2
    ),
    `Deduçōes 2 dependentes <= 3 anos + separado`
  );
}


// deducoes dependentes e ascendentes
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 1, 1, 0, 0, false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
    635
  ),
  `Deduçōes 1 ascendente + conjunto`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 1, 1, 0, 0, true, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
    635/2
  ),
  `Deduçōes 1 ascendente + separado`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 1, 2, 0, 0, false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
    525*2
  ),
  `Deduçōes 2 ascendentes`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 1, 2, 0, 0, true, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
    525*2/2
  ),
  `Deduçōes 2 ascendentes`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 1, 0, 0, 1, false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
    600
  ),
  `Deduçōes 1 dependente > 3 anos + conjunto`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 1, 0, 0, 1, true, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
    600/2
  ),
  `Deduçōes 1 dependente > 3 anos + separado`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 1, 0, 0, 2, false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
    600*2
  ),
  `Deduçōes 2 dependentes > 3 anos + conjunto`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 1, 0, 0, 2, true, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[1],
    (600*2)/2
  ),
  `Deduçōes 2 dependentes > 3 anos + separado`
);

// despesas gerais familiares
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 1, 0, 0, 0, false, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[0],
    0.35*100
  ),
  `Despesas gerais familiares normal`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 1, 0, 0, 0, false, 15000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[0],
    250
  ),
  `Despesas gerais familiares acima`
);

// despesas saúde
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 1, 0, 0, 0, false, 0, 500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[2],
    0.15*500
  ),
  `Despesas saúde normal`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 1, 0, 0, 0, false, 0, 100000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[2],
    1000
  ),
  `Despesas saúde acima`
);

// despesas educação
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 1, 0, 0, 0, false, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0)[2],
    0.3*100
  ),
  `Despesas educação normal`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 1, 0, 0, 0, false, 0, 0, 10000, 0, 0, 0, 0, 0, 0, 0, 0, 0)[2],
    800
  ),
  `Despesas educação acima`
);

// despesas habitação
assert(
  withinMarginError(
    calcularDeducoesColeta(escalao0.valor, 1, 0, 0, 0, false, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0)[2],
    0.15*100
  ),
  `Despesas habitação 1 normal`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(escalao0.valor, 1, 0, 0, 0, false, 0, 0, 0, 100000, 0, 0, 0, 0, 0, 0, 0, 0)[2],
    800
  ),
  `Despesas habitação 1 acima`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(14562, 1, 0, 0, 0, false, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0)[2],
    0.15*100
  ),
  `Despesas habitação 2 normal`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(14562, 1, 0, 0, 0, false, 0, 0, 0, 100000, 0, 0, 0, 0, 0, 0, 0, 0)[2],
    703
  ),
  `Despesas habitação 2 acima`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(30001, 1, 0, 0, 0, false, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 0)[2],
    0.15*100
  ),
  `Despesas habitação 3 normal`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(30001, 1, 0, 0, 0, false, 0, 0, 0, 100000, 0, 0, 0, 0, 0, 0, 0, 0)[2],
    502
  ),
  `Despesas habitação 3 acima`
);

// despesas lares
assert(
  withinMarginError(
    calcularDeducoesColeta(escalao0.valor, 1, 0, 0, 0, false, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0)[2],
    0.25*100
  ),
  `Despesas lares normal`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(escalao0.valor, 1, 0, 0, 0, false, 0, 0, 0, 0, 100000, 0, 0, 0, 0, 0, 0, 0)[2],
    403.75
  ),
  `Despesas lares acima`
);

// despesas pensōes alimentos
assert(
  withinMarginError(
    calcularDeducoesColeta(escalao0.valor, 1, 0, 0, 0, false, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0)[2],
    0.2*100
  ),
  `Despesas pensōes alimentos normal`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(escalao0.valor, 1, 0, 0, 0, false, 0, 0, 0, 0, 0, 100000, 0, 0, 0, 0, 0, 0)[2],
    0.2*100000
  ),
  `Despesas pensōes alimentos acima`
);

// despesas IVA
assert(
  withinMarginError(
    calcularDeducoesColeta(escalao0.valor, 1, 0, 0, 0, false, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 10, 0)[2],
    0.15*(10*5)*0.23/1.23
  ),
  `Despesas IVA normal`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(escalao0.valor, 1, 0, 0, 0, false, 0, 0, 0, 0, 0, 0, 2000, 2000, 2000, 2000, 2000, 0)[2],
    250
  ),
  `Despesas IVA acima`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(escalao0.valor, 1, 0, 0, 0, false, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100)[2],
    0.23/1.23*100
  ),
  `Despesas IVA passes`
);

// quoeficiente familiar deduçōes à coleta
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 2, 0, 0, 0, false, 100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[0],
    0.35*100
  ),
  `Quoeficiente familiar deduçōes à coleta normal`
);
assert(
  withinMarginError(
    calcularDeducoesColeta(0, 2, 0, 0, 0, false, 2000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)[0],
    250*2
  ),
  `Quoeficiente familiar deduçōes à coleta acima`
);


// proposta IRS da IL


// solteiro
// sem dependentes
assert(
  withinMarginError(
    calcularIRS_IL(1000, 0, 0, solteiro),
    0.15*14*(1000-650)
  ),
  `Proposta IL solteiro sem dependentes 1`
);
// o rendimento do sujeito passivo B deve ser ignorado
assert(
  withinMarginError(
    calcularIRS_IL(1000, 100000, 0, solteiro),
    0.15*14*(1000-650)
  ),
  `Proposta IL solteiro sem dependentes 2`
);

// casado + tributacao conjunta
// casado + tributacao separada
// sem dependentes
assert(
  withinMarginError(
    calcularIRS_IL(1000, 750, 0, casado),
    0.15*14*(1000+750-650*2)
  ),
  `Proposta IL casado sem dependentes`
);

// solteiro - monoparental
// com dependentes
var filhos = [1,2,3];
filhos.forEach(dependentes => {
  assert(
    withinMarginError(
      calcularIRS_IL(2000, 0, dependentes, solteiro),
      0.15*14*(2000-(650+400*dependentes))
    ),
    `Proposta IL solteiro com ${dependentes} dependentes`
  );
});
// minimo de IRS é 0
assert(
  withinMarginError(
    calcularIRS_IL(1000, 0, 10, solteiro),
    0
  ),
  `Proposta IL solteiro com 10 dependentes`
);

// casado + tributacao conjunta
// casado + tributacao separada
// com dependentes
var filhos = [1,2,3];
filhos.forEach(dependentes => {
  assert(
    withinMarginError(
      calcularIRS_IL(2500, 1500, dependentes, casado),
      0.15*14*(2500-(650+200*dependentes)+1500-(650+200*dependentes))
    ),
    `Proposta IL casado com ${dependentes} dependentes`
  );
});







//
