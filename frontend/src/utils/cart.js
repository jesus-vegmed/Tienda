/**
 * Simple cart management using localStorage.
 */
export const cartManager = {
    get() {
        if (typeof window === 'undefined') return [];
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },
    add(product) {
        const cart = this.get();
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateBadge();
    },
    remove(id) {
        let cart = this.get();
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        this.updateBadge();
    },
    clear() {
        localStorage.removeItem('cart');
        this.updateBadge();
    },
    updateBadge() {
        if (typeof window === 'undefined') return;
        const count = this.get().reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.getElementById('cart-count');
        if (badge) badge.innerText = count.toString();
    }
};
