document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newRecipeForm");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      const response = await fetch("/recipes/new-recipe", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Receta generada con éxito",
          confirmButtonText: "OK",
        });
        window.location.href = "/recetas";
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Error al crear receta",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error en el envío:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: `Error al crear receta: ${error.message}`,
        confirmButtonText: "OK",
      });
    }
  });
});