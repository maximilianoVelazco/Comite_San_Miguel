
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
        }

    } catch (error) {
        console.error("Error al comprobar los permisos:", error);
        window.location.replace("../pages/login.html");
    }
})();
