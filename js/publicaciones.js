
const grillaArticulos = document.getElementById("grilla-articulos");
const mensajePublicaciones = document.getElementById("mensaje-publicaciones");

// =====================================
// CARGAR ARTÍCULO DESTACADO
// =====================================

async function cargarDestacado() {
    const titulo = document.getElementById("destacado-titulo");
    const resumen = document.getElementById("destacado-resumen");
    const fecha = document.getElementById("destacado-fecha");
    const enlace = document.getElementById("destacado-enlace");
    const contenedorImagen = document.querySelector(".destacado-imagen");

    try {
        const { data, error } = await supabaseClient
            .from("articulos")
            .select("id, titulo, resumen, creado_en, imagen_url")
            .eq("estado", "publicado")
            .order("creado_en", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (error) throw error;

        if (!data) {
            titulo.textContent = "Todavía no hay publicaciones";
            resumen.textContent = "Próximamente compartiremos nuevos artículos.";
            fecha.textContent = "";
            enlace.style.display = "none";
            return;
        }

        titulo.textContent = data.titulo;
        resumen.textContent = data.resumen || "";
        fecha.textContent = new Date(data.creado_en).toLocaleDateString("es-AR");

        enlace.href = "leer-articulo.html?id=" + encodeURIComponent(data.id);

        if (data.imagen_url) {
            contenedorImagen.style.backgroundImage =
                `url("${data.imagen_url}")`;
            contenedorImagen.style.backgroundSize = "cover";
            contenedorImagen.style.backgroundPosition = "center";
        }

    } catch (error) {
        console.error("Error al cargar el destacado:", error);
        titulo.textContent = "No se pudo cargar la publicación destacada.";
        resumen.textContent = "";
        enlace.style.display = "none";
    }
}

// =====================================
// CARGAR PUBLICACIONES
// =====================================

async function cargarPublicaciones() {
    try {
        const { data, error } = await supabaseClient
            .from("articulos")
            .select("*")
            .eq("estado", "publicado")
            .order("creado_en", { ascending: false });

        if (error) throw error;

        grillaArticulos.innerHTML = "";

        if (!data || data.length === 0) {
            grillaArticulos.textContent =
                "Todavía no hay publicaciones disponibles.";
            return;
        }

        data.forEach(function (articulo, indice) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta-articulo";

            // IMAGEN
            const imagen = document.createElement("div");
            imagen.className = "imagen-tarjeta";

            const numero = document.createElement("span");
            numero.textContent = String(indice + 1).padStart(2, "0");

            imagen.appendChild(numero);

            if (articulo.imagen_url) {
                imagen.style.backgroundImage =
                    `url("${articulo.imagen_url}")`;
                imagen.style.backgroundSize = "cover";
                imagen.style.backgroundPosition = "center";
            }

            // CONTENIDO
            const contenido = document.createElement("div");
            contenido.className = "contenido-tarjeta";

            const categoria = document.createElement("span");
            categoria.className = "etiqueta";
            categoria.textContent = articulo.categoria.toUpperCase();

            const titulo = document.createElement("h3");
            titulo.textContent = articulo.titulo;

            const resumen = document.createElement("p");
            resumen.textContent = articulo.resumen || "";

            const fecha = document.createElement("span");
            fecha.className = "fecha-articulo";
            fecha.textContent =
                new Date(articulo.creado_en).toLocaleDateString("es-AR");

            contenido.appendChild(categoria);
            contenido.appendChild(titulo);
            contenido.appendChild(resumen);
            contenido.appendChild(fecha);

            tarjeta.appendChild(imagen);
            tarjeta.appendChild(contenido);

            // ABRIR ARTÍCULO
            tarjeta.style.cursor = "pointer";
            tarjeta.setAttribute("tabindex", "0");
            tarjeta.setAttribute("role", "link");
            tarjeta.setAttribute(
                "aria-label",
                "Leer artículo: " + articulo.titulo
            );

            function abrirArticulo() {
                window.location.href =
                    "leer-articulo.html?id=" + encodeURIComponent(articulo.id);
            }

            tarjeta.addEventListener("click", abrirArticulo);

            tarjeta.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    abrirArticulo();
                }
            });

            grillaArticulos.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("Error al cargar publicaciones:", error);
        grillaArticulos.textContent =
            "No se pudieron cargar las publicaciones.";
    }
}

// =====================================
// INICIO
// =====================================

cargarPublicaciones();
cargarDestacado();
