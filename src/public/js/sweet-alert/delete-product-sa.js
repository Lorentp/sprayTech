async function deleteProduct(productId) {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás deshacer esta acción.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const response = await fetch(`/products/delete/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (response.ok && result.success) {
        await Swal.fire({
          icon: "success",
          title: "¡Eliminado!",
          text: "El producto ha sido eliminado correctamente.",
          confirmButtonText: "OK",
        });
        window.location.reload();
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "No se pudo eliminar el producto.",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al eliminar el producto.",
        confirmButtonText: "OK",
      });
    }
  }
}
