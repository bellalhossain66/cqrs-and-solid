import {
    Model,
    DataTypes,
    Optional,
    CreationOptional,
    InferAttributes,
    InferCreationAttributes,
} from 'sequelize';
import sequelize from '../../../shared/config/db.config';

export interface CompanyCustomerConversationAttributes {
    id: number;
    conversationId: string;
    company_id: number;
    customer_id: number;
    agent_id: number | null;
    is_active?: number;
    created_at?: Date;
    updated_at?: Date;
}

export type CompanyCustomerConversationCreationAttributes = Optional<
    CompanyCustomerConversationAttributes,
    'id' | 'is_active' | 'created_at' | 'updated_at'
>;

class CompanyCustomerConversation extends Model<
    InferAttributes<CompanyCustomerConversation>,
    InferCreationAttributes<CompanyCustomerConversation>
> implements CompanyCustomerConversationAttributes {
    declare id: CreationOptional<number>;
    declare conversationId: string;
    declare company_id: number;
    declare customer_id: number;
    declare agent_id: number | null;
    declare is_active: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

CompanyCustomerConversation.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        conversationId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        company_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        customer_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        agent_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
            defaultValue: null
        },
        is_active: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
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
        tableName: 'cr_company_customer_conversations',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    }
);

export default CompanyCustomerConversation;
export type CompanyCustomerConversationType = InstanceType<typeof CompanyCustomerConversation>;