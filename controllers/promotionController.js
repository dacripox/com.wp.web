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

let getPromotion = async (promoId) => {
    try {
        let response = await fetch('http://localhost:3000/promotion/id/' + promoId, { method: 'get'});
        let data = await response.json();
        if (response.status !== 200) {
            return;
        }
        return data;
    } catch (error) {
        console.error('Fetch error. URL: '+url);
        console.error('Fetch error. STATUS: '+response.status);
        console.error(error);
    }
};


let isParticipating = async (userId, promoId) => {
    try{
        let response = await fetch('http://localhost:3001/user/participates/' + userId + '/' + promoId, { method: 'get' });
        let data = await response.json();
        if (response.status !== 200) {
            return;
        }
        return data;
    } catch (error) {
        console.error('Fetch error. URL: '+url);
        console.error('Fetch error. STATUS: '+response.status);
        console.error(error);
    }

};



let getParticipants = (promoId) => {
    fetch('http://localhost:3001/promotion/participates/' + userId + '/' + promoId, {
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
}


let makeRaffle = (promoId) => {

    fetch('http://localhost:3001/promotion/endWithRaffle/' + promoId, {
        method: 'get'
    }).then(
        function (response) {
            if (response.status !== 200) {
                return false;
            }
            console.log(response);
            // Examine the text in the response  
            response.json().then(function (data) {
                return data;
            });
        }
        ).catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}



/**
 * promotionController.js
 *
 * @description :: Server-side logic for managing promotions.
 */
module.exports = {
    /**
     * promotionController.showPromotion()
     */
    showPromotion: async function (req, res) {
        const promoId = req.params.promoId;
        const refFriend = req.params.refFriend;


        //Check if promotion eneded
       
       let promotion =  await getPromotion(promoId);
        

        if (promotion == undefined) {
            console.log(`promoción ${promoId} no encontrada / o error`);
            res.render('promotion-not-found', { title: 'No title', promoId: promoId });

        } else {
            if (!promotion.promoEnded) {
                if (promotion.endDate > Date.now()) {
                    //TODO: Check as ended 

                    //Make the raffle

                }
            } {

            }



            //Increment refFriend user points 
            if (refFriend !== undefined) {

            }

            var userId = req.cookies.userId;


            //If user not set in Cookie, create one user and set to cookie
            if (userId == undefined) {
                let userId = userController.createUserId();
                res.cookie('userId', userId, { expires: new Date(Date.now() + 2592000000000) });
            } {
                //If user already set in cookie, check if participating
                let participation = isParticipating();
                if (participation !== false) {
                    let user = getUser();
                }
            }

            console.log('Usuario: ' + userId);


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
            res.render('mobile-version', { title: 'No title', promoId: promoId, refFriend: refFriend, userId: userId, winners: [{ name: 'Maria', points: 777, profileImg: 'http://semantic-ui.com/images/avatar2/small/molly.png' }] });

        } //end if-else (promotion not found / found)


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
