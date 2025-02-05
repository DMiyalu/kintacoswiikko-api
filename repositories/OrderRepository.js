const Order = require('../models/Order');

class OrderRepository {
    constructor(provider) {
        this.provider = provider;
    }

    async create(orderData) {
        const order = new Order(orderData);
        order.validate();
        
        const savedOrder = await this.provider.create(order.toJSON());
        return new Order({ id: savedOrder.id, ...savedOrder });
    }

    async findById(id) {
        const order = await this.provider.findById(id);
        return order ? new Order({ id, ...order }) : null;
    }

    async findAll(filters = {}) {
        const orders = await this.provider.findAll(filters);
        return orders.map(order => new Order({ id: order.id, ...order }));
    }

    async update(id, orderData) {
        const existingOrder = await this.findById(id);
        if (!existingOrder) {
            throw new Error('Commande non trouvée');
        }

        const updatedOrder = new Order({
            ...existingOrder,
            ...orderData,
            id
        });
        updatedOrder.validate();

        await this.provider.update(id, updatedOrder.toJSON());
        return updatedOrder;
    }

    async updateStatus(id, status) {
        const existingOrder = await this.findById(id);
        if (!existingOrder) {
            throw new Error('Commande non trouvée');
        }

        existingOrder.status = status;
        await this.provider.update(id, existingOrder.toJSON());
        return existingOrder;
    }

    async delete(id) {
        const order = await this.findById(id);
        if (!order) {
            throw new Error('Commande non trouvée');
        }

        await this.provider.delete(id);
        return true;
    }
}

module.exports = OrderRepository;
