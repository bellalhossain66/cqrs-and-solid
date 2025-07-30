import sequelizeDB from "../../../shared/config/db.config";
require('../models/company_customer.model');
require('../models/company_customer_conversation.model');
require('../models/company_customer_message.model');
require('../models/company_customers_log.model');

async function migration() {
    try {
        await sequelizeDB.authenticate();
        console.log('Connection OK');

        console.log('Models registered:', Object.keys(sequelizeDB.models));

        await sequelizeDB.sync({ alter: true });
        console.log('Sync complete');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelizeDB.close();
    }
}
migration();