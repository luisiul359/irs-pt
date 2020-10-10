function teste() {
    var rendimentoA = Number($("#rendA").val());
    var rendimentoB = Number($("#rendB").val());
    var estadoCivil = $('#estadoCivil option:selected').text()
    var tributacao = $('#tributacao option:selected').text()
    var ascendentes = Number($("#ascendentes").val());
    var dependentes3Menos = Number($("#dependentes3menos").val());
    // greater or equal
    var dependentes3Mais = Number($("#dependentes3mais").val());
}


// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  'use strict'

  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation')

    // Loop over them and prevent submission
    Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault()
          event.stopPropagation()
        }
        form.classList.add('was-validated')
      }, false)
    })
  }, false)
}())
