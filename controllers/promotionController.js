let handlebars = require('../handlers/handelbars-get-template.js');
let fetch = require('isomorphic-fetch');
var mobileDetect = require('mobile-detect');
var userController = require('./userController');

let getUser = (userId) => {

    fetch('http://localhost:3001/user/' + userId, {
        method: 'get'
    }).then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                console.log('Looks like there was a problem. Status Code: ' +
                    response);
                return;
            }

            // Examine the text in the response  
            response.json().then(function (data) {
                return data;
            });
        }
        ).catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
};

let getPromotion = (promoId) => {

    fetch('http://localhost:3001/promotion/' + promoId, {
        method: 'get'
    }).then(
        function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                console.log('Looks like there was a problem. Status Code: ' +
                    response);
                return;
            }

            // Examine the text in the response  
            response.json().then(function (data) {
                return data;
            });
        }
        ).catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
};



let isParticipating = (userId, promoId) => {
    fetch('http://localhost:3001/user/participates/' + userId + '/' + promoId, {
        method: 'get'
    }).then(
        function (response) {
            if (response.status !== 200) {
                return false;
            }
              // Examine the text in the response  
            response.json().then(function (data) {
                return data;
            });
        }
        ).catch(function (err) {
            console.log('Fetch Error :-S', err);
        });

};




/**
 * promotionController.js
 *
 * @description :: Server-side logic for managing promotions.
 */
module.exports = {
    /**
     * promotionController.showPromotion()
     */
    showPromotion: function (req, res) {
        var promoId = req.params.promoId;
        var refFriend = req.params.refFriend;

        //Increment refFriend user points 
        if (refFriend !== undefined) {

        }

        var userId = req.cookies.userId;


        //If user not set in Cookie, create one user and set to cookie
        if (userId == undefined) {
            let userId = userController.createUserId();
            res.cookie('userId', userId, { expires: new Date(Date.now() + 900000) });
        } {
            //If user already set in cookie, check if participating
            let participation = isParticipating();
            if(participation!==false){
                let user = getUser();
            }
        }

        console.log('Usuario: ' + userId);


        let promotion = getPromotion(promoId);

        let md = new mobileDetect(req.headers['user-agent']);
        if (md.is('bot')) {
            console.log('bot access');
        } else if (md.mobile() != null) {
            console.log('phone access');
        } else if (md.is('desktopmode')) {
            console.log('desktopmode access');
        } else {
            console.log('other device access');
        }

        //Mobile promotion
        res.render('mobile-version', { title: 'No title', promoId: promoId, refFriend: refFriend, userId: userId, winners: [{name: 'Maria', points:777, profileImg:'http://semantic-ui.com/images/avatar2/small/molly.png'}] });
    },
    /**
     * promotionController.participate()
     */
    doParticipate: function (req, res) {

    },

    /**
     * promotionController.showPromotion()
     */
    reportPromotion: function (req, res) {

    }










}
