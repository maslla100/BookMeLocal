const { Model, DataTypes } = require('sequelize');
const bcryptjs = require('bcryptjs');

module.exports = (sequelize) => {
    class User extends Model {
        // Instance method to validate password
        validPassword(password) {
            return bcryptjs.compareSync(password, this.password);
        }
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('admin', 'owner', 'customer'),
            defaultValue: 'customer'
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'Users',  // Explicitly specifying the table name
        timestamps: true,
        paranoid: true,
        hooks: {
            beforeCreate: async (user) => {
                user.email = user.email.toLowerCase();
                const salt = await bcryptjs.genSalt(8);
                user.password = await bcryptjs.hash(user.password, salt);
            },
            beforeUpdate: async (user) => {
                if (user.changed('email')) {
                    user.email = user.email.toLowerCase();
                }
                if (user.changed('password')) {
                    const salt = await bcryptjs.genSalt(8);
                    user.password = await bcryptjs.hash(user.password, salt);
                }
            }
        }
    });

    return User;
};
