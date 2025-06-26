
const showPass = document.getElementById("showPass")
const passInput = document.getElementById("passInput")

showPass.addEventListener("change", function() {
    if (this.checked) {
        passInput.type = "text"
    } else {
        passInput.type = "password"
    }
})

//Manejo de errores del login
const inputErrors = document.querySelectorAll("input-error")
const inputs = document.querySelectorAll(".input")

const loginErrors = [
    "Ingrese un usuario y una contraseña",
    "Ingrese un email",
    "Ingrese una contraseña",
    "El usuario o la contraseña son incorrectos",
    "El usuario no se encontro",
]


const handleInputsError = (input) => {
    input.style.border = '.1rem solid var(--clr-red)'
    input.nextElementSibling.style.color = 'var(--clr-red)'
    input.nextElementSibling.nextElementSibling.innerHTML = '<img src="../assets/images/png/ios-exclamation-mark-icon.png" alt="iOs exclamation mark icon">'
}

loginErrors.forEach(error => {
    inputErrors.forEach(inputError => {
        const errorText = inputError.innerText
        if (errorText === error) {
            handleInputsError(inputError.parentElement.querySelector('.input'))
        }
    })
})