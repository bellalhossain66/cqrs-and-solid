import {
    Model,
    DataTypes,
    Optional,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import sequelize from '../../../shared/config/db.config';

export interface CompanyCustomerLogAttributes {
    id: number;
    action_by?: number | null;
    action_by_type?: 'user' | 'agent' | null;
    action?: string | null;
    meta?: object | null;
    created_at?: Date | null;
}

export type CompanyCustomerLogCreationAttributes = Optional<
    CompanyCustomerLogAttributes,
    'id' | 'action_by' | 'action_by_type' | 'action' | 'meta' | 'created_at'
>;

class CompanyCustomerLog extends Model<
    InferAttributes<CompanyCustomerLog>,
    InferCreationAttributes<CompanyCustomerLog>
> implements CompanyCustomerLogAttributes {
    declare id: CreationOptional<number>;
    declare action_by: number | null;
    declare action_by_type: 'user' | 'agent' | null;
    declare action: string | null;
    declare meta: object | null;
    declare created_at: Date | null;
}

CompanyCustomerLog.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        action_by: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
        },
        action_by_type: {
            type: DataTypes.ENUM('user', 'agent'),
            allowNull: true,
        },
        action: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        meta: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'cr_company_customers_logs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        underscored: true,
    }
);

export default CompanyCustomerLog;
export type CompanyCustomerLogType = InstanceType<typeof CompanyCustomerLog>;