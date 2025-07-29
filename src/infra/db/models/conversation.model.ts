import {
    Model,
    DataTypes,
    Optional,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import sequelize from '../../../shared/config/db.config';

export interface ConversationAttributes {
    id: number;
    conversationId: string;
    userId: number;
    user_phone?: string | null;
    user_email?: string | null;
    created_at?: Date | null;
    updated_at?: Date | null;
}

export type ConversationCreationAttributes = Optional<
    ConversationAttributes,
    'id' | 'user_phone' | 'user_email' | 'created_at' | 'updated_at'
>;

class Conversation extends Model<
    InferAttributes<Conversation>,
    InferCreationAttributes<Conversation>
> implements ConversationAttributes {
    declare id: CreationOptional<number>;
    declare conversationId: string;
    declare userId: number;
    declare user_phone: string | null;
    declare user_email: string | null;
    declare created_at: Date | null;
    declare updated_at: Date | null;
}

Conversation.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        conversationId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        user_phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'conversations',
        timestamps: false,
    }
);

export default Conversation;
export type ConversationType = InstanceType<typeof Conversation>;