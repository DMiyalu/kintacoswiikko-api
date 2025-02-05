const express = require('express');
const router = express.Router();
const OrderRepository = require('../repositories/OrderRepository');
const FirebaseOrderProvider = require('../providers/FirebaseOrderProvider');

// Initialisation du repository avec le provider Firebase
const orderRepository = new OrderRepository(new FirebaseOrderProvider());

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Créer une nouvelle commande
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Commande créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Récupérer toutes les commandes
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrer par statut
 *       - in: query
 *         name: deliveryOption
 *         schema:
 *           type: string
 *         description: Filtrer par option de livraison
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de début
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Date de fin
 *     responses:
 *       200:
 *         description: Liste des commandes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
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

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Récupérer une commande par son ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     responses:
 *       200:
 *         description: Commande trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée
 */
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

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'une commande
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, ready, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée
 */
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

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Mettre à jour une commande
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Commande mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Commande non trouvée
 */
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

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Supprimer une commande
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la commande
 *     responses:
 *       204:
 *         description: Commande supprimée
 *       404:
 *         description: Commande non trouvée
 */
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
