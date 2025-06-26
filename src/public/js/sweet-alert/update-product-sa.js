async function showEditPriceForm(productId) {
  const { value: newPrice } = await Swal.fire({
    title: "Modificar Precio",
    input: "number",
    inputLabel: "Nuevo precio",
    inputAttributes: {
      step: "0.01",
      min: "0",
      required: "true",
    },
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    inputValidator: (value) => {
      if (!value || parseFloat(value) <= 0) {
        return "Por favor, ingrese un precio válido mayor que 0";
      }
    },
  });

  if (newPrice) {
    try {
      const response = await fetch(`/products/update${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price: parseFloat(newPrice) }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        await Swal.fire({
          icon: "success",
          title: "¡Precio actualizado!",
          text: "El precio se ha actualizado correctamente.",
          confirmButtonText: "OK",
        });
        window.location.reload();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "No se pudo actualizar el precio.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al actualizar el precio.",
        confirmButtonText: "OK",
      });
    }
  }
}
