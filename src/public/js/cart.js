
function deletedProduct (cartId, productId) {
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al eliminar el producto del carrito de compras");
            }
            location.reload()
        })
        .catch(error => {
            console.error("error: ", error);
        });
};

function emptyCart(cartId) {
    fetch(`/api/carts/${cartId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al vaciar el carrito");
            }
            location.reload();
        })
        .catch(error => {
            console.error("error: ", error)
        });
};
