//variables
const formulario = document.getElementById("cotizar-seguro");
const formGroup = document.querySelector(".form-group");
const selectYear = document.getElementById("anio");
const marca = document.getElementById("marca");
const resultado = document.getElementById("resultado");
const spinner = document.querySelector("img");
const maxYear = new Date().getFullYear();
const minYear = maxYear - 20;

//EventListener Submit
formulario.addEventListener("submit", function submitForm(e) {
  e.preventDefault();
  // value de los input de un options, obtiene el value del html
  const marcaSelected = marca.options[marca.selectedIndex].value;
  //leer año
  const yearSelected = selectYear.options[selectYear.selectedIndex].value;
  //leer el valor del radio button
  const tipoSelected = document.querySelector('input[name="tipo"]:checked')
    .value;

  //creando la instancia de la clase interfaz
  const interfaz = new Interfaz();

  //comprobar que los campos no esten vacios
  if (
    marcaSelected.trim() === "" ||
    yearSelected.trim() === "" ||
    tipoSelected.trim() === ""
  ) {
    //llamado al metodo imprime error
    interfaz.imprimeError("Complete todos los datos del formulario.", "error");
  } else {
    //limpiar resultados anteriores
    let resultadoDiv = document.querySelector("#resultado div");
    if (resultadoDiv != null) {
      resultadoDiv.remove();
    }
    //instanciar la clase y mostrar en interfazt
    const seguro = new Seguro(marcaSelected, yearSelected, tipoSelected);

    //metodo para cotizar el seguro
    const cantidad = seguro.cotizarSeguro();
    //mostrar resultado
    interfaz.mostrarResultado(seguro, cantidad);
    interfaz.imprimeError("Calculando Cotización...", "correcto");
  }
});

//for para recorrer los años en el select year
for (let i = maxYear; i > minYear; i--) {
  let opcionesYear = document.createElement("option");
  opcionesYear.value = i;
  opcionesYear.textContent = i;
  selectYear.appendChild(opcionesYear);
}

//Clase para el seguro
function Seguro(marca, añio, tipo) {
  this.marca = marca;
  this.añio = añio;
  this.tipo = tipo;
}
//metodo para calcular el seguro
Seguro.prototype.cotizarSeguro = function () {
  /*
        1 = Americano 1.15,
        2 = Asiatico 1.05,
        3 = Europeo 1.35
    */
  let cantidad;
  const base = 2000;
  switch (this.marca) {
    case "1":
      cantidad = base * 1.15;
      break;
    case "2":
      cantidad = base * 1.05;
      break;
    case "3":
      cantidad = base * 1.35;
      break;
  }
  //leer año
  const diferencia = maxYear - this.añio; //restando el año actual con el selected

  //cada año de diferencia se reduce el 3% de la cantidad
  cantidad -= (diferencia * 3 * cantidad) / 100;

  /*
     Si el seguro es basico se multiplica por 30% mas, si es completo 50%
    */
  if (this.tipo === "basico") {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }
  return cantidad;
};
//Clase para la interfaz
function Interfaz() {}

//mensaje que se inprime en el html cuando existe un error en los campos
Interfaz.prototype.imprimeError = function (mensaje, tipoMensaje) {
  const div = document.createElement("div");
  if (tipoMensaje === "error") {
    div.classList.add("mensaje", "error");
  } else {
    div.classList.add("mensaje", "correcto");
  }
  div.innerHTML = `${mensaje}`; //agrego el mesnaje al div
  formulario.insertBefore(div, formGroup); //inserto la etiqueta antes del formGroup

  //faded message
  setTimeout(() => {
    document.querySelector(".mensaje").remove();
  }, 4000);
};

//mostrar resultado
Interfaz.prototype.mostrarResultado = function (seguro, totalCantidad) {
  let marca;
  switch (seguro.marca) {
    case "1":
      marca = "Americano";
      break;
    case "2":
      marca = "Asiatico";
      break;
    case "3":
      marca = "Europeo";
      break;
  }
  //creando el div para el resumen
  const divResumen = document.createElement("div");
  //insertat info
  divResumen.innerHTML = `
        <p class="header">Tu Resumen:</p>
        <p>Marca: ${marca}</p>
        <p>Año: ${seguro.añio}</p>
        <p>Tipo: ${seguro.tipo}</p>
        <p>Total: $${totalCantidad}</p>
   `;
  spinner.style.display = "block";
  setTimeout(() => {
    spinner.style.display = "none";
    resultado.appendChild(divResumen);
    formulario.reset();
  }, 4000);
};
