let fetch = require('isomorphic-fetch');
var mobileDetect = require('mobile-detect');
var userController = require('./userController');
var request = require('request-promise');
var _ = require('lodash');
var cookieParser = require('cookie-parser');

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


let newParticipation = async (participation) => {

    var formData = {
        "promoId": participation.promoId,
        "promotion": participation.promotion,
        "userId": participation.userId,
        "user": participation.user,
        "friendParticNumber": 0,
        "friendVisualNumber": 0,
        "points": 0,   //first time particiaption
        "ip": participation.ip,
            "refFriendId": participation.refFriendId,
    };
    try {
        let response = await request.post({ url: 'http://localhost:3000/participation/', form: formData });
        console.log('Participation succesfully created: ' + response);
        return response;
    } catch (error) {
        console.log('REQ. ERROR: When creating participation: ' + error);
    }
};

let incrementPoints = async (userId, promoId, points) => {
    console.log('incrementing points for userId: ' + userId + ' and promoId:' + promoId);
    let formData = {};
    try {
        let response = await request.post({ url: 'http://localhost:3000/participation/increment-points/user/' + userId + '/promotion/' + promoId + '/points/' + points, form: formData });
        return response;
    } catch (error) {
        console.log('REQ. ERROR: When incrementing points: ' + error);
    }
};


let incrementVisualization = async (userId, promoId) => {
    console.log('incrementing visualization for userId: ' + userId + ' and promoId:' + promoId);
    let formData = {};
    try {
        let response = await request.post({ url: 'http://localhost:3000/participation/increment-visualization/user/' + userId + '/promotion/' + promoId, form: formData });
        return response;
    } catch (error) {
        console.log('REQ. ERROR: When incrementing visualization ' + error);
    }
};

let incrementParticipation = async (userId, promoId) => {
    console.log('incrementing participation for userId: ' + userId + ' and promoId:' + promoId);
    let formData = {};
    try {
        let response = await request.post({ url: 'http://localhost:3000/participation/increment-participation/user/' + userId + '/promotion/' + promoId, form: formData });
        return response;
    } catch (error) {
        console.log('REQ. ERROR: When incrementing participation: ' + error);
    }
};

let incrementParticipationGlobal = async (promoId) => {
    console.log('incrementing participation for promotion: promoId:' + promoId);
    let formData = {};
    try {
        let response = await request.post({ url: 'http://localhost:3000/participation/increment-participation/promotion/' + promoId, form: formData });
        return response;
    } catch (error) {
        console.log('REQ. ERROR: When incrementing participation GLOBAL: ' + error);
    }
};


let makeRaffleAndEnd = async (promoId) => {
    console.log('Making raffle request for promotion: ' + promoId);
    let formData = {};
    try {
        let response = await request.post({ url: 'http://localhost:3000/promotion/endWithRaffle/' + promoId, form: formData });
        return response;
    } catch (error) {
        console.log('REQ. ERROR: When making raffle: ' + error);
    }
};


let existsUser = async (user) => {
    console.log('Checking if user already exists, before participating');
    let formData = {};
    try {
        let response = await request.get({ url: 'http://localhost:3000/user/exist/id/' + user.userId + '/email/' + user.email + '/phone/' + user.phone, form: formData });
        return response;
    } catch (error) {
        console.log('REQ. ERROR: When checking if user exists: ' + error);
    }
};

let getWinners = async (promo_id) => {
    console.log('Finding winners for promotion: ' + promo_id);
    let formData = {};
    try {
        let response = await request.get({ url: 'http://localhost:3000/winner/promotion/' + promo_id, form: formData });
        return JSON.parse(response);
    } catch (error) {
        console.log('REQ. ERROR: When find winners for promotion: ' + error);
    }
};


let checkRefFriend = async (refFriend) => {
    console.log('Checking if refFriend already exists, before increment points');
    let formData = {};
    try {
        let response = await request.get({ url: 'http://localhost:3000/user/id/' + refFriend, form: formData })
        return response;
    } catch (error) {
        console.log('RefFriend not exists' + error);
        return undefined;
    }

};


