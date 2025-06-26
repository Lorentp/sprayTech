document
  .getElementById("newFieldForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fieldData = {
      name: formData.get("name"),
      farmname: formData.get("farmname"),
      ha: parseFloat(formData.get("ha")),
    };
    try {
      const response = await fetch("/fields/new-field", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fieldData),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        await Swal.fire({
          icon: "success",
          title: "¡Lote creado correctamente!",
          text: "El lote se ha creado con éxito.",
          confirmButtonText: "OK",
        });
        window.location.href = "/productos";
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "No se pudo crear el lote.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al crear el lote.",
        confirmButtonText: "OK",
      });
    }
  });
