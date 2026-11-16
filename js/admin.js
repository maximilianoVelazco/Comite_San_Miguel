
(async function protegerPanel() {
    try {
        const { data, error } = await supabaseClient.auth.getSession();

        if (error) throw error;

        if (!data.session) {
            window.location.replace("../pages/login.html");
            return;
        }

        const usuarioActual = data.session.user;

        const { data: perfil, error: errorPerfil } = await supabaseClient
            .from("perfiles")
            .select("rol")
            .eq("id", usuarioActual.id)
            .single();

        if (errorPerfil || !perfil) {
            await supabaseClient.auth.signOut();
            window.location.replace("../pages/login.html");
            return;
        }

        if (!["super_admin", "admin"].includes(perfil.rol)) {
            await supabaseClient.auth.signOut();
            window.location.replace("../pages/login.html");
            return;
        }

        const encabezado = document.querySelector(".bienvenida-admin");

        if (encabezado) {
            const usuario = document.createElement("p");

            usuario.textContent =
                "Sesión iniciada: " + usuarioActual.email +
                " | Rol: " + perfil.rol;

            encabezado.appendChild(usuario);

            const botonSalir = document.createElement("button");

            botonSalir.textContent = "CERRAR SESIÓN";
            botonSalir.style.marginTop = "15px";
            botonSalir.style.padding = "10px 18px";
            botonSalir.style.cursor = "pointer";

            botonSalir.addEventListener("click", async function () {
                const { error } = await supabaseClient.auth.signOut();

                if (error) {
                    alert("No se pudo cerrar la sesión.");
                    return;
                }

                window.location.replace("../pages/login.html");
            });

            encabezado.appendChild(botonSalir);
        }

        const botonUsuarios = document.getElementById("btn-usuarios");

        if (botonUsuarios) {
            botonUsuarios.addEventListener("click", function () {
                window.location.href = "usuarios.html";
            });
        }

    } catch (error) {
        console.error("Error al comprobar los permisos:", error);
        window.location.replace("../pages/login.html");
    }
})();
