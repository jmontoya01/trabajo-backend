const socket = io();

socket.on("products", (data) => {
    renderProducts(data);
});


//mostrar productos
const renderProducts = (products) => {
    const containerProducts = document.getElementById("containerProducts");
    containerProducts.innerHTML = "";

    products.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
        <p>Id ${item.id} </p>
                <p>Titulo ${item.title} </p>
                <p>Precio ${item.price} </p>
                <button> Eliminar Producto </button>
        `;
        containerProducts.appendChild(card);
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item.id);
        });
    });
};

//eliminar productos
const deleteProduct = (id) => {
    socket.emit("deleteProduct", id);
};

//agregar productos
document.getElementById("btnSend").addEventListener("click", () => {
    addProduct();
});

const addProduct = () => {

    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true"
    };
    socket.emit("addProduct", product);
};

//chat
let user
const chatBox = document.getElementById("chatBox")

Swal.fire({
    title: "Como te llamas?",
    input: "text",
    text: "Ingresa nombre de usuario que se mostrara en el chat",
    inputValidator: (value) => {
        return !value && "Necesita ingresar un nombre para continuar"
    },
    allowOutsideClick: false,
}).then( result => {
    user = result.value
})

chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) {
            socket.emit("messages", {user: user, message: chatBox.value})
            chatBox.value = ""
        }
    }
})

//Listener de mensajes

socket.on("messages", data => {
    let log = document.getElementById("messagesLogs")
    let messagesUser = ""

    data.forEach( message =>{
        messagesUser = messagesUser + `${message.user} dice: ${message.message} <br>`
    })

    log.innerHTML = messagesUser
})