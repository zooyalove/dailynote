import mongoose from 'mongoose';

module.exports = (function() {
    mongoose.Promise = global.Promise;
    
    return {
        connect () {
            mongoose.connect('mongodb://localhost/zyapp', {
                useMongoClient: true
            }).then(
                () => {
                    console.log('Successfully connected to mongodb');
                }
            ).catch(e => {
                console.error(e);
            });
        }
    };
})();