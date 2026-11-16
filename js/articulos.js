
// =====================================
// EDITOR VISUAL QUILL
// =====================================

let editorArticulo = null;

const elementoEditor = document.getElementById("editor-articulo");

if (elementoEditor && typeof Quill !== "undefined") {
    editorArticulo = new Quill(elementoEditor, {
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
}

// =====================================
// ELEMENTOS DEL FORMULARIO
// =====================================

const formularioArticulo = document.getElementById("form-articulo");
let articuloEnEdicion = null;
let imagenActual = null;

const listaArticulos = document.getElementById("lista-articulos");
const inputImagen = document.getElementById("imagen");
const mensajeArticulos = document.getElementById("mensaje-articulos");

const botonAnterior = document.getElementById("btn-nuevo-articulo");

if (botonAnterior) {
    botonAnterior.remove();
}

// =====================================
// SUBIR IMAGEN
// =====================================

async function subirImagen(archivo) {
    const nombreArchivo =
        Date.now() + "-" +
        archivo.name.replace(/[^a-zA-Z0-9._-]/g, "_");

    const { data, error } = await supabaseClient
        .storage
        .from("articulos")
        .upload(nombreArchivo, archivo, {
            cacheControl: "3600",
            upsert: false,
            contentType: archivo.type
        });

    if (error) throw error;

    const { data: urlImagen } = supabaseClient
        .storage
        .from("articulos")
        .getPublicUrl(data.path);

    return urlImagen.publicUrl;
}

// =====================================
// EDITAR ARTÍCULO
// =====================================

function editarArticulo(articulo) {
    document.getElementById("titulo").value = articulo.titulo;
    document.getElementById("resumen").value = articulo.resumen || "";
    document.getElementById("categoria").value = articulo.categoria;
    document.getElementById("estado").value = articulo.estado;

    editorArticulo.root.innerHTML = articulo.contenido;

    articuloEnEdicion = articulo.id;
    imagenActual = articulo.imagen_url || null;

    mensajeArticulos.textContent = "Editando: " + articulo.titulo;

    formularioArticulo.querySelector(
        'button[type="submit"]'
    ).textContent = "ACTUALIZAR ARTÍCULO";
}

// =====================================
// ELIMINAR ARTÍCULO
// =====================================

async function eliminarArticulo(id) {
    const confirmar = confirm(
        "¿Estás seguro de que querés eliminar este artículo?"
    );

    if (!confirmar) return;

    const { error } = await supabaseClient
        .from("articulos")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error al eliminar:", error);
        mensajeArticulos.textContent = "No se pudo eliminar el artículo.";
        return;
    }

    mensajeArticulos.textContent = "Artículo eliminado correctamente.";

    await cargarArticulos();
}

// =====================================
// CARGAR ARTÍCULOS
// =====================================

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

    if (!data || data.length === 0) {
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

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "EDITAR";
        botonEditar.className = "boton-admin";
        botonEditar.type = "button";

        botonEditar.addEventListener("click", function () {
            editarArticulo(articulo);
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "ELIMINAR";
        botonEliminar.className = "boton-admin";
        botonEliminar.type = "button";

        botonEliminar.addEventListener("click", function () {
            eliminarArticulo(articulo.id);
        });

        tarjeta.appendChild(titulo);
        tarjeta.appendChild(categoria);
        tarjeta.appendChild(estado);
        tarjeta.appendChild(botonEditar);
        tarjeta.appendChild(botonEliminar);

        listaArticulos.appendChild(tarjeta);
    });
}

// =====================================
// GUARDAR ARTÍCULO
// =====================================

formularioArticulo.addEventListener("submit", async function (event) {
    event.preventDefault();

    mensajeArticulos.textContent = "";

    const titulo = document.getElementById("titulo").value.trim();
    const resumen = document.getElementById("resumen").value.trim();
    const categoria = document.getElementById("categoria").value;
    const estado = document.getElementById("estado").value;

    const contenido = editorArticulo.root.innerHTML;
    const textoContenido = editorArticulo.getText().trim();

    if (!titulo || !categoria || !textoContenido) {
        mensajeArticulos.textContent =
            "Completá el título, la categoría y el contenido.";
        return;
    }

    const botonGuardar = formularioArticulo.querySelector(
        'button[type="submit"]'
    );

    botonGuardar.disabled = true;
    botonGuardar.textContent = "GUARDANDO...";

    try {
        const { data: sesion, error: errorSesion } =
            await supabaseClient.auth.getUser();

        if (errorSesion || !sesion.user) {
            throw new Error("No hay una sesión administrativa activa.");
        }

        let imagenParaGuardar = imagenActual;
        const archivoImagen = inputImagen.files[0];

        if (archivoImagen) {
            imagenParaGuardar = await subirImagen(archivoImagen);
        }

        let resultado;

        if (articuloEnEdicion) {
            resultado = await supabaseClient
                .from("articulos")
                .update({
                    titulo: titulo,
                    resumen: resumen,
                    contenido: contenido,
                    categoria: categoria,
                    estado: estado,
                    imagen_url: imagenParaGuardar,
                    actualizado_en: new Date().toISOString()
                })
                .eq("id", articuloEnEdicion);
        } else {
            resultado = await supabaseClient
                .from("articulos")
                .insert({
                    titulo: titulo,
                    resumen: resumen,
                    contenido: contenido,
                    categoria: categoria,
                    estado: estado,
                    autor: sesion.user.id,
                    imagen_url: imagenParaGuardar
                });
        }

        if (resultado.error) {
            throw resultado.error;
        }

        mensajeArticulos.textContent = "Artículo guardado correctamente.";

        formularioArticulo.reset();
        editorArticulo.setText("");

        articuloEnEdicion = null;
        imagenActual = null;
        inputImagen.value = "";

        botonGuardar.textContent = "GUARDAR ARTÍCULO";

        await cargarArticulos();

    } catch (error) {
        console.error("Error al guardar el artículo:", error);

        mensajeArticulos.textContent =
            "No se pudo guardar el artículo. Revisá los datos y los permisos.";

    } finally {
        botonGuardar.disabled = false;
        botonGuardar.textContent = "GUARDAR ARTÍCULO";
    }
});

// =====================================
// INICIO
// =====================================

cargarArticulos();
