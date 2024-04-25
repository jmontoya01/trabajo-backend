const socket = io();

socket.on("products", (data) => {
    renderProducts(data);
});


//mostrar productos
const renderProducts = (products) => {
    const containerProducts = document.getElementById("containerProducts");
    containerProducts.innerHTML = "";

    products.docs.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
                <p>ID: ${item._id} </p>
                <p>Titulo ${item.title} </p>
                <p>Precio ${item.price} </p>
                <button class="btn"> Eliminar Producto </button>
        `;
        containerProducts.appendChild(card);
        card.querySelector("button").addEventListener("click", () => {
            deleteProduct(item._id);
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

