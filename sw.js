// sw.js

const swPrecache = {
  staticFileGlobs: [
    'https://use.typekit.net/dba6omz.css',
    'index.html',
    '*.css',
    '*.js',
    '*.json',
    '1x/android/*',
    '1x/apple/*',
  ],
  root: '/',
  stripPrefix: '/',
  directoryIndex: 'index.html',
  navigateFallback: 'index.html',
  runtimeCaching: [],
}

module.exports = swPrecache

var cacheName = 'sesctv-github-io-cache';
var filesToCache = [
    '/',
    '/main.js',
    '/1x',
    '/logo.png'
];
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName)
        .then(function(cache) {
            console.info('[sw.js] cached all files');
            return cache.addAll(filesToCache);
        })
    );
});


self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if(response){
                return response
            }
            else{
                // clone request stream
                // as stream once consumed, can not be used again
                var reqCopy = event.request.clone();

                return fetch(reqCopy, {credentials: 'include'}) // reqCopy stream consumed
                .then(function(response) {
                    // bad response
                    // response.type !== 'basic' means third party origin request
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response; // response stream consumed
                    }

                    // clone response stream
                    // as stream once consumed, can not be used again
                    var resCopy = response.clone();


                    // ================== IN BACKGROUND ===================== //

                    // add response to cache and return response
                    caches.open(cacheName)
                    .then(function(cache) {
                        return cache.put(reqCopy, resCopy); // reqCopy, resCopy streams consumed
                    });

                    // ====================================================== //


                    return response; // response stream consumed
                })
            }
        })
    );
});
