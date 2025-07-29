import {
    Model,
    DataTypes,
    Optional,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import sequelizeDB from '../../../shared/config/db.config';

export interface MessageAttributes {
    id: number;
    conversationId: string;
    senderId: number;
    senderPhone: string;
    senderType: 'user' | 'agent';
    content: string;
    created_at?: Date;
    updated_at?: Date;
}

type MessageCreationAttributes = Optional<MessageAttributes, 'id' | 'created_at'>;

class Message
    extends Model<InferAttributes<Message>, InferCreationAttributes<Message>>
    implements MessageAttributes {
    declare id: CreationOptional<number>;
    declare conversationId: string;
    declare senderId: number;
    declare senderPhone: string;
    declare senderType: 'user' | 'agent';
    declare content: string;
    declare created_at?: Date;
    declare updated_at?: Date;
}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        conversationId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        senderId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        senderPhone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        senderType: {
            type: DataTypes.ENUM('user', 'agent'),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize: sequelizeDB,
        tableName: 'messages',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default Message;
export type MessageType = InstanceType<typeof Message>;