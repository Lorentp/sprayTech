const newProductButton = document.getElementById("newProductButton");
const newFieldButton = document.getElementById("newFieldButton");

const newProductForm = document.getElementById("newProductForm");
const newFieldForm = document.getElementById("newFieldForm");

function showOrHideElement(e) {
  if (e.classList.contains("hidden")) {
    e.classList.remove("hidden");
    /*window.scroll({
      top: document.body.scrollHeight * (40 / 100),
      behavior: "smooth",
    });*/
  } else {
    e.classList.add("hidden");
  }
}

function activeButton(button) {
  button.classList.toggle("active");
}

newProductButton.addEventListener("click", function () {
  showOrHideElement(newProductForm);
  activeButton(this);
});

newFieldButton.addEventListener("click", function () {
  showOrHideElement(newFieldForm);
  activeButton(this);
});
