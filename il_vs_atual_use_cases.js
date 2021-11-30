// Test several conditions and compare the current system against the IL's proposal
//
// just copy paste to the browser console

function range(start, finish, step = 1) {
  let size = Math.floor((finish-start)/step)+1;
  return [...Array(size).keys()].map(i => i*step + start);
}

const casado = 'Casado/Unido de facto';
const solteiro = 'Solteiro, divorciado, viúvo ou separado judicialmente';
const tributacaoConjunto = 'Conjunto';
const tributacaoSeparado = 'Separado';

//--//

const results = [
  ["ano", "rendimentoA", "rendimentoB", "estadoCivil", "tributacao", "ascendentes", "dependentes3Menos", "dependentes3Mais",
  "despesasGerais", "despesasSaude", "despesasEducacao", "despesasHabitacao", "despesasLares", "despesasPensoesAlimentos",
  "despesasAutomoveis", "despesasMotociclos", "despesasRestauracao", "despesasCabeleireiros", "despesasVeterinario", "despesasPasses",
  "deducoesEspecificas", "rendimentoColectavel", "taxa", "coletaTotal", "deducoesColeta", "irsActual", "irsIL", "diff",
  "diffValorTrabalhador", "diffValorEstado", "diffPagoEmpresa", "diffValorTrabalhadorIL", "diffValorEstadoIL", "diffPagoEmpresaIL"]
];


var salarioMinimo = 665; // https://www.pordata.pt/Portugal/Sal%C3%A1rio+m%C3%ADnimo+nacional-74
var salarioMedio = 1326; // https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_destaques&DESTAQUESdest_boui=415288436&DESTAQUESmodo=2&xlang=pt

var despesasLares = 0;
var despesasPensoesAlimentos = 0;
var despesasAutomoveis = 0;
var despesasMotociclos = 0;
var despesasVeterinario = 0;
var despesasPasses = 0;

var total = 0;

console.log('Starting...');
[salarioMinimo, 1000, salarioMedio, 2*salarioMedio].forEach(rendimentoA => {
  [0, salarioMinimo, 1000, salarioMedio, 2*salarioMedio].forEach(rendimentoB => {
    [casado,solteiro].forEach(estadoCivil => {
      [tributacaoConjunto].forEach(tributacao => {
        [0].forEach(ascendentes => {
          range(0, 1).forEach(dependentes3Menos => {
            range(0, 1).forEach(dependentes3Mais => {
              [1000].forEach(despesasGerais => {
              [400].forEach(despesasSaude => {
              [0].forEach(despesasEducacao => {
              [500*12].forEach(despesasHabitacao => {
              [100].forEach(despesasRestauracao => {
              [0].forEach(despesasCabeleireiros => {

                if ((despesasGerais+despesasSaude+despesasEducacao+despesasHabitacao+despesasRestauracao+despesasCabeleireiros)/(rendimentoA*14+rendimentoB*14) >= 0.5) {
                  despesasHabitacao=0;
                }

                if (dependentes3Menos+dependentes3Mais === 0) {
                  despesasEducacao =0;
                }

                // impossible cases
                if (rendimentoB===0 && estadoCivil===casado) {
                  return;
                }
                if (rendimentoB>0 && estadoCivil===solteiro) {
                  return;
                }
                if (estadoCivil===solteiro && tributacao===tributacaoConjunto) {
                  tributacao = tributacaoSeparado;
                }

                var [deducoesEspecificas, rendimentoColectavel, taxa, coletaTotal, deducoesColeta, irsActual] = calcularIRS(
                  rendimentoA*14, rendimentoB*14, estadoCivil, tributacao, ascendentes, dependentes3Menos, dependentes3Mais,
                  despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
                  despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses
                );

                var fn = calcularIRS_IL;
                //var fn = calcularIRS_IL_3escaloes;

                var irsIL = fn(
                  rendimentoA*14, rendimentoB*14, estadoCivil, tributacao, dependentes3Menos, dependentes3Mais, despesasPensoesAlimentos
                );

                var [valorTrabalhadorBase, valorEstadoBase, pagoEmpresaBase] = calcularRendLiquido(rendimentoA*14, rendimentoB*14, irsActual);
                var [valorTrabalhadorILBase, valorEstadoILBase, pagoEmpresaILBase] = calcularRendLiquido(rendimentoA*14, rendimentoB*14, irsIL);

                // salary increase calculation

                var incremento = 100;
                var rendA = rendimentoA*14 + incremento*14;
                var rendB = rendimentoB > 0 ? rendimentoB*14 + incremento*14 : 0;

                var irsActualInc = calcularIRS(
                  rendA, rendB, estadoCivil, tributacao, ascendentes, dependentes3Menos, dependentes3Mais,
                  despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
                  despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses
                )[5];
          
                var irsILInc = fn(
                  rendA, rendB, estadoCivil, tributacao, dependentes3Menos, dependentes3Mais, despesasPensoesAlimentos
                );

                var [valorTrabalhador, valorEstado, pagoEmpresa] = calcularRendLiquido(rendA, rendB, irsActualInc);
                var [valorTrabalhadorIL, valorEstadoIL, pagoEmpresaIL] = calcularRendLiquido(rendA, rendB, irsILInc);

                // store result

                results.push(
                  [ano, rendimentoA, rendimentoB, estadoCivil, tributacao, ascendentes, dependentes3Menos, dependentes3Mais,
                  despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
                  despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses,
                  deducoesEspecificas, rendimentoColectavel, taxa, coletaTotal, deducoesColeta, irsActual, irsIL, irsActual - irsIL,
                  valorTrabalhador-valorTrabalhadorBase, valorEstado-valorEstadoBase, pagoEmpresa-pagoEmpresaBase, 
                  valorTrabalhadorIL-valorTrabalhadorILBase, valorEstadoIL-valorEstadoILBase, pagoEmpresaIL-pagoEmpresaILBase]
                );

                total++;

              });
              });
              });
              });
              });
              });
            });
          });
        });
      });
    });
  });
  console.log(`${rendimentoA} | ${total}`);
});


console.log("Creating CSV file...");
let csvContent = "data:text/csv;charset=utf-8," + results.map(e => e.join(",").replace(solteiro,"Solteiro")).join("\n");

var encodedUri = encodeURI(csvContent);
var link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "irs_use_cases.csv");
document.body.appendChild(link); // Required for FF

link.click(); // This will download the data file named "irs_use_cases.csv"
console.log(`Total: ${total} | ${results.length}`);
console.log("Done.");








//
