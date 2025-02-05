const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'KinTacosWiikko API',
            version: '1.0.0',
            description: 'API de gestion des commandes pour KinTacosWiikko',
            contact: {
                name: 'Support KinTacosWiikko',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement',
            },
        ],
        components: {
            schemas: {
                Order: {
                    type: 'object',
                    required: [
                        'firstName',
                        'lastName',
                        'phone',
                        'whatsapp',
                        'orderDescription',
                        'deliveryOption'
                    ],
                    properties: {
                        id: {
                            type: 'string',
                            description: 'ID unique de la commande',
                            example: 'abc123'
                        },
                        firstName: {
                            type: 'string',
                            description: 'Prénom du client',
                            example: 'John'
                        },
                        lastName: {
                            type: 'string',
                            description: 'Nom du client',
                            example: 'Doe'
                        },
                        phone: {
                            type: 'string',
                            description: 'Numéro de téléphone (9 chiffres)',
                            example: '123456789'
                        },
                        whatsapp: {
                            type: 'string',
                            description: 'Numéro WhatsApp (9 chiffres)',
                            example: '123456789'
                        },
                        orderDescription: {
                            type: 'string',
                            description: 'Description de la commande',
                            example: '2 Tacos poulet, sauce algérienne'
                        },
                        deliveryOption: {
                            type: 'string',
                            enum: ['delivery', 'pickup'],
                            description: 'Option de livraison',
                            example: 'delivery'
                        },
                        address: {
                            type: 'string',
                            description: 'Adresse de livraison (requis si deliveryOption est "delivery")',
                            example: '123 Rue Example'
                        },
                        city: {
                            type: 'string',
                            description: 'Ville (requis si deliveryOption est "delivery")',
                            example: 'Kinshasa'
                        },
                        commune: {
                            type: 'string',
                            description: 'Commune (requis si deliveryOption est "delivery")',
                            example: 'Gombe'
                        },
                        additionalInfo: {
                            type: 'string',
                            description: 'Informations supplémentaires',
                            example: 'Sonner à l\'interphone'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
                            description: 'Statut de la commande',
                            example: 'pending'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date de création de la commande',
                            example: '2025-02-05T15:00:00.000Z'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Message d\'erreur'
                        }
                    }
                }
            }
        }
    },
    apis: ['./routes/*.js'], // Chemins des fichiers contenant la documentation
};

const specs = swaggerJsdoc(options);

module.exports = specs;
