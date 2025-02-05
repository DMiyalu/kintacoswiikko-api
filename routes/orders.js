const express = require('express');
const router = express.Router();
const OrderRepository = require('../repositories/OrderRepository');
const FirebaseOrderProvider = require('../providers/FirebaseOrderProvider');

// Initialisation du repository avec le provider Firebase
const orderRepository = new OrderRepository(new FirebaseOrderProvider());

// Route POST pour créer une nouvelle commande
router.post('/', async (req, res) => {
    try {
        const order = await orderRepository.create(req.body);
        res.status(201).json({ 
            message: 'Commande créée avec succès',
            order: order.toJSON()
        });
    } catch (error) {
        console.error('Erreur lors de la création de la commande:', error);
        res.status(400).json({ 
            error: error.message || 'Erreur lors de la création de la commande'
        });
    }
});

// Route GET pour récupérer toutes les commandes
router.get('/', async (req, res) => {
    try {
        const filters = {
            status: req.query.status,
            deliveryOption: req.query.deliveryOption,
            startDate: req.query.startDate,
            endDate: req.query.endDate
        };

        const orders = await orderRepository.findAll(filters);
        res.json(orders.map(order => order.toJSON()));
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération des commandes'
        });
    }
});

// Route GET pour récupérer une commande par son ID
router.get('/:id', async (req, res) => {
    try {
        const order = await orderRepository.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Commande non trouvée' });
        }
        res.json(order.toJSON());
    } catch (error) {
        console.error('Erreur lors de la récupération de la commande:', error);
        res.status(500).json({ 
            error: 'Erreur lors de la récupération de la commande'
        });
    }
});

// Route PATCH pour mettre à jour le statut d'une commande
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: 'Le statut est requis' });
        }

        const order = await orderRepository.updateStatus(req.params.id, status);
        res.json(order.toJSON());
    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        res.status(error.message.includes('non trouvée') ? 404 : 500).json({ 
            error: error.message || 'Erreur lors de la mise à jour du statut'
        });
    }
});

// Route PUT pour mettre à jour une commande
router.put('/:id', async (req, res) => {
    try {
        const order = await orderRepository.update(req.params.id, req.body);
        res.json(order.toJSON());
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la commande:', error);
        res.status(error.message.includes('non trouvée') ? 404 : 400).json({ 
            error: error.message || 'Erreur lors de la mise à jour de la commande'
        });
    }
});

// Route DELETE pour supprimer une commande
router.delete('/:id', async (req, res) => {
    try {
        await orderRepository.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Erreur lors de la suppression de la commande:', error);
        res.status(error.message.includes('non trouvée') ? 404 : 500).json({ 
            error: error.message || 'Erreur lors de la suppression de la commande'
        });
    }
});

module.exports = router;
