const socket = io();
const role = document.getElementById("role").textContent;
const email = document.getElementById("email").textContent;

socket.on("products", (data) => {
    renderProducts(data);
});


//mostrar productos
const renderProducts = (products) => {
    const containerProducts = document.getElementById("containerProducts");
    
    containerProducts.innerHTML = "";

    products.docs.forEach(item => {
        const card = document.createElement("div");

        card.innerHTML = `
                <div class="user-card">
                    <p class="card-header">Titulo: ${item.title} </p>
                    <div class="card-body">
                        <p> <strong>ID:</strong> ${item._id} </p>
                        <p> <strong>Precio:</strong> ${item.price} </p>
                        <button class="btn"> Eliminar Producto </button>
                    </div>
                </div>
        `;
        containerProducts.appendChild(card);
        card.querySelector("button").addEventListener("click", () => {
            if (role === "premium" && item.owner === email) {
                deleteProduct(item._id);
            } else if( role === "admin") {
                deleteProduct(item._id);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: "No tiene los permisos para borrar ese producto"
                });
            };
            
        });
    });
};

//eliminar productos
const deleteProduct = (_id) => {
    socket.emit("deleteProduct", _id);
};

//agregar productos
document.getElementById("btnSend").addEventListener("click", () => {
    addProduct();
});

const addProduct = () => {
    const role = document.getElementById("role").textContent
    const email = document.getElementById("email").textContent

    const owner = role === "premium" ? email : "admin";
    
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
        owner
    };
    socket.emit("addProduct", product);
};

