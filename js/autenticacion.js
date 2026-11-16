
const formularioLogin = document.getElementById("form-login");

if (formularioLogin) {
    const botonLogin = formularioLogin.querySelector('button[type="submit"]');

    const mensajeLogin = document.createElement("p");
    mensajeLogin.setAttribute("role", "status");
    mensajeLogin.setAttribute("aria-live", "polite");
    mensajeLogin.style.marginTop = "15px";

    botonLogin.insertAdjacentElement("afterend", mensajeLogin);

    formularioLogin.addEventListener("submit", async function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        mensajeLogin.textContent = "";
        botonLogin.disabled = true;
        botonLogin.textContent = "INGRESANDO...";

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                throw error;
            }

            if (!data.session) {
                throw new Error("No se pudo iniciar la sesión.");
            }

            mensajeLogin.textContent = "Acceso correcto. Redirigiendo...";

            window.location.href = "../admin/admin.html";

        } catch (error) {
            console.error("Error de autenticación:", error);

            mensajeLogin.textContent =
                "No se pudo iniciar sesión. Verificá el correo y la contraseña.";

            botonLogin.disabled = false;
            botonLogin.textContent = "INGRESAR";
        }
    });
}
