const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase-config');

// Route POST pour créer une nouvelle commande
router.post('/', async (req, res) => {
    try {
        const order = {
            ...req.body,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        // Validation des données requises
        if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
            return res.status(400).json({ 
                error: 'La commande doit contenir au moins un article' 
            });
        }

        // Ajouter la commande à Firebase
        const orderRef = await db.collection('orders').add(order);
        
        res.status(201).json({ 
            message: 'Commande créée avec succès',
            orderId: orderRef.id,
            order: {
                id: orderRef.id,
                ...order
            }
        });
    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la création de la commande' 
        });
    }
});

module.exports = router;
