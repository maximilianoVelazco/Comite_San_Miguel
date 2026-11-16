
const editorArticulo = new Quill("#editor-articulo", {
    theme: "snow",
    placeholder: "Escribí aquí el contenido del artículo...",
    modules: {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "link"],
            ["clean"]
        ]
    }
});

const listaArticulos = document.getElementById("lista-articulos");
const botonNuevoArticulo = document.getElementById("btn-nuevo-articulo");

async function cargarArticulos() {
    listaArticulos.textContent = "Cargando publicaciones...";

    const { data, error } = await supabaseClient
        .from("articulos")
        .select("*")
        .order("creado_en", { ascending: false });

    if (error) {
        console.error("Error al cargar artículos:", error);
        listaArticulos.textContent = "No se pudieron cargar las publicaciones.";
        return;
    }

    listaArticulos.innerHTML = "";

    if (data.length === 0) {
        listaArticulos.textContent = "Todavía no hay publicaciones registradas.";
        return;
    }

    data.forEach(function (articulo) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "usuario-item";

        const titulo = document.createElement("h3");
        titulo.textContent = articulo.titulo;

        const categoria = document.createElement("p");
        categoria.textContent = "Categoría: " + articulo.categoria;

        const estado = document.createElement("p");
        estado.textContent = "Estado: " + articulo.estado;

        tarjeta.appendChild(titulo);
        tarjeta.appendChild(categoria);
        tarjeta.appendChild(estado);

        listaArticulos.appendChild(tarjeta);
    });
}

botonNuevoArticulo.addEventListener("click", function () {
    alert("El formulario de creación de artículos lo construiremos en el siguiente paso.");
});

cargarArticulos();
