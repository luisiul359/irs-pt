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
  "deducoesEspecificas", "rendimentoColectavel", "taxa", "coletaTotal", "deducoesColeta", "irsActual", "irsIL", "diff"]
];

const sujeitoA = range(500, 5000, 50).concat(range(5500, 25000, 500));
const sujeitoB = range(500, 5000, 50).concat(range(5500, 25000, 500));

var despesasLares = 0;
var despesasPensoesAlimentos = 0;
var despesasAutomoveis = 0;
var despesasMotociclos = 0;
var despesasVeterinario = 0;
var despesasPasses = 0;

var total = 0;

console.log('Starting...');
sujeitoA.forEach(rendimentoA => {
  [0].concat(sujeitoB).forEach(rendimentoB => {
    [casado,solteiro].forEach(estadoCivil => {
      [tributacaoConjunto,tributacaoSeparado].forEach(tributacao => {
        range(0, 3).forEach(ascendentes => {
          range(0, 3).forEach(dependentes3Menos => {
            range(0, 3).forEach(dependentes3Mais => {
              [1500].forEach(despesasGerais => {
              [400].forEach(despesasSaude => {
              [1500].forEach(despesasEducacao => {
              [600*12].forEach(despesasHabitacao => {
              [300].forEach(despesasRestauracao => {
              [80].forEach(despesasCabeleireiros => {

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
                  return;
                }

                var [deducoesEspecificas, rendimentoColectavel, taxa, coletaTotal, deducoesColeta, irsActual] = calcularIRS(
                  rendimentoA, rendimentoB, estadoCivil, tributacao, ascendentes, dependentes3Menos, dependentes3Mais,
                  despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
                  despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses
                );

                var irsIL = calcularIRS_IL(
                  rendimentoA, rendimentoB, dependentes3Menos + dependentes3Mais, estadoCivil
                );

                if (irsActual > 0 && irsActual - irsIL < 100) {
                  results.push(
                    [ano, rendimentoA, rendimentoB, estadoCivil, tributacao, ascendentes, dependentes3Menos, dependentes3Mais,
                    despesasGerais, despesasSaude, despesasEducacao, despesasHabitacao, despesasLares, despesasPensoesAlimentos,
                    despesasAutomoveis, despesasMotociclos, despesasRestauracao, despesasCabeleireiros, despesasVeterinario, despesasPasses,
                    deducoesEspecificas, rendimentoColectavel, taxa, coletaTotal, deducoesColeta, irsActual, irsIL, irsActual - irsIL]
                  );
                }

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
link.setAttribute("download", "irs_comparison.csv");
document.body.appendChild(link); // Required for FF

link.click(); // This will download the data file named "irs_comparison.csv"
console.log(`Total: ${total} | ${results.length}`);
console.log("Done.");








//
