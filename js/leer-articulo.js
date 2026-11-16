const articuloCompleto = document.getElementById("articulo-completo");
const mensajeArticulo = document.getElementById("mensaje-articulo");

async function cargarArticulo() {
    try {
        const parametros = new URLSearchParams(window.location.search);
        const id = parametros.get("id");

        if (!id) {
            throw new Error("No se indicó qué artículo mostrar.");
        }

        const { data, error } = await supabaseClient
            .from("articulos")
            .select("titulo, resumen, contenido, categoria, creado_en")
            .eq("id", id)
            .eq("estado", "publicado")
            .single();

        if (error) throw error;

        articuloCompleto.innerHTML = "";

        const categoria = document.createElement("span");
        categoria.className = "etiqueta";
        categoria.textContent = data.categoria.toUpperCase();

        const titulo = document.createElement("h1");
        titulo.textContent = data.titulo;

        const fecha = document.createElement("p");
        fecha.className = "fecha-articulo";
        fecha.textContent = new Date(data.creado_en).toLocaleDateString("es-AR");

        const resumen = document.createElement("p");
        resumen.textContent = data.resumen || "";

        const contenido = document.createElement("div");
        contenido.className = "contenido-completo";

        const contenidoSeguro = new DOMParser().parseFromString(
            data.contenido,
            "text/html"
        );

        const elementosPermitidos = [
            "P", "H1", "H2", "H3", "STRONG", "B",
            "EM", "I", "U", "S", "UL", "OL", "LI",
            "BLOCKQUOTE", "BR", "A"
        ];

        function copiarContenido(origen, destino) {
            Array.from(origen.childNodes).forEach(function(nodo) {
                if (nodo.nodeType === Node.TEXT_NODE) {
                    destino.appendChild(document.createTextNode(nodo.textContent));
                    return;
                }

                if (nodo.nodeType !== Node.ELEMENT_NODE) return;

                const etiqueta = nodo.tagName;

                if (!elementosPermitidos.includes(etiqueta)) {
                    copiarContenido(nodo, destino);
                    return;
                }

                const nuevoElemento = document.createElement(etiqueta.toLowerCase());

                if (etiqueta === "A") {
                    const enlace = nodo.getAttribute("href") || "";

                    if (/^(https?:\/\/|mailto:)/i.test(enlace)) {
                        nuevoElemento.setAttribute("href", enlace);
                        nuevoElemento.setAttribute("target", "_blank");
                        nuevoElemento.setAttribute("rel", "noopener noreferrer");
                    }
                }

                copiarContenido(nodo, nuevoElemento);
                destino.appendChild(nuevoElemento);
            });
        }

        copiarContenido(contenidoSeguro.body, contenido);

        articuloCompleto.appendChild(categoria);
        articuloCompleto.appendChild(titulo);
        articuloCompleto.appendChild(fecha);

        if (data.resumen) {
            articuloCompleto.appendChild(resumen);
        }

        articuloCompleto.appendChild(contenido);

        document.title = data.titulo + " | Comité San Miguel";

    } catch (error) {
        console.error("Error al cargar el artículo:", error);
        mensajeArticulo.textContent =
            "No se pudo encontrar este artículo o ya no está publicado.";
    }
}

cargarArticulo();