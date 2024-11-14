import User from './user.model';
import Preferences from './workout-preference.model';

function setupAssociations(): void {
    User.hasOne(Preferences, {
        foreignKey: 'user_id',
        as: 'workoutPreference'
    });

    Preferences.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user'
    });
}

export {
    User,
    Preferences,
    setupAssociations
};