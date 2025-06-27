document.addEventListener("DOMContentLoaded", () => {
  // Obtener datos desde el elemento script
  const recipeDataElement = document.getElementById("recipe-data");
  const { fields, products } = JSON.parse(recipeDataElement.textContent);

  // Manejar selección de lote
  const fieldSelect = document.getElementById("field");
  const fieldFarmname = document.getElementById("fieldFarmname");
  const fieldHa = document.getElementById("fieldHa");

  fieldSelect.addEventListener("change", () => {
    const selectedFieldId = fieldSelect.value;
    const field = fields.find((f) => f._id === selectedFieldId);
    if (field) {
      fieldFarmname.textContent = `Dueño: ${field.farmname}`;
      fieldHa.value = field.ha; // Asignar valor inicial al input
      updateTanks();
      updateCosts();
    } else {
      fieldFarmname.textContent = "";
      fieldHa.textContent = "";
    }
  });

  // Actualizar cálculos cuando cambie el input de hectáreas
  fieldHa.addEventListener("input", () => {
    updateTanks();
    updateCosts();
    document.querySelectorAll("#productsContainer .form-group").forEach(updateUnitAndTotal);
  });

  // Calcular tancadas
  const maxTankInput = document.getElementById("maxTank");
  const ltsXHaInput = document.getElementById("lts_x_ha");
  const tanksSpan = document.getElementById("tanks");

  function updateTanks() {
    const ha = parseFloat(fieldHa.value) || 0;
    const maxTank = parseFloat(maxTankInput.value) || 0;
    const ltsXHa = parseFloat(ltsXHaInput.value) || 0;
    if (ha && maxTank && ltsXHa) {
      const totalLiters = ltsXHa * ha;
      const tanks = Math.ceil(totalLiters / maxTank);
      tanksSpan.textContent = `${tanks} (cada una de ${(totalLiters / tanks).toFixed(2)} litros)`;
    } else {
      tanksSpan.textContent = "";
    }
  }

  maxTankInput.addEventListener("input", updateTanks);
  ltsXHaInput.addEventListener("input", updateTanks);

  // Generar inputs de productos dinámicamente
  const numProductsSelect = document.getElementById("numProducts");
  const productsContainer = document.getElementById("productsContainer");

  numProductsSelect.addEventListener("change", () => {
    const num = parseInt(numProductsSelect.value) || 0;
    productsContainer.innerHTML = "";
    for (let i = 0; i < num; i++) {
      const div = document.createElement("div");
      div.className = "form-group";
      div.innerHTML = `
        <label>Producto ${i + 1}:</label>
        <select name="products_per_ha[${i}][product]" required>
          <option value="" disabled selected>Seleccionar producto</option>
          ${products
            .map(
              (p) =>
                `<option value="${p._id}" data-type="${p.type}" data-price="${p.price}">${p.name}</option>`
            )
            .join("")}
        </select>
        <input type="number" name="products_per_ha[${i}][quantity]" placeholder="Cantidad por ha" step="0.001" pattern="[0-9]+([.][0-9]{1,3})?" required>
        <span class="unit"></span>
        <span class="total">Total: 0</span>
      `;
      productsContainer.appendChild(div);
      div.querySelector("select").addEventListener("change", updateUnitAndTotal);
      div.querySelector("input").addEventListener("input", updateUnitAndTotal);
    }
    updateCosts();
  });

  function updateUnitAndTotal(event) {
    const container = event.target.closest(".form-group");
    const select = container.querySelector("select");
    const quantityInput = container.querySelector("input");
    const unitSpan = container.querySelector(".unit");
    const totalSpan = container.querySelector(".total");
    const ha = parseFloat(fieldHa.value) || 0;
    const selectedOption = select.selectedOptions[0];
    if (selectedOption && selectedOption.dataset.type) {
      unitSpan.textContent = selectedOption.dataset.type;
    } else {
      unitSpan.textContent = "";
    }
    const quantity = parseFloat(quantityInput.value) || 0;
    totalSpan.textContent = `Total: ${(quantity * ha).toFixed(3)}`;
    updateCosts();
  }

  // Calcular costos
  const totalCostSpan = document.getElementById("totalCost");
  const costPerHaSpan = document.getElementById("costPerHa");
  const totalCostInput = document.getElementById("totalCostInput");
  const costPerHaInput = document.getElementById("costPerHaInput");

  function updateCosts() {
    const ha = parseFloat(fieldHa.value) || 0;
    let totalCost = 0;
    document.querySelectorAll("#productsContainer .form-group").forEach((container) => {
      const select = container.querySelector("select");
      const quantityInput = container.querySelector("input");
      const quantity = parseFloat(quantityInput.value) || 0;
      const selectedOption = select.selectedOptions[0];
      const price = parseFloat(selectedOption?.dataset.price) || 0;
      totalCost += quantity * ha * price;
    });
    totalCostSpan.textContent = totalCost.toFixed(3);
    totalCostInput.value = totalCost.toFixed(3);
    const costPerHa = ha ? (totalCost / ha).toFixed(3) : 0;
    costPerHaSpan.textContent = costPerHa;
    costPerHaInput.value = costPerHa;
  }

})