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
    updateProfile: (req,res) => {
       
    },
      /**
     * userController.updateProfileSettings()
     */
    updateProfileSettings: (req,res) => {
      
    }


}
