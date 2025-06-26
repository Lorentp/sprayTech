document.addEventListener("DOMContentLoaded", () => {
  // Función para mostrar productos en un modal
 window.showProducts = function (type, recipe) {
    console.log("showProducts called with type:", type, "recipe:", recipe);
    let title, products, extraInfo = "";
    const ltsXHa = recipe.recipe?.[0]?.lts_x_ha ? parseFloat(recipe.recipe[0].lts_x_ha).toFixed(3) : "N/A";

    // Normalizar type para compatibilidad
    if (type === "perTank") type = "per_t";
    if (type === "perHa") type = "per_ha";

    if (type === "total") {
      title = "Uso Total de Productos";
      products = recipe.recipe?.[0]?.products_total;
      extraInfo = `
        <p><strong>Costo Total:</strong> $${recipe.totalCost ? parseFloat(recipe.totalCost).toFixed(3) : "N/A"}</p>
        <p><strong>Costo por Hectárea:</strong> $${recipe.costPerHa ? parseFloat(recipe.costPerHa).toFixed(3) : "N/A"}</p>
        <p><strong>Litros por Hectárea:</strong> ${ltsXHa} lts/ha</p>
      `;
    } else if (type === "per_t") {
      title = "Productos por Tancada";
      products = recipe.recipe?.[0]?.products_per_tank;
      const litersPerTank = recipe.recipe?.[0]?.liters_per_tank ? parseFloat(recipe.recipe[0].liters_per_tank).toFixed(3) : "N/A";
      const tanks = recipe.recipe?.[0]?.tanks ? Math.round(parseFloat(recipe.recipe[0].tanks)) : "N/A";
      extraInfo = `
        <p><strong>Cantidad de Tancadas:</strong> ${tanks}</p>
        <p><strong>Litros por Tanque:</strong> ${litersPerTank} lts</p>
        <p><strong>Litros por Hectárea:</strong> ${ltsXHa} lts/ha</p>
      `;
    } else if (type === "per_ha") {
      title = "Productos por Hectárea";
      products = recipe.recipe?.[0]?.products_per_ha;
    } else {
      console.error("Tipo desconocido:", type);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Tipo de productos no válido",
        confirmButtonText: "Cerrar",
      });
      return;
    }

    // Validar que products sea un array
    if (!Array.isArray(products) || products.length === 0) {
      console.error("Products no es un array válido:", products, "para tipo:", type);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `No se encontraron productos para ${title}`,
        confirmButtonText: "Cerrar",
      });
      return;
    }

    const html = `
      ${extraInfo}
      <table style="width:100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Producto</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Cantidad</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Unidad</th>
          </tr>
        </thead>
        <tbody>
          ${products
            .map(
              (p) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${p.product?.name || "N/A"}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${p.quantity ? parseFloat(p.quantity).toFixed(3) : "N/A"}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${p.unit || "N/A"}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;

    Swal.fire({
      title: title,
      html: html,
      confirmButtonText: "Cerrar",
    });
  };


  // Función para eliminar una receta
  window.deleteRecipe = function (recipeId) {
    if (!recipeId || typeof recipeId !== "string") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID de receta inválido",
        confirmButtonText: "OK",
      });
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la receta permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/recipes/${recipeId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          credentials: "include",
        })
          .then((response) => {
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
              return response.text().then((text) => {
                console.error("Respuesta no JSON:", text.substring(0, 100)); // Mostrar primeros 100 caracteres
                if (text.startsWith("<!DOCTYPE")) {
                  Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Respuesta inesperada del servidor. Por favor, intenta de nuevo.",
                    confirmButtonText: "OK",
                  });
                  throw new Error("Respuesta HTML detectada");
                }
                throw new Error("Respuesta no es JSON válida");
              });
            }
            return response.json();
          })
          .then((data) => {
            if (data.success) {
              Swal.fire({
                icon: "success",
                title: "¡Eliminada!",
                text: data.message,
                confirmButtonText: "OK",
              })
              window.location.reload()
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: data.message || "Error al eliminar la receta",
                confirmButtonText: "OK",
              });
            }
          })
          .catch((error) => {
            console.error("Error en deleteRecipe:", error.message, error.stack);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: `Error al eliminar la receta: ${error.message}`,
              confirmButtonText: "OK",
            });
          });
      }
    });
  };
});