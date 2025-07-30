import {
    Model,
    DataTypes,
    Optional,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import sequelize from '../../../shared/config/db.config';

export interface CompanyCustomerMessageAttributes {
    id: number;
    conversation_id: string;
    customer_id: number | null;
    agent_id: number | null;
    sender_type: 'user' | 'agent';
    message?: string;
    message_type?: 'text' | 'image' | 'video' | 'file' | 'system';
    message_status?: 'sent' | 'delivered' | 'read' | 'failed';
    sent_at?: Date | null;
    created_at?: Date | null;
    updated_at?: Date | null;
}

export type CompanyCustomerMessageCreationAttributes = Optional<
    CompanyCustomerMessageAttributes,
    'id' | 'message' | 'message_type' | 'message_status' | 'sent_at' | 'created_at' | 'updated_at'
>;

class CompanyCustomerMessage extends Model<
    InferAttributes<CompanyCustomerMessage>,
    InferCreationAttributes<CompanyCustomerMessage>
> implements CompanyCustomerMessageAttributes {
    declare id: CreationOptional<number>;
    declare conversation_id: string;
    declare customer_id: number | null;
    declare agent_id: number | null;
    declare sender_type: 'user' | 'agent';
    declare message: string;
    declare message_type: 'text' | 'image' | 'video' | 'file' | 'system';
    declare message_status: 'sent' | 'delivered' | 'read' | 'failed';
    declare sent_at: Date | null;
    declare created_at: Date | null;
    declare updated_at: Date | null;
}

CompanyCustomerMessage.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        conversation_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        customer_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
        },
        agent_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
        },
        sender_type: {
            type: DataTypes.ENUM('user', 'agent'),
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        message_type: {
            type: DataTypes.ENUM('text', 'image', 'video', 'file', 'system'),
            allowNull: false,
            defaultValue: 'text',
        },
        message_status: {
            type: DataTypes.ENUM('sent', 'delivered', 'read', 'failed'),
            allowNull: false,
            defaultValue: 'sent',
        },
        sent_at: {
            type: DataTypes.DATE,
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
        tableName: 'cr_company_customer_messages',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    }
);

export default CompanyCustomerMessage;
export type CompanyCustomerMessageType = InstanceType<typeof CompanyCustomerMessage>;