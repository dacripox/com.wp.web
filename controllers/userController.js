
var request = require('request-promise');
/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {
    /**
     * userController.createUserId()
     */
    createUserId: () => {
        var length = 10;
        function randomIntFromInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }
        var token = "";
        var codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        codeAlphabet += "abcdefghijklmnopqrstuvwxyz";
        codeAlphabet += "0123456789";
        for (var i = 0; i < length; i++) {
            token += codeAlphabet.charAt(randomIntFromInterval(0, codeAlphabet.length));
        }
        return token;
    },

    /**
     * userController.updateProfile()
     */
    updateProfile: (req, res) => {

    },
    /**
   * userController.updateProfileSettings()
   */
    updateProfileSettings: (req, res) => {

    },

    /**
    * userController.enablePushForUser()
    */
    enablePushForUser: async function (req, res) {
        let userId = req.params.userId;
        let onesignalId = req.query.onesignalId;
        let promoId = req.query.promoId;
        console.log('Enabling push notification for userId: ' + userId);


        var formData = {
            "onesignalId": onesignalId,
            "hasPushEnabled": true
        };

        try {
            let user = await request.get({ url: 'http://localhost:3000/user/id/' + userId })
            let userJSON = JSON.parse(user);

            let response = await request.put({ url: 'http://localhost:3000/user/' + userJSON._id, form: formData });
            let incrementPoints = await request.post({ url: 'http://localhost:3000/increment-points/user/' + userId + '/promotion/' + promoId + '/points/' + 10 })

            console.log('User succesfully updated  (onsesgnalId): ' + response + '. Increment points: '+incrementPoints);

            return response;
        } catch (error) {
            console.log('REQ. ERROR: When updating user (onsesgnalId): ' + error);
        }


    }


}
