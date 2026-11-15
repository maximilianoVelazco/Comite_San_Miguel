
/* =================================
   CALENDARIO - COMITÉ SAN MIGUEL
================================= */

const calendario = document.getElementById("calendario");
const tituloMes = document.getElementById("mes-actual");

const botonAnterior = document.getElementById("mes-anterior");
const botonSiguiente = document.getElementById("mes-siguiente");

const hoy = new Date();

let mesActual = hoy.getMonth();
let anioActual = hoy.getFullYear();

const nombresMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];

/* GENERAR CALENDARIO */

function generarCalendario() {

    calendario.innerHTML = "";

    tituloMes.textContent =
        nombresMeses[mesActual] + " " + anioActual;

    const diasSemana = [
        "LUN",
        "MAR",
        "MIÉ",
        "JUE",
        "VIE",
        "SÁB",
        "DOM"
    ];

    diasSemana.forEach(dia => {

        const encabezado = document.createElement("div");

        encabezado.className = "dia-semana";
        encabezado.textContent = dia;

        calendario.appendChild(encabezado);

    });

    const primerDia = new Date(
        anioActual,
        mesActual,
        1
    );

    const ultimoDia = new Date(
        anioActual,
        mesActual + 1,
        0
    );

    let diaInicio = primerDia.getDay();

    // Adaptar semana para que comience el lunes
    diaInicio = (diaInicio + 6) % 7;

    const cantidadDias = ultimoDia.getDate();

    // Días del mes anterior
    const ultimoDiaAnterior = new Date(
        anioActual,
        mesActual,
        0
    ).getDate();

    for (let i = 0; i < diaInicio; i++) {

        const celda = document.createElement("div");

        celda.className = "dia-calendario otro-mes";

        const numero =
            ultimoDiaAnterior - diaInicio + i + 1;

        celda.innerHTML =
            `<span class="numero-dia">${numero}</span>`;

        calendario.appendChild(celda);

    }

    // Días del mes actual
    for (let dia = 1; dia <= cantidadDias; dia++) {

        const celda = document.createElement("div");

        celda.className = "dia-calendario";

        const esHoy =
            dia === hoy.getDate() &&
            mesActual === hoy.getMonth() &&
            anioActual === hoy.getFullYear();

        if (esHoy) {
            celda.classList.add("hoy");
        }

        celda.innerHTML =
            `<span class="numero-dia">${dia}</span>`;

        calendario.appendChild(celda);

    }

    // Completar última semana con días del mes siguiente
    const totalCeldas = calendario.children.length;
    const celdasRestantes = (7 - (totalCeldas % 7)) % 7;

    for (let i = 1; i <= celdasRestantes; i++) {

        const celda = document.createElement("div");

        celda.className = "dia-calendario otro-mes";

        celda.innerHTML =
            `<span class="numero-dia">${i}</span>`;

        calendario.appendChild(celda);

    }

}

/* MES ANTERIOR */

botonAnterior.addEventListener("click", function() {

    mesActual--;

    if (mesActual < 0) {

        mesActual = 11;
        anioActual--;

    }

    generarCalendario();

});

/* MES SIGUIENTE */

botonSiguiente.addEventListener("click", function() {

    mesActual++;

    if (mesActual > 11) {

        mesActual = 0;
        anioActual++;

    }

    generarCalendario();

});

/* INICIAR */

generarCalendario();
