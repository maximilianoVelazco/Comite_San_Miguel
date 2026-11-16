const grillaArticulos = document.getElementById("grilla-articulos");
const mensajePublicaciones = document.getElementById("mensaje-publicaciones");

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
            grillaArticulos.textContent = "Todavía no hay publicaciones disponibles.";
            return;
        }

        data.forEach(function(articulo, indice) {
            const tarjeta = document.createElement("article");
            tarjeta.className = "tarjeta-articulo";

            const imagen = document.createElement("div");
            imagen.className = "imagen-tarjeta";

            const numero = document.createElement("span");
            numero.textContent = String(indice + 1).padStart(2, "0");

            imagen.appendChild(numero);

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
            fecha.textContent = new Date(articulo.creado_en).toLocaleDateString("es-AR");

            contenido.appendChild(categoria);
            contenido.appendChild(titulo);
            contenido.appendChild(resumen);
            contenido.appendChild(fecha);

            tarjeta.appendChild(imagen);
            tarjeta.appendChild(contenido);

            grillaArticulos.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("Error al cargar publicaciones:", error);
        grillaArticulos.textContent = "No se pudieron cargar las publicaciones.";
    }
}

cargarPublicaciones();