// Very dummy test suite in native javascript
//
// just copy paste to the browser console

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

function withinMarginError(value, expected, epsilon=1) {
    return Math.abs(value-expected) < epsilon
}

const casado = 'Casado/Unido de facto';
const solteiro = 'Solteiro, divorciado, viúvo ou separado judicialmente';
const tributacaoConjunto = 'Conjunto';
const tributacaoSeparado = 'Separado';

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
          dependentes3Mais=0
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
          dependentes3Mais=0
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
          dependentes3Mais=0
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
          dependentes3Mais=0
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
          dependentes3Mais=0
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
          dependentes3Mais=0
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
          dependentes3Mais=0
        )[5],
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0
        )[5] +
        calcularIRS(
          rendimentoA=test[1],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0
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
          dependentes3Mais=0
        )[5],
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0
        )[5] +
        calcularIRS(
          rendimentoA=test[1],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0
        )[5]
      ),
      `Casado + Separado + ${test[1]} + ${test[0]}`
    );
  });
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
          dependentes3Mais=0
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
          dependentes3Mais=0
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
          dependentes3Mais=0
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
          dependentes3Mais=0
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
          dependentes3Mais=0
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
          dependentes3Mais=0
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
          dependentes3Mais=0
        )[5],
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0
        )[5] +
        calcularIRS(
          rendimentoA=test[1],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0
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
          dependentes3Mais=0
        )[5],
        calcularIRS(
          rendimentoA=test[0],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0
        )[5] +
        calcularIRS(
          rendimentoA=test[1],
          rendimentoB=0,
          estadoCivil=solteiro,
          tributacao=tributacaoSeparado,
          ascendentes=0,
          dependentes3Menos=0,
          dependentes3Mais=0
        )[5]
      ),
      `Casado + Separado + ${test[1]} + ${test[0]}`
    );
  });
}
