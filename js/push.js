var webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BHAdNzKSX14EfKa1SpguQNmNtb52WdA-qMFX6J2rdjfIm77E6Zq_WactiHcXmsN2xOQ-wFxQWwTHHn-O4R9HFhc",
    "privateKey": "Iu9C-sijuy2uX_Wz7HjBBiEwKQWVhCknRdfq6JtAUu0"
};


webPush.setVapidDetails(
    'mailto:mzfais@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)
var pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/cSVY5Wbb2Gw:APA91bFfn_Ux8CK77xZd0hu8MMp73j214WohEJ2-ww6PDXwMcsu49DxR-bRJxYlXSJCt3Xis7RmKa0Sufc_l3SBoRJxqPutpkTWlfNTlnZnhvj520ul5Jn_nWRHRx2cNFdZFpWFz7vAv",
    "keys": {
        "p256dh": "BKJUvFgGIw/lI8ceim+HewKUbdhxVuVIDAnZfv1Y/bLvS7rrj/1KCCW8H+ywgXFe2RB/VnVOllFTWci91JeWcgQ=",
        "auth": "yEofO384h7QnoabpsMROMg=="
    }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';

var options = {
    gcmAPIKey: '990996659061',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);