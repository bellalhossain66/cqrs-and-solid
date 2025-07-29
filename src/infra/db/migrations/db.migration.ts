import sequelizeDB from "../../../shared/config/db.config";
require('../models/message.model');
require('../models/conversation.model');

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