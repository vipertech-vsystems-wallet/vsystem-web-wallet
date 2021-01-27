var CACHE_NAME = "v1";
var IMMUTABLE_FILES = [
    "fonts/Saira-Regular.ttf",
    "sounds/sfx/copy.mp3",
    "sounds/sfx/error.mp3",
    "sounds/sfx/logout.mp3",
    "sounds/sfx/page.mp3",
    "sounds/sfx/refresh.mp3",
    "sounds/sfx/scan.mp3",
    "sounds/sfx/scanner.mp3",
    "sounds/sfx/sent.mp3",
    "sounds/vocal/accounts_reset.mp3",
    "sounds/vocal/address_copied.mp3",
    "sounds/vocal/backup_file_downloaded.mp3",
    "sounds/vocal/code_successfully_scanned.mp3",
    "sounds/vocal/connection_established.mp3",
    "sounds/vocal/currency_changed.mp3",
    "sounds/vocal/invalid_backup_file.mp3",
    "sounds/vocal/language_changed.mp3",
    "sounds/vocal/password_changed.mp3",
    "sounds/vocal/passwords_are_identical.mp3",
    "sounds/vocal/sound_effects_disabled.mp3",
    "sounds/vocal/sound_effects_enabled.mp3",
    "sounds/vocal/transaction_failed.mp3",
    "sounds/vocal/transaction_received.mp3",
    "sounds/vocal/transaction_sent.mp3",
    "sounds/vocal/valid_backup_file.mp3",
    "sounds/vocal/vocal_disabled.mp3",
    "sounds/vocal/vocal_enabled.mp3",
    "sounds/vocal/wallet_updated.mp3",
    "sounds/vocal/wrong_password.mp3"
];
var MUTABLE_FILES = [
    "css/pages.css",
    "css/theme.css",
    "/",
    "index.html",
    "404.html",
    "client.min.js",
    "service-worker.js",
    "manifest.json"
];


// Cache resources
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            cache.addAll(IMMUTABLE_FILES.concat(MUTABLE_FILES))
        )
    );
});

// Respond with cached resources
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function(response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});