class Order {
    constructor({
        id = null,
        firstName,
        lastName,
        phone,
        whatsapp,
        orderDescription,
        deliveryOption,
        address,
        city,
        commune,
        additionalInfo = '',
        status = 'pending',
        createdAt = new Date().toISOString()
    }) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.whatsapp = whatsapp;
        this.orderDescription = orderDescription;
        this.deliveryOption = deliveryOption;
        this.address = address;
        this.city = city;
        this.commune = commune;
        this.additionalInfo = additionalInfo;
        this.status = status;
        this.createdAt = createdAt;
    }

    validate() {
        const requiredFields = [
            'firstName',
            'lastName',
            'phone',
            'whatsapp',
            'orderDescription',
            'deliveryOption'
        ];

        const missingFields = requiredFields.filter(field => !this[field]);

        if (missingFields.length > 0) {
            throw new Error(`Champs requis manquants: ${missingFields.join(', ')}`);
        }

        if (this.deliveryOption === 'delivery') {
            const requiredDeliveryFields = ['address', 'city', 'commune'];
            const missingDeliveryFields = requiredDeliveryFields.filter(field => !this[field]);

            if (missingDeliveryFields.length > 0) {
                throw new Error(`Champs de livraison requis manquants: ${missingDeliveryFields.join(', ')}`);
            }
        }

        if (!this.validatePhoneNumber(this.phone)) {
            throw new Error('Le numéro de téléphone est invalide');
        }

        if (!this.validatePhoneNumber(this.whatsapp)) {
            throw new Error('Le numéro WhatsApp est invalide');
        }
    }

    validatePhoneNumber(number) {
        const phoneNumber = number.replace(/\D/g, '');
        return phoneNumber.length === 9 && phoneNumber[0] !== '0';
    }

    toJSON() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            phone: this.phone,
            whatsapp: this.whatsapp,
            orderDescription: this.orderDescription,
            deliveryOption: this.deliveryOption,
            address: this.address,
            city: this.city,
            commune: this.commune,
            additionalInfo: this.additionalInfo,
            status: this.status,
            createdAt: this.createdAt
        };
    }
}

module.exports = Order;
