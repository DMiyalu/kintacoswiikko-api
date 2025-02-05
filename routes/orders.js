const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase-config');

// Route POST pour créer une nouvelle commande
router.post('/', async (req, res) => {
    try {
        const orderData = {
            ...req.body,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        // Validation des données requises
        const requiredFields = [
            'firstName',
            'lastName',
            'phone',
            'whatsapp',
            'orderDescription',
            'deliveryOption'
        ];

        const missingFields = requiredFields.filter(field => !orderData[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Champs requis manquants: ${missingFields.join(', ')}`
            });
        }

        // Validation supplémentaire pour l'adresse si livraison
        if (orderData.deliveryOption === 'delivery') {
            const requiredDeliveryFields = ['address', 'city', 'commune'];
            const missingDeliveryFields = requiredDeliveryFields.filter(field => !orderData[field]);

            if (missingDeliveryFields.length > 0) {
                return res.status(400).json({
                    error: `Champs de livraison requis manquants: ${missingDeliveryFields.join(', ')}`
                });
            }
        }

        // Validation du numéro de téléphone
        const validatePhoneNumber = (number) => {
            const phoneNumber = number.replace(/\D/g, '');
            return phoneNumber.length === 9 && phoneNumber[0] !== '0';
        };

        if (!validatePhoneNumber(orderData.phone)) {
            return res.status(400).json({
                error: 'Le numéro de téléphone est invalide'
            });
        }

        if (!validatePhoneNumber(orderData.whatsapp)) {
            return res.status(400).json({
                error: 'Le numéro WhatsApp est invalide'
            });
        }

        // Ajouter la commande à Firebase
        const orderRef = await db.collection('orders').add(orderData);
        
        res.status(201).json({ 
            message: 'Commande créée avec succès',
            orderId: orderRef.id,
            order: {
                id: orderRef.id,
                ...orderData
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