let newUser = async (user) => {

    var formData = {

        "userId": user.userId,
        "email": user.email,
        "phone": user.phone,
        "onesignalId": user.onesignalId,
        "googleId": user.googleId,
        "facebookId": user.facebookId,
        "profileImg": user.profileImg,
        "points": 0,

        "firstName": user.firstName,
        "lastName": user.lastName,
        "hasPushEnabled": user.hasPushEnabled,
        "hasGeolocEnabled": user.hasGeolocEnabled,
        "hasProfileCompleted": user.hasProfileCompleted

    };
    try {
        let response = await request.post({ url: 'http://localhost:3000/user/', form: formData });
        console.log('User succesfully created: ' + response);
        return response;
    } catch (error) {
        console.log('REQ. ERROR: When creating User: ' + error);
    }
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

        let participatingThisPromo = false;

        let requestType = 'desktop';
        //Check if mobile 
        let md = new mobileDetect(req.headers['user-agent']);
        console.log(req.headers['user-agent']);
        if (md.is('bot')) {
            console.log('bot access');
            requestType = 'bot';
        } else if (md.mobile() != null) {
            console.log('phone access');
            requestType = 'mobile';
        } else if (md.is('desktopmode')) {
            console.log('desktopmode access');
            requestType = 'desktop';
        } else if(req.headers['user-agent'] && (req.headers['user-agent'].indexOf('bot'))>-1 && (req.headers['user-agent'].indexOf('whatsapp') >-1)  ) {
            console.log('special bot access');
            requestType = 'bot';
        }else{
            console.log('other device access');
            requestType = 'desktop';

        }

        let showPromotion = (promotion, user, participation, winners, requestType) => {
            if (requestType == 'mobile') {
                console.log('show promotion on mobile');
                //Mobile promotion
                res.render('mobile-version', { title: promotion.promoTitle, promotion: promotion, participation: participation, user: user, winners: winners });
            } else {
                console.log('show promotion on desktop');                //Desktop promotion
                res.render('desktop-version', { title: promotion.promoTitle, promotion: promotion, participation: participation, user: user, winners: winners/*[{ name: 'Maria', points: 777, profileImg: 'http://semantic-ui.com/images/avatar2/small/molly.png' },{ name: 'Maria', points: 777 },{ name: 'Maria', points: 777, profileImg: 'http://semantic-ui.com/images/avatar2/small/molly.png' },{ name: 'Maria', points: 777}] */ });
            }
        }

        let promotion = await getPromotion(promoId);

        //Check if promotion exists and enabled
        if (promotion == undefined || promotion.promoEnable == false) {
            console.log(`promoción ${promoId} no encontrada / o error`);
            res.render('promotion-not-found', { title: 'Promoción no encontrada. ' });
        } else {
            if (!promotion.promoEnded) {

                console.log('Promotion end on: ' + promotion.endDate);
                if (new Date(promotion.endDate) < new Date()) {
                    console.log('Ending promotion now. Making raffle.');
                    //Make the raffle and check as ended 
                    let promoEndedOk = await makeRaffleAndEnd(promoId);
                    if (promoEndedOk) {
                        //Refresh page 
                        console.log('Refreshing page after promotion end.');
                        res.redirect(req.get('referer'));
                    }
                } else {
                    console.log('Promotion not ended');
                    var userId = req.cookies.userId;

                    //Crate promotioN cookie in promotionS cookie (without refFriend)
                    let cookiePromotions;
                    if (!req.cookies.promotions) {
                        cookiePromotions = [];
                    } else {
                        cookiePromotions = req.cookies.promotions;
                    }

                    console.log(cookiePromotions);
                    //let exists = false;
                    let p = new Promise((resolve, reject) => {
                        cookiePromotions.forEach((promotion) => {
                            if (promotion.promoId == promoId) {
                                console.log('Cookie promotion for ' + promoId + ' already exists');
                                resolve(true);
                            }
                        });
                        resolve(false);
                    })
                    p.then((cookiePromoExist) => {
                        console.log('Cookie promotion exists: ' + cookiePromoExist);
                        if (cookiePromoExist) {participatingThisPromo = true;}
                        if (!cookiePromoExist) {
                            var newCookiePromotion = {
                                'promoId': promoId,
                                'promotion_id': promotion._id,
                            };
                            console.log('Creating new cookie promotion: ' + newCookiePromotion);
                            cookiePromotions.push(newCookiePromotion);
                            console.log('Cookie promotions are: ' + cookiePromotions);
                            res.cookie('promotions', cookiePromotions, { expires: new Date(Date.now() + 2592000000000) });
                        }
                        console.log('Cookie promotion exists: ' + cookiePromoExist);
                    }).then(() => {

                        //If has refFriend, increment points and add refFriend to cookie promotion
                        //let alreadyRefered = false;
                        if (refFriend) {
                            if (req.cookies.promotions) { let cookiePromotions = req.cookies.promotions; }
                            new Promise((resolve, reject) => {
                                if (cookiePromotions) {
                                    cookiePromotions.forEach((promotion) => {
                                        if (promotion.refFriendId) {
                                            console.log('Already refered: ' + true);
                                            resolve(true);
                                        }
                                    });
                                }
                                resolve(false);
                            }).then(async (alreadyRefered) => {


                                ////////////////////////////////
                                if ( !alreadyRefered && userId != refFriend/*not same user*/) { //Special cookie for limit once incrementations
                                    console.log('Setting special points cookie');
                                    let refFriendExists = await checkRefFriend(refFriend);

                                    if (refFriendExists) {
                                        console.log('refFriend exists ' + refFriendExists);
                                        if (!participatingThisPromo && requestType == 'mobile') {
                                            await incrementPoints(refFriend, promoId, 1);
                                            await incrementVisualization(refFriend, promoId);
                                        }
                                        //Crate promotioN cookie in promotionS cookie (with refFriend --add to cookie)
                                        if (req.cookies.promotions) { let cookiePromotions = req.cookies.promotions; }
                                        let p = new Promise((resolve, reject) => {
                                            cookiePromotions.forEach((promotion) => {
                                                console.log(promotion);
                                                if (promotion.promoId == promoId && promotion.refFriend == undefined) {
                                                    resolve(promotion);
                                                }
                                            });
                                            resolve(false);
                                        });
                                        p.then((oldCookiePromotion) => {
                                            if (oldCookiePromotion) {
                                                console.log('oldCookiePromotion:' + oldCookiePromotion);
                                                var newCookiePromotion = {
                                                    'promoId': oldCookiePromotion.promoId,
                                                    'promotion_id': oldCookiePromotion.promotion_id,
                                                    'refFriendId': refFriend
                                                    //    ,'refFriend_id': refFriendObject._id
                                                };
                                                let p = new Promise((resolve, reject) => {
                                                    let newCookiePromotions = [];
                                                    cookiePromotions.forEach(
                                                        (promotion) => {
                                                            if (promotion.promoId != promoId) {
                                                                newCookiePromotions.push(promotion);
                                                            }
                                                        }
                                                    );
                                                    resolve(newCookiePromotions);
                                                });

                                                p.then((newCookiePromotions) => {
                                                    newCookiePromotions.push(newCookiePromotion);
                                                    console.log('newCookiePromotions:' + newCookiePromotions);
                                                    res.cookie('promotions', newCookiePromotions, { expires: new Date(Date.now() + 2592000000000) });

                                                    //continue
                                                    renderPromotion();
                                                }).catch((err) => {
                                                    console.log(err);
                                                });

                                            } else {
                                                //continue
                                                renderPromotion();
                                            }
                                        }).catch((errr) => {
                                            console.log(errr);
                                        });

                                    } // end if not already have added points
                                    else {
                                        //continue
                                        renderPromotion();
                                    }
                                } else {
                                    //continue
                                    renderPromotion();
                                }
                            }
                                ////////////////////////////////////////////////////
                                ).catch((errr) => {
                                    console.log(errr);
                                });
                        } else {
                            //continue
                            renderPromotion();
                        }
                    });
                } //end if-else promotion (make raffle / not make raffle)


                renderPromotion = async () => {

                    // setTimeout(async () => {
                    //If user not set in Cookie, create one user and set to cookie
                    if (userId == undefined) {
                        console.log('creating user id');
                        let userId = userController.createUserId();
                        res.cookie('userId', userId, { expires: new Date(Date.now() + 2592000000000) });

                        //Show promotion (new user)
                        showPromotion(promotion, undefined, undefined, undefined, requestType);

                    } else {
                        console.log('User already created');
                        //If user already set in cookie, check if participating
                        let alreadyParticipating = await isParticipating(userId, promoId);

                        if (alreadyParticipating == true) {
                            console.log('user already participating');
                            let user = await getUser(userId);
                            let participation = await getParticipation(userId, promoId);
                            //Show promotion (with user details)
                            console.log('user is: ' + user);
                            res.cookie('userId', user.userId, { expires: new Date(Date.now() + 2592000000000) });
                            showPromotion(promotion, user, participation, undefined, requestType);
                        }
                        else {
                            console.log('user not participating ');
                            //Show promotion (new user)
                            showPromotion(promotion, undefined, undefined, undefined, requestType);
                        } //end if-else user already participating
                    }// end if-else (creat new user / get existing user)


                    // }, 4000);
                }


            } else {
                console.log('promotion already ended');
                var userId = req.cookies.userId;
                //If user not set in Cookie, create one user and set to cookie
                if (userId == undefined) {
                    console.log('show promotion ended, user not defined, promotion already ended');
                    //Show promotion (ended)
                    let winners = await getWinners(promoId);
                    showPromotion(promotion, undefined, undefined, winners, requestType);

                } else {
                    console.log('show promotion ended, user exists, promotion already ended');

                    //If user already set in cookie, check if participating
                    let alreadyParticipating = await isParticipating(userId, promoId);
                    if (alreadyParticipating !== false) {
                        console.log('user is participating, promotion already ended');
                        let user = await getUser(userId);
                        let participation = await getParticipation(userId, promoId);
                        //Show promotion (with user details)
                        console.log('user is: ' + user);
                        let winners = await getWinners(promoId);
                        showPromotion(promotion, user, undefined, winners, requestType);
                    } else {
                        console.log('show promotion ended, user not defined, promotion already ended');
                        //Show promotion (ended)
                        let winners = await getWinners(promoId);
                        showPromotion(promotion, undefined, undefined, winners, requestType);

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
        user.lastName = req.body.lastName;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.onesignalId = "req.cookies.onesignalId";
        user.googleId = req.body.googleId;
        user.facebookId = req.body.facebookId;
        user.profileImg = req.body.profileImg;
        user.hasPushEnabled = false;
        user.hasGeolocEnabled = false;
        user.hasProfileCompleted = false;

        let currentUserNoJSON = await existsUser(user);
        let currentUser = JSON.parse(currentUserNoJSON);

        let newCurrentUser;
        let participation = {};

        console.log('current user for user cookie (req.cookies.userId) is' + currentUser);
        if (_.isEmpty(currentUser)) {
            console.log('user not already participating')
            let currentUserNoJSON = await newUser(user);
            newCurrentUser = JSON.parse(currentUserNoJSON);

            participation.userId = newCurrentUser.userId;
            participation.user = newCurrentUser._id;
        } else {
            participation.userId = currentUser.userId;

            res.cookie('userId', currentUser.userId, { expires: new Date(Date.now() + 2592000000000) });
            participation.user = currentUser._id;
        }

        participation.promoId = req.body.promoId;
        participation.promotion = req.body.promo_id;
        participation.refFriendId = req.body.refFriend;
        participation.ip = req.ip;

        let nowParticipating = await newParticipation(participation);
        if (nowParticipating) {
            await incrementParticipationGlobal(req.body.promoId);
            await incrementPoints(req.cookies.userId, req.body.promoId, 5);
            if (req.body.refFriend && req.body.refFriend !== "") {

                await incrementParticipation(req.body.refFriend, req.body.promoId);
                await incrementPoints(req.body.refFriend, req.body.promoId, 10);
            }
            return res.json({ participating: true });
        } else {
            return res.status(404).json({ message: false });
        }

    },

    /**
     * promotionController.showPromotion()
     */
    reportPromotion: function (req, res) {
        //TODO
    },

    /**
     * promotionController.participationInfo()
     */
    participationInfo: async function (req, res) {

        let userId = req.query.userId;
        let promoId = req.query.promoId;
        let participation = await getParticipation(userId, promoId);
        let promotion = await getPromotion(promoId);

        console.log('Retrieving participation info. for user: ' + userId + ' (promotion: ' + promoId + ')');
        let partInfo = {
            avgPoints: parseInt(promotion.totalPoints / promotion.participNumber) || 0,
            userPoints: participation.points,
            particNumber: participation.friendParticNumber,
            visualNumber: participation.friendVisualNumber,
            particPoints: participation.friendParticNumber * 10,
            visualPoints: participation.friendVisualNumber * 1
        }
        console.log(partInfo);

        return res.json(partInfo);

    }
}
