import { UserModel } from '../models/userModel';
import { ContactsModel } from '../models/ContactsModel';
import { PaymentModel } from '../models/PaymentModel';

async function initializeDatabase() {
    try {
        const userModel = new UserModel();
        const contactsModel = new ContactsModel();
        const paymentModel = new PaymentModel();
        
        console.log('Base de datos inicializada correctamente');
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
    }
}

initializeDatabase();