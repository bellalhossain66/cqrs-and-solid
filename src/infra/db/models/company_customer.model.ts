import {
    Model,
    DataTypes,
    Optional,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import sequelizeDB from '../../../shared/config/db.config';
import Company from './company.model';

export interface CompanyCustomerAttributes {
    id: number;
    company_id: number;
    name: string | null;
    phone: string | null;
    email?: string | null;
    is_active?: number;
    created_at?: Date | null;
    updated_at?: Date | null;
}

export type CompanyCustomerCreationAttributes = Optional<
    CompanyCustomerAttributes,
    'id' | 'email' | 'is_active' | 'created_at' | 'updated_at'
>;

class CompanyCustomer extends Model<
    InferAttributes<CompanyCustomer>,
    InferCreationAttributes<CompanyCustomer>
> implements CompanyCustomerAttributes {
    declare id: CreationOptional<number>;
    declare company_id: number;
    declare name: string | null;
    declare phone: string | null;
    declare email: string | null;
    declare is_active: number;
    declare created_at: Date | null;
    declare updated_at: Date | null;
}

CompanyCustomer.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        company_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(110),
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: true,
            unique: true,
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
        sequelize: sequelizeDB,
        tableName: 'company_customers',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

CompanyCustomer.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

export default CompanyCustomer;
export type CompanyCustomerType = InstanceType<typeof CompanyCustomer>;