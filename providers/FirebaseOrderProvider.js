const { db } = require('../config/firebase-config');

class FirebaseOrderProvider {
    constructor() {
        this.collection = 'orders';
    }

    async create(orderData) {
        const docRef = await db.collection(this.collection).add(orderData);
        const doc = await docRef.get();
        return {
            id: doc.id,
            ...doc.data()
        };
    }

    async findById(id) {
        const doc = await db.collection(this.collection).doc(id).get();
        if (!doc.exists) {
            return null;
        }
        return {
            id: doc.id,
            ...doc.data()
        };
    }

    async findAll(filters = {}) {
        let query = db.collection(this.collection);

        // Appliquer les filtres
        if (filters.status) {
            query = query.where('status', '==', filters.status);
        }
        if (filters.deliveryOption) {
            query = query.where('deliveryOption', '==', filters.deliveryOption);
        }
        if (filters.startDate) {
            query = query.where('createdAt', '>=', filters.startDate);
        }
        if (filters.endDate) {
            query = query.where('createdAt', '<=', filters.endDate);
        }

        // Trier par date de création (du plus récent au plus ancien)
        query = query.orderBy('createdAt', 'desc');

        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async update(id, orderData) {
        await db.collection(this.collection).doc(id).update(orderData);
        return this.findById(id);
    }

    async delete(id) {
        await db.collection(this.collection).doc(id).delete();
        return true;
    }
}

module.exports = FirebaseOrderProvider;
