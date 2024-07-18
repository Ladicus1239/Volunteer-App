class PricingModule {
    constructor() {
        this.prices = {};
    }

    setPrice(item, price) {
        this.prices[item] = price;
    }

    getPrice(item) {
        return this.prices[item];
    }

    removePrice(item) {
        delete this.prices[item];
    }

    calculateTotal(items) {
        return items.reduce((total, { item, quantity }) => {
            const price = this.getPrice(item);
            if (price !== undefined) {
                return total + (price * quantity);
            } else {
                console.warn(`Price for item '${item}' is not set.`);
                return total;
            }
        }, 0);
    }
}

export default PricingModule;