document
  .getElementById("newProductForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      name: formData.get("name"),
      price: parseFloat(formData.get("price")),
      type: formData.get("type"),
    };

    try {
      const response = await fetch("/products/new-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        await Swal.fire({
          icon: "success",
          title: "¡Producto agregado con exito!",
          text: "El producto se ha agregado correctamente.",
          confirmButtonText: "OK",
        });
        window.location.href = "/productos";
      } else {
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al agregar el producto.",
        confirmButtonText: "OK",
      });
    }
  });
