
const listaAdministradores = document.getElementById("lista-administradores");
const botonAgregar = document.getElementById("btn-agregar-usuario");
const campoUsuario = document.getElementById("nuevo-usuario-id");
const mensajeUsuarios = document.getElementById("mensaje-usuarios");

// Consultar administradores registrados.
async function cargarAdministradores() {
    listaAdministradores.textContent = "Cargando usuarios...";

    const { data, error } = await supabaseClient.rpc(
        "listar_administradores"
    );

    if (error) {
        console.error(error);
        listaAdministradores.textContent =
            "No se pudo cargar la lista de administradores.";
        return;
    }

    listaAdministradores.innerHTML = "";

    if (data.length === 0) {
        listaAdministradores.textContent =
            "No hay administradores registrados.";
        return;
    }

    data.forEach(function (usuario) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "usuario-item";

        const correo = document.createElement("p");
        correo.textContent = "Correo: " + usuario.correo;

        const rol = document.createElement("p");
        rol.textContent = "Rol: " + usuario.rol;

        tarjeta.appendChild(correo);
        tarjeta.appendChild(rol);

        if (usuario.rol === "admin") {
            const botonQuitar = document.createElement("button");
            botonQuitar.textContent = "QUITAR ADMINISTRADOR";

            botonQuitar.addEventListener("click", async function () {
                const confirmar = confirm(
                    "¿Querés quitar los permisos administrativos de este usuario?"
                );

                if (!confirmar) return;

                const { error } = await supabaseClient.rpc(
                    "quitar_administrador",
                    { usuario_id: usuario.usuario_id }
                );

                if (error) {
                    mensajeUsuarios.textContent =
                        "No se pudo quitar el administrador.";
                    console.error(error);
                    return;
                }

                mensajeUsuarios.textContent =
                    "Permisos administrativos revocados correctamente.";

                cargarAdministradores();
            });

            tarjeta.appendChild(botonQuitar);
        }

        listaAdministradores.appendChild(tarjeta);
    });
}

// Asignar un usuario existente como administrador.
botonAgregar.addEventListener("click", async function () {
    const usuarioId = campoUsuario.value.trim();

    mensajeUsuarios.textContent = "";

    if (!usuarioId) {
        mensajeUsuarios.textContent = "Ingresá un UID.";
        return;
    }

    const confirmar = confirm(
        "¿Querés asignar el rol de administrador a este usuario?"
    );

    if (!confirmar) return;

    botonAgregar.disabled = true;

    const { error } = await supabaseClient.rpc(
        "asignar_administrador",
        { usuario_id: usuarioId }
    );

    botonAgregar.disabled = false;

    if (error) {
        console.error(error);
        mensajeUsuarios.textContent =
            "No se pudo asignar el administrador. Verificá el UID.";
        return;
    }

    campoUsuario.value = "";

    mensajeUsuarios.textContent =
        "Administrador agregado correctamente.";

    cargarAdministradores();
});

// Cargar la lista al abrir la pantalla.
cargarAdministradores();
