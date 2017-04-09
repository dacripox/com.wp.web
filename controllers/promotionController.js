let fetch = require('isomorphic-fetch');
var mobileDetect = require('mobile-detect');
var userController = require('./userController');
var request = require('request-promise');

let getUser = async (userId) => {

    try {
        let response = await fetch('http://localhost:3000/user/id/' + userId, { method: 'get' });
        let data = await response.json();
        if (response.status !== 200) {
            return;
        }
        return data;
    } catch (error) {

        console.error('Fetch error. STATUS: ' + response.status);
        console.error(error);
    }

};

let getPromotion = async (promoId) => {
    try {
        let response = await fetch('http://localhost:3000/promotion/id/' + promoId, { method: 'get' });
        let data = await response.json();
        if (response.status !== 200) {
            return;
        }
        return data;
    } catch (error) {

        console.error('Fetch error. STATUS: ' + response.status);
        console.error(error);
    }
};


let isParticipating = async (userId, promoId) => {
    try {
        let response = await fetch('http://localhost:3000/user/participates/' + userId + '/' + promoId, { method: 'get' });
        let data = await response.json();
        if (response.status !== 200) {
            return;
        }
        if (data.participating) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Fetch error. STATUS: ' + response.status);
        console.error(error);
    }

};



let getParticipation = async (userId, promoId) => {

    try {
        let response = await fetch('http://localhost:3000/participation/user/' + userId + '/promotion/' + promoId, { method: 'get' });
        let data = await response.json();
        if (response.status !== 200) {
            return;
        }
        return data;
    } catch (error) {
        console.error('Fetch error. STATUS: ' + response.status);
        console.error(error);
    }
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

let newParticipation = async (participation) => {

    var formData = {
        "promoId": participation.promoId,
        "userId": participation.userId,
        "refFriend": participation.refFriend,
        "refFriendId": participation.refFriendId,
        "promotion": participation.promotion,
        "user": participation.user,
        "friendParticNumber": 0,
        "friendVisualNumber": 0,
        "points": 0
    };

    let response = await request.post({ url: 'http://localhost:3000/participation/', form: formData });
    console.log(response);
    return response;
};

let incrementPoints = async (userId, promoId, points) => {
    console.log('incrementing points for userId: ' + userId + ' and promoId:' + promoId);
    let formData = {};
    let response = await request.post({ url: 'http://localhost:3000/participation/increment-points/user/' + userId + '/promotion/' + promoId + '/points/' + points, form: formData });
    return response;
};


let incrementVisualization = async (userId, promoId) => {
    console.log('incrementing visualization for userId: ' + userId + ' and promoId:' + promoId);
    let formData = {};
    let response = await request.post({ url: 'http://localhost:3000/participation/increment-visualization/user/' + userId + '/promotion/' + promoId, form: formData });
    return response;
};

let incrementParticipation = async (userId, promoId) => {
    console.log('incrementing participation for userId: ' + userId + ' and promoId:' + promoId);
    let formData = {};
    let response = await request.post({ url: 'http://localhost:3000/participation/increment-participation/user/' + userId + '/promotion/' + promoId, form: formData });
    return response;
};
let existsUser = async (user) => {
    console.log('check if user already exists, before participating');
    let formData = {};
    let response = await request.get({ url: 'http://localhost:3000/user/exist/email/' + user.email + '/phone/' + user.phone, form: formData });
    return response;
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
    showPromotion: async function (req, res) {
        const promoId = req.params.promoId;
        const refFriend = req.params.refFriend;

        let requestType = 'desktop';
        //Check if mobile 
        let md = new mobileDetect(req.headers['user-agent']);
        if (md.is('bot')) {
            console.log('bot access');
            requestType = 'bot';
        } else if (md.mobile() != null) {
            console.log('phone access');
            requestType = 'mobile';
        } else if (md.is('desktopmode')) {
            console.log('desktopmode access');
            requestType = 'desktop';
        } else {
            console.log('other device access');
            requestType = 'desktop';
        }

        let showPromotion = (promotion, user, participation, requestType) => {
            if (requestType == 'mobile') {
                console.log('show promotion on mobile');
                //Mobile promotion
                res.render('mobile-version', { title: promotion.promoTitle, promotion: promotion, participation: participation, user: user, winners: [{ name: 'Maria', points: 777, profileImg: 'http://semantic-ui.com/images/avatar2/small/molly.png' }] });
            } else {
                console.log('show promotion on desktop');
                //Desktop promotion
                res.render('mobile-version', { title: promotion.promoTitle, promotion: promotion, participation: participation, user: user, winners: [{ name: 'Maria', points: 777, profileImg: 'http://semantic-ui.com/images/avatar2/small/molly.png' }] });
            }
        }

        let promotion = await getPromotion(promoId);

        //Check if promotion exists and enabled
        if (promotion == undefined || promotion.promoEnable == false) {
            console.log(`promoción ${promoId} no encontrada / o error`);
            res.render('promotion-not-found', { title: promotion.promoTitle, promoId: promoId });
        } else {
            if (!promotion.promoEnded) {
                if (promotion.endDate > Date.now()) {
                    console.log('promotion ended now');
                    //TODO: Check as ended 
                    //Make the raffle
                    //Refresh page
                } else {
                    console.log('promotion not ended');

                    var userId = req.cookies.userId;
                    //If user not set in Cookie, create one user and set to cookie
                    if (userId == undefined) {
                        console.log('creating user id');
                        let userId = userController.createUserId();
                        res.cookie('userId', userId, { expires: new Date(Date.now() + 2592000000000) });

                        //Show promotion (new user)
                        showPromotion(promotion, {}, requestType);

                    } else {
                        console.log('user already created');
                        //If user already set in cookie, check if participating
                        let alreadyParticipating = await isParticipating(userId, promoId);

                        if (alreadyParticipating == true) {
                            console.log('user already participating');
                            let user = await getUser();
                            let participation = await getParticipation(userId, promoId);
                            //Show promotion (with user details)
                            console.log('user is: ' + user);
                            showPromotion(promotion, user, participation, requestType);
                        }
                        else {
                            console.log('user not participating ');
                            //Show promotion (new user)
                            showPromotion(promotion, {}, {}, requestType);
                        }
                    }
                    //If has refFriend, increment points
                    if (refFriend) {
                        if (!req.cookies.p && userId!=refFriend) { //Special cookie for limit once incrementations
                            console.log('Setting special points cookie');
                            incrementPoints(refFriend, promoId, 1);
                            incrementVisualization(refFriend, promoId);
                            res.cookie('p', '1', { expires: new Date(Date.now() + 2592000000000) });
                        }
                    }

                }
            } else {
                console.log('promotion already ended');
                var userId = req.cookies.userId;
                //If user not set in Cookie, create one user and set to cookie
                if (userId == undefined) {
                    console.log('show promotion ended, user not defined, promotion already ended');
                    //Show promotion (ended)
                    showPromotion(promotion, {}, {}, requestType);

                } else {
                    console.log('show promotion ended, user exists, promotion already ended');

                    //If user already set in cookie, check if participating
                    let alreadyParticipating = await isParticipating(userId, promoId);
                    if (alreadyParticipating !== false) {
                        console.log('user is participating, promotion already ended');
                        let user = await getUser();
                        let participation = await getParticipation(userId, promoId);
                        //Show promotion (with user details)
                        console.log('user is: ' + user);
                        showPromotion(promotion, user, participation, requestType);
                    }
                }
            }
        } //end if-else (promotion not found / found)


    },
    /**
     * promotionController.participate()
     */
    doParticipate: async function (req, res) {

let user = {}

	user.userId = req.cookies.userId;
	user.firstName = req.body.firstName;
	user.lastName =req.body.lastName;
//	user.sex 
//	user.age
	user.email =req.body.email;
	user.phone = req.body.phone;
//	user.password = req.body.firstName;

//	user.onesignalId = req.body.firstName;
	user.googleId = req.body.googleId;
	user.facebookId = req.body.facebookId;
	user.profileImg = req.body.profileImg;
	
//	user.postCode = req.body.firstName;
	user.hasPushEnabled = false;
	user.hasGeolocEnabled = false;
	user.hasProfileCompleted = false;


if(!existsUser(user)){
    await newUser(participation);
}


        let participation = {};

        participation.promoId = req.cookies.promoId;
        participation.promotion = req.cookies.promotion_id

        participation.userId = req.cookies.userId;
        participation.user = req.cookies.user_id;

        participation.refFriendId = req.cookies.refFriend
        participation.refFriend = req.cookies.refFriend_id;


        await newParticipation(participation);

    },

    /**
     * promotionController.showPromotion()
     */
    reportPromotion: function (req, res) {
        //TODO
    }










}
