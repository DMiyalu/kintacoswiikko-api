const { db } = require('../config/firebase-config');
const { 
    collection, 
    addDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc,
    doc,
    query,
    where,
    orderBy
} = require('firebase/firestore');

class FirebaseOrderProvider {
    constructor() {
        this.collection = 'orders';
    }

    async create(orderData) {
        const ordersRef = collection(db, this.collection);
        const docRef = await addDoc(ordersRef, orderData);
        const docSnap = await getDoc(docRef);
        return {
            id: docRef.id,
            ...docSnap.data()
        };
    }

    async findById(id) {
        const docRef = doc(db, this.collection, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return {
            id: docSnap.id,
            ...docSnap.data()
        };
    }

    async findAll(filters = {}) {
        const ordersRef = collection(db, this.collection);
        let constraints = [];

        // Appliquer les filtres
        if (filters.status) {
            constraints.push(where('status', '==', filters.status));
        }
        if (filters.deliveryOption) {
            constraints.push(where('deliveryOption', '==', filters.deliveryOption));
        }
        if (filters.startDate) {
            constraints.push(where('createdAt', '>=', filters.startDate));
        }
        if (filters.endDate) {
            constraints.push(where('createdAt', '<=', filters.endDate));
        }

        // Trier par date de création (du plus récent au plus ancien)
        constraints.push(orderBy('createdAt', 'desc'));

        const q = query(ordersRef, ...constraints);
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    async update(id, orderData) {
        const docRef = doc(db, this.collection, id);
        await updateDoc(docRef, orderData);
        return this.findById(id);
    }

    async delete(id) {
        const docRef = doc(db, this.collection, id);
        await deleteDoc(docRef);
        return true;
    }
}

module.exports = FirebaseOrderProvider;
