const socket = io()
let user;
const chatBox = document.getElementById("chatBox");

Swal.fire({
    title: "Como te llamas?",
    input: "text",
    text: "Ingresa nombre de usuario que se mostrara en el chat",
    inputValidator: (value) => {
        return !value && "Necesita ingresar un nombre para continuar"
    },
    allowOutsideClick: false,
}).then( result => {
    user = result.value;
});

chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            socket.emit("messages", {user: user, message: chatBox.value});
            chatBox.value = "";
        };
    };
});

//Listener de mensajes

socket.on("messages", data => {
    let log = document.getElementById("messagesLogs");
    let messagesUser = "";

    data.forEach( message =>{
        messagesUser = messagesUser + `${message.user} dice: ${message.message} <br>`
    });

    log.innerHTML = messagesUser;
});