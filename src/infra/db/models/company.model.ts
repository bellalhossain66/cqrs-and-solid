import {
    Model,
    DataTypes,
    Optional,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
} from 'sequelize';
import sequelize from '../../../shared/config/db.config';

export interface CompanyAttributes {
    id: number;
    created_at?: Date | null;
    updated_at?: Date | null;
    deleted_at?: Date | null;
    name: string;
    slug?: string | null;
    subdomain?: string | null;
    logo: string;
    cover: string;
    active: number;
    lat?: string | null;
    lng?: string | null;
    address?: string | null;
    phone?: string | null;
    minimum: string;
    description: string;
    fee: number;
    static_fee: number;
    is_featured: number;
    views: number;
    whatsapp_phone: string;
    do_covertion: number;
    currency?: string | null;
    payment_info?: string | null;
    mollie_payment_key?: string | null;
    user_id?: number | null;
}

export type CompanyCreationAttributes = Optional<
    CompanyAttributes,
    | 'id'
    | 'created_at'
    | 'updated_at'
    | 'deleted_at'
    | 'slug'
    | 'subdomain'
    | 'lat'
    | 'lng'
    | 'address'
    | 'phone'
    | 'currency'
    | 'payment_info'
    | 'mollie_payment_key'
    | 'user_id'
>;

class Company extends Model<
    InferAttributes<Company>,
    InferCreationAttributes<Company>
> implements CompanyAttributes {
    declare id: CreationOptional<number>;
    declare created_at: Date | null;
    declare updated_at: Date | null;
    declare deleted_at: Date | null;
    declare name: string;
    declare slug: string | null;
    declare subdomain: string | null;
    declare logo: string;
    declare cover: string;
    declare active: number;
    declare lat: string | null;
    declare lng: string | null;
    declare address: string | null;
    declare phone: string | null;
    declare minimum: string;
    declare description: string;
    declare fee: number;
    declare static_fee: number;
    declare is_featured: number;
    declare views: number;
    declare whatsapp_phone: string;
    declare do_covertion: number;
    declare currency: string | null;
    declare payment_info: string | null;
    declare mollie_payment_key: string | null;
    declare user_id: number | null;
}

Company.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING(191),
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING(191),
            allowNull: true,
            unique: true,
        },
        subdomain: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        logo: {
            type: DataTypes.STRING(191),
            allowNull: false,
            defaultValue: '',
        },
        cover: {
            type: DataTypes.STRING(191),
            allowNull: false,
            defaultValue: '',
        },
        active: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1,
        },
        lat: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        lng: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        minimum: {
            type: DataTypes.STRING(191),
            allowNull: false,
            defaultValue: '0',
        },
        description: {
            type: DataTypes.STRING(500),
            allowNull: false,
            defaultValue: '',
        },
        fee: {
            type: DataTypes.DOUBLE(8, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        static_fee: {
            type: DataTypes.DOUBLE(8, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        is_featured: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0,
        },
        views: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        whatsapp_phone: {
            type: DataTypes.STRING(191),
            allowNull: false,
            defaultValue: '',
        },
        do_covertion: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        currency: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        payment_info: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        mollie_payment_key: {
            type: DataTypes.STRING(191),
            allowNull: true,
        },
        user_id: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'companies',
        timestamps: false,
        paranoid: true,
    }
);

export default Company;
export type CompanyType = InstanceType<typeof Company>;