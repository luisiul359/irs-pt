// Very dummy test suite in native javascript
//
// just copy paste to browser console

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
    // [rendimento, valor obtido pelo simulador da pwc]
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
    // [rendimento A, redimento B, valor obtido pelo simulador da pwc]
    [  500,  100, 0.00],
    [  500,  500, 0.00],
    [ 1000,  500, 0.00],
    [ 635, 635, 0.00]
    [ 675, 635, 1251.30]
    [ 1000, 1000, 3346.69]
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
}
